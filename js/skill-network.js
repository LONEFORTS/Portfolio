// Premium Neural Network Skill Visualization with Navy Blue & White Theme
import * as THREE from 'three';

const skillsNetworkData = {
    nodes: [
        { id: 'ai-ml', name: 'AI & ML', icon: '🧠', color: 0x0D47A1 },
        { id: 'python', name: 'Python', icon: '🐍', color: 0x1565C0 },
        { id: 'deeplearn', name: 'Deep Learning', icon: '🔮', color: 0x0D47A1 },
        { id: 'neural-nets', name: 'Neural Networks', icon: '⚡', color: 0x1976D2 },
        { id: 'tensorflow', name: 'TensorFlow', icon: '🤖', color: 0x0D47A1 },
        { id: 'pytorch', name: 'PyTorch', icon: '🔥', color: 0x1565C0 },
        { id: 'cv', name: 'Computer Vision', icon: '👁️', color: 0x1976D2 },
        { id: 'nlp', name: 'NLP', icon: '📝', color: 0x1565C0 },
        { id: 'data-science', name: 'Data Science', icon: '📊', color: 0x0D47A1 },
        { id: 'backend', name: 'Backend', icon: '⚙️', color: 0x1976D2 },
        { id: 'frontend', name: 'Frontend', icon: '💻', color: 0x1565C0 },
        { id: 'devops', name: 'DevOps', icon: '🚀', color: 0x0D47A1 },
        { id: 'algorithms', name: 'Algorithms', icon: '🧮', color: 0x1976D2 },
        { id: 'databases', name: 'Databases', icon: '🗄️', color: 0x1565C0 },
        { id: 'system-design', name: 'System Design', icon: '🏗️', color: 0x0D47A1 }
    ],
    edges: [
        { source: 'ai-ml', target: 'python' },
        { source: 'ai-ml', target: 'deeplearn' },
        { source: 'ai-ml', target: 'neural-nets' },
        { source: 'ai-ml', target: 'data-science' },
        { source: 'deeplearn', target: 'tensorflow' },
        { source: 'deeplearn', target: 'pytorch' },
        { source: 'deeplearn', target: 'neural-nets' },
        { source: 'deeplearn', target: 'cv' },
        { source: 'deeplearn', target: 'nlp' },
        { source: 'neural-nets', target: 'algorithms' },
        { source: 'neural-nets', target: 'tensorflow' },
        { source: 'neural-nets', target: 'pytorch' },
        { source: 'tensorflow', target: 'python' },
        { source: 'pytorch', target: 'python' },
        { source: 'cv', target: 'python' },
        { source: 'cv', target: 'data-science' },
        { source: 'nlp', target: 'python' },
        { source: 'nlp', target: 'data-science' },
        { source: 'data-science', target: 'databases' },
        { source: 'data-science', target: 'backend' },
        { source: 'backend', target: 'databases' },
        { source: 'backend', target: 'system-design' },
        { source: 'backend', target: 'devops' },
        { source: 'frontend', target: 'system-design' },
        { source: 'devops', target: 'system-design' },
        { source: 'algorithms', target: 'python' },
        { source: 'algorithms', target: 'backend' }
    ]
};

const canvas = document.getElementById('skillNetworkCanvas');
if (!canvas) console.error('Canvas not found');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfafafa);
scene.fog = new THREE.Fog(0xfafafa, 50, 150);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.set(0, 15, 25);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowShadowMap;

// Premium lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(20, 30, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x1976D2, 0.5);
pointLight.position.set(-30, 15, 20);
scene.add(pointLight);

const nodesMesh = {};
const nodePositions = {};
const nodeGroup = new THREE.Group();
scene.add(nodeGroup);

// Create nodes with optimized layout
const createNodes = () => {
    const positions = {};
    
    // Initialize positions in a sphere pattern
    skillsNetworkData.nodes.forEach((nodeData, idx) => {
        const phi = Math.acos(-1 + (2 * idx) / skillsNetworkData.nodes.length);
        const theta = Math.sqrt(skillsNetworkData.nodes.length * Math.PI) * phi;
        
        const radius = 12;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.cos(phi) - 2;
        const z = radius * Math.sin(theta) * Math.sin(phi);
        
        positions[nodeData.id] = new THREE.Vector3(x, y, z);
    });
    
    // Apply spring physics
    for (let iter = 0; iter < 30; iter++) {
        skillsNetworkData.nodes.forEach((nodeData) => {
            const pos = positions[nodeData.id];
            const forces = new THREE.Vector3(0, 0, 0);
            
            // Repulsion
            skillsNetworkData.nodes.forEach((other) => {
                if (other.id !== nodeData.id) {
                    const otherPos = positions[other.id];
                    const diff = pos.clone().sub(otherPos);
                    const dist = Math.max(diff.length(), 0.5);
                    diff.normalize().multiplyScalar(0.8 / (dist * 0.3));
                    forces.add(diff);
                }
            });
            
            // Attraction
            skillsNetworkData.edges.forEach((edge) => {
                if (edge.source === nodeData.id) {
                    const targetPos = positions[edge.target];
                    const diff = targetPos.clone().sub(pos);
                    diff.multiplyScalar(0.008);
                    forces.add(diff);
                } else if (edge.target === nodeData.id) {
                    const sourcePos = positions[edge.source];
                    const diff = sourcePos.clone().sub(pos);
                    diff.multiplyScalar(0.008);
                    forces.add(diff);
                }
            });
            
            forces.multiplyScalar(0.12);
            pos.add(forces);
        });
    }
    
    // Create mesh nodes
    skillsNetworkData.nodes.forEach((nodeData) => {
        const geometry = new THREE.OctahedronGeometry(0.6, 2);
        const material = new THREE.MeshStandardMaterial({
            color: nodeData.color,
            metalness: 0.7,
            roughness: 0.2,
            emissive: new THREE.Color(nodeData.color).multiplyScalar(0.15),
            envMapIntensity: 1.0
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

const edgeGroup = new THREE.Group();
scene.add(edgeGroup);
const edgeMeshes = {};

const createEdges = () => {
    skillsNetworkData.edges.forEach((edge) => {
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
            color: 0x1976D2,
            transparent: true,
            opacity: 0.25,
            linewidth: 2
        });
        
        const line = new THREE.Line(geometry, material);
        edgeGroup.add(line);
        edgeMeshes[`${edge.source}-${edge.target}`] = { line, edge };
    });
};

createEdges();

let selectedNode = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const highlightConnections = (nodeId) => {
    Object.values(edgeMeshes).forEach(({ line }) => {
        line.material.opacity = 0.15;
        line.material.color.setHex(0x1976D2);
    });
    
    Object.values(nodesMesh).forEach((mesh) => {
        mesh.material.emissive.copy(new THREE.Color(mesh.material.color).multiplyScalar(0.15));
        mesh.scale.set(1, 1, 1);
    });
    
    if (nodeId === null) return;
    
    const connectedNodes = new Set([nodeId]);
    skillsNetworkData.edges.forEach((edge) => {
        if (edge.source === nodeId) connectedNodes.add(edge.target);
        else if (edge.target === nodeId) connectedNodes.add(edge.source);
    });
    
    connectedNodes.forEach((nId) => {
        const mesh = nodesMesh[nId];
        if (mesh) {
            mesh.material.emissive.copy(new THREE.Color(mesh.material.color).multiplyScalar(0.8));
            mesh.scale.set(1.25, 1.25, 1.25);
        }
    });
    
    skillsNetworkData.edges.forEach((edge) => {
        const key = `${edge.source}-${edge.target}`;
        if (connectedNodes.has(edge.source) && connectedNodes.has(edge.target)) {
            edgeMeshes[key].line.material.opacity = 0.7;
            edgeMeshes[key].line.material.color.setHex(0x0D47A1);
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
        showSkillDetails(clickedMesh.userData);
    } else {
        selectedNode = null;
        highlightConnections(null);
        hideSkillDetails();
    }
});

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
                <h3>Related Skills (${connectedSkills.length})</h3>
                <div class="skills-list">
                    ${connectedSkills.map(skill => `
                        <div class="skill-link">
                            <span class="icon">${skill.icon}</span>
                            <span class="name">${skill.name}</span>
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

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 0.5;
});

const startTime = Date.now();

function animate() {
    requestAnimationFrame(animate);
    
    const elapsed = (Date.now() - startTime) * 0.0005;
    
    // Smooth camera rotation
    const targetRotX = mouseY * Math.PI * 0.3;
    const targetRotY = mouseX * Math.PI * 0.6;
    
    camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), (targetRotY - camera.position.y * 0.001) * 0.02);
    
    // Node animations
    Object.values(nodesMesh).forEach((mesh, idx) => {
        const float = Math.sin(elapsed + idx * 0.5) * 0.3;
        const basePos = nodePositions[Object.keys(nodePositions)[idx]];
        if (basePos) {
            mesh.position.y = basePos.y + float;
        }
        
        const originalScale = mesh.userData.skillId === selectedNode ? 1.25 : 1;
        const pulse = originalScale * (0.95 + Math.sin(elapsed * 1.5 + idx * 0.3) * 0.05);
        mesh.scale.set(pulse, pulse, pulse);
        
        mesh.rotation.x += 0.001;
        mesh.rotation.y += 0.002;
    });
    
    // Update edges
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

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
