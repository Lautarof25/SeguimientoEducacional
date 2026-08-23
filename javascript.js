const done = document.querySelector('#done');
const button = document.querySelector('#continue');
const lesson = document.querySelector('#lesson');
const fill = document.querySelector('#fill');
const percent = document.querySelector('#percent');

done.addEventListener('change', () => {
    button.disabled = !done.checked;
    lesson.classList.toggle('completed', done.checked);
});

button.addEventListener('click', () => {
    fill.style.width = '50%';
    percent.textContent = '50%';
    button.textContent = 'Progreso actualizado ✓';
    button.disabled = true;
});