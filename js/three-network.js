import * as THREE from 'three';

const canvas = document.getElementById('bgCanvas');
const scene = new THREE.Scene();
scene.background = null; // transparent

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Nodes (spheres)
const nodesCount = 180;
const nodes = [];
const positions = [];

for (let i = 0; i < nodesCount; i++) {
    const radius = 0.08;
    const geometry = new THREE.SphereGeometry(radius, 12, 12);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x222222,
        roughness: 0.3,
        metalness: 0.7
    });
    const sphere = new THREE.Mesh(geometry, material);
    
    // Random positions in a torus-like shape
    const angle = (i / nodesCount) * Math.PI * 2;
    const r = 3.5;
    const x = Math.cos(angle * 3) * r;
    const z = Math.sin(angle * 2) * r;
    const y = Math.sin(angle * 4) * 1.2;
    sphere.position.set(x, y, z);
    scene.add(sphere);
    nodes.push(sphere);
    positions.push(new THREE.Vector3(x, y, z));
}

// Connections (lines)
const edgesGeometry = new THREE.BufferGeometry();
const edgeVertices = [];
const connectionDistance = 2.0;

for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
        const dist = positions[i].distanceTo(positions[j]);
        if (dist < connectionDistance) {
            edgeVertices.push(positions[i].x, positions[i].y, positions[i].z);
            edgeVertices.push(positions[j].x, positions[j].y, positions[j].z);
        }
    }
}
edgesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgeVertices), 3));
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
const lines = new THREE.LineSegments(edgesGeometry, lineMaterial);
scene.add(lines);

// Lights
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(1, 2, 1);
scene.add(dirLight);
const backLight = new THREE.PointLight(0x335588, 0.5);
backLight.position.set(-2, 1, -3);
scene.add(backLight);

// Mouse interaction (rotate scene gently)
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    targetRotationY = mouseX * 0.5;
    targetRotationX = mouseY * 0.3;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Smooth rotation
    scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.05;
    scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.05;
    
    // Subtle pulsation for nodes
    const time = Date.now() * 0.002;
    nodes.forEach((node, idx) => {
        const scale = 1 + Math.sin(time + idx) * 0.2;
        node.scale.set(scale, scale, scale);
    });
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
