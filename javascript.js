const authScreen = document.querySelector('#auth-screen');
const authForm = document.querySelector('#auth-form');
const authToggle = document.querySelector('#auth-toggle');
const authTitle = document.querySelector('#auth-title');
const authIntro = document.querySelector('#auth-intro');
const authSubmit = document.querySelector('#auth-submit');
const authMessage = document.querySelector('#auth-message');
const confirmField = document.querySelector('#confirm-field');
const confirmPassword = document.querySelector('#confirm-password');
const app = document.querySelector('#app');
const logout = document.querySelector('#logout');
const fill = document.querySelector('#fill');
const percent = document.querySelector('#percent');
const header = document.querySelector('header');
const startCourseButton = document.querySelector('#start-course');
const viewProgressButton = document.querySelector('#view-progress');
const homePanel = document.querySelector('.home-panel');
const courseCards = [...document.querySelectorAll('.course-card')];
const courseState = document.querySelector('#course-state');
const lessons = [...document.querySelectorAll('.lesson')];
const config = window.SUPABASE_CONFIG || {};
const supabaseClient = window.supabase && config.url && config.anonKey
    ? window.supabase.createClient(config.url, config.anonKey)
    : null;

const availableCourses = [{
    id: 'ingenieria-de-prompting',
    name: 'Ingeniería de prompting',
    level: 'Nivel inicial',
    totalLessons: 4
}, {
    id: 'productividad-personal',
    name: 'Productividad personal',
    level: 'Nivel intermedio',
    totalLessons: 4
}, {
    id: 'ventas-y-negociacion',
    name: 'Ventas y negociación',
    level: 'Nivel avanzado',
    totalLessons: 4
}];

let isRegistering = false;
let currentLesson = 0;
let completedLessons = 0;
let selectedCourseId = null;
let currentUser = null;

function setMessage(message, isError = false) {
    authMessage.textContent = message;
    authMessage.classList.toggle('error', isError);
}

function setAuthLoading(isLoading) {
    authSubmit.disabled = isLoading;
    authToggle.disabled = isLoading;
    authSubmit.textContent = isLoading ? 'Procesando...' : (isRegistering ? 'Crear cuenta' : 'Iniciar sesión');
}

function showAuth() {
    authScreen.hidden = false;
    app.hidden = true;
}

function showApp(user) {
    authScreen.hidden = true;
    app.hidden = false;
    logout.title = user.email || 'Cerrar sesión';
}

function setAuthMode(registering) {
    isRegistering = registering;
    authTitle.textContent = registering ? 'Crea tu cuenta' : 'Continúa tu recorrido';
    authIntro.textContent = registering
        ? 'Regístrate para guardar tu progreso en cada clase.'
        : 'Inicia sesión para guardar tu progreso en cada clase.';
    confirmField.hidden = !registering;
    confirmPassword.required = registering;
    authToggle.textContent = registering
        ? '¿Ya tienes una cuenta? Inicia sesión'
        : '¿Todavía no tienes una cuenta? Regístrate';
    authForm.reset();
    setMessage('');
}

function getSelectedCourse() {
    if (!selectedCourseId) return null;
    return availableCourses.find((course) => course.id === selectedCourseId) || null;
}

function getProgressStorageKey(userId) {
    return `aula-course-progress:${userId || 'guest'}:${selectedCourseId}`;
}

function getSavedProgress(userId) {
    const course = getSelectedCourse();
    if (!course) return 0;

    const rawValue = localStorage.getItem(getProgressStorageKey(userId));
    if (!rawValue) return 0;

    try {
        const parsed = JSON.parse(rawValue);
        const savedProgress = Number(parsed.completedLessons || 0);
        return Math.max(0, Math.min(savedProgress, course.totalLessons));
    } catch (error) {
        return 0;
    }
}

function updateCourseStateMessage() {
    if (!courseState) return;

    const course = getSelectedCourse();
    const totalLessons = course?.totalLessons || lessons.length;

    if (!course) {
        courseState.textContent = 'Elegí un curso para cargar tu progreso.';
        return;
    }

    if (completedLessons === 0) {
        courseState.textContent = `Elegiste ${course.name}. Aún no comenzaste este curso.`;
        return;
    }

    if (completedLessons >= totalLessons) {
        courseState.textContent = `Elegiste ${course.name}. Completaste todas las ${totalLessons} clases de este curso.`;
        return;
    }

    courseState.textContent = `Elegiste ${course.name}. Quedaste en la clase ${completedLessons + 1} de ${totalLessons}.`;
}

function updateCourseButtons() {
    courseCards.forEach((card) => {
        const isSelected = card.dataset.courseId === selectedCourseId;
        card.classList.toggle('selected', isSelected);
        card.setAttribute('aria-pressed', String(isSelected));
    });
}

function applyProgress() {
    const course = getSelectedCourse();
    const totalLessons = course?.totalLessons || lessons.length;
    const lessonsContainer = document.querySelector('.lessons');

    if (homePanel) {
        homePanel.hidden = !!course;
    }
    lessonsContainer.hidden = !course;

    if (!course) {
        completedLessons = 0;
        currentLesson = 0;
        fill.style.width = '0%';
        percent.textContent = '0%';
        lessons.forEach((lesson) => {
            lesson.classList.remove('active', 'completed');
            const done = lesson.querySelector('.done');
            const button = lesson.querySelector('.continue');
            done.checked = false;
            done.disabled = true;
            button.disabled = true;
            button.textContent = 'Continuar con el progreso →';
        });
        updateCourseStateMessage();
        return;
    }

    currentLesson = Math.min(completedLessons, totalLessons - 1);

    lessons.forEach((lesson, index) => {
        const done = lesson.querySelector('.done');
        const button = lesson.querySelector('.continue');
        const isCompleted = index < completedLessons;

        done.checked = isCompleted;
        done.disabled = index !== completedLessons;
        button.disabled = index !== completedLessons;
        button.textContent = index < completedLessons ? 'Progreso actualizado ✓' : 'Continuar con el progreso →';
        lesson.classList.toggle('completed', isCompleted);
        lesson.classList.toggle('active', index === currentLesson);
    });

    const progress = Math.round((completedLessons / totalLessons) * 100);
    fill.style.width = `${progress}%`;
    percent.textContent = `${progress}%`;
    updateCourseOptionsText();
    updateCourseStateMessage();
}

function updateCourseOptionsText() {
    const course = getSelectedCourse();
    const totalLessons = course?.totalLessons || lessons.length;
    const selectorText = document.querySelector('.picker-count');
    if (selectorText) {
        selectorText.textContent = `${availableCourses.length} disponible${availableCourses.length > 1 ? 's' : ''}`;
    }

    const courseTitle = document.querySelector('.course-card h3');
    const courseLevel = document.querySelector('.course-level');
    if (courseTitle) courseTitle.textContent = course.name;
    if (courseLevel) courseLevel.textContent = course.level;

    const lessonList = document.querySelector('.course-meta li');
    if (lessonList) {
        lessonList.textContent = `${totalLessons} clases`;
    }
}

async function loadProgress(user) {
    currentUser = user;
    const course = getSelectedCourse();
    if (!course) {
        completedLessons = 0;
        applyProgress();
        return;
    }

    const savedProgress = getSavedProgress(user?.id || 'guest');
    completedLessons = savedProgress;
    applyProgress();
}

async function saveProgress(user) {
    if (!selectedCourseId || !user) return;

    const progressValue = {
        completedLessons,
        updatedAt: new Date().toISOString(),
        courseId: selectedCourseId
    };

    localStorage.setItem(getProgressStorageKey(user.id), JSON.stringify(progressValue));

    if (!supabaseClient) return;

    try {
        const { error } = await supabaseClient.from('lesson_progress').upsert({
            user_id: user.id,
            completed_lessons: completedLessons,
            updated_at: new Date().toISOString()
        });
        if (error) throw error;
    } catch (error) {
        console.warn('No se pudo sincronizar el progreso con Supabase:', error);
    }
}

async function startSession(session) {
    if (!session) {
        showAuth();
        return;
    }
    try {
        await loadProgress(session.user);
        showApp(session.user);
    } catch (error) {
        showAuth();
        setMessage(`No se pudo cargar tu progreso: ${error.message}`, true);
    }
}

authToggle.addEventListener('click', () => setAuthMode(!isRegistering));

authForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!supabaseClient) {
        setMessage('Configura SUPABASE_CONFIG antes de iniciar la aplicación.', true);
        return;
    }

    const formData = new FormData(authForm);
    const email = formData.get('email').trim();
    const password = formData.get('password');
    if (isRegistering && password !== formData.get('confirm-password')) {
        setMessage('Las contraseñas no coinciden.', true);
        return;
    }

    setAuthLoading(true);
    setMessage('');
    try {
        const result = isRegistering
            ? await supabaseClient.auth.signUp({ email, password })
            : await supabaseClient.auth.signInWithPassword({ email, password });

        if (result.error) {
            setMessage(result.error.message, true);
        } else if (isRegistering && !result.data.session) {
            setMessage('Revisa tu email para confirmar la cuenta.');
        }
    } catch (error) {
        setMessage(`No se pudo contactar con el servicio: ${error.message}`, true);
    } finally {
        setAuthLoading(false);
    }
});

logout.addEventListener('click', async () => {
    await supabaseClient?.auth.signOut();
});

startCourseButton?.addEventListener('click', () => {
    const firstLesson = document.querySelector('#lesson-1');
    if (!firstLesson) return;
    const firstPosition = firstLesson.getBoundingClientRect().top + window.scrollY;
    const scrollOffset = header.offsetHeight + 16;
    window.scrollTo({ top: firstPosition - scrollOffset, behavior: 'smooth' });
});

viewProgressButton?.addEventListener('click', () => {
    const progressSection = document.querySelector('header');
    if (!progressSection) return;
    const progressPosition = progressSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: progressPosition, behavior: 'smooth' });
});

courseCards.forEach((card) => {
    card.addEventListener('click', () => {
        selectedCourseId = card.dataset.courseId;
        updateCourseButtons();
        void loadProgress(currentUser);
    });
});

updateCourseButtons();
applyProgress();

lessons.forEach((lesson, index) => {
    const done = lesson.querySelector('.done');
    const button = lesson.querySelector('.continue');

    done.addEventListener('change', () => {
        button.disabled = !done.checked;
        lesson.classList.toggle('completed', done.checked);
    });

    button.addEventListener('click', async () => {
        const totalLessons = getSelectedCourse()?.totalLessons || lessons.length;
        if (index !== completedLessons || completedLessons >= totalLessons) return;

        completedLessons += 1;
        applyProgress();
        button.textContent = completedLessons === totalLessons ? 'Curso completado ✓' : 'Progreso actualizado ✓';

        try {
            if (!currentUser) {
                const { data: { session } } = await supabaseClient.auth.getSession();
                currentUser = session?.user || currentUser;
            }
            await saveProgress(currentUser);
        } catch (error) {
            completedLessons -= 1;
            applyProgress();
            setMessage(`No se pudo guardar el progreso: ${error.message}`, true);
            return;
        }

        const nextLesson = lessons[completedLessons];
        if (nextLesson) {
            const nextPosition = nextLesson.getBoundingClientRect().top + window.scrollY;
            const scrollOffset = header.offsetHeight + 16;
            window.scrollTo({ top: nextPosition - scrollOffset, behavior: 'smooth' });
        }
    });
});

updateCourseButtons();
updateCourseStateMessage();

if (!supabaseClient) {
    setMessage('Configura SUPABASE_CONFIG para habilitar el acceso.', true);
} else {
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        void startSession(session);
    });
}