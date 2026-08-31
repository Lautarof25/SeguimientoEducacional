import { availableCourses, getCourseById, getCourseLessonIndexes, getActiveLessonIndexes, getLessonIndexForProgress, getCourseProgressPercent } from './domain/courseLogic.js';
import { courseDefinitions } from './courseData.js';
import { createAppState } from './state.js';
import { getSavedProgressForCourse, saveCourseProgress, resetProgressForCourse, getAllProgressKeysForUser } from './services/progressService.js';
import { signIn, signUp, signOut, getSession } from './services/authService.js';
import { setProfilePopupOpen, setMessage, setAuthLoading, updateCourseButtons, updateCourseStateMessage, updateCourseHeader, updateCourseDetailsState, updateLessonHeadings } from './ui.js';
import { renderCourseCards, renderLessons } from './ui/renderContent.js';

export function createApp({ document, window, supabaseClient }) {
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
    const profileToggle = document.querySelector('#profile-toggle');
    const profilePopup = document.querySelector('#profile-popup');
    const profileMenu = document.querySelector('#profile-menu-wrapper');
    const profileName = document.querySelector('#profile-name');
    const profileEmail = document.querySelector('#profile-email');
    const profileFirstName = document.querySelector('#profile-first-name');
    const profileLastName = document.querySelector('#profile-last-name');
    const profileSave = document.querySelector('#profile-save');
    const certificateModal = document.querySelector('#certificate-modal');
    const closeCertificateButton = document.querySelector('#close-certificate');
    const closeCertificateSecondaryButton = document.querySelector('#close-certificate-btn');
    const downloadCertificateButton = document.querySelector('#download-certificate');
    const certificateParticipant = document.querySelector('#certificate-participant');
    const certificateCourse = document.querySelector('#certificate-course');
    const certificateCourseMeta = document.querySelector('#certificate-course-meta');
    const certificateProfileName = document.querySelector('#certificate-profile-name');
    const certificateProfileEmail = document.querySelector('#certificate-profile-email');
    const certificateDate = document.querySelector('#certificate-date');
    const logout = document.querySelector('#logout');
    const resetProgressButton = document.querySelector('#reset-progress');
    const fill = document.querySelector('#fill');
    const percent = document.querySelector('#percent');
    const progressWrap = document.querySelector('.progress-wrap');
    const header = document.querySelector('header');
    const startCourseButton = document.querySelector('#start-course');
    const viewProgressButton = document.querySelector('#view-progress');
    const homePanel = document.querySelector('.home-panel');
    renderCourseCards();
    renderLessons();

    const courseCards = [...document.querySelectorAll('.course-card')];
    const courseState = document.querySelector('#course-state');
    const courseHeader = document.querySelector('#course-header');
    const courseTitle = document.querySelector('#course-title');
    const brandHome = document.querySelector('#brand-home');
    const courseDetails = [...document.querySelectorAll('.course-details')];
    const courseSummary = [...document.querySelectorAll('.course-summary')];
    const lessonSelector = [...document.querySelectorAll('.lesson-selector')];
    const lessonSelectorButtons = [...document.querySelectorAll('.lesson-chip')];
    const lessons = [...document.querySelectorAll('.lesson')];
    const courseMap = Object.fromEntries(courseDefinitions.map((course) => [course.id, course]));

    const state = createAppState();
    let isRegistering = state.isRegistering;
    let currentLesson = state.currentLesson;
    let completedLessons = state.completedLessons;
    let selectedCourseId = state.selectedCourseId;
    let currentUser = state.currentUser;

    function getSelectedCourse() {
        return selectedCourseId ? getCourseById(selectedCourseId) : null;
    }

    function getProgressStorageKey(userId) {
        return `aula-course-progress:${userId || 'guest'}:${selectedCourseId}`;
    }

    function getProfileStorageKey(userId) {
        return `aula-user-profile:${userId || 'guest'}`;
    }

    function getSavedProfile(userId) {
        const rawProfile = localStorage.getItem(getProfileStorageKey(userId));
        if (!rawProfile) return { firstName: '', lastName: '' };

        try {
            const parsed = JSON.parse(rawProfile);
            return {
                firstName: typeof parsed?.firstName === 'string' ? parsed.firstName : '',
                lastName: typeof parsed?.lastName === 'string' ? parsed.lastName : ''
            };
        } catch (error) {
            return { firstName: '', lastName: '' };
        }
    }

    function getSavedProgress(userId) {
        const course = getSelectedCourse();
        if (!course) return 0;
        return getSavedProgressForCourse(userId, course.id);
    }

    function getProfileDisplayData() {
        const userProfile = getSavedProfile(currentUser?.id || 'guest');
        const fullName = [userProfile.firstName, userProfile.lastName].filter(Boolean).join(' ').trim();

        return {
            fullName: fullName || 'Participante',
            firstName: userProfile.firstName || '',
            lastName: userProfile.lastName || '',
            email: currentUser?.email || 'Cuenta'
        };
    }

    function updateProfileSummary() {
        const { fullName, email } = getProfileDisplayData();

        if (profileName) profileName.textContent = fullName || 'Perfil';
        if (profileEmail) profileEmail.textContent = email || 'Cuenta';
        if (profileFirstName) profileFirstName.value = getSavedProfile(currentUser?.id || 'guest').firstName;
        if (profileLastName) profileLastName.value = getSavedProfile(currentUser?.id || 'guest').lastName;
    }

    function syncProfileDraftToSummary() {
        const firstName = profileFirstName?.value.trim() || '';
        const lastName = profileLastName?.value.trim() || '';
        const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

        if (profileName) profileName.textContent = fullName || 'Perfil';
    }

    function updateHomeCardProgress() {
        courseCards.forEach((card) => {
            const courseId = card.dataset.courseId;
            const course = getCourseById(courseId);
            const fillElement = card.querySelector('.course-progress-fill');
            const percentLabel = card.querySelector('.course-progress-header strong');

            if (!course || !fillElement || !percentLabel) return;

            const savedProgress = getSavedProgressForCourse(currentUser?.id || 'guest', courseId);
            const progress = getCourseProgressPercent(savedProgress, course.totalLessons);

            fillElement.style.width = `${progress}%`;
            percentLabel.textContent = `${progress}%`;
        });
    }

    function populateCertificate(course) {
        if (!course) return;

        const { fullName, email } = getProfileDisplayData();
        const issueDate = new Date().toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        if (certificateParticipant) certificateParticipant.textContent = fullName;
        if (certificateCourse) certificateCourse.textContent = course.name;
        if (certificateCourseMeta) certificateCourseMeta.textContent = course.name;
        if (certificateProfileName) certificateProfileName.textContent = fullName;
        if (certificateProfileEmail) certificateProfileEmail.textContent = email;
        if (certificateDate) certificateDate.textContent = issueDate;
    }

    function showCertificate(course) {
        if (!course || !certificateModal) return;
        populateCertificate(course);
        certificateModal.hidden = false;
    }

    function closeCertificate() {
        if (!certificateModal) return;
        certificateModal.hidden = true;
    }

    function updateLessonSelector() {
        if (!lessonSelector.length) return;

        const course = getSelectedCourse();
        const courseLessonIndexes = getActiveLessonIndexes(course, lessons);
        const actualLessonCount = Math.max(courseLessonIndexes.length, course?.totalLessons || 0);
        const totalLessons = actualLessonCount || lessons.length;

        lessonSelector.forEach((selector) => {
            if (!course) {
                selector.hidden = true;
                return;
            }

            selector.hidden = false;
            const label = selector.querySelector('.selector-label');
            if (label) label.textContent = `${totalLessons} clases`;

            const chips = [...selector.querySelectorAll('.lesson-chip')];
            chips.forEach((button) => {
                const lessonIndex = Number(button.dataset.lessonIndex);
                const isVisible = lessonIndex < totalLessons;
                const isSelected = currentLesson === lessonIndex;
                const isAvailable = lessonIndex <= completedLessons || completedLessons >= totalLessons;

                button.hidden = !isVisible;
                button.classList.toggle('selected', isSelected && isVisible);
                button.disabled = !isAvailable || !isVisible;
                button.setAttribute('aria-disabled', String(!isAvailable || !isVisible));
            });
        });
    }

    function scrollToLesson(index) {
        const lesson = lessons[index];
        if (!lesson) return;

        const lessonPosition = lesson.getBoundingClientRect().top + window.scrollY;
        const scrollOffset = header.offsetHeight + 16;
        window.scrollTo({ top: lessonPosition - scrollOffset, behavior: 'smooth' });
    }

    function showLesson(index) {
        const course = getSelectedCourse();
        const totalLessons = course?.totalLessons || lessons.length;
        const courseLessonIndexes = getActiveLessonIndexes(course, lessons);

        const safeIndex = Math.min(Math.max(index, 0), totalLessons - 1);
        if (completedLessons < totalLessons && safeIndex > completedLessons) {
            currentLesson = completedLessons;
        } else {
            currentLesson = safeIndex;
        }

        const activeLessonIndex = getLessonIndexForProgress(course, currentLesson, lessons);

        courseDetails.forEach((detail) => {
            detail.open = false;
        });
        updateCourseDetailsState(courseDetails, courseSummary, course);

        lessons.forEach((lesson, lessonIndex) => {
            const isInCourse = courseLessonIndexes.includes(lessonIndex);
            lesson.classList.toggle('active', isInCourse && lessonIndex === activeLessonIndex);
            lesson.hidden = !isInCourse;
        });
        updateLessonNavigationButtons();
        scrollToLesson(activeLessonIndex);
    }

    function updateLessonNavigationButtons() {
        const course = getSelectedCourse();
        document.querySelectorAll('.lesson-back').forEach((button) => {
            const canGoBack = !!course && currentLesson > 0 && currentLesson > completedLessons;
            button.hidden = !canGoBack;
            button.disabled = !canGoBack;
        });

        document.querySelectorAll('.course-back').forEach((button) => {
            button.hidden = !course;
            button.disabled = !course;
        });
    }

    function updateCourseOptionsText() {
        const selectorText = document.querySelector('.picker-count');
        if (selectorText) {
            selectorText.textContent = `${availableCourses.length} disponible${availableCourses.length > 1 ? 's' : ''}`;
        }
    }

    function applyProgress() {
        const course = getSelectedCourse();
        const totalLessons = course?.totalLessons || lessons.length;
        const courseLessonIndexes = getActiveLessonIndexes(course, lessons);

        if (homePanel) homePanel.hidden = !!course;
        if (progressWrap) progressWrap.hidden = !course;
        const lessonsContainer = document.querySelector('.lessons');
        if (lessonsContainer) lessonsContainer.hidden = !course;

        updateHomeCardProgress();

        if (!course) {
            completedLessons = 0;
            currentLesson = 0;
            if (fill) fill.style.width = '0%';
            if (percent) percent.textContent = '0%';
            updateCourseHeader(courseHeader, courseTitle, null, courseDetails);
            lessons.forEach((lesson) => {
                lesson.classList.remove('active', 'completed');
                lesson.hidden = true;
                const done = lesson.querySelector('.done');
                const button = lesson.querySelector('.continue');
                if (done) done.checked = false;
                if (done) done.disabled = true;
                if (button) {
                    button.disabled = true;
                    button.textContent = 'Continuar con el progreso →';
                }
            });
            updateCourseStateMessage(courseState, null, completedLessons, totalLessons);
            return;
        }

        if (completedLessons >= totalLessons) {
            currentLesson = totalLessons - 1;
        } else {
            currentLesson = Math.min(Math.max(completedLessons, 0), totalLessons - 1);
        }

        lessons.forEach((lesson, index) => {
            const done = lesson.querySelector('.done');
            const button = lesson.querySelector('.continue');
            const isInCourse = courseLessonIndexes.includes(index);
            const isCompleted = isInCourse && courseLessonIndexes.indexOf(index) < completedLessons;
            const activeLessonIndex = getLessonIndexForProgress(course, currentLesson, lessons);

            if (done) {
                done.checked = isCompleted;
                done.disabled = !isInCourse || index !== activeLessonIndex;
            }
            if (button) {
                button.disabled = !isInCourse || index !== activeLessonIndex;
                button.textContent = isCompleted ? 'Progreso actualizado ✓' : 'Continuar con el progreso →';
            }
            lesson.classList.toggle('completed', isCompleted);
            lesson.classList.toggle('active', isInCourse && index === activeLessonIndex);
            lesson.hidden = !isInCourse;
        });

        const progress = getCourseProgressPercent(completedLessons, totalLessons);
        if (fill) fill.style.width = `${progress}%`;
        if (percent) percent.textContent = `${progress}%`;
        updateHomeCardProgress();
        updateCourseDetailsState(courseDetails, courseSummary, course);
        updateCourseOptionsText();
        updateCourseStateMessage(courseState, course, completedLessons, totalLessons);
        updateLessonNavigationButtons();
        updateLessonSelector();
        updateLessonHeadings(lessons, (courseId) => getCourseLessonIndexes(courseId, lessons));

        document.querySelectorAll('.certificate-button').forEach((button) => {
            const isCourseComplete = !!course && completedLessons >= totalLessons;
            button.hidden = !isCourseComplete;
            button.disabled = !isCourseComplete;
        });
    }

    async function loadProgress(user) {
        currentUser = user;
        const course = getSelectedCourse();
        if (!course) {
            completedLessons = 0;
            applyProgress();
            return;
        }

        completedLessons = getSavedProgress(user?.id || 'guest');
        applyProgress();
    }

    async function saveProgress(user) {
        if (!selectedCourseId || !user) return;

        const progressValue = saveCourseProgress(user.id, selectedCourseId, completedLessons);

        if (!supabaseClient) return;

        try {
            const { error } = await supabaseClient.from('lesson_progress').upsert({
                user_id: user.id,
                completed_lessons: completedLessons,
                updated_at: progressValue.updatedAt
            });
            if (error) throw error;
        } catch (error) {
            console.warn('No se pudo sincronizar el progreso con Supabase:', error);
        }
    }

    async function startSession(session) {
        if (!session) {
            authScreen.hidden = false;
            app.hidden = true;
            return;
        }

        try {
            await loadProgress(session.user);
            authScreen.hidden = true;
            app.hidden = false;
            const email = session.user?.email || 'Cuenta';
            logout.title = email;
            if (profileEmail) profileEmail.textContent = email;
            updateProfileSummary();
        } catch (error) {
            authScreen.hidden = false;
            app.hidden = true;
            setMessage(authMessage, `No se pudo cargar tu progreso: ${error.message}`, true);
        }
    }

    function setAuthMode(registering) {
        isRegistering = registering;
        authTitle.textContent = registering ? 'Crea tu cuenta' : 'Continúa tu recorrido';
        authIntro.textContent = registering ? 'Regístrate para guardar tu progreso en cada clase.' : 'Inicia sesión para guardar tu progreso en cada clase.';
        confirmField.hidden = !registering;
        confirmPassword.required = registering;
        authToggle.textContent = registering ? '¿Ya tienes una cuenta? Inicia sesión' : '¿Todavía no tienes una cuenta? Regístrate';
        authForm.reset();
        setMessage(authMessage, '');
    }

    profileToggle?.addEventListener('click', (event) => {
        event.stopPropagation();
        updateProfileSummary();
        const isOpen = profilePopup && profilePopup.hidden;
        setProfilePopupOpen(profileToggle, profilePopup, isOpen);
    });

    closeCertificateButton?.addEventListener('click', closeCertificate);
    closeCertificateSecondaryButton?.addEventListener('click', closeCertificate);
    certificateModal?.addEventListener('click', (event) => {
        if (event.target instanceof Element && event.target.matches('[data-close-certificate="true"]')) {
            closeCertificate();
        }
    });
    downloadCertificateButton?.addEventListener('click', () => {
        window.print();
    });

    profilePopup?.addEventListener('pointerdown', (event) => {
        if (event.target instanceof Element) {
            const clickedControl = event.target.closest('input, button');
            if (clickedControl) {
                event.stopPropagation();
            }
        }
    });
    profilePopup?.addEventListener('click', (event) => event.stopPropagation());
    profileFirstName?.addEventListener('input', syncProfileDraftToSummary);
    profileLastName?.addEventListener('input', syncProfileDraftToSummary);

    profileSave?.addEventListener('click', () => {
        const userId = currentUser?.id || 'guest';
        const profile = {
            firstName: profileFirstName?.value.trim() || '',
            lastName: profileLastName?.value.trim() || ''
        };

        localStorage.setItem(getProfileStorageKey(userId), JSON.stringify(profile));
        updateProfileSummary();
        setMessage(authMessage, 'Perfil actualizado.', false);
    });

    document.addEventListener('click', (event) => {
        const target = event.target;
        const clickedInsideMenu = target instanceof Element && profileMenu?.contains(target);
        if (!clickedInsideMenu && profilePopup && !profilePopup.hidden) {
            setProfilePopupOpen(profileToggle, profilePopup, false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && profilePopup && !profilePopup.hidden) {
            setProfilePopupOpen(profileToggle, profilePopup, false);
        }

        if (event.key === 'Escape' && certificateModal && !certificateModal.hidden) {
            closeCertificate();
        }
    });

    authToggle.addEventListener('click', () => setAuthMode(!isRegistering));

    authForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!supabaseClient) {
            setMessage(authMessage, 'Configura SUPABASE_CONFIG antes de iniciar la aplicación.', true);
            return;
        }

        const formData = new FormData(authForm);
        const email = formData.get('email').trim();
        const password = formData.get('password');
        if (isRegistering && password !== formData.get('confirm-password')) {
            setMessage(authMessage, 'Las contraseñas no coinciden.', true);
            return;
        }

        setAuthLoading(authSubmit, authToggle, true, isRegistering);
        setMessage(authMessage, '');
        try {
            const result = isRegistering
                ? await signUp(supabaseClient, email, password)
                : await signIn(supabaseClient, email, password);

            if (result.error) {
                setMessage(authMessage, result.error.message, true);
            } else if (isRegistering && !result.data.session) {
                setMessage(authMessage, 'Revisa tu email para confirmar la cuenta.');
            }
        } catch (error) {
            setMessage(authMessage, `No se pudo contactar con el servicio: ${error.message}`, true);
        } finally {
            setAuthLoading(authSubmit, authToggle, false, isRegistering);
        }
    });

    logout.addEventListener('click', async () => {
        await signOut(supabaseClient);
    });

    resetProgressButton?.addEventListener('click', async () => {
        const course = getSelectedCourse();
        const targetLabel = course ? `de ${course.name}` : 'de todos los cursos';
        const confirmed = window.confirm(`¿Querés reiniciar el progreso ${targetLabel}?`);
        if (!confirmed) return;

        if (course) {
            resetProgressForCourse(currentUser?.id || 'guest', course.id);
            completedLessons = 0;
            currentLesson = 0;
        } else {
            const userPrefix = `aula-course-progress:${currentUser?.id || 'guest'}:`;
            getAllProgressKeysForUser(currentUser?.id || 'guest').forEach((key) => {
                localStorage.removeItem(key);
            });
            completedLessons = 0;
            currentLesson = 0;
        }

        if (currentUser) {
            try {
                await saveProgress(currentUser);
            } catch (error) {
                console.warn('No se pudo reiniciar el progreso guardado:', error);
            }
        }

        applyProgress();
        if (course) {
            const firstLessonIndex = getLessonIndexForProgress(course, 0, lessons);
            scrollToLesson(firstLessonIndex);
        }
        setMessage(authMessage, `Se reinició el progreso ${targetLabel}.`);
    });

    brandHome?.addEventListener('click', () => {
        selectedCourseId = null;
        currentLesson = 0;
        closeCertificate();
        updateCourseButtons(courseCards, selectedCourseId);
        courseDetails.forEach((detail) => {
            detail.open = false;
        });
        updateCourseDetailsState(courseDetails, courseSummary, null);
        void loadProgress(currentUser);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    startCourseButton?.addEventListener('click', () => {
        const course = getSelectedCourse();
        if (!course) return;

        const firstLessonIndex = getLessonIndexForProgress(course, 0, lessons);
        const firstLesson = lessons[firstLessonIndex];
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
            currentLesson = 0;
            courseDetails.forEach((detail) => {
                detail.open = false;
            });
            updateCourseDetailsState(courseDetails, courseSummary, getSelectedCourse());
            updateCourseButtons(courseCards, selectedCourseId);
            void loadProgress(currentUser);
        });
    });

    courseDetails.forEach((detail) => {
        detail.addEventListener('toggle', () => {
            updateCourseDetailsState(courseDetails, courseSummary, getSelectedCourse());
        });
    });

    setProfilePopupOpen(profileToggle, profilePopup, false);
    updateCourseButtons(courseCards, selectedCourseId);
    updateLessonHeadings(lessons, (courseId) => getCourseLessonIndexes(courseId, lessons));
    applyProgress();

    const previousLessonButtons = document.querySelectorAll('.lesson-back');
    previousLessonButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (currentLesson <= 0 || currentLesson <= completedLessons) return;
            showLesson(currentLesson - 1);
        });
    });

    const courseBackButtons = document.querySelectorAll('.course-back');
    courseBackButtons.forEach((button) => {
        button.addEventListener('click', () => {
            selectedCourseId = null;
            currentLesson = 0;
            closeCertificate();
            updateCourseButtons(courseCards, selectedCourseId);
            courseDetails.forEach((detail) => {
                detail.open = false;
            });
            updateCourseDetailsState(courseDetails, courseSummary, null);
            void loadProgress(currentUser);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    document.querySelectorAll('.certificate-button').forEach((button) => {
        button.addEventListener('click', () => {
            const course = getSelectedCourse();
            showCertificate(course);
        });
    });

    lessonSelectorButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const course = getSelectedCourse();
            const targetLesson = Number(button.dataset.lessonIndex);
            const totalLessons = course?.totalLessons || 0;
            const maxAvailableLesson = completedLessons >= totalLessons ? totalLessons - 1 : completedLessons;

            if (targetLesson > maxAvailableLesson) return;

            currentLesson = targetLesson;
            const activeLessonIndex = getLessonIndexForProgress(course, currentLesson, lessons);

            courseDetails.forEach((detail) => {
                detail.open = true;
            });
            updateCourseDetailsState(courseDetails, courseSummary, course);
            lessons.forEach((lesson, index) => {
                const isInCourse = getActiveLessonIndexes(course, lessons).includes(index);
                lesson.classList.toggle('active', isInCourse && index === activeLessonIndex);
                lesson.hidden = !isInCourse;
            });
            updateLessonSelector();
            scrollToLesson(activeLessonIndex);
        });
    });

    lessons.forEach((lesson, index) => {
        const done = lesson.querySelector('.done');
        const button = lesson.querySelector('.continue');

        if (!done || !button) return;

        done.addEventListener('change', () => {
            button.disabled = !done.checked;
            lesson.classList.toggle('completed', done.checked);
        });

        button.addEventListener('click', async () => {
            const course = getSelectedCourse();
            const totalLessons = course?.totalLessons || lessons.length;
            const courseLessonIndexes = getActiveLessonIndexes(course, lessons);
            const activeCourseLessonIndex = courseLessonIndexes.indexOf(index);

            if (activeCourseLessonIndex === -1 || activeCourseLessonIndex !== completedLessons || completedLessons >= totalLessons) return;

            completedLessons += 1;
            currentLesson = Math.min(completedLessons, totalLessons - 1);
            applyProgress();
            button.textContent = completedLessons === totalLessons ? 'Curso completado ✓' : 'Progreso actualizado ✓';

            try {
                if (!currentUser) {
                    const { data: { session } } = await getSession(supabaseClient);
                    currentUser = session?.user || currentUser;
                }
                await saveProgress(currentUser);
            } catch (error) {
                completedLessons -= 1;
                currentLesson = Math.max(0, completedLessons);
                applyProgress();
                setMessage(authMessage, `No se pudo guardar el progreso: ${error.message}`, true);
                return;
            }

            const nextLessonIndex = getLessonIndexForProgress(course, completedLessons, lessons);
            if (nextLessonIndex !== undefined) {
                scrollToLesson(nextLessonIndex);
            }

            if (completedLessons >= totalLessons) {
                showCertificate(course);
            }
        });
    });

    updateCourseButtons(courseCards, selectedCourseId);
    updateCourseStateMessage(courseState, getSelectedCourse(), completedLessons, getSelectedCourse()?.totalLessons || lessons.length);
    updateLessonNavigationButtons();

    if (!supabaseClient) {
        setMessage(authMessage, 'Configura SUPABASE_CONFIG para habilitar el acceso.', true);
    } else {
        supabaseClient.auth.onAuthStateChange((_event, session) => {
            void startSession(session);
        });
    }

    return {
        startSession,
        loadProgress,
        saveProgress
    };
}
