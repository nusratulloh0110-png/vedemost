const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'vedomost-pro-secret-key-2024';

// Database path — use persistent volume in Docker
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// --- Database Schema ---
db.exec(`
  CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'starosta' CHECK(role IN ('admin', 'tutor', 'starosta')),
    group_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(group_id) REFERENCES groups(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    FOREIGN KEY(id) REFERENCES profiles(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    group_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(group_id) REFERENCES groups(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    group_id TEXT NOT NULL,
    status TEXT DEFAULT 'absent' CHECK(status IN ('present', 'absent', 'excused', 'late', 'left_early')),
    comment TEXT DEFAULT '',
    date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE(student_id, date)
  );
`);

// --- Create Default Admin ---
const adminId = '00000000-0000-0000-0000-000000000000';
const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
if (!existingAdmin) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT OR IGNORE INTO profiles (id, full_name, role) VALUES (?, ?, ?)').run(adminId, 'Администратор', 'admin');
    db.prepare('INSERT OR IGNORE INTO users (id, username, password_hash) VALUES (?, ?, ?)').run(adminId, 'admin', hash);
    console.log('[INFO] Default admin created: login=admin, password=admin123');
} else {
    console.log('[INFO] Admin user already exists, skipping creation.');
}

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        req.user = jwt.verify(token, SECRET_KEY);
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

const requireAdmin = (req, res, next) => {
    const profile = db.prepare('SELECT role FROM profiles WHERE id = ?').get(req.user.id);
    if (!profile || profile.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: admin role required' });
    }
    next();
};

// --- API Routes ---

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Login
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = db.prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE').get(username.trim());
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(user.id);
        const token = jwt.sign({ id: user.id, role: profile.role }, SECRET_KEY, { expiresIn: '30d' });

        console.log(`[AUTH] Login successful: ${username}`);
        res.json({ token, profile });
    } catch (err) {
        console.error('[ERROR] Login failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Profile
app.get('/api/profile', authenticateToken, (req, res) => {
    const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(req.user.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
});

// Groups
app.get('/api/groups', authenticateToken, (req, res) => {
    const groups = db.prepare('SELECT * FROM groups ORDER BY name').all();
    res.json(groups);
});

app.post('/api/groups', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Group name is required' });
        const id = crypto.randomUUID();
        db.prepare('INSERT INTO groups (id, name) VALUES (?, ?)').run(id, name.trim());
        res.json({ id, name });
    } catch (err) {
        if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Group with this name already exists' });
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/groups/:id', authenticateToken, requireAdmin, (req, res) => {
    db.prepare('DELETE FROM groups WHERE id = ?').run(req.params.id);
    res.sendStatus(204);
});

// Students
app.get('/api/students', authenticateToken, (req, res) => {
    const { group_id } = req.query;
    let students;
    if (group_id) {
        students = db.prepare('SELECT * FROM students WHERE group_id = ? ORDER BY full_name').all(group_id);
    } else {
        students = db.prepare('SELECT * FROM students ORDER BY full_name').all();
    }
    res.json(students);
});

app.post('/api/students', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { full_name, group_id } = req.body;
        if (!full_name || !group_id) return res.status(400).json({ error: 'full_name and group_id are required' });
        const id = crypto.randomUUID();
        db.prepare('INSERT INTO students (id, full_name, group_id) VALUES (?, ?, ?)').run(id, full_name.trim(), group_id);
        res.json({ id, full_name, group_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/students/:id', authenticateToken, requireAdmin, (req, res) => {
    db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
    res.sendStatus(204);
});

// Attendance
app.get('/api/attendance', authenticateToken, (req, res) => {
    const { date, group_id } = req.query;
    let query = 'SELECT * FROM attendance WHERE 1=1';
    const params = [];
    if (date) { query += ' AND date = ?'; params.push(date); }
    if (group_id) { query += ' AND group_id = ?'; params.push(group_id); }
    const attendance = db.prepare(query).all(...params);
    res.json(attendance);
});

app.post('/api/attendance', authenticateToken, (req, res) => {
    try {
        const { student_id, group_id, status, date, comment = '' } = req.body;
        if (!student_id || !date || !status) {
            return res.status(400).json({ error: 'student_id, date, and status are required' });
        }
        // Use a safe group_id — get it from the student if not provided
        let grp_id = group_id;
        if (!grp_id) {
            const student = db.prepare('SELECT group_id FROM students WHERE id = ?').get(student_id);
            grp_id = student?.group_id;
        }
        db.prepare(`
            INSERT INTO attendance (student_id, group_id, status, date, comment)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(student_id, date) DO UPDATE SET
                status = excluded.status,
                comment = excluded.comment
        `).run(student_id, grp_id, status, date, comment);
        res.sendStatus(200);
    } catch (err) {
        console.error('[ERROR] Attendance update failed:', err);
        res.status(500).json({ error: err.message });
    }
});

// User Management (Admin only)
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
    const users = db.prepare(`
        SELECT p.id, p.full_name, p.role, p.group_id, p.created_at,
               g.name as group_name, u.username
        FROM profiles p
        LEFT JOIN groups g ON p.group_id = g.id
        LEFT JOIN users u ON u.id = p.id
        ORDER BY p.full_name
    `).all();
    res.json(users);
});

app.post('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { username, password, full_name, role, group_id } = req.body;
        if (!username || !password || !full_name || !role) {
            return res.status(400).json({ error: 'username, password, full_name, and role are required' });
        }
        const id = crypto.randomUUID();
        const hash = bcrypt.hashSync(password, 10);

        db.transaction(() => {
            db.prepare('INSERT INTO profiles (id, full_name, role, group_id) VALUES (?, ?, ?, ?)').run(id, full_name, role, group_id || null);
            db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)').run(id, username.trim(), hash);
        })();

        res.json({ id, username, full_name, role });
    } catch (err) {
        if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'User with this login already exists' });
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { full_name, role, group_id, username, password } = req.body;
        const id = req.params.id;

        db.transaction(() => {
            db.prepare('UPDATE profiles SET full_name = ?, role = ?, group_id = ? WHERE id = ?').run(full_name, role, group_id || null, id);
            if (username && username.trim()) {
                db.prepare('UPDATE users SET username = ? WHERE id = ?').run(username.trim(), id);
            }
            if (password && password.trim()) {
                const hash = bcrypt.hashSync(password, 10);
                db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, id);
            }
        })();
        res.sendStatus(200);
    } catch (err) {
        if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'This login is already taken' });
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
    const id = req.params.id;
    if (id === adminId) return res.status(403).json({ error: 'Cannot delete the main admin account' });
    db.transaction(() => {
        db.prepare('DELETE FROM users WHERE id = ?').run(id);
        db.prepare('DELETE FROM profiles WHERE id = ?').run(id);
    })();
    res.sendStatus(204);
});

// --- Static Frontend Files ---
app.use(express.static(path.join(__dirname)));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Start Server ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[INFO] Vedomost PRO server running on port ${PORT}`);
    console.log(`[INFO] Database: ${DB_PATH}`);
});
