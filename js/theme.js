const toggleBtn = document.getElementById('themeToggle');
function setTheme(isLight) {
    if (isLight) {
        document.body.classList.add('light');
        toggleBtn.textContent = '☀️';
    } else {
        document.body.classList.remove('light');
        toggleBtn.textContent = '🌙';
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') setTheme(true);
    else setTheme(false);
}
toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light');
    setTheme(!isLight);
});
initTheme();
