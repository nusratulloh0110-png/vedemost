const apiClient = {
    async request(path, options = {}) {
        const token = localStorage.getItem('token');
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
        const response = await fetch(path, {
            ...options,
            headers: { ...defaultHeaders, ...options.headers }
        });
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                state.user = null;
                render();
            }
            const error = await response.json().catch(() => ({ error: `Error ${response.status}: ${response.statusText}` }));
            throw new Error(error.error || 'Request failed');
        }
        if (response.status === 204) return null;
        return response.json();
    },
    get(path) { return this.request(path); },
    post(path, body) { return this.request(path, { method: 'POST', body: JSON.stringify(body) }); },
    patch(path, body) { return this.request(path, { method: 'PATCH', body: JSON.stringify(body) }); },
    delete(path) { return this.request(path, { method: 'DELETE' }); }
};

// Состояние
let state = {
    user: null,
    profile: null,
    groups: [],
    selectedGroupId: null,
    students: [],
    attendance: [],
    currentDate: new Date().toISOString().split('T')[0],
    activeTab: 'journal', // 'journal', 'groups', 'settings', 'students'
    loading: false,
    loadingStep: '',
    error: null,
    allStudents: [],
    allProfiles: []
};

window.showToast = (message, type = 'success') => {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span style="font-size: 1.25rem">${type === 'success' ? '✅' : '❌'}</span>
        <div class="flex flex-col">
            <span class="font-bold">${type === 'success' ? 'Успешно' : 'Ошибка'}</span>
            <span class="text-xs opacity-90">${message}</span>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.4s ease-in forwards';
        setTimeout(() => toast.remove(), 400);
    }, 5000);
};

window.showConfirm = (message, onConfirm) => {
    const modalHtml = `
        <div class="modal-overlay animate-fade-in" id="confirm-modal">
            <div class="glass glass-card max-w-sm w-full text-center">
                <div class="text-4xl mb-4">🤔</div>
                <h3 class="text-xl font-bold mb-2">Подтверждение</h3>
                <p class="text-text-secondary text-sm mb-6">${message}</p>
                <div class="flex gap-3">
                    <button id="confirm-yes" class="btn btn-primary flex-1">Да, уверен</button>
                    <button onclick="closeModal()" class="btn btn-secondary flex-1">Отмена</button>
                </div>
            </div>
        </div>
    `;
    const container = document.getElementById('modal-container');
    if (container) {
        container.innerHTML = modalHtml;
        document.getElementById('confirm-yes').onclick = () => {
            closeModal();
            onConfirm();
        };
    }
};

async function init() {
    try {
        console.log("Vedomost PRO: Запуск инициализации...");
        state.loadingStep = 'Старт системы...';
        state.error = null;

        const token = localStorage.getItem('token');
        if (token) {
            await loadProfile();
        } else {
            console.log("Токен не найден, показываем экран входа.");
        }
    } catch (err) {
        console.error("Критическая ошибка при запуске:", err);
        state.error = "Не удалось подключиться к серверу: " + err.message;
        state.user = null;
    } finally {
        state.loading = false;
        render();
    }
}

async function loadProfile() {
    state.loading = true;
    state.loadingStep = 'Загрузка профиля...';
    render();

    try {
        const profile = await apiClient.get('/api/profile');
        state.profile = profile;
        state.user = { id: profile.id }; // Compatibility with old logic

        if (state.profile?.role === 'admin' || state.profile?.role === 'tutor') {
            const groups = await apiClient.get('/api/groups');
            state.groups = groups || [];
        } else {
            state.selectedGroupId = state.profile.group_id;
        }

        await loadData();
    } catch (err) {
        console.error("Ошибка loadProfile:", err);
        localStorage.removeItem('token');
        state.user = null;
        state.error = err.message;
    } finally {
        state.loading = false;
        render();
    }
}

async function loadData() {
    state.loadingStep = 'Загрузка данных...';
    try {
        const isAdmin = state.profile?.role === 'admin';
        const isTutor = state.profile?.role === 'tutor';

        if (isAdmin) {
            const [students, profiles, groups] = await Promise.all([
                apiClient.get('/api/students'),
                apiClient.get('/api/admin/users'),
                apiClient.get('/api/groups')
            ]);
            state.allStudents = students || [];
            state.allProfiles = profiles || [];
            state.groups = groups || [];
        } else if (isTutor) {
            const [students, groups] = await Promise.all([
                apiClient.get('/api/students'),
                apiClient.get('/api/groups')
            ]);
            state.allStudents = students || [];
            state.groups = groups || [];
        }

        const groupId = state.selectedGroupId || state.profile?.group_id;

        if (!groupId) {
            state.students = [];
            state.attendance = [];
            return;
        }

        const [students, attendance] = await Promise.all([
            apiClient.get(`/api/students?group_id=${groupId}`),
            apiClient.get(`/api/attendance?group_id=${groupId}&date=${state.currentDate}`)
        ]);

        state.students = students || [];
        state.attendance = attendance || [];
    } catch (err) {
        console.error("Ошибка в loadData:", err);
    }
}

async function login(username, password) {
    if (state.loading) return;
    state.loading = true;
    render();

    try {
        const data = await apiClient.post('/api/login', { username: username.trim(), password });
        localStorage.setItem('token', data.token);
        state.user = { id: data.profile.id };
        state.profile = data.profile;
        await loadProfile();
        showToast('Вы успешно вошли!');
    } catch (err) {
        showToast('Ошибка входа: ' + err.message, 'error');
    } finally {
        state.loading = false;
        render();
    }
}

window.logout = async () => {
    localStorage.removeItem('token');
    state.user = null;
    state.profile = null;
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
                        ${renderHeader('Группы', 'Управление группами и студентами')}
                        ${renderGroups()}
                    </div>
                    <div id="tab-students" class="tab-content ${state.activeTab === 'students' ? 'active' : ''}">
                        ${renderHeader('Студенты', 'Управление общим списком студентов')}
                        ${renderStudentsTab()}
                    </div>
                    <div id="tab-settings" class="tab-content ${state.activeTab === 'settings' ? 'active' : ''}">
                        ${renderHeader('Пользователи', 'Управление доступами старост и тюторов')}
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
                        Это может занять время при первом запуске или медленном соединении с сервером.
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
                    <input type="text" id="username" placeholder="Логин (например, admin)" class="input-premium">
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
                <div class="flex items-center gap-2 mt-1">
                    <div class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                        ${roleMap[state.profile?.role] || 'Пользователь'}
                    </div>
                    <span class="text-[8px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded-full font-black border border-emerald-500/30">v2.1</span>
                </div>
            </div>
            
            <nav class="flex-1 space-y-2">
                <div class="nav-item ${state.activeTab === 'journal' ? 'active' : ''}" onclick="switchTab('journal')">
                    <span>📋</span> <span class="nav-text">Журнал</span>
                </div>
                ${state.profile?.role === 'admin' ? `
                <div class="nav-item ${state.activeTab === 'groups' ? 'active' : ''}" onclick="switchTab('groups')">
                    <span>👥</span> <span class="nav-text">Группы</span>
                </div>
                <div class="nav-item ${state.activeTab === 'students' ? 'active' : ''}" onclick="switchTab('students')">
                    <span>👨‍🎓</span> <span class="nav-text">Студенты</span>
                </div>
                <div class="nav-item ${state.activeTab === 'settings' ? 'active' : ''}" onclick="switchTab('settings')">
                    <span>🔑</span> <span class="nav-text">Доступы</span>
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
    if (!state.user) return '';

    // Показываем минимальный навигатор, если профиль еще грузится
    const isAdmin = state.profile && state.profile.role === 'admin';

    return `
        <div class="mobile-nav">
            <div class="mobile-nav-item ${state.activeTab === 'journal' ? 'active' : ''}" onclick="switchTab('journal')">
                <span class="text-xl">📋</span>
                <span>Журнал</span>
            </div>
            ${isAdmin ? `
            <div class="mobile-nav-item ${state.activeTab === 'groups' ? 'active' : ''}" onclick="switchTab('groups')">
                <span class="text-xl">👥</span>
                <span>Группы</span>
            </div>
            <div class="mobile-nav-item ${state.activeTab === 'students' ? 'active' : ''}" onclick="switchTab('students')">
                <span class="text-xl">👨‍🎓</span>
                <span>Студенты</span>
            </div>
            <div class="mobile-nav-item ${state.activeTab === 'settings' ? 'active' : ''}" onclick="switchTab('settings')">
                <span class="text-xl">🔑</span>
                <span>Доступы</span>
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
        <header class="flex justify-between items-end mb-6 animate-fade-in flex-header gap-4 flex-wrap">
            <div>
                <h1 class="text-3xl font-black mb-1">${title}</h1>
                <p class="text-text-secondary text-sm">${subtitle}</p>
            </div>
            ${state.activeTab === 'journal' ? `
            <div class="flex gap-2 flex-wrap items-center">
                <div class="relative">
                    <button onclick="toggleExportMenu()" class="btn btn-secondary py-2 flex items-center gap-2">
                        <span>📊</span> <span>Excel</span>
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                    </button>
                    <div id="export-menu" class="hidden absolute right-0 top-full mt-2 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl z-50 min-w-[180px]">
                        <div class="p-2 text-[10px] font-bold text-text-muted uppercase px-3 pt-3">Период экспорта</div>
                        <button onclick="exportToExcel('day')" class="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors">📅 Сегодня</button>
                        <button onclick="exportToExcel('week')" class="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors">📅 Неделя (7 дней)</button>
                        <button onclick="exportToExcel('month')" class="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors">📅 Месяц (30 дней)</button>
                        <button onclick="exportToExcel('halfyear')" class="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors pb-3">📅 6 месяцев</button>
                    </div>
                </div>
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

window.toggleExportMenu = () => {
    const menu = document.getElementById('export-menu');
    if (menu) menu.classList.toggle('hidden');
    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!e.target.closest('#export-menu') && !e.target.closest('[onclick="toggleExportMenu()"]')) {
                menu?.classList.add('hidden');
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 10);
};

window.switchTab = (tab) => {
    state.activeTab = tab;
    if (tab === 'settings') loadUsers();
    render();
};

function renderGroups() {
    const isAdmin = state.profile?.role === 'admin';
    return `
        <div class="glass glass-card mb-8">
            <h3 class="text-xl font-bold mb-6">Список групп</h3>
            ${isAdmin ? `
            <div class="flex gap-4 mb-8 flex-header">
                <input type="text" id="new-group-name" placeholder="Название новой группы (напр. 211-22)" class="input-premium">
                <button onclick="createGroup()" class="btn btn-primary whitespace-nowrap">+ Создать группу</button>
            </div>
            ` : ''}
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${state.groups.map(g => {
        const groupStudents = state.allStudents?.filter(s => s.group_id === g.id) || [];
        return `
                    <div class="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-xl font-bold">${g.name}</h3>
                                <p class="text-text-muted text-[10px]">Студентов: ${groupStudents.length}</p>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="enterGroup('${g.id}')" class="text-xs text-emerald-500 font-bold hover:underline">Открыть Журнал</button>
                                ${isAdmin ? `
                                <button onclick="showConfirm('Удалить группу ${g.name}?', () => deleteGroup('${g.id}'))" class="text-xs text-red-500 font-bold hover:underline">Удалить</button>
                                ` : ''}
                            </div>
                        </div>

                        ${isAdmin ? `
                        <div class="mt-4 pt-4 border-t border-white/5">
                            <p class="text-[10px] font-bold text-text-muted uppercase mb-3 text-emerald-500">Добавить студента</p>
                            <div class="flex gap-2">
                                <input type="text" id="student-name-${g.id}" placeholder="ФИО Студента" class="input-premium text-sm py-2">
                                <button onclick="addStudent('${g.id}')" class="btn btn-primary py-2 px-4 shadow-none">+</button>
                            </div>
                            
                            <div class="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                ${groupStudents.length > 0 ? groupStudents.map(s => `
                                    <div class="flex justify-between items-center p-2 bg-white/5 rounded-lg text-sm border border-white/5">
                                        <span class="truncate">${s.full_name}</span>
                                        <button onclick="showConfirm('Удалить ${s.full_name}?', () => removeStudent('${s.id}'))" class="text-red-400 hover:text-red-300 text-xs">✕</button>
                                    </div>
                                `).join('') : '<p class="text-[10px] text-text-muted italic">В группе нет студентов</p>'}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                `}).join('')}
            </div>
        </div>
    `;
}

function renderStudentsTab() {
    if (state.profile?.role !== 'admin') return '<div class="p-10 text-center">Доступ запрещен</div>';

    return `
        <div class="glass glass-card mb-8">
            <h3 class="text-xl font-bold mb-6">Добавить студента</h3>
            <div class="flex gap-4 flex-header items-end">
                <div class="flex-1">
                    <label class="text-[10px] font-bold text-text-muted uppercase">ФИО Студента</label>
                    <input type="text" id="new-student-name" placeholder="Фамилия Имя Отчество" class="input-premium mt-1">
                </div>
                <div class="flex-1">
                    <label class="text-[10px] font-bold text-text-muted uppercase">Группа</label>
                    <select id="new-student-group" class="input-premium mt-1">
                        <option value="">— Выберите группу —</option>
                        ${state.groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}
                    </select>
                </div>
                <button onclick="addStudentGlobal()" class="btn btn-primary px-10">Добавить Студента</button>
            </div>
        </div>

        <div class="glass glass-card">
            <h3 class="text-xl font-bold mb-6">Все студенты</h3>
            <div class="overflow-x-auto">
                <table class="premium-table">
                    <thead>
                        <tr>
                            <th>ФИО Студента</th>
                            <th>Группа</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.allStudents.length > 0 ? state.allStudents.map(s => {
        const groupName = state.groups.find(g => g.id === s.group_id)?.name || 'Неизвестно';
        return `
                            <tr>
                                <td class="font-bold">${s.full_name}</td>
                                <td><span class="badge badge-present">${groupName}</span></td>
                                <td>
                                    <button onclick="showConfirm('Удалить студента ${s.full_name}?', () => removeStudent('${s.id}'))" 
                                            class="text-red-400 hover:text-red-300 font-bold text-xs">Удалить</button>
                                </td>
                            </tr>
                            `;
    }).join('') : '<tr><td colspan="3" class="text-center py-10 opacity-50">Студентов пока нет</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

window.createGroup = async () => {
    const name = document.getElementById('new-group-name').value;
    if (!name) {
        showToast("Введите название группы", 'error');
        return;
    }
    state.loading = true;
    render();
    try {
        await apiClient.post('/api/groups', { name });
        showToast('Группа успешно создана!');
        await loadProfile();
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        state.loading = false;
        render();
    }
}

window.enterGroup = (groupId) => {
    state.selectedGroupId = groupId;
    state.activeTab = 'journal';
    loadData();
    render();
};

window.addStudent = async (groupId) => {
    const input = document.getElementById(`student-name-${groupId}`);
    const fullName = input.value;

    if (!fullName) {
        showToast("Введите ФИО студента", 'error');
        return;
    }

    state.loading = true;
    render();

    try {
        await apiClient.post('/api/students', { full_name: fullName, group_id: groupId });
        showToast("Студент успешно добавлен");
        input.value = '';
        await loadData();
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        state.loading = false;
        render();
    }
};

window.addStudentGlobal = async () => {
    const fullName = document.getElementById('new-student-name').value;
    const groupId = document.getElementById('new-student-group').value;

    if (!fullName || !groupId) {
        showToast("Заполните ФИО и выберите группу", 'error');
        return;
    }

    state.loading = true;
    render();

    try {
        await apiClient.post('/api/students', { full_name: fullName, group_id: groupId });
        showToast("Студент успешно добавлен");
        document.getElementById('new-student-name').value = '';
        await loadData();
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        state.loading = false;
        render();
    }
};

window.removeStudent = async (id) => {
    state.loading = true;
    render();
    try {
        await apiClient.delete('/api/students/' + id);
        showToast("Студент удален");
        await loadData();
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        state.loading = false;
        render();
    }
};


function renderSettings() {
    return `
        <div class="glass glass-card mb-8">
            <h3 class="text-xl font-bold mb-6">Создать нового пользователя</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div>
                    <label class="text-[10px] font-bold text-text-muted uppercase">ФИО</label>
                    <input type="text" id="reg-name" placeholder="Иван Иванов" class="input-premium mt-1">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-text-muted uppercase">Логин</label>
                    <input type="text" id="reg-username" placeholder="Только латиница и цифры" class="input-premium mt-1">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-text-muted uppercase">Пароль</label>
                    <input type="password" id="reg-password" placeholder="******" class="input-premium mt-1">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-text-muted uppercase">Роль</label>
                    <select id="reg-role" class="input-premium mt-1" onchange="toggleRegGroup()">
                        <option value="starosta">Староста</option>
                        <option value="tutor">Тютор</option>
                    </select>
                </div>
                <div id="reg-group-container">
                    <label class="text-[10px] font-bold text-text-muted uppercase">Группа</label>
                    <select id="reg-group" class="input-premium mt-1">
                        <option value="">— Выберите группу —</option>
                        ${state.groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}
                    </select>
                </div>
                <div class="md:col-span-2 lg:col-span-5 mt-2">
                    <button onclick="createNewUser()" class="btn btn-primary w-full lg:w-auto px-10">Создать аккаунт</button>
                </div>
            </div>
        </div>

        <div class="glass glass-card">
            <h3 class="text-xl font-bold mb-6">Существующие пользователи</h3>
            <div class="overflow-x-auto">
                <table class="premium-table">
                    <thead>
                        <tr>
                            <th>ФИО</th>
                            <th>Роль</th>
                            <th>Группа</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.allProfiles.length > 0 ? state.allProfiles.map(p => {
        const groupName = state.groups.find(g => g.id === p.group_id)?.name || '—';
        const roleMap = { admin: 'Админ', tutor: 'Тютор', starosta: 'Староста' };
        return `
                            <tr>
                                <td class="font-bold">${p.full_name}</td>
                                <td><span class="badge badge-${p.role === 'admin' ? 'present' : 'excused'}">${roleMap[p.role]}</span></td>
                                <td>${groupName}</td>
                                <td>
                                    <button onclick="editUserProfile('${p.id}')" class="text-accent-primary hover:underline text-xs mr-3">Изменить</button>
                                </td>
                            </tr>
                            `;
    }).join('') : '<tr><td colspan="4" class="text-center py-6 opacity-30">Пользователей нет</td></tr>'}
                    </tbody>
                </table>
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
    const username = document.getElementById('reg-username').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    const group_id = role === 'starosta' ? document.getElementById('reg-group').value : null;

    if (!full_name || !username || !password) {
        showToast("Заполните ФИО, Логин и Пароль", 'error');
        return;
    }

    if (/[^a-z0-9_.-]/.test(username)) {
        showToast("Логин должен содержать только английские буквы и цифры", "error");
        return;
    }

    if (role === 'starosta' && !group_id) {
        showToast("Для старосты нужно выбрать группу", 'error');
        return;
    }

    state.loading = true;
    render();

    try {
        await apiClient.post('/api/admin/users', { username, password, full_name, role, group_id });
        showToast(`Аккаунт для ${full_name} создан!`);
        document.getElementById('reg-name').value = '';
        document.getElementById('reg-username').value = '';
        document.getElementById('reg-password').value = '';
        if (document.getElementById('reg-group')) document.getElementById('reg-group').value = '';

        await loadUsers();
    } catch (err) {
        console.error("Create user error:", err);
        showToast("Ошибка: " + err.message, 'error');
    } finally {
        state.loading = false;
        render();
    }
};

async function loadUsers() {
    try {
        const profiles = await apiClient.get('/api/admin/users');
        const container = document.getElementById('users-list-container');
        if (!container) return;

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
                                <td>${p.group_name || '—'}</td>
                                <td>
                                    <div class="flex gap-3 items-center">
                                        <button onclick="editUserProfile('${p.id}')" class="btn btn-secondary py-1 px-3 text-xs">Изменить</button>
                                        <button onclick="deleteUserAdmin('${p.id}', '${p.full_name}')" class="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider">Удалить</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (err) {
        const container = document.getElementById('users-list-container');
        if (container) container.innerHTML = `<div class="text-red-400">Ошибка: ${err.message}</div>`;
    }
}



function renderJournal() {
    const isAdmin = state.profile?.role === 'admin';
    const isTutor = state.profile?.role === 'tutor';
    const hasStudents = state.students.length > 0;
    const isGroupSelected = state.profile?.role === 'starosta' || state.selectedGroupId;

    let content = '';

    if (!isGroupSelected) {
        content = `<div class="glass glass-card text-center py-20 text-text-muted">Выберите группу для отображения журнала</div>`;
    } else if (!hasStudents) {
        content = `
            <div class="glass glass-card text-center py-10">
                <p class="text-text-muted mb-6">В этой группе пока нет студентов</p>
                ${isAdmin ? `
                <div class="max-w-md mx-auto">
                    <p class="text-[10px] font-bold text-text-muted uppercase mb-3 text-emerald-500 text-left">Быстрое добавление студента</p>
                    <div class="flex gap-2">
                        <input type="text" id="journal-student-name" placeholder="ФИО Студента" class="input-premium text-sm py-2">
                        <button onclick="addStudentJournal()" class="btn btn-primary py-2 px-6">Добавить</button>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    } else {
        // Mobile-first: cards on small screens, table on large screens
        const studentRows = state.students.map(student => {
            const att = state.attendance.find(a => a.student_id === student.id);
            const statusLabels = { present: '✅ Пришёл', absent: '❌ Не пришёл', excused: '🟡 Уважительная', late: '⏰ Опоздал', left_early: '🚶 Ушёл раньше' };
            const currentLabel = statusLabels[att?.status] || '— Нет отметки';

            return `
                <!-- Mobile card -->
                <div class="mobile-student-card glass rounded-2xl p-4 mb-3 md:hidden">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <p class="font-bold text-sm">${student.full_name}</p>
                            <p class="text-xs text-text-muted mt-0.5">${currentLabel}</p>
                        </div>
                        <div class="flex gap-2 items-center">
                            <button onclick="openOptions('${student.id}')" class="text-text-secondary hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                                ${att?.comment ? '📝' : '⋯'}
                            </button>
                            ${isAdmin ? `<button onclick="showConfirm('Удалить студента?', () => removeStudent('${student.id}'))" class="text-red-500 hover:text-red-400 p-1">✕</button>` : ''}
                        </div>
                    </div>
                    ${renderStatusSelector(student.id, att?.status, true)}
                </div>
                <!-- Desktop table row -->
                <tr class="hidden md:table-row">
                    <td class="font-bold">${student.full_name}</td>
                    <td>${renderStatusSelector(student.id, att?.status)}</td>
                    <td>
                        <button onclick="openOptions('${student.id}')" class="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 text-xs">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            ${att?.comment ? '📝' : 'Опции'}
                        </button>
                    </td>
                    ${isAdmin ? `<td><button onclick="showConfirm('Удалить студента ${student.full_name}?', () => removeStudent('${student.id}'))" class="text-red-500 hover:text-red-400">✕</button></td>` : ''}
                </tr>
            `;
        }).join('');

        content = `
            <!-- Mobile list -->
            <div class="md:hidden mb-4">${studentRows}</div>

            <!-- Desktop table -->
            <div class="glass glass-card overflow-x-auto animate-fade-in mb-6 hidden md:block" style="animation-delay: 0.1s">
                <table class="premium-table">
                    <thead>
                        <tr>
                            <th>ФИО Студента</th>
                            <th>Статус</th>
                            <th>Детали</th>
                            ${isAdmin ? '<th>Удалить</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>${studentRows}</tbody>
                </table>
            </div>

            ${isAdmin ? `
            <div class="glass glass-card max-w-xl">
                 <p class="text-[10px] font-bold text-text-muted uppercase mb-3 text-emerald-500">Добавить студента в текущую группу</p>
                 <div class="flex gap-2">
                    <input type="text" id="journal-student-name" placeholder="ФИО Студента" class="input-premium py-2">
                    <button onclick="addStudentJournal()" class="btn btn-primary py-2 px-8">Добавить</button>
                 </div>
            </div>
            ` : ''}
        `;
    }

    return content;
}

window.addStudentJournal = async () => {
    // Получаем ID группы. Для старосты он берется из профиля, для админа - из селекта
    const groupId = state.profile?.group_id || state.selectedGroupId;
    const name = document.getElementById('journal-student-name').value;

    if (!groupId) {
        showToast("Пожалуйста, сначала выберите конкретную группу в списке сверху!", 'error');
        return;
    }

    if (!name) {
        showToast("Введите ФИО студента", 'error');
        return;
    }

    state.loading = true;
    render();

    try {
        await apiClient.post('/api/students', { full_name: name, group_id: groupId });
        showToast("Студент успешно добавлен в группу");
        await loadData(); // Обновляем список студентов
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        state.loading = false;
        render();
    }
};

function renderStatusSelector(studentId, currentStatus, isMobile = false) {
    // late and left_early are treated as 'details' — map visually to present with a badge
    const effectiveStatus = (currentStatus === 'late' || currentStatus === 'left_early') ? 'present' : currentStatus;
    const detailBadge = currentStatus === 'late' ? ' ⏰' : currentStatus === 'left_early' ? ' 🚶' : '';

    const statuses = [
        { id: 'present', label: 'Пришёл' + detailBadge, activeClass: 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)] border-transparent' },
        { id: 'absent', label: 'Не пришёл', activeClass: 'bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)] border-transparent' },
        { id: 'excused', label: 'Уважительная', activeClass: 'bg-orange-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)] border-transparent' }
    ];

    const isUpdating = state.updatingStatus === studentId;
    const baseClass = `flex-1 py-3 px-2 rounded-xl font-bold text-[11px] uppercase tracking-wide transition-all border text-center cursor-pointer ${isMobile ? 'py-3.5' : 'py-2.5'}`;
    const inactiveClass = 'bg-white/5 text-text-secondary border-white/10 hover:border-white/30 hover:bg-white/10';

    return `
        <div class="flex gap-2 w-full ${isMobile ? '' : 'min-w-[280px]'}">
            ${statuses.map(s => {
        const isActive = effectiveStatus === s.id;
        return `
                <button 
                    id="status-${studentId}-${s.id}"
                    onclick="updateStatus('${studentId}', '${s.id}')"
                    class="${baseClass} ${isActive ? s.activeClass : inactiveClass} ${isUpdating ? 'opacity-50 pointer-events-none' : ''}"
                >${s.label}</button>`;
    }).join('')}
        </div>
    `;
}

// Events
function attachLoginEvents() {
    document.getElementById('login-btn')?.addEventListener('click', () => {
        const username = document.getElementById('username').value.trim().toLowerCase();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            showToast("Введите логин и пароль", "error");
            return;
        }

        login(username, password);
    });
}

function attachAppEvents() {
    document.getElementById('logout-btn')?.addEventListener('click', logout);
    document.getElementById('date-picker')?.addEventListener('change', async (e) => {
        state.currentDate = e.target.value;
        await loadData();
        render(); // <-- Вот это вернет Журнал на экран
    });
    document.getElementById('group-select')?.addEventListener('change', async (e) => {
        state.selectedGroupId = e.target.value;
        await loadData();
        render(); // <-- Вот это вернет Журнал на экран
    });
}

// Global functions for inline events
window.updateStatus = async (studentId, status) => {
    if (state.updatingStatus) return; // Prevent multiple clicks

    state.updatingStatus = studentId;
    render();

    try {
        const groupId = state.profile?.group_id || state.selectedGroupId;
        await apiClient.post('/api/attendance', { student_id: studentId, group_id: groupId, status, date: state.currentDate });
        await loadData();
    } catch (err) {
        showToast('Ошибка: ' + err.message, 'error');
    } finally {
        state.updatingStatus = null;
        render();
    }
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

    try {
        const groupId = state.profile?.group_id || state.selectedGroupId;
        await apiClient.post('/api/attendance', { student_id: studentId, group_id: groupId, status, date: state.currentDate, comment });
        closeModal();
        await loadData();
    } catch (err) {
        showToast('Ошибка: ' + err.message, 'error');
    }
};

window.closeModal = () => {
    document.getElementById('modal-container').innerHTML = '';
};


window.renderDashboard = () => { }; // Placeholder for now
window.editUserProfile = async (userId) => {
    const profiles = await apiClient.get('/api/admin/users');
    const profile = profiles.find(p => p.id === userId);
    if (!profile) return;

    const modalHtml = `
        <div class="modal-overlay animate-fade-in" id="user-modal">
            <div class="glass glass-card min-w-[400px]">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Настройки пользователя</h3>
                    <button onclick="deleteUserAdmin('${userId}', '${profile.full_name}')" class="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded hover:bg-red-500/20">Удалить аккаунт</button>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="text-xs font-bold text-text-muted uppercase">Полное имя</label>
                        <input id="edit-full-name" type="text" value="${profile.full_name || ''}" class="input-premium mt-1">
                    </div>
                    <div class="flex gap-2">
                        <div class="flex-1">
                            <label class="text-xs font-bold text-text-muted uppercase">Новый Логин</label>
                            <input id="edit-username" type="text" placeholder="Оставьте пустым, если не меняете" class="input-premium mt-1 text-sm">
                        </div>
                        <div class="flex-1">
                            <label class="text-xs font-bold text-text-muted uppercase">Новый Пароль</label>
                            <input id="edit-password" type="text" placeholder="Оставьте пустым..." class="input-premium mt-1 text-sm">
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <div class="flex-1">
                            <label class="text-xs font-bold text-text-muted uppercase">Роль</label>
                            <select id="edit-role" class="input-premium mt-1">
                                <option value="admin" ${profile.role === 'admin' ? 'selected' : ''}>Админ</option>
                                <option value="tutor" ${profile.role === 'tutor' ? 'selected' : ''}>Тютор</option>
                                <option value="starosta" ${profile.role === 'starosta' ? 'selected' : ''}>Староста</option>
                            </select>
                        </div>
                        <div class="flex-1">
                            <label class="text-xs font-bold text-text-muted uppercase">Группа</label>
                            <select id="edit-group-id" class="input-premium mt-1">
                                <option value="">— Нет группы —</option>
                                ${state.groups.map(g => `<option value="${g.id}" ${profile.group_id === g.id ? 'selected' : ''}>${g.name}</option>`).join('')}
                            </select>
                        </div>
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

    let username = document.getElementById('edit-username').value.trim().toLowerCase();
    const password = document.getElementById('edit-password').value;

    state.loading = true;
    render();

    try {
        if (username && /[^a-z0-9_.-]/.test(username)) throw new Error("Логин должен содержать только английские буквы и цифры");

        await apiClient.patch('/api/admin/users/' + userId, { full_name, role, group_id, username, password });

        showToast("Пользователь успешно обновлен!");
        closeModal();
        await loadData();
        if (state.activeTab === 'settings') await loadUsers();

    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        state.loading = false;
        render();
    }
};

window.deleteUserAdmin = (userId, userName) => {
    showConfirm(`Вы уверены, что хотите НАВСЕГДА удалить пользователя ${userName}? Это действие нельзя отменить.`, async () => {
        state.loading = true;
        render();
        try {
            await apiClient.delete('/api/admin/users/' + userId);
            showToast("Пользователь удален!");
            closeModal();
            await loadData();
            if (state.activeTab === 'settings') loadUsers();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            state.loading = false;
            render();
        }
    });
};

window.deleteGroup = (groupId) => {
    showConfirm(`Удалить группу и всех студентов в ней?`, async () => {
        try {
            await apiClient.delete('/api/groups/' + groupId);
            showToast("Группа удалена");
            await loadData();
            await loadProfile();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });
};

// Вспомогательные функции
window.closeModal = () => {
    document.getElementById('modal-container').innerHTML = '';
};

window.renderModals = () => `
    <div id="modal-container"></div>
`;

window.toggleRegGroup = () => {
    const role = document.getElementById('reg-role')?.value;
    const container = document.getElementById('reg-group-container');
    if (container) {
        container.style.display = role === 'starosta' ? 'block' : 'none';
    }
};

window.exportToExcel = async (period = 'day') => {
    // Close the dropdown menu
    document.getElementById('export-menu')?.classList.add('hidden');

    if (!state.students || state.students.length === 0) {
        showToast('Нет данных для экспорта', 'error');
        return;
    }

    const isTutor = state.profile?.role === 'tutor' || state.profile?.role === 'admin';
    const groupId = state.selectedGroupId || state.profile?.group_id;
    const group = state.groups.find(g => g.id === groupId);
    const groupName = group ? group.name : 'Все_группы';

    // Calculate date range
    const today = new Date();
    const toDate = today.toISOString().split('T')[0];
    let fromDate = toDate;
    let periodLabel = 'День';

    if (period === 'week') {
        const d = new Date(today); d.setDate(d.getDate() - 6);
        fromDate = d.toISOString().split('T')[0]; periodLabel = 'Неделя';
    } else if (period === 'month') {
        const d = new Date(today); d.setDate(d.getDate() - 29);
        fromDate = d.toISOString().split('T')[0]; periodLabel = 'Месяц';
    } else if (period === 'halfyear') {
        const d = new Date(today); d.setDate(d.getDate() - 179);
        fromDate = d.toISOString().split('T')[0]; periodLabel = '6 месяцев';
    }

    const basicStatusMap = { present: 'Присутствует', absent: 'Отсутствует', excused: 'Уважительная', late: 'Присутствует', left_early: 'Присутствует' };
    const fullStatusMap = { present: 'Присутствует', absent: 'Отсутствует', excused: 'Уважительная', late: 'Опоздал', left_early: 'Ушёл раньше' };
    const statusMap = isTutor ? fullStatusMap : basicStatusMap;

    try {
        showToast('Подготовка данных...', 'success');

        let attendanceData;
        if (period === 'day') {
            // Use already loaded data for today
            attendanceData = state.attendance;
        } else {
            // Fetch range from server
            const url = groupId
                ? `/api/attendance?group_id=${groupId}&date_from=${fromDate}&date_to=${toDate}`
                : `/api/attendance?date_from=${fromDate}&date_to=${toDate}`;
            attendanceData = await apiClient.get(url);
        }

        let data;
        if (period === 'day') {
            // Single day: Student | Status | Comment(tutor only)
            data = state.students.map(s => {
                const att = attendanceData.find(a => a.student_id === s.id);
                const row = { 'ФИО Студента': s.full_name, 'Статус': statusMap[att?.status] || 'Нет отметки' };
                if (isTutor) row['Комментарий'] = att?.comment || '';
                return row;
            });
        } else {
            // Multi-day: Student | Date | Status | Comment(tutor only)
            data = [];
            state.students.forEach(s => {
                const studentAtt = attendanceData.filter(a => a.student_id === s.id);
                if (studentAtt.length === 0) {
                    const row = { 'ФИО Студента': s.full_name, 'Дата': '—', 'Статус': 'Нет данных' };
                    if (isTutor) row['Комментарий'] = '';
                    data.push(row);
                } else {
                    studentAtt.forEach(att => {
                        const row = { 'ФИО Студента': s.full_name, 'Дата': att.date, 'Статус': statusMap[att.status] || 'Нет отметки' };
                        if (isTutor) row['Комментарий'] = att.comment || '';
                        data.push(row);
                    });
                }
            });
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Посещаемость');
        XLSX.writeFile(workbook, `Vedomost_${groupName}_${periodLabel}_${toDate}.xlsx`);
        showToast('Excel файл скачан! ✅');
    } catch (err) {
        console.error('Export error:', err);
        showToast('Ошибка при экспорте', 'error');
    }
};

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM готов, запуск Vedomost PRO...");
    init();
});


