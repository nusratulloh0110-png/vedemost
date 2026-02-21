// Внимание: мы используем Supabase через CDN в index.html, поэтому import не нужен.

const SUPABASE_URL = 'https://ubuurabdqquixkyfpvup.supabase.co'
const SUPABASE_KEY = 'sb_publishable_kX3znaYNvRT6A9up1HukHQ_Dz1VenqI'

let supabaseClient = null;

// Состояние
let state = {
    user: null,
    profile: null,
    groups: [],
    selectedGroupId: null,
    students: [],
    attendance: [],
    currentDate: new Date().toISOString().split('T')[0],
    activeTab: 'journal', // 'journal', 'groups', 'settings'
    loading: false,
    loadingStep: '',
    error: null
};

async function init() {
    try {
        console.log("Vedomost PRO: Запуск инициализации...");
        state.loadingStep = 'Старт системы...';
        state.error = null;

        if (typeof supabase === 'undefined') {
            throw new Error("Supabase не загружен. Проверьте интернет или ссылку в HTML.");
        }

        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

        // Получаем текущую сессию
        state.loadingStep = 'Проверка сессии...';
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            state.user = session.user;
            await loadProfile();
        } else {
            console.log("Сессия не найдена, показываем экран входа.");
        }
    } catch (err) {
        console.error("Критическая ошибка при запуске:", err);
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div class="fixed inset-0 flex items-center justify-center p-4 bg-red-900/10">
                    <div class="glass glass-card max-w-sm w-full text-center">
                        <h2 class="text-xl font-bold text-red-500 mb-2">Ошибка!</h2>
                        <p class="text-sm text-text-secondary">${err.message}</p>
                        <button onclick="location.reload()" class="btn btn-secondary mt-4 w-full">Обновить</button>
                    </div>
                </div>
            `;
        }
    } finally {
        render();
    }
}

// Вспомогательная функция для сброса загрузки по тайм-ауту
let loadingTimeout = null;
function startLoadingTimeout() {
    if (loadingTimeout) clearTimeout(loadingTimeout);
    loadingTimeout = setTimeout(() => {
        if (state.loading) {
            console.warn("Loading timeout reached. Resetting loading state.");
            state.loading = false;
            state.error = "Время ожидания ответа от сервера истекло. Проверьте VPN или ключ API.";
            render();
        }
    }, 15000); // 15 секунд
}

async function loadProfile() {
    if (!state.user) return;

    state.loading = true;
    state.loadingStep = 'Загрузка профиля...';
    state.error = null;
    render();
    startLoadingTimeout();

    try {
        console.log("Fetching profile for:", state.user.id);
        const { data: profile, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', state.user.id)
            .single();

        if (error) {
            console.error("Profile Error:", error);
            if (error.code === 'PGRST116') {
                // Если профиля нет, создадим минимальный, чтобы не вешать приложение
                console.log("Profile missing, creating default...");
                const { data: newProfile, error: createError } = await supabaseClient
                    .from('profiles')
                    .insert([{ id: state.user.id, full_name: state.user.email.split('@')[0], role: 'starosta' }])
                    .select()
                    .single();

                if (createError) throw createError;
                state.profile = newProfile;
            } else {
                throw error;
            }
        } else {
            state.profile = profile;
        }

        // Загрузка групп (параллельно для скорости)
        state.loadingStep = 'Загрузка групп...';
        if (state.profile.role === 'admin' || state.profile.role === 'tutor') {
            const { data: groups, error: gError } = await supabaseClient.from('groups').select('*');
            if (gError) console.error("Groups fetch failed:", gError);
            state.groups = groups || [];
        } else {
            state.selectedGroupId = state.profile.group_id;
        }

        await loadData();
    } catch (err) {
        console.error("Критическая ошибка loadProfile:", err);
        state.error = err.message || JSON.stringify(err);
    } finally {
        state.loading = false;
        if (loadingTimeout) clearTimeout(loadingTimeout);
        render();
    }
}


async function loadData() {
    console.log("Loading data for group:", state.selectedGroupId);
    state.loadingStep = 'Загрузка журнала...';
    try {
        // Если это админ без выбранной группы, мы можем либо загрузить всё, либо ничего.
        // Чтобы не вешать браузер тонной данных, загрузим только если группа выбрана или если это журнал админа.
        if (!state.selectedGroupId && state.profile?.role !== 'admin' && state.profile?.role !== 'tutor') {
            state.students = [];
            state.attendance = [];
            return;
        }

        const [studentsRes, attendanceRes] = await Promise.all([
            state.selectedGroupId
                ? supabaseClient.from('students').select('*').eq('group_id', state.selectedGroupId)
                : supabaseClient.from('students').select('*').limit(100), // Ограничим админа для скорости
            supabaseClient.from('attendance').select('*').eq('date', state.currentDate)
        ]);

        if (studentsRes.error) console.error("Students load error:", studentsRes.error);
        if (attendanceRes.error) console.error("Attendance load error:", attendanceRes.error);

        state.students = studentsRes.data || [];
        state.attendance = attendanceRes.data || [];
    } catch (err) {
        console.error("Ошибка в loadData:", err);
    }
}


async function login(email, password) {
    if (state.loading) return;
    state.loading = true;
    render();

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        state.user = data.user;
        await loadProfile();
    } catch (err) {
        alert('Ошибка входа: ' + err.message);
    } finally {
        state.loading = false;
        render();
    }
}

window.logout = async () => {
    state.loading = true;
    render();
    await supabaseClient.auth.signOut();
    state.user = null;
    state.profile = null;
    state.loading = false;
    render();
}


// UI Rendering
function render() {
    const app = document.getElementById('app');
    const mobileNav = document.getElementById('mobile-nav-container');

    if (!state.user) {
        app.innerHTML = renderLogin();
        mobileNav.innerHTML = '';
        attachLoginEvents();
    } else {
        app.innerHTML = `
            <div class="flex">
                ${renderSidebar()}
                <main class="main-content">
                    <div id="tab-journal" class="tab-content ${state.activeTab === 'journal' ? 'active' : ''}">
                        ${renderHeader()}
                        ${renderJournal()}
                    </div>
                    <div id="tab-groups" class="tab-content ${state.activeTab === 'groups' ? 'active' : ''}">
                        ${renderHeader('Управление группами', 'Создание и редактирование групп')}
                        ${renderGroups()}
                    </div>
                    <div id="tab-settings" class="tab-content ${state.activeTab === 'settings' ? 'active' : ''}">
                        ${renderHeader('Настройки логинов', 'Управление доступами старост')}
                        ${renderSettings()}
                    </div>
                </main>
            </div>
            ${renderModals()}
            ${state.loading ? `
                <div class="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                    <div class="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <p class="text-emerald-500 text-xl font-bold mb-2 animate-pulse">${state.loadingStep || 'Загрузка данных...'}</p>
                    <p class="text-text-secondary text-sm mb-8 max-w-xs">
                        Это может занять время, если интернет медленный или ключи Supabase неверны.
                    </p>
                    <div class="flex flex-col gap-3 w-full max-w-xs">
                        <button onclick="state.loading=false; render();" class="btn btn-secondary w-full uppercase tracking-widest text-xs py-3">
                            Продолжить без ожидания
                        </button>
                        <button onclick="logout()" class="text-red-400 text-[10px] uppercase font-bold hover:text-red-300">
                            Выйти и зайти заново
                        </button>
                    </div>
                </div>
            ` : ''}
        `;


        mobileNav.innerHTML = renderMobileNav();
        attachAppEvents();
    }
}

function renderLogin() {
    return `
        <div class="fixed inset-0 flex items-center justify-center p-4 bg-[#0a0f18]">
            <div class="glass glass-card max-w-sm w-full animate-fade-in">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-extrabold mb-2">Vedomost <span class="text-emerald-500">PRO</span></h1>
                    <p class="text-text-secondary text-sm">Панель управления</p>
                </div>
                <div class="space-y-4">
                    <input type="email" id="email" placeholder="Email" class="input-premium">
                    <input type="password" id="password" placeholder="Пароль" class="input-premium">
                    <button id="login-btn" class="btn btn-primary w-full mt-2 flex items-center justify-center gap-3" ${state.loading ? 'disabled' : ''}>
                        ${state.loading ? `
                            <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Входим...
                        ` : 'Войти в систему'}
                    </button>
                </div>
                <p class="text-center text-text-muted text-xs mt-6">Powered by <a href="https://nusra.uz" target="_blank" class="text-emerald-500 font-bold hover:underline">Nusra.uz</a></p>
            </div>
        </div>
    `;
}


function renderSidebar() {
    if (!state.profile) {
        if (state.loading) {
            return `<aside class="sidebar glass"><p class="p-4 text-xs font-bold text-emerald-500 animate-pulse">Загрузка профиля...</p></aside>`;
        }

        return `
            <aside class="sidebar glass">
                <div class="brand mb-4">
                    <h2 class="brand-text text-xl font-bold text-red-400">Ошибка!</h2>
                    <p class="text-[10px] text-red-300 font-bold mt-1">Детали: ${state.error || 'Профиль не загружен'}</p>
                </div>
                <div class="space-y-2">
                    <button onclick="logout()" class="btn btn-secondary w-full text-xs">Перезайти</button>
                    <button onclick="location.reload()" class="btn btn-primary w-full text-xs mt-2">Обновить</button>
                </div>
                <div class="mt-4 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                    <p class="text-[9px] text-text-secondary leading-normal">
                        Совет: Убедитесь, что вы вставили <b>Anon Key</b> (eyJ...) в начало файла <code>main.js</code> и выполнили SQL скрипт.
                    </p>
                </div>
            </aside>
        `;
    }

    const roleMap = { admin: 'Администратор', tutor: 'Тютор', starosta: 'Староста' };
    return `
        <aside class="sidebar glass">
            <div class="brand mb-4">
                <h2 class="brand-text text-xl font-bold">Vedomost <span class="text-emerald-500">PRO</span></h2>
                <div class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">
                    ${roleMap[state.profile.role] || 'Пользователь'}
                </div>
            </div>
            
            <nav class="flex-1 space-y-2">
                <div class="nav-item ${state.activeTab === 'journal' ? 'active' : ''}" onclick="switchTab('journal')">
                    <span>📋</span> <span class="nav-text">Журнал</span>
                </div>
                ${state.profile.role === 'admin' ? `
                <div class="nav-item ${state.activeTab === 'groups' ? 'active' : ''}" onclick="switchTab('groups')">
                    <span>👥</span> <span class="nav-text">Группы</span>
                </div>
                <div class="nav-item ${state.activeTab === 'settings' ? 'active' : ''}" onclick="switchTab('settings')">
                    <span>🔑</span> <span class="nav-text">Логины и Пароли</span>
                </div>
                ` : ''}
            </nav>

            
            <div class="mt-auto space-y-4">
                <div class="bg-white/5 p-4 rounded-xl">
                    <p class="text-[10px] text-text-muted mb-1 font-bold">ПОДДЕРЖКА</p>
                    <a href="https://nusra.uz" target="_blank" class="text-xs font-bold text-text-secondary hover:text-white transition-colors">
                        Powered by <span class="text-emerald-500">Nusra.uz</span>
                    </a>
                </div>
                <button id="logout-btn" class="nav-item w-full text-red-400 hover:text-red-300">
                    <span>🚪</span> <span class="nav-text">Выйти</span>
                </button>
            </div>
        </aside>
    `;
}


function renderMobileNav() {
    return `
        <div class="mobile-nav">
            <div class="mobile-nav-item ${state.activeTab === 'journal' ? 'active' : ''}" onclick="switchTab('journal')">
                <span class="text-xl">📋</span>
                <span>Журнал</span>
            </div>
            ${state.profile.role === 'admin' ? `
            <div class="mobile-nav-item ${state.activeTab === 'groups' ? 'active' : ''}" onclick="switchTab('groups')">
                <span class="text-xl">👥</span>
                <span>Группы</span>
            </div>
            <div class="mobile-nav-item ${state.activeTab === 'settings' ? 'active' : ''}" onclick="switchTab('settings')">
                <span class="text-xl">🔑</span>
                <span>Пароли</span>
            </div>
            ` : ''}

            <div class="mobile-nav-item text-red-400" onclick="logout()">
                <span class="text-xl">🚪</span>
                <span>Выход</span>
            </div>
        </div>
    `;
}

function renderHeader(title = 'Журнал посещаемости', subtitle = 'Управление отметками студентов') {
    return `
        <header class="flex justify-between items-end mb-10 animate-fade-in flex-header">
            <div>
                <h1 class="text-4xl font-black mb-2">${title}</h1>
                <p class="text-text-secondary">${subtitle}</p>
            </div>
            ${state.activeTab === 'journal' ? `
            <div class="flex gap-4">
                <input type="date" value="${state.currentDate}" id="date-picker" class="input-premium py-2 w-auto">
                ${state.profile && state.profile.role !== 'starosta' ? `
                <select id="group-select" class="input-premium py-2 w-auto">
                    <option value="">Все группы</option>
                    ${state.groups.map(g => `<option value="${g.id}" ${state.selectedGroupId === g.id ? 'selected' : ''}>${g.name}</option>`).join('')}
                </select>
                ` : ''}
            </div>
            ` : ''}
        </header>
    `;
}

window.switchTab = (tab) => {
    state.activeTab = tab;
    if (tab === 'settings') loadUsers();
    render();
};

function renderGroups() {
    return `
        <div class="glass glass-card mb-8">
            <div class="flex gap-4 mb-6 flex-header">
                <input type="text" id="new-group-name" placeholder="Название новой группы" class="input-premium">
                <button onclick="createGroup()" class="btn btn-primary whitespace-nowrap">+ Создать группу</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${state.groups.map(g => `
                    <div class="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all">
                        <h3 class="text-xl font-bold mb-2">${g.name}</h3>
                        <p class="text-text-muted text-[10px] mb-4">ID: ${g.id}</p>
                        <button onclick="deleteGroup('${g.id}')" class="text-xs text-red-500 font-bold hover:underline">Удалить группу</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.createGroup = async () => {
    const name = document.getElementById('new-group-name').value;
    if (!name) return;
    state.loading = true;
    render();
    const { error } = await supabaseClient.from('groups').insert([{ name }]);
    if (error) alert(error.message);
    else await loadProfile();
    state.loading = false;
    render();
}


function renderSettings() {
    return `
        <div class="glass glass-card mb-8">
            <h3 class="text-xl font-bold mb-6">Создать нового старосту</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                    <label class="text-[10px] font-bold text-text-muted uppercase">ФИО</label>
                    <input type="text" id="reg-name" placeholder="Иван Иванов" class="input-premium mt-1">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-text-muted uppercase">Email</label>
                    <input type="email" id="reg-email" placeholder="email@example.com" class="input-premium mt-1">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-text-muted uppercase">Пароль</label>
                    <input type="password" id="reg-password" placeholder="******" class="input-premium mt-1">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-text-muted uppercase">Группа</label>
                    <select id="reg-group" class="input-premium mt-1">
                        <option value="">— Выберите группу —</option>
                        ${state.groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}
                    </select>
                </div>
                <div class="md:col-span-2 lg:col-span-4 mt-2">
                    <button onclick="createNewUser()" class="btn btn-primary w-full lg:w-auto px-10">Создать аккаунт старосты</button>
                </div>
            </div>
        </div>

        <div class="glass glass-card">
            <h3 class="text-xl font-bold mb-6">Зарегистрированные пользователи</h3>
            <div id="users-list-container">
                <div class="loader text-center py-10">Загрузка пользователей...</div>
            </div>
        </div>
    `;
}

window.createNewUser = async () => {
    const full_name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const group_id = document.getElementById('reg-group').value || null;

    if (!full_name || !email || !password) {
        alert("Пожалуйста, заполните все обязательные поля (ФИО, Email, Пароль).");
        return;
    }

    state.loading = true;
    render();

    try {
        const { data, error } = await supabaseClient.rpc('create_user_admin', {
            in_email: email,
            in_password: password,
            in_full_name: full_name,
            in_role: 'starosta',
            in_group_id: group_id
        });

        if (error) throw error;

        alert(`Пользователь ${full_name} успешно создан!`);
        // Clear fields
        document.getElementById('reg-name').value = '';
        document.getElementById('reg-email').value = '';
        document.getElementById('reg-password').value = '';
        document.getElementById('reg-group').value = '';

        await loadUsers();
    } catch (err) {
        console.error("Create user error:", err);
        alert("Ошибка при создании пользователя: " + err.message);
    } finally {
        state.loading = false;
        render();
    }
};

async function loadUsers() {
    const { data: profiles, error } = await supabaseClient.from('profiles').select('*, groups(name)');
    const container = document.getElementById('users-list-container');
    if (!container) return;

    if (error) {
        container.innerHTML = `<div class="text-red-400">Ошибка: ${error.message}</div>`;
        return;
    }

    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="premium-table">
                <thead>
                    <tr>
                        <th>Пользователь</th>
                        <th>Роль</th>
                        <th>Группа</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${profiles.map(p => `
                        <tr>
                            <td>
                                <div class="font-bold">${p.full_name || 'Без имени'}</div>
                                <div class="text-[10px] text-text-muted">${p.id}</div>
                            </td>
                            <td><span class="badge ${p.role === 'admin' ? 'badge-present' : 'badge-excused'}">${p.role}</span></td>
                            <td>${p.groups?.name || '—'}</td>
                            <td>
                                <button onclick="editUserProfile('${p.id}')" class="btn btn-secondary py-1 px-3 text-xs">Изменить</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}



function renderJournal() {
    if (state.students.length === 0) {
        return `<div class="glass glass-card text-center py-20 text-text-muted">Нет данных для отображения</div>`;
    }

    return `
        <div class="glass glass-card overflow-hidden animate-fade-in" style="animation-delay: 0.1s">
            <table class="premium-table">
                <thead>
                    <tr>
                        <th>ФИО Студента</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.students.map(student => {
        const att = state.attendance.find(a => a.student_id === student.id);
        return `
                            <tr>
                                <td class="font-bold">${student.full_name}</td>
                                <td>
                                    ${renderStatusSelector(student.id, att?.status)}
                                </td>
                                <td>
                                    <button onclick="openOptions('${student.id}')" class="text-text-secondary hover:text-text-primary transition-colors">
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    </button>
                                </td>
                            </tr>
                        `;
    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderStatusSelector(studentId, currentStatus) {
    const statuses = [
        { id: 'present', label: 'П' },
        { id: 'absent', label: 'Н' },
        { id: 'excused', label: 'У' }
    ];

    return `
        <div class="flex gap-2">
            ${statuses.map(s => `
                <button 
                    onclick="updateStatus('${studentId}', '${s.id}')"
                    class="w-10 h-10 rounded-xl font-bold transition-all border ${currentStatus === s.id ? 'bg-accent-primary text-white border-accent-primary' : 'bg-bg-primary text-text-muted border-border-color hover:border-text-muted'}"
                >
                    ${s.label}
                </button>
            `).join('')}
        </div>
    `;
}

// Events
function attachLoginEvents() {
    document.getElementById('login-btn')?.addEventListener('click', () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

function attachAppEvents() {
    document.getElementById('logout-btn')?.addEventListener('click', logout);
    document.getElementById('date-picker')?.addEventListener('change', (e) => {
        state.currentDate = e.target.value;
        loadData();
    });
    document.getElementById('group-select')?.addEventListener('change', (e) => {
        state.selectedGroupId = e.target.value;
        loadData();
    });
}

// Global functions for inline events
window.updateStatus = async (studentId, status) => {
    const existing = state.attendance.find(a => a.student_id === studentId);
    let error;

    if (existing) {
        ({ error } = await supabaseClient
            .from('attendance')
            .update({ status })
            .eq('id', existing.id));
    } else {
        ({ error } = await supabaseClient
            .from('attendance')
            .insert([{ student_id: studentId, date: state.currentDate, status }]));
    }

    if (error) alert('Ошибка обновления: ' + error.message);
    else loadData();
};

window.openOptions = (studentId) => {
    const student = state.students.find(s => s.id === studentId);
    const existing = state.attendance.find(a => a.student_id === studentId);

    const modalHtml = `
        <div class="modal-overlay animate-fade-in" id="options-modal">
            <div class="glass glass-card min-w-[400px]">
                <h3 class="text-xl font-bold mb-4">Детали посещаемости: ${student.full_name}</h3>
                <div class="space-y-4">
                    <div>
                        <label class="text-xs font-bold text-text-muted uppercase">Статус</label>
                        <select id="modal-status" class="input-premium mt-1">
                            <option value="present" ${existing?.status === 'present' ? 'selected' : ''}>Присутствует</option>
                            <option value="absent" ${existing?.status === 'absent' ? 'selected' : ''}>Отсутствует</option>
                            <option value="excused" ${existing?.status === 'excused' ? 'selected' : ''}>Уважительная</option>
                            <option value="late" ${existing?.status === 'late' ? 'selected' : ''}>Опоздал</option>
                            <option value="left_early" ${existing?.status === 'left_early' ? 'selected' : ''}>Ушел раньше</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-bold text-text-muted uppercase">Причина / Комментарий</label>
                        <textarea id="modal-comment" class="input-premium mt-1 h-24" placeholder="Напишите причину...">${existing?.comment || ''}</textarea>
                    </div>
                    <div class="flex gap-2 pt-4">
                        <button onclick="saveOptions('${studentId}')" class="btn btn-primary flex-1">Сохранить</button>
                        <button onclick="closeModal()" class="btn btn-secondary flex-1">Отмена</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
};

window.saveOptions = async (studentId) => {
    const status = document.getElementById('modal-status').value;
    const comment = document.getElementById('modal-comment').value;

    const existing = state.attendance.find(a => a.student_id === studentId);
    let error;

    if (existing) {
        ({ error } = await supabaseClient
            .from('attendance')
            .update({ status, comment })
            .eq('id', existing.id));
    } else {
        ({ error } = await supabaseClient
            .from('attendance')
            .insert([{ student_id: studentId, date: state.currentDate, status, comment }]));
    }

    if (error) alert('Ошибка: ' + error.message);
    else {
        closeModal();
        loadData();
    }
};

window.closeModal = () => {
    document.getElementById('modal-container').innerHTML = '';
};


window.renderDashboard = () => { }; // Placeholder for now
window.editUserProfile = async (userId) => {
    const { data: profile } = await supabaseClient.from('profiles').select('*').eq('id', userId).single();
    if (!profile) return;

    const modalHtml = `
        <div class="modal-overlay animate-fade-in" id="user-modal">
            <div class="glass glass-card min-w-[400px]">
                <h3 class="text-xl font-bold mb-4">Настройки пользователя</h3>
                <div class="space-y-4">
                    <div>
                        <label class="text-xs font-bold text-text-muted uppercase">Полное имя</label>
                        <input id="edit-full-name" type="text" value="${profile.full_name || ''}" class="input-premium mt-1">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-text-muted uppercase">Роль</label>
                        <select id="edit-role" class="input-premium mt-1">
                            <option value="admin" ${profile.role === 'admin' ? 'selected' : ''}>Админ</option>
                            <option value="tutor" ${profile.role === 'tutor' ? 'selected' : ''}>Тютор</option>
                            <option value="starosta" ${profile.role === 'starosta' ? 'selected' : ''}>Староста</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-bold text-text-muted uppercase">Группа (для старосты)</label>
                        <select id="edit-group-id" class="input-premium mt-1">
                            <option value="">— Нет группы —</option>
                            ${state.groups.map(g => `<option value="${g.id}" ${profile.group_id === g.id ? 'selected' : ''}>${g.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="flex gap-2 pt-4">
                        <button onclick="saveUserProfile('${userId}')" class="btn btn-primary flex-1">Сохранить</button>
                        <button onclick="closeModal()" class="btn btn-secondary flex-1">Отмена</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-container').innerHTML = modalHtml;
};

window.saveUserProfile = async (userId) => {
    const full_name = document.getElementById('edit-full-name').value;
    const role = document.getElementById('edit-role').value;
    const group_id = document.getElementById('edit-group-id').value || null;

    const { error } = await supabaseClient
        .from('profiles')
        .update({ full_name, role, group_id })
        .eq('id', userId);

    if (error) alert(error.message);
    else {
        closeModal();
        loadUsers();
    }
};

window.deleteGroup = async (groupId) => {
    if (!confirm('Вы уверены, что хотите удалить группу и всех студентов в ней?')) return;
    const { error } = await supabaseClient.from('groups').delete().eq('id', groupId);
    if (error) alert(error.message);
    else {
        await loadProfile();
        render();
    }
};

// Вспомогательные функции
window.closeModal = () => {
    document.getElementById('modal-container').innerHTML = '';
};

window.renderModals = () => `
    <div id="modal-container"></div>
`;

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM готов, запуск Vedomost PRO...");
    init();
});


