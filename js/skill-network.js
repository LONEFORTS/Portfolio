// Advanced Neural Network Skill Visualization with Cherry Blossom Theme
import * as THREE from 'three';

const skillsNetworkData = {
    nodes: [
        { id: 'ai-ml', name: 'AI & ML', icon: '🧠', color: 0xff6b9d },
        { id: 'python', name: 'Python', icon: '🐍', color: 0xffd93d },
        { id: 'deeplearn', name: 'Deep Learning', icon: '🔮', color: 0xff6b9d },
        { id: 'neural-nets', name: 'Neural Networks', icon: '⚡', color: 0xff6b9d },
        { id: 'tensorflow', name: 'TensorFlow', icon: '🤖', color: 0xffd93d },
        { id: 'pytorch', name: 'PyTorch', icon: '🔥', color: 0xffd93d },
        { id: 'cv', name: 'Computer Vision', icon: '👁️', color: 0x6bcf7f },
        { id: 'nlp', name: 'NLP', icon: '📝', color: 0x6bcf7f },
        { id: 'data-science', name: 'Data Science', icon: '📊', color: 0x4d96ff },
        { id: 'backend', name: 'Backend', icon: '⚙️', color: 0x9d4dff },
        { id: 'frontend', name: 'Frontend', icon: '💻', color: 0x4d96ff },
        { id: 'devops', name: 'DevOps', icon: '🚀', color: 0x9d4dff },
        { id: 'algorithms', name: 'Algorithms', icon: '🧮', color: 0xff6b9d },
        { id: 'databases', name: 'Databases', icon: '🗄️', color: 0x6bcf7f },
        { id: 'system-design', name: 'System Design', icon: '🏗️', color: 0x4d96ff }
    ],
    edges: [
        // AI/ML core connections
        { source: 'ai-ml', target: 'python' },
        { source: 'ai-ml', target: 'deeplearn' },
        { source: 'ai-ml', target: 'neural-nets' },
        { source: 'ai-ml', target: 'data-science' },
        
        // Deep Learning connections
        { source: 'deeplearn', target: 'tensorflow' },
        { source: 'deeplearn', target: 'pytorch' },
        { source: 'deeplearn', target: 'neural-nets' },
        { source: 'deeplearn', target: 'cv' },
        { source: 'deeplearn', target: 'nlp' },
        
        // Neural Networks
        { source: 'neural-nets', target: 'algorithms' },
        { source: 'neural-nets', target: 'tensorflow' },
        { source: 'neural-nets', target: 'pytorch' },
        
        // Frameworks
        { source: 'tensorflow', target: 'python' },
        { source: 'pytorch', target: 'python' },
        
        // Computer Vision & NLP
        { source: 'cv', target: 'python' },
        { source: 'cv', target: 'data-science' },
        { source: 'nlp', target: 'python' },
        { source: 'nlp', target: 'data-science' },
        
        // Data Science connections
        { source: 'data-science', target: 'databases' },
        { source: 'data-science', target: 'backend' },
        
        // Backend/Frontend
        { source: 'backend', target: 'databases' },
        { source: 'backend', target: 'system-design' },
        { source: 'backend', target: 'devops' },
        { source: 'frontend', target: 'system-design' },
        
        // DevOps
        { source: 'devops', target: 'system-design' },
        
        // General algorithms
        { source: 'algorithms', target: 'python' },
        { source: 'algorithms', target: 'backend' }
    ]
};

// Create Three.js scene
const canvas = document.getElementById('skillNetworkCanvas');
if (!canvas) console.error('Canvas not found');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);
scene.fog = new THREE.Fog(0x050505, 30, 100);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// Lighting with cherry blossom aesthetic
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xff6b9d, 0.6);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLight1 = new THREE.PointLight(0x4d96ff, 0.4);
pointLight1.position.set(-10, 5, 8);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x6bcf7f, 0.3);
pointLight2.position.set(10, -5, 8);
scene.add(pointLight2);

// Create nodes map
const nodesMesh = {};
const nodePositions = {};
const nodeGroup = new THREE.Group();
scene.add(nodeGroup);

// Distribute nodes in 3D space using force-directed layout
const createNodes = () => {
    const positions = {};
    
    // Initialize random positions
    skillsNetworkData.nodes.forEach((nodeData, idx) => {
        const angle = (idx / skillsNetworkData.nodes.length) * Math.PI * 2;
        const radius = 8 + Math.random() * 3;
        const x = Math.cos(angle) * radius;
        const y = (Math.random() - 0.5) * 10;
        const z = Math.sin(angle) * radius;
        positions[nodeData.id] = new THREE.Vector3(x, y, z);
    });
    
    // Apply spring physics for better distribution
    for (let iter = 0; iter < 50; iter++) {
        skillsNetworkData.nodes.forEach((nodeData) => {
            const pos = positions[nodeData.id];
            const forces = new THREE.Vector3(0, 0, 0);
            
            // Repulsion from other nodes
            skillsNetworkData.nodes.forEach((other) => {
                if (other.id !== nodeData.id) {
                    const otherPos = positions[other.id];
                    const diff = pos.clone().sub(otherPos);
                    const dist = Math.max(diff.length(), 0.1);
                    diff.normalize().multiplyScalar(1 / (dist * 0.5));
                    forces.add(diff);
                }
            });
            
            // Attraction along edges
            skillsNetworkData.edges.forEach((edge) => {
                if (edge.source === nodeData.id) {
                    const targetPos = positions[edge.target];
                    const diff = targetPos.clone().sub(pos);
                    diff.multiplyScalar(0.01);
                    forces.add(diff);
                } else if (edge.target === nodeData.id) {
                    const sourcePos = positions[edge.source];
                    const diff = sourcePos.clone().sub(pos);
                    diff.multiplyScalar(0.01);
                    forces.add(diff);
                }
            });
            
            // Damping and update
            forces.multiplyScalar(0.1);
            pos.add(forces);
        });
    }
    
    // Create mesh nodes
    skillsNetworkData.nodes.forEach((nodeData) => {
        const geometry = new THREE.IcosahedronGeometry(0.5, 4);
        const material = new THREE.MeshStandardMaterial({
            color: nodeData.color,
            metalness: 0.6,
            roughness: 0.3,
            emissive: new THREE.Color(nodeData.color).multiplyScalar(0.3)
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        const pos = positions[nodeData.id];
        mesh.position.copy(pos);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { skillId: nodeData.id, skillName: nodeData.name, skillIcon: nodeData.icon };
        
        nodeGroup.add(mesh);
        nodesMesh[nodeData.id] = mesh;
        nodePositions[nodeData.id] = pos.clone();
    });
};

createNodes();

// Create edges (connections)
const edgeGroup = new THREE.Group();
scene.add(edgeGroup);

const edgeMeshes = {};

const createEdges = () => {
    skillsNetworkData.edges.forEach((edge, idx) => {
        const sourcePos = nodePositions[edge.source];
        const targetPos = nodePositions[edge.target];
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(
            new Float32Array([
                sourcePos.x, sourcePos.y, sourcePos.z,
                targetPos.x, targetPos.y, targetPos.z
            ]),
            3
        ));
        
        const material = new THREE.LineBasicMaterial({
            color: 0xff6b9d,
            transparent: true,
            opacity: 0.2,
            linewidth: 2
        });
        
        const line = new THREE.Line(geometry, material);
        edgeGroup.add(line);
        edgeMeshes[`${edge.source}-${edge.target}`] = { line, edge };
    });
};

createEdges();

// Interactive selection and highlighting
let selectedNode = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const highlightConnections = (nodeId) => {
    // Reset all edges
    Object.values(edgeMeshes).forEach(({ line }) => {
        line.material.opacity = 0.15;
        line.material.color.setHex(0xff6b9d);
    });
    
    // Reset all nodes
    Object.values(nodesMesh).forEach((mesh) => {
        mesh.material.emissive.copy(new THREE.Color(mesh.material.color).multiplyScalar(0.3));
    });
    
    if (nodeId === null) return;
    
    // Highlight connected nodes and edges
    const connectedNodes = new Set([nodeId]);
    skillsNetworkData.edges.forEach((edge) => {
        if (edge.source === nodeId) {
            connectedNodes.add(edge.target);
        } else if (edge.target === nodeId) {
            connectedNodes.add(edge.source);
        }
    });
    
    // Highlight connected nodes
    connectedNodes.forEach((nId) => {
        const mesh = nodesMesh[nId];
        if (mesh) {
            mesh.material.emissive.copy(new THREE.Color(mesh.material.color));
            mesh.scale.set(1.3, 1.3, 1.3);
        }
    });
    
    // Highlight connected edges
    skillsNetworkData.edges.forEach((edge) => {
        const key = `${edge.source}-${edge.target}`;
        if (connectedNodes.has(edge.source) && connectedNodes.has(edge.target)) {
            edgeMeshes[key].line.material.opacity = 0.8;
            edgeMeshes[key].line.material.color.setHex(0xff6b9d);
        }
    });
};

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodeGroup.children);
    
    if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        selectedNode = clickedMesh.userData.skillId;
        highlightConnections(selectedNode);
        
        // Show skill details
        showSkillDetails(clickedMesh.userData);
    } else {
        selectedNode = null;
        highlightConnections(null);
        hideSkillDetails();
    }
});

// Skill details panel
const showSkillDetails = (skillData) => {
    let panel = document.getElementById('skillDetailsPanel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'skillDetailsPanel';
        panel.className = 'skill-details-panel';
        document.body.appendChild(panel);
    }
    
    const connectedSkills = [];
    skillsNetworkData.edges.forEach((edge) => {
        if (edge.source === skillData.skillId) {
            const connected = skillsNetworkData.nodes.find(n => n.id === edge.target);
            if (connected) connectedSkills.push(connected);
        } else if (edge.target === skillData.skillId) {
            const connected = skillsNetworkData.nodes.find(n => n.id === edge.source);
            if (connected) connectedSkills.push(connected);
        }
    });
    
    panel.innerHTML = `
        <div class="skill-details-content">
            <button class="close-btn" onclick="document.getElementById('skillDetailsPanel').style.display='none'">✕</button>
            <h2>${skillData.skillIcon} ${skillData.skillName}</h2>
            <div class="connected-skills">
                <h3>Connected Skills (${connectedSkills.length})</h3>
                <div class="skills-list">
                    ${connectedSkills.map(skill => `
                        <div class="skill-link">
                            <span>${skill.icon}</span>
                            <span>${skill.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    panel.style.display = 'block';
};

const hideSkillDetails = () => {
    const panel = document.getElementById('skillDetailsPanel');
    if (panel) panel.style.display = 'none';
};

// Mouse move for subtle camera interaction
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// Animation loop
const startTime = Date.now();
let nodes_reference = nodeGroup.children;

function animate() {
    requestAnimationFrame(animate);
    
    const elapsed = (Date.now() - startTime) * 0.001;
    
    // Gentle rotation based on mouse
    nodeGroup.rotation.x += (mouseY * 0.5 - nodeGroup.rotation.x) * 0.05;
    nodeGroup.rotation.y += (mouseX * 0.5 - nodeGroup.rotation.y) * 0.05;
    
    // Pulsing animation for nodes
    Object.values(nodesMesh).forEach((mesh, idx) => {
        const originalScale = mesh.userData.skillId === selectedNode ? 1.3 : 1;
        const pulse = 1 + Math.sin(elapsed * 2 + idx * 0.3) * 0.1;
        mesh.scale.set(originalScale * pulse, originalScale * pulse, originalScale * pulse);
    });
    
    // Update edge positions for smooth animation
    Object.values(edgeMeshes).forEach(({ line, edge }) => {
        const sourcePos = nodePositions[edge.source];
        const targetPos = nodePositions[edge.target];
        
        const positions = line.geometry.attributes.position.array;
        positions[0] = sourcePos.x;
        positions[1] = sourcePos.y;
        positions[2] = sourcePos.z;
        positions[3] = targetPos.x;
        positions[4] = targetPos.y;
        positions[5] = targetPos.z;
        line.geometry.attributes.position.needsUpdate = true;
    });
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Expose for debugging
window.skillNetwork = {
    scene,
    nodesMesh,
    highlightConnections
};
