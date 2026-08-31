export function setProfilePopupOpen(profileToggle, profilePopup, isOpen) {
    if (!profileToggle || !profilePopup) return;
    profileToggle.setAttribute('aria-expanded', String(isOpen));
    profilePopup.hidden = !isOpen;
}

export function setMessage(element, message, isError = false) {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('error', isError);
}

export function setAuthLoading(button, toggle, isLoading, isRegistering) {
    if (button) button.disabled = isLoading;
    if (toggle) toggle.disabled = isLoading;
    if (button) {
        button.textContent = isLoading ? 'Procesando...' : (isRegistering ? 'Crear cuenta' : 'Iniciar sesión');
    }
}

export function updateCourseButtons(courseCards, selectedCourseId) {
    courseCards.forEach((card) => {
        const isSelected = card.dataset.courseId === selectedCourseId;
        card.classList.toggle('selected', isSelected);
        card.setAttribute('aria-pressed', String(isSelected));
    });
}

export function updateCourseStateMessage(courseState, course, completedLessons, totalLessons) {
    if (!courseState) return;

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

export function updateCourseHeader(courseHeader, courseTitle, selectedCourse, courseDetails) {
    if (!courseHeader || !courseTitle) return;

    const shouldShowHeader = !!selectedCourse && courseDetails.some((detail) => detail.open);
    courseHeader.hidden = !shouldShowHeader;
    courseTitle.textContent = selectedCourse ? selectedCourse.name : '';
}

export function updateCourseDetailsState(courseDetails, courseSummary, selectedCourse) {
    if (!courseDetails.length || !courseSummary.length) return;

    const isOpen = courseDetails.some((detail) => detail.open);

    if (!selectedCourse) {
        courseDetails.forEach((detail) => {
            detail.hidden = true;
            detail.open = false;
        });
        courseSummary.forEach((summary) => {
            summary.textContent = 'Mostrar clases';
        });
        return;
    }

    courseDetails.forEach((detail) => {
        detail.hidden = false;
    });

    courseSummary.forEach((summary) => {
        summary.textContent = isOpen ? 'Ocultar clases' : 'Mostrar clases';
    });
}

export function updateLessonHeadings(lessons, getCourseLessonIndexes) {
    lessons.forEach((lesson, lessonIndex) => {
        const courseNameEl = lesson.querySelector('.lesson-course-name');
        const stepEl = lesson.querySelector('.lesson-course-step');
        if (!courseNameEl || !stepEl) return;

        const courseId = lesson.dataset.courseId;
        const courseLessonIndexes = getCourseLessonIndexes(courseId);
        const localIndex = courseLessonIndexes.indexOf(lessonIndex);
        const courseName = lesson.dataset.courseName || 'Curso';

        courseNameEl.textContent = courseName;
        stepEl.textContent = localIndex >= 0 ? `Clase ${localIndex + 1}` : `Clase ${lessonIndex + 1}`;
    });
}
