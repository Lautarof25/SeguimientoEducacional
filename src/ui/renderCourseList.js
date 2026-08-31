export function renderCourseCards(courseCards, currentUser, getCourseProgressPercent, getSavedProgressForCourse) {
    courseCards.forEach((card) => {
        const courseId = card.dataset.courseId;
        const course = card.dataset.courseId ? { id: courseId, totalLessons: 4 } : null;
        const fillElement = card.querySelector('.course-progress-fill');
        const percentLabel = card.querySelector('.course-progress-header strong');

        if (!course || !fillElement || !percentLabel) return;

        const savedProgress = getSavedProgressForCourse(currentUser?.id || 'guest', courseId);
        const progress = getCourseProgressPercent(savedProgress, course.totalLessons);

        fillElement.style.width = `${progress}%`;
        percentLabel.textContent = `${progress}%`;
    });
}
