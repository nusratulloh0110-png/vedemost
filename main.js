// ==============================================
// INTERNATIONALIZATION (i18n)
// ==============================================
const TRANSLATIONS = {
    uz: {
        // Навигация
        nav_journal: 'Jurnal', nav_groups: 'Guruhlar', nav_students: 'Talabalar',
        nav_access: 'Kirishlar', nav_logout: 'Chiqish',
        // Заголовок журнала
        journal_title: 'Davomadlik jurnali',
        journal_subtitle: "Talabalar belgilarini boshqarish",
        // Статусы (кнопки)
        status_present: 'Keldi', status_absent: 'Kelmadi', status_excused: 'Uzrli',
        status_late_btn: 'Keldi (Kech)', status_early_btn: 'Keldi (Erta)',
        // Статус бейдж в карточке
        att_present: '✅ Keldi', att_absent: '❌ Kelmadi',
        att_excused: '⚠️ Uzrli', att_late: '⏰ Keldi (Kechikdi)',
        att_early: '🚶 Keldi (Erta ketdi)', att_none: '— belgilanmagan —',
        // Журнал
        select_group_prompt: "Jurnalni ko'rish uchun guruhni tanlang",
        no_students: "Bu guruhda hali talabalar yo'q",
        quick_add: "Talabani tezkor qo'shish",
        add_student_label: "Joriy guruhga talaba qo'shish",
        add_student_placeholder: 'Talaba F.I.O.',
        btn_add: "Qo'shish",
        // Excel
        excel_period: 'Eksport davri', excel_today: '📅 Bugun',
        excel_week: '📅 Hafta (7 kun)', excel_month: '📅 Oy (30 kun)', excel_halfyear: '📅 6 oy',
        // Группы
        groups_title: "Guruhlar ro'yxati", all_groups: '— Guruhni tanlang —',
        create_group_placeholder: "Yangi guruh nomi (mas. 211-22)",
        btn_create_group: '+ Guruh yaratish', btn_open_journal: "Jurnalni ochish",
        btn_delete: "O'chirish", no_students_in_group: "Guruhda talabalar yo'q",
        add_student_to_group: "Guruhga talaba qo'shish",
        // Студенты
        students_title: "Talabani qo'shish", students_all_title: "Barcha talabalar",
        student_fio_label: 'Talaba F.I.O.', student_fio_placeholder: 'Familiya Ism Otasining ismi',
        group_label: 'Guruh', group_placeholder: '— Guruhni tanlang —',
        btn_add_student: "Talaba qo'shish",
        // Пользователи / Доступы
        users_title: "Yangi foydalanuvchi yaratish",
        users_existing: "Mavjud foydalanuvchilar", users_registered: "Ro'yxatdan o'tgan foydalanuvchilar",
        field_fio: 'F.I.O.', field_login: 'Login', field_password: 'Parol',
        field_role: 'Rol', field_group: 'Guruh',
        login_placeholder: 'Faqat lotin harflari va raqamlar',
        password_placeholder: '******', fio_placeholder: 'Ivan Ivanov',
        no_group: '— Guruh yo\'q —',
        btn_create_account: "Hisob yaratish",
        role_admin: 'Admin', role_tutor: 'Tyutor', role_starosta: 'Starosta',
        // Модальное окно опций
        options_title: 'Davomadlik tafsilotlari', options_status: 'Status',
        options_comment: 'Sabab / Izoh', options_comment_placeholder: 'Sababni yozing...',
        opt_present: 'Keldi', opt_absent: 'Kelmadi', opt_excused: 'Uzrli',
        opt_late: 'Kechikdi', opt_early: 'Erta ketdi',
        btn_save: 'Saqlash', btn_cancel: 'Bekor qilish',
        // Логин
        login_subtitle: 'Boshqaruv paneli', login_username_ph: 'Login (masalan: admin)',
        login_password_ph: 'Parol', login_btn: 'Tizimga kirish', login_loading: 'Kirilmoqda...',
        // Подтверждение
        confirm_title: 'Tasdiqlash', confirm_yes: 'Ha, aminman', confirm_cancel: 'Bekor qilish',
        // Тосты
        toast_success: 'Muvaffaqiyatli', toast_error: 'Xatolik',
        // Загрузка
        loading_start: 'Tizim yuklanmoqda...', loading_profile: 'Profil yuklanmoqda...',
        loading_data: "Ma'lumotlar yuklanmoqda...",
        loading_wait: "Bu birinchi ishga tushirishda yoki sekin internet aloqasida vaqt olishi mumkin.",
        btn_continue: 'Kutmasdan davom etish', btn_relogin: "Chiqib, qayta kirish",
        // Прочее
        support_label: 'QOLLAB-QUVVATLASH', all_groups_option: 'Barcha guruhlar',
        edit_user: "O'zgartirish", delete_user: "Hisobni o'chirish",
        user_settings: "Foydalanuvchi sozlamalari", new_login: 'Yangi Login',
        new_password: 'Yangi Parol', leave_empty: "O'zgartirmasangiz bo'sh qoldiring",
        btn_update_account: "Hisobni yangilash",
        delete_group_confirm: "Guruhni va undagi barcha talabalarni o'chirish?",
        delete_student_confirm: "Talabani o'chirish?",
        delete_user_confirm: "Bu foydalanuvchini BUTUNLAY o'chirmoqchimisiz?",
        profile_not_loaded: 'Profil yuklanmadi',
        error_title: 'Xatolik!', btn_reenter: "Qayta kirish", btn_refresh: "Yangilash",
        roles: { admin: 'Administrator', tutor: 'Tyutor', starosta: 'Starosta' },
        version_label: 'v2.1',
    },
    ru: {
        nav_journal: 'Журнал', nav_groups: 'Группы', nav_students: 'Студенты',
        nav_access: 'Доступы', nav_logout: 'Выйти',
        journal_title: 'Журнал посещаемости',
        journal_subtitle: 'Управление отметками студентов',
        status_present: 'Пришёл', status_absent: 'Не пришёл', status_excused: 'Уважит.',
        status_late_btn: 'Пришёл (Поздн.)', status_early_btn: 'Пришёл (Рано)',
        att_present: '✅ Пришёл', att_absent: '❌ Не пришёл',
        att_excused: '⚠️ Уважительная', att_late: '⏰ Пришёл (Опоздал)',
        att_early: '🚶 Пришёл (Ушёл раньше)', att_none: '— не отмечен —',
        select_group_prompt: 'Выберите группу для отображения журнала',
        no_students: 'В этой группе пока нет студентов',
        quick_add: 'Быстрое добавление студента',
        add_student_label: 'Добавить студента в текущую группу',
        add_student_placeholder: 'ФИО Студента', btn_add: 'Добавить',
        excel_period: 'Период экспорта', excel_today: '📅 Сегодня',
        excel_week: '📅 Неделя (7 дней)', excel_month: '📅 Месяц (30 дней)', excel_halfyear: '📅 6 месяцев',
        groups_title: 'Список групп', all_groups: '— Выберите группу —',
        create_group_placeholder: 'Название новой группы (напр. 211-22)',
        btn_create_group: '+ Создать группу', btn_open_journal: 'Открыть Журнал',
        btn_delete: 'Удалить', no_students_in_group: 'В группе нет студентов',
        add_student_to_group: 'Добавить студента',
        students_title: 'Добавить студента', students_all_title: 'Все студенты',
        student_fio_label: 'ФИО Студента', student_fio_placeholder: 'Фамилия Имя Отчество',
        group_label: 'Группа', group_placeholder: '— Выберите группу —',
        btn_add_student: 'Добавить Студента',
        users_title: 'Создать нового пользователя',
        users_existing: 'Существующие пользователи', users_registered: 'Зарегистрированные пользователи',
        field_fio: 'ФИО', field_login: 'Логин', field_password: 'Пароль',
        field_role: 'Роль', field_group: 'Группа',
        login_placeholder: 'Только латиница и цифры',
        password_placeholder: '******', fio_placeholder: 'Иван Иванов',
        no_group: '— Нет группы —',
        btn_create_account: 'Создать аккаунт',
        role_admin: 'Админ', role_tutor: 'Тютор', role_starosta: 'Староста',
        options_title: 'Детали посещаемости', options_status: 'Статус',
        options_comment: 'Причина / Комментарий', options_comment_placeholder: 'Напишите причину...',
        opt_present: 'Присутствует', opt_absent: 'Отсутствует', opt_excused: 'Уважительная',
        opt_late: 'Опоздал', opt_early: 'Ушел раньше',
        btn_save: 'Сохранить', btn_cancel: 'Отмена',
        login_subtitle: 'Панель управления', login_username_ph: 'Логин (например, admin)',
        login_password_ph: 'Пароль', login_btn: 'Войти в систему', login_loading: 'Входим...',
        confirm_title: 'Подтверждение', confirm_yes: 'Да, уверен', confirm_cancel: 'Отмена',
        toast_success: 'Успешно', toast_error: 'Ошибка',
        loading_start: 'Старт системы...', loading_profile: 'Загрузка профиля...',
        loading_data: 'Загрузка данных...',
        loading_wait: 'Это может занять время при первом запуске или медленном соединении с сервером.',
        btn_continue: 'Продолжить без ожидания', btn_relogin: 'Выйти и зайти заново',
        support_label: 'ПОДДЕРЖКА', all_groups_option: 'Все группы',
        edit_user: 'Изменить', delete_user: 'Удалить аккаунт',
        user_settings: 'Настройки пользователя', new_login: 'Новый Логин',
        new_password: 'Новый Пароль', leave_empty: 'Оставьте пустым, если не меняете',
        btn_update_account: 'Обновить аккаунт',
        delete_group_confirm: 'Удалить группу и всех студентов в ней?',
        delete_student_confirm: 'Удалить студента?',
        delete_user_confirm: 'Вы уверены, что хотите НАВСЕГДА удалить пользователя',
        profile_not_loaded: 'Профиль не загружен',
        error_title: 'Ошибка!', btn_reenter: 'Перезайти', btn_refresh: 'Обновить',
        roles: { admin: 'Администратор', tutor: 'Тютор', starosta: 'Староста' },
        version_label: 'v2.1',
    }
};

// Текущий язык из localStorage (по умолчанию Uzbek)
let currentLang = localStorage.getItem('lang') || 'uz';

// Функция перевода
function t(key) {
    return TRANSLATIONS[currentLang]?.[key] ?? TRANSLATIONS['uz']?.[key] ?? key;
}

// Смена языка
window.changeLang = (lang) => {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    // Update floating button active states
    const uz = document.getElementById('lang-float-uz');
    const ru = document.getElementById('lang-float-ru');
    if (uz) { uz.classList.toggle('active', lang === 'uz'); }
    if (ru) { ru.classList.toggle('active', lang === 'ru'); }
    render();
};

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
            <span class="font-bold">${type === 'success' ? t('toast_success') : t('toast_error')}</span>
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
                <h3 class="text-xl font-bold mb-2">${t('confirm_title')}</h3>
                <p class="text-text-secondary text-sm mb-6">${message}</p>
                <div class="flex gap-3">
                    <button id="confirm-yes" class="btn btn-primary flex-1">${t('confirm_yes')}</button>
                    <button onclick="closeModal()" class="btn btn-secondary flex-1">${t('confirm_cancel')}</button>
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
        console.log("TDTrU Davomat: Запуск инициализации...");
        state.loadingStep = t('loading_start');
        state.error = null;

        const token = localStorage.getItem('token');
        if (token) {
            await loadProfile();
        } else {
            console.log("Токен не найден, показываем экран входа.");
        }
    } catch (err) {
        console.error("Критическая ошибка при запуске:", err);
        state.error = (currentLang === 'uz' ? "Serverga ulanish muvaffaqiyatsiz: " : "Не удалось подключиться к серверу: ") + err.message;
        state.user = null;
    } finally {
        state.loading = false;
        render();
    }
}

async function loadProfile() {
    state.loading = true;
    state.loadingStep = t('loading_profile');
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
    state.loadingStep = t('loading_data');
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
            // Автоматически выбираем первую группу, если тютор ещё не выбрал
            if (!state.selectedGroupId && state.groups.length > 0) {
                state.selectedGroupId = state.groups[0].id;
            }
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
        showToast(currentLang === 'uz' ? "Tizimga muvaffaqiyatli kirdingiz!" : 'Вы успешно вошли!');
    } catch (err) {
        showToast((currentLang === 'uz' ? "Kirish xatosi: " : "Ошибка входа: ") + err.message, 'error');
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
    document.body.classList.toggle('app-auth', !!state.user);
    // Update active state of floating lang buttons
    const uzBtn = document.getElementById('lang-float-uz');
    const ruBtn = document.getElementById('lang-float-ru');
    if (uzBtn) uzBtn.classList.toggle('active', currentLang === 'uz');
    if (ruBtn) ruBtn.classList.toggle('active', currentLang === 'ru');

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
                        ${renderHeader(t('nav_groups'), currentLang === 'uz' ? 'Guruhlar va talabalarni boshqarish' : 'Управление группами и студентами')}
                        ${renderGroups()}
                    </div>
                    <div id="tab-students" class="tab-content ${state.activeTab === 'students' ? 'active' : ''}">
                        ${renderHeader(t('nav_students'), currentLang === 'uz' ? 'Umumiy talabalar ro\'yxatini boshqarish' : 'Управление общим списком студентов')}
                        ${renderStudentsTab()}
                    </div>
                    <div id="tab-settings" class="tab-content ${state.activeTab === 'settings' ? 'active' : ''}">
                        ${renderHeader(currentLang === 'uz' ? 'Foydalanuvchilar' : 'Пользователи', currentLang === 'uz' ? 'Starosta va tyutorlar kirishini boshqarish' : 'Управление доступами старост и тюторов')}
                        ${renderSettings()}
                    </div>
                </main>
            </div>
            ${renderModals()}
            ${state.loading ? `
                <div class="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                    <div class="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <p class="text-emerald-500 text-xl font-bold mb-2 animate-pulse">${state.loadingStep || t('loading_data')}</p>
                    <p class="text-text-secondary text-sm mb-8 max-w-xs">${t('loading_wait')}</p>
                    <div class="flex flex-col gap-3 w-full max-w-xs">
                        <button onclick="state.loading=false; render();" class="btn btn-secondary w-full uppercase tracking-widest text-xs py-3">
                            ${t('btn_continue')}
                        </button>
                        <button onclick="logout()" class="text-red-400 text-[10px] uppercase font-bold hover:text-red-300">
                            ${t('btn_relogin')}
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
                    <h1 class="text-3xl font-extrabold mb-2">TDTrU <span class="text-emerald-500">Davomat</span></h1>
                    <p class="text-text-secondary text-sm">${t('login_subtitle')}</p>
                </div>
                <div class="space-y-4">
                    <input type="text" id="username" placeholder="${t('login_username_ph')}" class="input-premium">
                    <input type="password" id="password" placeholder="${t('login_password_ph')}" class="input-premium">
                    <button id="login-btn" class="btn btn-primary w-full mt-2 flex items-center justify-center gap-3" ${state.loading ? 'disabled' : ''}>
                        ${state.loading ? `
                            <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ${t('login_loading')}
                        ` : t('login_btn')}
                    </button>
                </div>
                <div class="flex justify-center gap-2 mt-5">
                    <button onclick="changeLang('uz')" class="lang-btn ${currentLang === 'uz' ? 'lang-btn-active' : ''}">UZ</button>
                    <button onclick="changeLang('ru')" class="lang-btn ${currentLang === 'ru' ? 'lang-btn-active' : ''}">RU</button>
                </div>
                <p class="text-center text-text-muted text-xs mt-4">Powered by <a href="https://nusra.uz" target="_blank" class="text-emerald-500 font-bold hover:underline">Nusra.uz</a></p>
            </div>
        </div>
    `;
}


function renderSidebar() {
    if (!state.profile) {
        if (state.loading) {
            return `<aside class="sidebar glass"><p style="padding:1rem;font-size:0.75rem;font-weight:700;color:#10b981;">${t('loading_profile')}</p></aside>`;
        }
        return `
            <aside class="sidebar glass">
                <div style="margin-bottom:1rem;">
                    <h2 style="font-size:1.1rem;font-weight:900;color:#ef4444;">${t('error_title')}</h2>
                    <p style="font-size:0.7rem;color:#fca5a5;margin-top:0.25rem;">${state.error || t('profile_not_loaded')}</p>
                </div>
                <button onclick="logout()" class="btn btn-secondary" style="width:100%;font-size:0.8rem;">${t('btn_reenter')}</button>
                <button onclick="location.reload()" class="btn btn-primary" style="width:100%;font-size:0.8rem;margin-top:0.5rem;">${t('btn_refresh')}</button>
            </aside>
        `;
    }

    const roles = t('roles');
    const roleLabel = roles[state.profile?.role] || state.profile?.role || '';
    return `
        <aside class="sidebar glass">
            <div class="sidebar-brand">
                <span class="sidebar-logo">TDTrU <span style="color:#10b981;">Davomat</span></span>
                <div style="margin-top:0.25rem;display:flex;align-items:center;gap:0.5rem;">
                    <span style="font-size:0.65rem;color:#10b981;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;">${roleLabel}</span>
                    <span style="font-size:0.6rem;background:rgba(16,185,129,0.15);color:#10b981;padding:0.1rem 0.4rem;border-radius:2rem;font-weight:900;border:1px solid rgba(16,185,129,0.3);">${t('version_label')}</span>
                </div>
            </div>

            <nav>
                <div class="nav-item ${state.activeTab === 'journal' ? 'active' : ''}" onclick="switchTab('journal')">
                    <span>📋</span> <span class="nav-text">${t('nav_journal')}</span>
                </div>
                ${state.profile?.role === 'admin' ? `
                <div class="nav-item ${state.activeTab === 'groups' ? 'active' : ''}" onclick="switchTab('groups')">
                    <span>👥</span> <span class="nav-text">${t('nav_groups')}</span>
                </div>
                <div class="nav-item ${state.activeTab === 'students' ? 'active' : ''}" onclick="switchTab('students')">
                    <span>👨‍🎓</span> <span class="nav-text">${t('nav_students')}</span>
                </div>
                <div class="nav-item ${state.activeTab === 'settings' ? 'active' : ''}" onclick="switchTab('settings')">
                    <span>🔑</span> <span class="nav-text">${t('nav_access')}</span>
                </div>
                ` : ''}
            </nav>

            <div class="sidebar-bottom">
                <div class="sidebar-lang">
                    <button onclick="changeLang('uz')" class="sidebar-lang-btn ${currentLang === 'uz' ? 'active' : ''}">🇺🇿 UZ</button>
                    <button onclick="changeLang('ru')" class="sidebar-lang-btn ${currentLang === 'ru' ? 'active' : ''}">🇷🇺 RU</button>
                </div>
                <div style="background:rgba(255,255,255,0.04);padding:0.75rem;border-radius:0.75rem;border:1px solid rgba(255,255,255,0.08);">
                    <p style="font-size:0.6rem;color:var(--text-muted);font-weight:800;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.3rem;">${t('support_label')}</p>
                    <a href="https://nusra.uz" target="_blank" style="font-size:0.75rem;font-weight:700;color:var(--text-secondary);text-decoration:none;">
                        Powered by <span style="color:#10b981;">Nusra.uz</span>
                    </a>
                </div>
                <button id="logout-btn" class="nav-item" style="width:100%;color:#f87171;">
                    <span>🚪</span> <span class="nav-text">${t('nav_logout')}</span>
                </button>
            </div>
        </aside>
    `;
}


function renderMobileNav() {
    if (!state.user) return '';
    const isAdmin = state.profile && state.profile.role === 'admin';

    return `
        <div class="mobile-nav">
            <div class="mobile-nav-item ${state.activeTab === 'journal' ? 'active' : ''}" onclick="switchTab('journal')">
                <span class="text-xl">📋</span>
                <span>${t('nav_journal')}</span>
            </div>
            ${isAdmin ? `
            <div class="mobile-nav-item ${state.activeTab === 'groups' ? 'active' : ''}" onclick="switchTab('groups')">
                <span class="text-xl">👥</span>
                <span>${t('nav_groups')}</span>
            </div>
            <div class="mobile-nav-item ${state.activeTab === 'students' ? 'active' : ''}" onclick="switchTab('students')">
                <span class="text-xl">👨‍🎓</span>
                <span>${t('nav_students')}</span>
            </div>
            <div class="mobile-nav-item ${state.activeTab === 'settings' ? 'active' : ''}" onclick="switchTab('settings')">
                <span class="text-xl">🔑</span>
                <span>${t('nav_access')}</span>
            </div>
            ` : ''}

            <div class="mobile-nav-item text-red-400" onclick="logout()">
                <span class="text-xl">🚪</span>
                <span>${t('nav_logout')}</span>
            </div>
        </div>
    `;
}

function renderHeader(title, subtitle) {
    const _title = title || t('journal_title');
    const _subtitle = subtitle || t('journal_subtitle');
    return `
        <header class="journal-header animate-fade-in">
            <h1 class="title-responsive">${_title}</h1>
            <p class="text-text-secondary" style="font-size:0.85rem; margin-top:0.25rem;">${_subtitle}</p>
        </header>
        ${state.activeTab === 'journal' ? `
        <div class="journal-toolbar">
            <div class="journal-toolbar-row">
                <div class="export-wrapper" id="export-wrapper">
                    <button onclick="toggleExportMenu()" class="btn btn-secondary btn-export" id="excel-btn">
                        <span>📊</span> <span>Excel</span>
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                    </button>
                    <input type="date" value="${state.currentDate}" id="date-picker" class="input-premium input-date">
                </div>
                ${state.profile && state.profile.role !== 'starosta' ? `
                <select id="group-select" class="input-premium input-group-select">
                    <option value="">${t('all_groups')}</option>
                    ${state.groups.map(g => `<option value="${g.id}" ${state.selectedGroupId === g.id ? 'selected' : ''}>${g.name}</option>`).join('')}
                </select>
                ` : ''}
            </div>
        </div>
        ` : ''}
    `;
}

window.toggleExportMenu = () => {
    // Удаляем старое меню если есть
    let menu = document.getElementById('export-menu');
    if (menu) {
        menu.remove();
        return;
    }

    // Создаём меню и добавляем в body (не в скроллируемый контейнер!)
    menu = document.createElement('div');
    menu.id = 'export-menu';
    menu.className = 'export-dropdown-fixed';
    menu.innerHTML = `
        <div class="export-dropdown-title">${t('excel_period')}</div>
        <button onclick="exportToExcel('day')" class="export-dropdown-item">${t('excel_today')}</button>
        <button onclick="exportToExcel('week')" class="export-dropdown-item">${t('excel_week')}</button>
        <button onclick="exportToExcel('month')" class="export-dropdown-item">${t('excel_month')}</button>
        <button onclick="exportToExcel('halfyear')" class="export-dropdown-item">${t('excel_halfyear')}</button>
    `;
    document.body.appendChild(menu);

    // Позиционируем под кнопкой
    const btn = document.getElementById('excel-btn');
    if (btn) {
        const rect = btn.getBoundingClientRect();
        menu.style.top = (rect.bottom + 8) + 'px';
        menu.style.left = rect.left + 'px';
        // Если уходит вправо за экран — сдвигаем влево
        setTimeout(() => {
            const menuRect = menu.getBoundingClientRect();
            if (menuRect.right > window.innerWidth - 8) {
                menu.style.left = (window.innerWidth - menuRect.width - 8) + 'px';
            }
        }, 0);
    }

    // Закрываем при клике вне
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!e.target.closest('#export-menu') && !e.target.closest('#excel-btn')) {
                document.getElementById('export-menu')?.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 10);
};

window.switchTab = (tab) => {
    state.activeTab = tab;
    if (tab === 'settings') loadData().then(() => render());
    else render();
};

function renderGroups() {
    const isAdmin = state.profile?.role === 'admin';
    return `
        <div class="glass glass-card mb-8">
            <h3 class="text-xl font-bold mb-6">${t('groups_title')}</h3>
            ${isAdmin ? `
            <div class="flex gap-4 mb-8 flex-header">
                <input type="text" id="new-group-name" placeholder="${t('create_group_placeholder')}" class="input-premium">
                <button onclick="createGroup()" class="btn btn-primary whitespace-nowrap">${t('btn_create_group')}</button>
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
                                <p class="text-text-muted text-[10px]">${currentLang === 'uz' ? 'Talabalar' : 'Студентов'}: ${groupStudents.length}</p>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="enterGroup('${g.id}')" class="text-xs text-emerald-500 font-bold hover:underline">${t('btn_open_journal')}</button>
                                ${isAdmin ? `
                                <button onclick="showConfirm('${t('delete_group_confirm')}', () => deleteGroup('${g.id}'))" class="text-xs text-red-500 font-bold hover:underline">${t('btn_delete')}</button>
                                ` : ''}
                            </div>
                        </div>

                        ${isAdmin ? `
                        <div class="mt-4 pt-4 border-t border-white/5">
                            <p class="text-[10px] font-bold text-text-muted uppercase mb-3 text-emerald-500">${t('add_student_to_group')}</p>
                            <div class="flex gap-2">
                                <input type="text" id="student-name-${g.id}" placeholder="${t('student_fio_placeholder')}" class="input-premium text-sm py-2">
                                <button onclick="addStudent('${g.id}')" class="btn btn-primary py-2 px-4 shadow-none">+</button>
                            </div>
                            
                            <div class="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                ${groupStudents.length > 0 ? groupStudents.map(s => `
                                    <div class="flex justify-between items-center p-2 bg-white/5 rounded-lg text-sm border border-white/5">
                                        <span class="truncate">${s.full_name}</span>
                                        <button onclick="showConfirm('${t('delete_student_confirm')}', () => removeStudent('${s.id}'))" class="text-red-400 hover:text-red-300 text-xs">✕</button>
                                    </div>
                                `).join('') : `<p class="text-[10px] text-text-muted italic">${t('no_students_in_group')}</p>`}
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
    if (state.profile?.role !== 'admin') return `<div class="p-10 text-center">${currentLang === 'uz' ? 'Kirish taqiqlangan' : 'Доступ запрещен'}</div>`;

    return `
        <div class="glass glass-card mb-8">
            <h3 class="text-xl font-bold mb-6">${t('students_title')}</h3>
            <div class="flex gap-4 flex-header items-end">
                <div class="flex-1">
                    <label class="text-[10px] font-bold text-text-muted uppercase">${t('student_fio_label')}</label>
                    <input type="text" id="new-student-name" placeholder="${t('student_fio_placeholder')}" class="input-premium mt-1">
                </div>
                <div class="flex-1">
                    <label class="text-[10px] font-bold text-text-muted uppercase">${t('group_label')}</label>
                    <select id="new-student-group" class="input-premium mt-1">
                        <option value="">${t('group_placeholder')}</option>
                        ${state.groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}
                    </select>
                </div>
                <button onclick="addStudentGlobal()" class="btn btn-primary px-10">${t('btn_add_student')}</button>
            </div>
        </div>

        <div class="glass glass-card">
            <h3 class="text-xl font-bold mb-6">${t('students_all_title')}</h3>
            <div class="overflow-x-auto">
                <table class="premium-table">
                    <thead>
                        <tr>
                            <th>${t('student_fio_label')}</th>
                            <th>${t('group_label')}</th>
                            <th>${t('btn_delete')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.allStudents.length > 0 ? state.allStudents.map(s => {
        const groupName = state.groups.find(g => g.id === s.group_id)?.name || '—';
        return `
                            <tr>
                                <td class="font-bold">${s.full_name}</td>
                                <td><span class="badge badge-present">${groupName}</span></td>
                                <td>
                                    <button onclick="showConfirm('${t('delete_student_confirm')}', () => removeStudent('${s.id}'))" 
                                            class="text-red-400 hover:text-red-300 font-bold text-xs">${t('btn_delete')}</button>
                                </td>
                            </tr>
                            `;
    }).join('') : `<tr><td colspan="3" class="text-center py-10 opacity-50">${currentLang === 'uz' ? 'Hali talabalar yoq' : 'Студентов пока нет'}</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

window.createGroup = async () => {
    const name = document.getElementById('new-group-name').value;
    if (!name) {
        showToast(currentLang === 'uz' ? "Guruh nomini kiriting" : "Введите название группы", 'error');
        return;
    }
    state.loading = true;
    render();
    try {
        await apiClient.post('/api/groups', { name });
        showToast(currentLang === 'uz' ? "Guruh muvaffaqiyatli yaratildi" : 'Группа успешно создана!');
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
        showToast(currentLang === 'uz' ? "Talaba F.I.O.sini kiriting" : "Введите ФИО студента", 'error');
        return;
    }

    state.loading = true;
    render();

    try {
        await apiClient.post('/api/students', { full_name: fullName, group_id: groupId });
        showToast(currentLang === 'uz' ? "Talaba muvaffaqiyatli qo'shildi" : "Студент успешно добавлен");
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
        showToast(currentLang === 'uz' ? "F.I.O. va guruhni to'ldiring" : "Заполните ФИО и выберите группу", 'error');
        return;
    }

    state.loading = true;
    render();

    try {
        await apiClient.post('/api/students', { full_name: fullName, group_id: groupId });
        showToast(currentLang === 'uz' ? "Talaba muvaffaqiyatli qo'shildi" : "Студент успешно добавлен");
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
        showToast(currentLang === 'uz' ? "Talaba o'chirildi" : "Студент удален");
        await loadData();
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        state.loading = false;
        render();
    }
};


function renderSettings() {
    const roles = t('roles');
    return `
        <div class="glass glass-card mb-8">
            <h3 class="text-xl font-bold mb-6">${t('users_title')}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div>
                    <label class="text-[10px] font-bold text-text-muted uppercase">${t('field_fio')}</label>
                    <input type="text" id="reg-name" placeholder="${t('fio_placeholder')}" class="input-premium mt-1">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-text-muted uppercase">${t('field_login')}</label>
                    <input type="text" id="reg-username" placeholder="${t('login_placeholder')}" class="input-premium mt-1">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-text-muted uppercase">${t('field_password')}</label>
                    <input type="password" id="reg-password" placeholder="${t('password_placeholder')}" class="input-premium mt-1">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-text-muted uppercase">${t('field_role')}</label>
                    <select id="reg-role" class="input-premium mt-1" onchange="toggleRegGroup()">
                        <option value="starosta">${t('role_starosta')}</option>
                        <option value="tutor">${t('role_tutor')}</option>
                    </select>
                </div>
                <div id="reg-group-container">
                    <label class="text-[10px] font-bold text-text-muted uppercase">${t('field_group')}</label>
                    <select id="reg-group" class="input-premium mt-1">
                        <option value="">${t('group_placeholder')}</option>
                        ${state.groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}
                    </select>
                </div>
                <div class="md:col-span-2 lg:col-span-5 mt-2">
                    <button onclick="createNewUser()" class="btn btn-primary w-full lg:w-auto px-10">${t('btn_create_account')}</button>
                </div>
            </div>
        </div>

        <div class="glass glass-card">
            <h3 class="text-xl font-bold mb-6">${t('users_existing')}</h3>
            <div class="overflow-x-auto">
                <table class="premium-table">
                    <thead>
                        <tr>
                            <th>${t('field_fio')}</th>
                            <th>${t('field_role')}</th>
                            <th>${t('field_group')}</th>
                            <th>${t('btn_delete')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.allProfiles.length > 0 ? state.allProfiles.map(p => {
        const groupName = state.groups.find(g => g.id === p.group_id)?.name || '—';
        const roleLabel = roles[p.role] || p.role;
        return `
                            <tr>
                                <td class="font-bold">${p.full_name}</td>
                                <td><span class="badge badge-${p.role === 'admin' ? 'present' : 'excused'}">${roleLabel}</span></td>
                                <td>${groupName}</td>
                                <td>
                                    <button onclick="editUserProfile('${p.id}')" class="text-accent-primary hover:underline text-xs mr-3">${t('edit_user')}</button>
                                </td>
                            </tr>
                            `;
    }).join('') : `<tr><td colspan="4" class="text-center py-6 opacity-30">${currentLang === 'uz' ? 'Foydalanuvchilar yoq' : 'Пользователей нет'}</td></tr>`}
                    </tbody>
                </table>
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
        showToast(currentLang === 'uz' ? "F.I.O., Login va Parolni to'ldiring" : "Заполните ФИО, Логин и Пароль", 'error');
        return;
    }

    if (/[^a-z0-9_.-]/.test(username)) {
        showToast(currentLang === 'uz' ? "Login faqat lotin harflari va raqamlardan iborat bo'lishi kerak" : "Логин должен содержать только английские буквы и цифры", "error");
        return;
    }

    if (role === 'starosta' && !group_id) {
        showToast(currentLang === 'uz' ? "Starosta uchun guruh tanlash kerak" : "Для старосты нужно выбрать группу", 'error');
        return;
    }

    state.loading = true;
    render();

    try {
        await apiClient.post('/api/admin/users', { username, password, full_name, role, group_id });
        showToast((currentLang === 'uz' ? `Akkaunt yaratildi: ${full_name}` : `Аккаунт для ${full_name} создан!`));
        document.getElementById('reg-name').value = '';
        document.getElementById('reg-username').value = '';
        document.getElementById('reg-password').value = '';
        if (document.getElementById('reg-group')) document.getElementById('reg-group').value = '';

        await loadUsers();
    } catch (err) {
        console.error("Create user error:", err);
        showToast((currentLang === 'uz' ? "Xatolik: " : "Ошибка: ") + err.message, 'error');
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
                            <th>${currentLang === 'uz' ? 'Foydalanuvchi' : 'Пользователь'}</th>
                            <th>${currentLang === 'uz' ? 'Rol' : 'Роль'}</th>
                            <th>${currentLang === 'uz' ? 'Guruh' : 'Группа'}</th>
                            <th>${currentLang === 'uz' ? 'Amallar' : 'Действия'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${profiles.map(p => `
                            <tr>
                                <td>
                                    <div class="font-bold">${p.full_name || (currentLang === 'uz' ? 'Ismsiz' : 'Без имени')}</div>
                                    <div class="text-[10px] text-text-muted">${p.id}</div>
                                </td>
                                <td><span class="badge ${p.role === 'admin' ? 'badge-present' : 'badge-excused'}">${p.role}</span></td>
                                <td>${p.group_name || '—'}</td>
                                <td>
                                    <div class="flex gap-3 items-center">
                                        <button onclick="editUserProfile('${p.id}')" class="btn btn-secondary py-1 px-3 text-xs">${currentLang === 'uz' ? "O'zgartirish" : 'Изменить'}</button>
                                        <button onclick="deleteUserAdmin('${p.id}', '${p.full_name}')" class="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider">${currentLang === 'uz' ? "O'chirish" : 'Удалить'}</button>
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
        if (container) container.innerHTML = `<div class="text-red-400">${currentLang === 'uz' ? 'Xatolik' : 'Ошибка'}: ${err.message}</div>`;
    }
}



function renderJournal() {
    const isAdmin = state.profile?.role === 'admin';
    const isTutor = state.profile?.role === 'tutor';
    const hasStudents = state.students.length > 0;
    const isGroupSelected = state.profile?.role === 'starosta' || state.selectedGroupId;

    let content = '';

    if (!isGroupSelected) {
        content = `<div class="glass glass-card text-center py-20 text-text-muted">${t('select_group_prompt')}</div>`;
    } else if (!hasStudents) {
        content = `
            <div class="glass glass-card text-center py-10">
                <p class="text-text-muted mb-6">${t('no_students')}</p>
                ${isAdmin ? `
                <div class="max-w-md mx-auto">
                    <p class="text-[10px] font-bold text-text-muted uppercase mb-3 text-emerald-500 text-left">${t('quick_add')}</p>
                    <div class="flex gap-2">
                        <input type="text" id="journal-student-name" placeholder="${t('add_student_placeholder')}" class="input-premium text-sm py-2">
                        <button onclick="addStudentJournal()" class="btn btn-primary py-2 px-6">${t('btn_add')}</button>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    } else {
        // === МОБИЛЬНЫЕ КАРТОЧКИ (journal-mobile-list) ===
        const mobileCards = state.students.map(student => {
            const att = state.attendance.find(a => a.student_id === student.id);
            const statusLabel = !att?.status ? '' :
                att.status === 'present' ? t('att_present') :
                    att.status === 'absent' ? t('att_absent') :
                        att.status === 'excused' ? t('att_excused') :
                            att.status === 'late' ? t('att_late') : t('att_early');
            const statusColor = !att?.status ? '#64748b' :
                (att.status === 'present' || att.status === 'late' || att.status === 'left_early') ? '#10b981' :
                    att.status === 'absent' ? '#ef4444' : '#f59e0b';
            return `
                <div class="jc-card">
                    <div class="jc-card-header">
                        <div class="jc-card-info">
                            <p class="jc-card-name">${student.full_name}</p>
                            <span class="jc-card-status" style="color:${statusColor}">${statusLabel || t('att_none')}</span>
                        </div>
                        <div class="jc-card-btns">
                            <button onclick="openOptions('${student.id}')" class="jc-btn-opts" title="${t('options_title')}">${att?.comment ? '📝' : '⋯'}</button>
                            ${isAdmin ? `<button onclick="showConfirm('${t('delete_student_confirm')}', () => removeStudent('${student.id}'))" class="jc-btn-del">✕</button>` : ''}
                        </div>
                    </div>
                    ${renderStatusSelector(student.id, att?.status, true)}
                </div>
            `;
        }).join('');

        const desktopRows = state.students.map(student => {
            const att = state.attendance.find(a => a.student_id === student.id);
            return `
                <tr>
                    <td class="font-bold">${student.full_name}</td>
                    <td>${renderStatusSelector(student.id, att?.status)}</td>
                    <td>
                        <button onclick="openOptions('${student.id}')" class="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 text-xs">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            ${att?.comment ? '📝' : currentLang === 'uz' ? 'Variantlar' : 'Опции'}
                        </button>
                    </td>
                    ${isAdmin ? `<td><button onclick="showConfirm('${currentLang === 'uz' ? "Talabani o'chirish" : 'Удалить студента'} ${student.full_name}?', () => removeStudent('${student.id}'))" class="text-red-500 hover:text-red-400">✕</button></td>` : ''}
                </tr>
            `;
        }).join('');

        content = `
            <div class="journal-mobile-list">${mobileCards}</div>

            <div class="journal-desktop-table glass glass-card animate-fade-in" style="animation-delay: 0.1s">
                <div class="overflow-x-auto">
                    <table class="premium-table">
                        <thead>
                            <tr>
                                <th>${t('student_fio_label')}</th>
                                <th>${t('options_status')}</th>
                                <th>${t('options_title')}</th>
                                ${isAdmin ? `<th>${t('btn_delete')}</th>` : ''}
                            </tr>
                        </thead>
                        <tbody>${desktopRows}</tbody>
                    </table>
                </div>
            </div>

            ${isAdmin || isTutor ? `
            <div class="glass glass-card add-student-card">
                <p class="add-student-label">${t('add_student_label')}</p>
                <div class="add-student-row">
                    <input type="text" id="journal-student-name" placeholder="${t('add_student_placeholder')}" class="input-premium">
                    <button onclick="addStudentJournal()" class="btn btn-primary">${t('btn_add')}</button>
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
        showToast(currentLang === 'uz' ? "Avval ro'yxatda guruhni belgilang!" : "Пожалуйста, сначала выберите конкретную группу в списке сверху!", 'error');
        return;
    }

    if (!name) {
        showToast(currentLang === 'uz' ? "Talaba F.I.O.sini kiriting" : "Введите ФИО студента", 'error');
        return;
    }

    state.loading = true;
    render();

    try {
        await apiClient.post('/api/students', { full_name: name, group_id: groupId });
        showToast(currentLang === 'uz' ? "Talaba guruhga muvaffaqiyatli qo'shildi" : "Студент успешно добавлен в группу");
        await loadData(); // Обновляем список студентов
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        state.loading = false;
        render();
    }
};

function renderStatusSelector(studentId, currentStatus, isMobile = false) {
    const effectiveStatus = (currentStatus === 'late' || currentStatus === 'left_early') ? 'present' : currentStatus;
    const detailBadge = currentStatus === 'late' ? ` (${currentLang === 'uz' ? 'Kech' : 'Поздн.'})` :
        currentStatus === 'left_early' ? ` (${currentLang === 'uz' ? 'Erta' : 'Рано'})` : '';

    const statuses = [
        { id: 'present', label: t('status_present') + detailBadge, activeClass: 'status-btn-present' },
        { id: 'absent', label: t('status_absent'), activeClass: 'status-btn-absent' },
        { id: 'excused', label: t('status_excused'), activeClass: 'status-btn-excused' }
    ];

    const isUpdating = state.updatingStatus === studentId;
    return `
        <div class="status-btn-row${isMobile ? ' status-btn-row--mobile' : ''}">
            ${statuses.map(s => {
        const isActive = effectiveStatus === s.id;
        return `<button
                    id="status-${studentId}-${s.id}"
                    onclick="updateStatus('${studentId}', '${s.id}')"
                    class="status-btn ${isActive ? s.activeClass : 'status-btn-inactive'} ${isUpdating ? 'status-btn-loading' : ''}"
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
            showToast(currentLang === 'uz' ? "Login va parolni kiriting" : "Введите логин и пароль", "error");
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
        showToast((currentLang === 'uz' ? 'Xatolik: ' : 'Ошибка: ') + err.message, 'error');
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
                <h3 class="text-xl font-bold mb-4">${t('options_title')}: ${student.full_name}</h3>
                <div class="space-y-4">
                    <div>
                        <label class="text-xs font-bold text-text-muted uppercase">${t('options_status')}</label>
                        <select id="modal-status" class="input-premium mt-1">
                            <option value="present" ${existing?.status === 'present' ? 'selected' : ''}>${t('opt_present')}</option>
                            <option value="absent" ${existing?.status === 'absent' ? 'selected' : ''}>${t('opt_absent')}</option>
                            <option value="excused" ${existing?.status === 'excused' ? 'selected' : ''}>${t('opt_excused')}</option>
                            <option value="late" ${existing?.status === 'late' ? 'selected' : ''}>${t('opt_late')}</option>
                            <option value="left_early" ${existing?.status === 'left_early' ? 'selected' : ''}>${t('opt_early')}</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-bold text-text-muted uppercase">${t('options_comment')}</label>
                        <textarea id="modal-comment" class="input-premium mt-1 h-24" placeholder="${t('options_comment_placeholder')}">${existing?.comment || ''}</textarea>
                    </div>
                    <div class="flex gap-2 pt-4">
                        <button onclick="saveOptions('${studentId}')" class="btn btn-primary flex-1">${t('btn_save')}</button>
                        <button onclick="closeModal()" class="btn btn-secondary flex-1">${t('btn_cancel')}</button>
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
        showToast((currentLang === 'uz' ? 'Xatolik: ' : 'Ошибка: ') + err.message, 'error');
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
                    <h3 class="text-xl font-bold">${t('user_settings')}</h3>
                    <button onclick="deleteUserAdmin('${userId}', '${profile.full_name}')" class="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded hover:bg-red-500/20">${t('delete_user')}</button>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="text-xs font-bold text-text-muted uppercase">${t('field_fio')}</label>
                        <input id="edit-full-name" type="text" value="${profile.full_name || ''}" class="input-premium mt-1">
                    </div>
                    <div class="flex gap-2">
                        <div class="flex-1">
                            <label class="text-xs font-bold text-text-muted uppercase">${t('new_login')}</label>
                            <input id="edit-username" type="text" placeholder="${t('leave_empty')}" class="input-premium mt-1 text-sm">
                        </div>
                        <div class="flex-1">
                            <label class="text-xs font-bold text-text-muted uppercase">${t('new_password')}</label>
                            <input id="edit-password" type="text" placeholder="${t('leave_empty')}" class="input-premium mt-1 text-sm">
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <div class="flex-1">
                            <label class="text-xs font-bold text-text-muted uppercase">${t('field_role')}</label>
                            <select id="edit-role" class="input-premium mt-1">
                                <option value="admin" ${profile.role === 'admin' ? 'selected' : ''}>${t('role_admin')}</option>
                                <option value="tutor" ${profile.role === 'tutor' ? 'selected' : ''}>${t('role_tutor')}</option>
                                <option value="starosta" ${profile.role === 'starosta' ? 'selected' : ''}>${t('role_starosta')}</option>
                            </select>
                        </div>
                        <div class="flex-1">
                            <label class="text-xs font-bold text-text-muted uppercase">${t('field_group')}</label>
                            <select id="edit-group-id" class="input-premium mt-1">
                                <option value="">${t('no_group')}</option>
                                ${state.groups.map(g => `<option value="${g.id}" ${profile.group_id === g.id ? 'selected' : ''}>${g.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="flex gap-2 pt-4">
                        <button onclick="saveUserProfile('${userId}')" class="btn btn-primary flex-1">${t('btn_update_account')}</button>
                        <button onclick="closeModal()" class="btn btn-secondary flex-1">${t('btn_cancel')}</button>
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
        if (username && /[^a-z0-9_.-]/.test(username)) throw new Error(currentLang === 'uz' ? "Login faqat lotin harflari va raqamlardan iborat bo'lishi kerak" : "Логин должен содержать только английские буквы и цифры");

        await apiClient.patch('/api/admin/users/' + userId, { full_name, role, group_id, username, password });

        showToast(currentLang === 'uz' ? "Foydalanuvchi muvaffaqiyatli yangilandi!" : "Пользователь успешно обновлен!");
        closeModal();
        await loadData();
        render();

    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        state.loading = false;
        render();
    }
};

window.deleteUserAdmin = (userId, userName) => {
    showConfirm(`${t('delete_user_confirm')} ${userName}?`, async () => {
        state.loading = true;
        render();
        try {
            await apiClient.delete('/api/admin/users/' + userId);
            showToast(currentLang === 'uz' ? "Foydalanuvchi o'chirildi!" : "Пользователь удален!");
            closeModal();
            await loadData();
            render();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            state.loading = false;
            render();
        }
    });
};

window.deleteGroup = (groupId) => {
    showConfirm(t('delete_group_confirm'), async () => {
        try {
            await apiClient.delete('/api/groups/' + groupId);
            showToast(currentLang === 'uz' ? "Guruh o'chirildi" : "Группа удалена");
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
    document.getElementById('export-menu')?.remove();

    if (!state.students || state.students.length === 0) {
        showToast(currentLang === 'uz' ? "Eksport uchun ma'lumot yo'q" : 'Нет данных для экспорта', 'error');
        return;
    }

    const groupId = state.selectedGroupId || state.profile?.group_id;
    const group = state.groups.find(g => g.id === groupId);
    const groupName = group ? group.name : (currentLang === 'uz' ? 'Barcha_guruhlar' : 'Все_группы');

    const labels = currentLang === 'uz'
        ? {
            day: 'Kun', week: 'Hafta', month: 'Oy', halfyear: '6 oy',
            present: 'Keldi', absent: 'Kelmadi', excused: 'Uzrli',
            lateSuffix: ' (Kechikdi)', earlySuffix: ' (Erta ketdi)',
            noMarkShort: '—',
            colStudent: 'Talaba F.I.O.',
            sheet: 'Davomat',
            preparing: "Ma'lumotlar tayyorlanmoqda...",
            success: 'Excel fayli yuklab olindi! ✅',
            exportError: 'Eksportda xatolik'
        }
        : {
            day: 'День', week: 'Неделя', month: 'Месяц', halfyear: '6 месяцев',
            present: 'Присутствует', absent: 'Отсутствует', excused: 'Уважительная',
            lateSuffix: ' (Опоздал)', earlySuffix: ' (Ушёл раньше)',
            noMarkShort: '—',
            colStudent: 'ФИО Студента',
            sheet: 'Посещаемость',
            preparing: 'Подготовка данных...',
            success: 'Excel файл скачан! ✅',
            exportError: 'Ошибка при экспорте'
        };

    const today = new Date();
    const toDate = today.toISOString().split('T')[0];
    let fromDate = toDate;
    let periodLabel = labels.day;

    if (period === 'week') {
        const d = new Date(today); d.setDate(d.getDate() - 6);
        fromDate = d.toISOString().split('T')[0]; periodLabel = labels.week;
    } else if (period === 'month') {
        const d = new Date(today); d.setDate(d.getDate() - 29);
        fromDate = d.toISOString().split('T')[0]; periodLabel = labels.month;
    } else if (period === 'halfyear') {
        const d = new Date(today); d.setDate(d.getDate() - 179);
        fromDate = d.toISOString().split('T')[0]; periodLabel = labels.halfyear;
    }

    const baseStatusMap = {
        present: labels.present,
        absent: labels.absent,
        excused: labels.excused,
        late: labels.present,
        left_early: labels.present
    };
    const detailSuffixMap = {
        late: labels.lateSuffix,
        left_early: labels.earlySuffix
    };

    const formatDateHeader = (iso) => {
        const [y, m, d] = iso.split('-');
        return `${d}.${m}`;
    };

    const buildDateRange = (from, to) => {
        const dates = [];
        const cursor = new Date(`${from}T00:00:00`);
        const end = new Date(`${to}T00:00:00`);
        while (cursor <= end) {
            dates.push(cursor.toISOString().split('T')[0]);
            cursor.setDate(cursor.getDate() + 1);
        }
        return dates;
    };

    const formatStatusCell = (att) => {
        if (!att?.status) return labels.noMarkShort;
        const base = baseStatusMap[att.status] || labels.noMarkShort;
        const suffix = detailSuffixMap[att.status] || '';
        const comment = att.comment ? ` (${att.comment})` : '';
        return `${base}${suffix}${comment}`;
    };

    try {
        showToast(labels.preparing, 'success');

        let attendanceData;
        if (period === 'day') {
            attendanceData = state.attendance.map(a => ({ ...a, date: toDate }));
        } else {
            const url = groupId
                ? `/api/attendance?group_id=${groupId}&date_from=${fromDate}&date_to=${toDate}`
                : `/api/attendance?date_from=${fromDate}&date_to=${toDate}`;
            attendanceData = await apiClient.get(url);
        }

        const dates = buildDateRange(fromDate, toDate);
        const attMap = new Map(attendanceData.map(a => [`${a.student_id}|${a.date}`, a]));

        const aoa = [];
        aoa.push([labels.colStudent, ...dates.map(formatDateHeader)]);

        state.students.forEach(student => {
            const row = [student.full_name];
            dates.forEach(date => {
                const att = attMap.get(`${student.id}|${date}`);
                row.push(formatStatusCell(att));
            });
            aoa.push(row);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(aoa);
        worksheet['!cols'] = [{ wch: 36 }, ...dates.map(() => ({ wch: 18 }))];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, labels.sheet);
        XLSX.writeFile(workbook, `TDTrU_Davomat_${groupName}_${periodLabel}_${toDate}.xlsx`);
        showToast(labels.success);
    } catch (err) {
        console.error('Export error:', err);
        showToast(labels.exportError, 'error');
    }
};

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM готов, запуск TDTrU Davomat...");
    init();
});









