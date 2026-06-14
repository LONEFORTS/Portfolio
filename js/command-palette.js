const palette = document.getElementById('commandPalette');
const input = document.getElementById('commandInput');
const suggestionsDiv = document.querySelector('.command-suggestions');

function showPalette() {
    palette.classList.add('active');
    input.value = '';
    suggestionsDiv.innerHTML = 'Try: :skills, :dark, :light, :github, :contact';
    input.focus();
}
function hidePalette() {
    palette.classList.remove('active');
}
function executeCommand(cmd) {
    const lower = cmd.toLowerCase().trim();
    if (lower === ':skills') document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
    else if (lower === ':contact') document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    else if (lower === ':github') window.open('https://github.com/LONEFORTS', '_blank');
    else if (lower === ':dark') document.body.classList.add('light'); // toggle? We'll implement in theme
    else if (lower === ':light') document.body.classList.remove('light');
    else if (lower === ':theme toggle') document.body.classList.toggle('light');
    else suggestionsDiv.innerHTML = `Unknown command: ${cmd}`;
    hidePalette();
}

window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showPalette();
    }
    if (e.key === 'Escape' && palette.classList.contains('active')) hidePalette();
});
palette.addEventListener('click', (e) => { if (e.target === palette) hidePalette(); });
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        executeCommand(input.value);
    }
});
