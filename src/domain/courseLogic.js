import { availableCourses as courseCatalog } from '../courseData.js';

export const availableCourses = courseCatalog;

export function getCourseById(courseId) {
    return availableCourses.find((course) => course.id === courseId) || null;
}

export function getCourseLessonIndexes(courseId, lessons) {
    if (!courseId || !Array.isArray(lessons)) return [];
    const courseLessons = lessons.filter((lesson) => lesson.dataset.courseId === courseId);
    return courseLessons.map((lesson) => lessons.indexOf(lesson));
}

export function getActiveLessonIndexes(course, lessons) {
    if (!course || !Array.isArray(lessons)) return [];
    return getCourseLessonIndexes(course.id, lessons);
}

export function getLessonIndexForProgress(course, lessonProgressIndex, lessons) {
    const lessonIndexes = getActiveLessonIndexes(course, lessons);
    return lessonIndexes[lessonProgressIndex] ?? lessonIndexes[lessonIndexes.length - 1] ?? 0;
}

export function getCourseProgressPercent(completedLessons, totalLessons) {
    if (!totalLessons) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
}
