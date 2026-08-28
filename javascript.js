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
const lessons = [...document.querySelectorAll('.lesson')];
const config = window.SUPABASE_CONFIG || {};
const supabaseClient = window.supabase && config.url && config.anonKey
    ? window.supabase.createClient(config.url, config.anonKey)
    : null;

let isRegistering = false;
let currentLesson = 0;
let completedLessons = 0;

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

function applyProgress() {
    currentLesson = Math.min(completedLessons, lessons.length - 1);
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
    const progress = Math.round((completedLessons / lessons.length) * 100);
    fill.style.width = `${progress}%`;
    percent.textContent = `${progress}%`;
}

async function loadProgress(user) {
    const { data, error } = await supabaseClient
        .from('lesson_progress')
        .select('completed_lessons')
        .eq('user_id', user.id)
        .maybeSingle();

    if (error) throw error;
    completedLessons = Math.max(0, Math.min(data?.completed_lessons || 0, lessons.length));
    applyProgress();
}

async function saveProgress(user) {
    const { error } = await supabaseClient.from('lesson_progress').upsert({
        user_id: user.id,
        completed_lessons: completedLessons,
        updated_at: new Date().toISOString()
    });
    if (error) throw error;
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

lessons.forEach((lesson, index) => {
    const done = lesson.querySelector('.done');
    const button = lesson.querySelector('.continue');

    done.addEventListener('change', () => {
        button.disabled = !done.checked;
        lesson.classList.toggle('completed', done.checked);
    });

    button.addEventListener('click', async () => {
        if (index !== completedLessons || !supabaseClient) return;
        completedLessons += 1;
        applyProgress();
        button.textContent = completedLessons === lessons.length ? 'Curso completado ✓' : 'Progreso actualizado ✓';

        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            await saveProgress(session.user);
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

if (!supabaseClient) {
    setMessage('Configura SUPABASE_CONFIG para habilitar el acceso.', true);
} else {
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        void startSession(session);
    });
}