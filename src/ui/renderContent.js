import { courseDefinitions } from '../courseData.js';

export function renderCourseCards() {
    const grid = document.querySelector('.course-grid');
    if (!grid) return;

    grid.innerHTML = courseDefinitions.map((course) => `
        <button class="course-card" type="button" data-course-id="${course.id}" aria-pressed="false" aria-label="Seleccionar curso ${course.name}">
            <div class="course-card-top">
                <span class="course-tag">${course.emoji || '📘'} Curso</span>
                <span class="course-level">${course.level}</span>
            </div>
            <div class="course-card-icon" aria-hidden="true">${course.emoji || '📘'}</div>
            <h3>${course.name}</h3>
            <p>${course.description || 'Curso disponible para seguir tu progreso.'}</p>
            <ul class="course-meta">
                <li>${course.lessons.length} clases</li>
                <li>Progreso visual</li>
                <li>Certificación</li>
            </ul>
            <div class="course-progress" aria-label="Progreso del curso ${course.name}">
                <div class="course-progress-header">
                    <span>Progreso</span>
                    <strong>0%</strong>
                </div>
                <div class="course-progress-track">
                    <span class="course-progress-fill" style="width: 0%"></span>
                </div>
            </div>
        </button>
    `).join('');
}

export function renderLessons() {
    const lessonsRoot = document.querySelector('.lessons');
    if (!lessonsRoot) return;

    lessonsRoot.innerHTML = courseDefinitions.map((course) => course.lessons.map((lesson, lessonIndex) => {
        const lessonButtons = Array.from({ length: course.lessons.length }, (_, index) => `
            <button class="lesson-chip" type="button" data-lesson-index="${index}">Clase ${index + 1}</button>
        `).join('');

        return `
            <section class="lesson" id="lesson-${course.id}-${lessonIndex + 1}" data-course-id="${course.id}" data-course-name="${course.name}">
                <div class="lesson-heading">
                    <span class="lesson-course-name">${course.name}</span>
                    <span class="lesson-course-step">Clase ${lessonIndex + 1}</span>
                </div>
                <div class="notion-frame-wrap">
                    <iframe class="notion-frame" src="${lesson.notionUrl}" title="Contenido de la clase ${lessonIndex + 1}" allowfullscreen></iframe>
                </div>
                <div class="action">
                    <label class="check">
                        <input type="checkbox" class="done">
                        <span class="box"></span>
                        <span class="check-text">
                            <strong>Marcar como completada</strong>
                            <span>Leí el contenido y estoy listo para continuar.</span>
                        </span>
                    </label>
                    <button class="continue" disabled>Continuar con el progreso →</button>
                    <div class="lesson-navs">
                        <button class="lesson-back" type="button">← Clase anterior</button>
                        <button class="course-back" type="button">Elegir otro curso</button>
                    </div>
                    <details class="course-details course-details-inline">
                        <summary class="course-summary">Mostrar clases</summary>
                        <div class="lesson-selector" hidden>
                            <div class="selector-header">
                                <span class="eyebrow">Clases del curso</span>
                                <span class="selector-label">${course.lessons.length} clases</span>
                            </div>
                            <div class="lesson-pills">
                                ${lessonButtons}
                            </div>
                        </div>
                    </details>
                    <div class="status">✓ Clase completada. ¡Buen trabajo!</div>
                </div>
            </section>
        `;
    }).join('')).join('');
}
