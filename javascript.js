const fill = document.querySelector('#fill');
const percent = document.querySelector('#percent');
const header = document.querySelector('header');
const lessons = document.querySelectorAll('.lesson');
let currentLesson = 0;

lessons.forEach((lesson) => {
    const done = lesson.querySelector('.done');
    const button = lesson.querySelector('.continue');

    done.addEventListener('change', () => {
        button.disabled = !done.checked;
        lesson.classList.toggle('completed', done.checked);
    });

    button.addEventListener('click', () => {
        const progress = Math.round(((currentLesson + 1) / lessons.length) * 100);

        fill.style.width = `${progress}%`;
        percent.textContent = `${progress}%`;
        button.textContent = 'Progreso actualizado ✓';
        button.disabled = true;

        const nextLesson = lessons[currentLesson + 1];
        if (nextLesson) {
            lesson.classList.remove('active');
            currentLesson += 1;
            nextLesson.classList.add('active');

            const nextPosition = nextLesson.getBoundingClientRect().top + window.scrollY;
            const scrollOffset = header.offsetHeight + 16;
            window.scrollTo({ top: nextPosition - scrollOffset, behavior: 'smooth' });
        } else {
            button.textContent = 'Curso completado ✓';
        }
    });
});