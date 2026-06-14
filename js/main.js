// Skills data (can be extended)
const skillsData = [
    { icon: '🧠', name: 'AI & ML', desc: 'Deep Learning, Neural Networks' },
    { icon: '🐍', name: 'Python', desc: 'Core Language & Data Science' },
    { icon: '🏗️', name: 'System Design', desc: 'Scalable Architecture' },
    { icon: '📊', name: 'Research', desc: 'Technical Analysis & Papers' },
    { icon: '⚙️', name: 'Backend', desc: 'APIs & Databases' },
    { icon: '💻', name: 'Frontend', desc: 'Web & UI Engineering' },
    { icon: '🚀', name: 'DevOps', desc: 'Deployment & Infrastructure' },
    { icon: '🔧', name: 'Problem Solving', desc: 'Algorithm & Logic Design' }
];

const skillsGrid = document.getElementById('skillsGrid');
if (skillsGrid) {
    skillsGrid.innerHTML = skillsData.map(skill => `
        <div class="skill-node" data-skill="${skill.name}">
            <span class="icon">${skill.icon}</span>
            <h3>${skill.name}</h3>
            <p>${skill.desc}</p>
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.skill-node').forEach(node => {
        node.addEventListener('click', () => {
            const skillName = node.dataset.skill;
            console.log(`Skill activated: ${skillName}`);
            node.style.background = 'rgba(255,255,255,0.1)';
            setTimeout(() => node.style.background = '', 300);
        });
    });
}

// Scroll spy
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 200;
        if (scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinksDiv = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
    navLinksDiv.classList.toggle('active');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navLinksDiv.classList.contains('active') ? 'rotate(45deg) translate(5px,5px)' : '';
    spans[1].style.transform = navLinksDiv.classList.contains('active') ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

// Fade-in sections on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(25px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
});
