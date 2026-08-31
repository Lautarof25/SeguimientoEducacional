export function createAppState() {
    return {
        isRegistering: false,
        currentLesson: 0,
        completedLessons: 0,
        selectedCourseId: null,
        currentUser: null
    };
}
