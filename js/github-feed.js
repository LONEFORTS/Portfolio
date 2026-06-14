export async function loadGitHubFeed() {
    const container = document.getElementById('githubFeed');
    if (!container) return;
    container.innerHTML = '<p>Loading projects...</p>';
    try {
        const response = await fetch('https://api.github.com/users/LONEFORTS/repos?sort=updated&per_page=4');
        if (!response.ok) throw new Error('GitHub API error');
        const repos = await response.json();
        if (repos.length === 0) {
            container.innerHTML = '<p>No public repos found.</p>';
            return;
        }
        container.innerHTML = '';
        repos.forEach(repo => {
            const card = document.createElement('a');
            card.href = repo.html_url;
            card.target = '_blank';
            card.className = 'writing-card';
            card.innerHTML = `
                <span class="tag">📁 Repository</span>
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description provided.'}</p>
                <span style="font-size:0.7rem">⭐ ${repo.stargazers_count} · 🍴 ${repo.forks_count}</span>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        container.innerHTML = '<p>Unable to load GitHub feed. Try again later.</p>';
    }
}

// Auto-run when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGitHubFeed);
} else {
    loadGitHubFeed();
}
