import * as THREE from 'three';

// ============================================
// SKILL DATA WITH INTERCONNECTIONS
// ============================================
const skillsNetwork = {
    nodes: [
        { id: 'ai-ml', label: 'AI & ML', icon: '🧠', color: 0xff6b9d },
        { id: 'python', label: 'Python', icon: '🐍', color: 0xc748ef },
        { id: 'neural-nets', label: 'Neural Networks', icon: '🧬', color: 0x00d4ff },
        { id: 'system-design', label: 'System Design', icon: '🏗️', color: 0xffd700 },
        { id: 'research', label: 'Research', icon: '📊', color: 0x00ff88 },
        { id: 'backend', label: 'Backend', icon: '⚙️', color: 0xff8c42 },
        { id: 'frontend', label: 'Frontend', icon: '💻', color: 0x6366f1 },
        { id: 'devops', label: 'DevOps', icon: '🚀', color: 0xff1493 },
        { id: 'problem-solving', label: 'Problem Solving', icon: '🔧', color: 0x20b2aa },
        { id: 'deep-learning', label: 'Deep Learning', icon: '⚡', color: 0xff6347 },
        { id: 'data-science', label: 'Data Science', icon: '📈', color: 0x1e90ff }
    ],
    
    // Connections represent skill relationships
    edges: [
        // AI/ML core connections
        { source: 'ai-ml', target: 'python' },
        { source: 'ai-ml', target: 'neural-nets' },
        { source: 'ai-ml', target: 'deep-learning' },
        { source: 'ai-ml', target: 'data-science' },
        { source: 'ai-ml', target: 'research' },
        
        // Neural Networks connections
        { source: 'neural-nets', target: 'deep-learning' },
        { source: 'neural-nets', target: 'python' },
        { source: 'neural-nets', target: 'system-design' },
        
        // Python connections
        { source: 'python', target: 'backend' },
        { source: 'python', target: 'data-science' },
        { source: 'python', target: 'problem-solving' },
        
        // System Design connections
        { source: 'system-design', target: 'backend' },
        { source: 'system-design', target: 'devops' },
        { source: 'system-design', target: 'frontend' },
        
        // Research connections
        { source: 'research', target: 'data-science' },
        { source: 'research', target: 'deep-learning' },
        
        // Backend connections
        { source: 'backend', target: 'devops' },
        { source: 'backend', target: 'problem-solving' },
        
        // Frontend connections
        { source: 'frontend', target: 'problem-solving' },
        
        // Deep Learning connections
        { source: 'deep-learning', target: 'data-science' },
        { source: 'deep-learning', target: 'system-design' }
    ]
};

// ============================================
// NEURAL NETWORK VISUALIZATION
// ============================================
export class SkillNetworkVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050505);
        this.camera = new THREE.PerspectiveCamera(
            60,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            10000
        );
        this.camera.position.z = 100;
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        this.nodes = [];
        this.edges = [];
        this.nodeMap = new Map();
        this.selectedNode = null;
        this.highlightedEdges = [];
        
        this.init();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    init() {
        // Create nodes using cherry blossom petal distribution (mathematical)
        this.createNodes();
        
        // Create edges
        this.createEdges();
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(100, 100, 100);
        this.scene.add(pointLight);
        
        // Add raycaster for mouse interactions
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        window.addEventListener('click', (e) => this.onMouseClick(e));
    }
    
    createNodes() {
        // Position nodes using parametric equations inspired by cherry blossom patterns
        const nodeCount = skillsNetwork.nodes.length;
        
        skillsNetwork.nodes.forEach((skillData, index) => {
            // Use mathematical spiral + petal distribution
            const angle = (index / nodeCount) * Math.PI * 2;
            const radius = 30 + Math.sin(angle * 3) * 10;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle * 1.5) * 20;
            const z = Math.cos(angle * 2) * 15;
            
            // Create node sphere
            const geometry = new THREE.SphereGeometry(3, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: skillData.color,
                emissive: skillData.color,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
            });
            
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(x, y, z);
            sphere.userData.skillId = skillData.id;
            sphere.userData.skillLabel = skillData.label;
            sphere.userData.originalColor = skillData.color;
            
            // Create glow effect
            const glowGeometry = new THREE.SphereGeometry(3.3, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: skillData.color,
                transparent: true,
                opacity: 0.1
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            sphere.add(glow);
            
            this.scene.add(sphere);
            this.nodes.push(sphere);
            this.nodeMap.set(skillData.id, sphere);
        });
    }
    
    createEdges() {
        skillsNetwork.edges.forEach(edgeData => {
            const sourceNode = this.nodeMap.get(edgeData.source);
            const targetNode = this.nodeMap.get(edgeData.target);
            
            if (sourceNode && targetNode) {
                const points = [
                    sourceNode.position.clone(),
                    targetNode.position.clone()
                ];
                
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({
                    color: 0x666666,
                    transparent: true,
                    opacity: 0.2,
                    linewidth: 2
                });
                
                const line = new THREE.Line(geometry, material);
                line.userData.source = edgeData.source;
                line.userData.target = edgeData.target;
                
                this.scene.add(line);
                this.edges.push(line);
            }
        });
    }
    
    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.nodes);
        
        if (intersects.length > 0) {
            const selected = intersects[0].object;
            this.selectNode(selected);
        }
    }
    
    selectNode(node) {
        // Deselect previous
        if (this.selectedNode) {
            this.selectedNode.material.emissiveIntensity = 0.4;
            this.clearHighlights();
        }
        
        this.selectedNode = node;
        node.material.emissiveIntensity = 1;
        
        // Highlight connected edges
        this.highlightConnections(node.userData.skillId);
        this.showSkillInfo(node);
    }
    
    highlightConnections(skillId) {
        this.highlightedEdges = [];
        
        this.edges.forEach(edge => {
            if (edge.userData.source === skillId || edge.userData.target === skillId) {
                edge.material.opacity = 0.8;
                edge.material.color.set(0xffff00);
                this.highlightedEdges.push(edge);
                
                // Also highlight connected nodes
                const connectedId = edge.userData.source === skillId 
                    ? edge.userData.target 
                    : edge.userData.source;
                const connectedNode = this.nodeMap.get(connectedId);
                if (connectedNode) {
                    connectedNode.material.emissiveIntensity = 0.8;
                }
            }
        });
    }
    
    clearHighlights() {
        this.edges.forEach(edge => {
            edge.material.opacity = 0.2;
            edge.material.color.set(0x666666);
        });
        
        this.nodes.forEach(node => {
            if (node !== this.selectedNode) {
                node.material.emissiveIntensity = 0.4;
            }
        });
        
        this.highlightedEdges = [];
    }
    
    showSkillInfo(node) {
        // Create/update skill info modal
        let modal = document.getElementById('skillModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'skillModal';
            modal.className = 'skill-modal';
            document.body.appendChild(modal);
        }
        
        const skillId = node.userData.skillId;
        const skillData = skillsNetwork.nodes.find(n => n.id === skillId);
        
        // Get connected skills
        const connected = skillsNetwork.edges
            .filter(e => e.source === skillId || e.target === skillId)
            .map(e => e.source === skillId ? e.target : e.source)
            .map(id => skillsNetwork.nodes.find(n => n.id === id));
        
        modal.innerHTML = `
            <div class="skill-modal-content">
                <span class="skill-modal-close">&times;</span>
                <h2>${skillData.icon} ${skillData.label}</h2>
                <p class="skill-description">${this.getSkillDescription(skillId)}</p>
                ${connected.length > 0 ? `
                    <div class="connected-skills">
                        <h3>Connected Skills</h3>
                        <div class="connected-list">
                            ${connected.map(s => `
                                <div class="connected-item">
                                    <span>${s.icon}</span> ${s.label}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        modal.classList.add('active');
        modal.querySelector('.skill-modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
            this.clearHighlights();
            this.selectedNode.material.emissiveIntensity = 0.4;
            this.selectedNode = null;
        });
    }
    
    getSkillDescription(skillId) {
        const descriptions = {
            'ai-ml': 'Artificial Intelligence and Machine Learning systems, including supervised/unsupervised learning paradigms.',
            'python': 'Primary programming language for data science, ML, and backend development.',
            'neural-nets': 'Artificial neural networks design and implementation for pattern recognition.',
            'system-design': 'Large-scale system architecture, scalability, and distributed systems design.',
            'research': 'Technical research, paper analysis, and academic methodology.',
            'backend': 'Server-side development, APIs, and database architecture.',
            'frontend': 'Web UI/UX design and interactive user experience engineering.',
            'devops': 'Deployment pipelines, containerization, and infrastructure automation.',
            'problem-solving': 'Algorithm design, complexity analysis, and computational problem-solving.',
            'deep-learning': 'Deep neural networks, CNNs, RNNs, and advanced learning architectures.',
            'data-science': 'Statistical analysis, data visualization, and exploratory data analysis.'
        };
        return descriptions[skillId] || 'Expert-level proficiency in this domain.';
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.0005;
        
        // Gentle rotation
        this.scene.rotation.x += 0.0001;
        this.scene.rotation.y += 0.0003;
        
        // Pulsating glow for nodes
        this.nodes.forEach((node, idx) => {
            const pulse = Math.sin(time + idx * 0.3) * 0.3 + 0.7;
            node.children[0].material.opacity = pulse * 0.1;
            
            // Cherry blossom-like floating motion
            if (!this.selectedNode || node !== this.selectedNode) {
                const floatAmount = Math.sin(time * 0.5 + idx) * 0.5;
                node.position.y += floatAmount * 0.01;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const skillVisContainer = document.getElementById('skillNetworkContainer');
    if (skillVisContainer) {
        new SkillNetworkVisualizer('skillNetworkContainer');
    }
});
