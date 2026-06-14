// Main JavaScript functionality
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when link clicked
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Scroll spy
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// Load GitHub projects (if needed)
const loadProjects = async () => {
    try {
        const response = await fetch('https://api.github.com/users/LONEFORTS/repos');
        const repos = await response.json();
        const projectsGrid = document.getElementById('projectsGrid');
        
        if (projectsGrid && repos.length > 0) {
            projectsGrid.innerHTML = repos.slice(0, 6).map(repo => `
                <a href="${repo.html_url}" target="_blank" class="project-card">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available'}</p>
                </a>
            `).join('');
        }
    } catch (error) {
        console.log('Could not load projects from GitHub');
    }
};

loadProjects();
