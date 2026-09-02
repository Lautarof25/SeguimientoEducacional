import { getCourseById } from '../domain/courseLogic.js';

export function getProgressStorageKeyForCourse(userId, courseId) {
    return `aula-course-progress:${userId || 'guest'}:${courseId}`;
}

export function getSavedProgressForCourse(userId, courseId) {
    const course = getCourseById(courseId);
    if (!course) return 0;

    const rawValue = localStorage.getItem(getProgressStorageKeyForCourse(userId, courseId));
    if (!rawValue) return 0;

    try {
        const parsed = JSON.parse(rawValue);
        const savedProgress = Number(parsed.completedLessons || 0);
        return Math.max(0, Math.min(savedProgress, course.totalLessons));
    } catch (error) {
        return 0;
    }
}

export function saveCourseProgress(userId, courseId, completedLessons) {
    const data = {
        completedLessons,
        updatedAt: new Date().toISOString(),
        courseId
    };

    localStorage.setItem(getProgressStorageKeyForCourse(userId, courseId), JSON.stringify(data));
    return data;
}

export function resetProgressForCourse(userId, courseId) {
    localStorage.removeItem(getProgressStorageKeyForCourse(userId, courseId));
}

export function getAllProgressKeysForUser(userId) {
    const prefix = `aula-course-progress:${userId || 'guest'}:`;
    return Object.keys(localStorage).filter((key) => key.startsWith(prefix));
}
