const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;
const SECRET_KEY = 'your-very-secret-key-change-it'; // In production, move to env
const db = new Database(path.join(__dirname, 'database.sqlite'));

// --- Database Configuration ---
db.exec(`
  CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    full_name TEXT,
    role TEXT CHECK(role IN ('admin', 'tutor', 'starosta')),
    group_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(group_id) REFERENCES groups(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    FOREIGN KEY(id) REFERENCES profiles(id)
  );

  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    group_id TEXT NOT NULL,
    FOREIGN KEY(group_id) REFERENCES groups(id)
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    group_id TEXT NOT NULL,
    status TEXT CHECK(status IN ('present', 'absent', 'excused')),
    date DATE NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students(id),
    FOREIGN KEY(group_id) REFERENCES groups(id),
    UNIQUE(student_id, date)
  );
`);

// Initial Admin User (Create if not exists)
const adminId = '00000000-0000-0000-0000-000000000000';
const existingAdmin = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!existingAdmin) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO profiles (id, full_name, role) VALUES (?, ?, ?)').run(adminId, 'Administrator', 'admin');
    db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)').run(adminId, 'admin', hash);
    console.log('Created default admin: admin / admin123');
}

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve frontend files

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    const profile = db.prepare('SELECT role FROM profiles WHERE id = ?').get(req.user.id);
    if (!profile || profile.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    next();
};

// --- API Routes ---

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE LOWER(username) = LOWER(?)').get(username);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
    const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(user.id);
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '30d' });
    res.json({ token, profile });
});

// Profile
app.get('/api/profile', authenticateToken, (req, res) => {
    const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(req.user.id);
    res.json(profile);
});

// Groups
app.get('/api/groups', authenticateToken, (req, res) => {
    const groups = db.prepare('SELECT * FROM groups').all();
    res.json(groups);
});

app.post('/api/groups', authenticateToken, isAdmin, (req, res) => {
    const { name } = req.body;
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO groups (id, name) VALUES (?, ?)').run(id, name);
    res.json({ id, name });
});

app.delete('/api/groups/:id', authenticateToken, isAdmin, (req, res) => {
    db.prepare('DELETE FROM groups WHERE id = ?').run(req.params.id);
    res.sendStatus(200);
});

// Students
app.get('/api/students', authenticateToken, (req, res) => {
    const students = db.prepare('SELECT * FROM students').all();
    res.json(students);
});

app.post('/api/students', authenticateToken, isAdmin, (req, res) => {
    const { full_name, group_id } = req.body;
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO students (id, full_name, group_id) VALUES (?, ?, ?)').run(id, full_name, group_id);
    res.json({ id, full_name, group_id });
});

app.delete('/api/students/:id', authenticateToken, isAdmin, (req, res) => {
    db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
    res.sendStatus(200);
});

// Attendance
app.get('/api/attendance', authenticateToken, (req, res) => {
    const { date, group_id } = req.query;
    let query = 'SELECT * FROM attendance';
    const params = [];
    if (date || group_id) {
        query += ' WHERE 1=1';
        if (date) { query += ' AND date = ?'; params.push(date); }
        if (group_id) { query += ' AND group_id = ?'; params.push(group_id); }
    }
    const attendance = db.prepare(query).all(...params);
    res.json(attendance);
});

app.post('/api/attendance', authenticateToken, (req, res) => {
    const { student_id, group_id, status, date } = req.body;
    db.prepare(`
        INSERT INTO attendance (student_id, group_id, status, date)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(student_id, date) DO UPDATE SET status = EXCLUDED.status
    `).run(student_id, group_id, status, date);
    res.sendStatus(200);
});

// User Management (Admin only)
app.get('/api/admin/users', authenticateToken, isAdmin, (req, res) => {
    const users = db.prepare(`
        SELECT p.*, g.name as group_name 
        FROM profiles p 
        LEFT JOIN groups g ON p.group_id = g.id
    `).all();
    res.json(users);
});

app.post('/api/admin/users', authenticateToken, isAdmin, (req, res) => {
    const { username, password, full_name, role, group_id } = req.body;
    const id = crypto.randomUUID();
    const hash = bcrypt.hashSync(password, 10);

    db.transaction(() => {
        db.prepare('INSERT INTO profiles (id, full_name, role, group_id) VALUES (?, ?, ?, ?)').run(id, full_name, role, group_id);
        db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)').run(id, username, hash);
    })();

    res.json({ id, username, full_name, role });
});

app.patch('/api/admin/users/:id', authenticateToken, isAdmin, (req, res) => {
    const { full_name, role, group_id, username, password } = req.body;
    const id = req.params.id;

    db.transaction(() => {
        db.prepare('UPDATE profiles SET full_name = ?, role = ?, group_id = ? WHERE id = ?').run(full_name, role, group_id, id);
        if (username) db.prepare('UPDATE users SET username = ? WHERE id = ?').run(username, id);
        if (password) {
            const hash = bcrypt.hashSync(password, 10);
            db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, id);
        }
    })();
    res.sendStatus(200);
});

app.delete('/api/admin/users/:id', authenticateToken, isAdmin, (req, res) => {
    db.transaction(() => {
        db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
        db.prepare('DELETE FROM profiles WHERE id = ?').run(req.params.id);
    })();
    res.sendStatus(200);
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const crypto = require('crypto');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
