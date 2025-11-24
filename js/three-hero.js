import * as THREE from 'three';

// Adaptive performance configuration
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
const cpuCores = navigator.hardwareConcurrency || 2;

// Adaptive quality settings based on device
const QUALITY = {
    HIGH: cpuCores >= 8,
    MEDIUM: cpuCores >= 4 && !isMobile,
    LOW: cpuCores < 4 || isMobile || isTablet
};

// Optimized configuration - AI themed
const CONFIG = {
    neuralNodes: QUALITY.HIGH ? 100 : QUALITY.MEDIUM ? 60 : 40,
    connectionDistance: 180,
    maxConnections: QUALITY.HIGH ? 120 : QUALITY.MEDIUM ? 80 : 50,
    dataOrbs: QUALITY.HIGH ? 6 : QUALITY.MEDIUM ? 4 : 3,
    backgroundParticles: QUALITY.HIGH ? 200 : QUALITY.MEDIUM ? 100 : 50,
    enableBloom: QUALITY.HIGH || QUALITY.MEDIUM,
    enableDataFlow: !QUALITY.LOW,
    geometryDetail: QUALITY.HIGH ? 16 : QUALITY.MEDIUM ? 12 : 8,
    targetFPS: 60,
    updateInterval: QUALITY.LOW ? 2 : 1
};

let scene, camera, renderer;
let neuralNetwork, dataOrbs = [];
let aiCore, dataStreams = [];
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
let frameCount = 0;
let lastTime = Date.now();
let fps = 60;

function init() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0006);

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1000;

    // Renderer with optimizations
    renderer = new THREE.WebGLRenderer({
        antialias: QUALITY.HIGH,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true
    });

    // Adaptive pixel ratio
    const pixelRatio = QUALITY.HIGH ? Math.min(window.devicePixelRatio, 2) :
        QUALITY.MEDIUM ? Math.min(window.devicePixelRatio, 1.5) : 1;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create AI-themed 3D elements
    createNeuralNetwork();
    createAICore();
    createDataOrbs();
    if (CONFIG.enableDataFlow) {
        createDataStreams();
    }
    createBackgroundParticles();

    // AI-themed lighting
    const ambientLight = new THREE.AmbientLight(0x005CFF, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00FFFF, 2, 2000);
    pointLight1.position.set(400, 400, 400);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7F00FF, 2, 2000);
    pointLight2.position.set(-400, -400, -400);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x005CFF, 1.5, 1500);
    pointLight3.position.set(0, 0, 500);
    scene.add(pointLight3);

    // Event Listeners
    window.addEventListener('resize', onWindowResize, { passive: true });

    let mouseMoveTimeout;
    document.addEventListener('mousemove', (event) => {
        if (mouseMoveTimeout) return;
        mouseMoveTimeout = setTimeout(() => {
            onMouseMove(event);
            mouseMoveTimeout = null;
        }, 16);
    }, { passive: true });

    // Start animation loop
    animate();
}

// Create Neural Network with interconnected nodes
function createNeuralNetwork() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const velocities = [];

    // Create neural nodes in a brain-like structure
    for (let i = 0; i < CONFIG.neuralNodes; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 200 + Math.random() * 150;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions.push(x, y, z);

        // Gradient colors for AI theme
        const color = new THREE.Color();
        color.setHSL(0.55 + Math.random() * 0.2, 1, 0.5 + Math.random() * 0.3);
        colors.push(color.r, color.g, color.b);

        // Random velocities for organic movement
        velocities.push(
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5
        );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.userData.velocities = velocities;

    const material = new THREE.PointsMaterial({
        size: QUALITY.HIGH ? 6 : QUALITY.MEDIUM ? 5 : 4,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    neuralNetwork = new THREE.Points(geometry, material);
    scene.add(neuralNetwork);
}

// Create AI Core - central glowing sphere
function createAICore() {
    const geometry = new THREE.IcosahedronGeometry(80, CONFIG.geometryDetail);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00FFFF,
        emissive: 0x005CFF,
        emissiveIntensity: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });

    aiCore = new THREE.Mesh(geometry, material);
    scene.add(aiCore);

    // Add inner glow
    const innerGeometry = new THREE.IcosahedronGeometry(60, CONFIG.geometryDetail);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x7F00FF,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
    aiCore.add(innerCore);
}

// Create Data Orbs - floating data nodes
function createDataOrbs() {
    for (let i = 0; i < CONFIG.dataOrbs; i++) {
        const geometry = new THREE.OctahedronGeometry(20 + Math.random() * 15, CONFIG.geometryDetail);
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(0.5 + Math.random() * 0.3, 1, 0.6),
            emissive: new THREE.Color().setHSL(0.5 + Math.random() * 0.3, 1, 0.3),
            emissiveIntensity: 0.7,
            transparent: true,
            opacity: 0.8,
            wireframe: Math.random() > 0.5
        });

        const orb = new THREE.Mesh(geometry, material);

        // Position orbs in orbit around center
        const angle = (i / CONFIG.dataOrbs) * Math.PI * 2;
        const radius = 300 + Math.random() * 200;
        orb.position.x = Math.cos(angle) * radius;
        orb.position.y = Math.sin(angle) * radius;
        orb.position.z = (Math.random() - 0.5) * 400;

        orb.userData.angle = angle;
        orb.userData.radius = radius;
        orb.userData.speed = 0.0003 + Math.random() * 0.0005;
        orb.userData.rotationSpeed = (Math.random() - 0.5) * 0.02;

        dataOrbs.push(orb);
        scene.add(orb);
    }
}

// Create Data Streams - flowing particles
function createDataStreams() {
    for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        // Create stream path
        for (let j = 0; j < 50; j++) {
            const t = j / 50;
            const angle = t * Math.PI * 4 + (i * Math.PI * 2 / 3);
            const radius = 250 + Math.sin(t * Math.PI * 2) * 100;

            positions.push(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                (t - 0.5) * 600
            );

            const color = new THREE.Color();
            color.setHSL(0.5 + i * 0.15, 1, 0.5 + t * 0.3);
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 4,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const stream = new THREE.Points(geometry, material);
        stream.userData.offset = i * 100;
        dataStreams.push(stream);
        scene.add(stream);
    }
}

// Create Background Particles
function createBackgroundParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < CONFIG.backgroundParticles; i++) {
        positions.push(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000
        );

        const color = new THREE.Color();
        color.setHSL(0.5 + Math.random() * 0.3, 0.8, 0.5);
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    frameCount++;
    if (frameCount % CONFIG.updateInterval !== 0) return;

    // FPS calculation
    const currentTime = Date.now();
    const delta = currentTime - lastTime;
    fps = 1000 / delta;
    lastTime = currentTime;

    // Smooth camera movement
    targetRotationX += (mouseX * 0.0001 - targetRotationX) * 0.05;
    targetRotationY += (mouseY * 0.0001 - targetRotationY) * 0.05;

    // Animate Neural Network
    if (neuralNetwork) {
        neuralNetwork.rotation.y += 0.0005;
        neuralNetwork.rotation.x = targetRotationY;
        neuralNetwork.rotation.z = targetRotationX;

        // Animate neural nodes
        const positions = neuralNetwork.geometry.attributes.position.array;
        const velocities = neuralNetwork.geometry.userData.velocities;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i] * 0.5;
            positions[i + 1] += velocities[i + 1] * 0.5;
            positions[i + 2] += velocities[i + 2] * 0.5;

            // Bounce back if too far
            const distance = Math.sqrt(
                positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2
            );
            if (distance > 400 || distance < 150) {
                velocities[i] *= -1;
                velocities[i + 1] *= -1;
                velocities[i + 2] *= -1;
            }
        }
        neuralNetwork.geometry.attributes.position.needsUpdate = true;
    }

    // Animate AI Core
    if (aiCore) {
        aiCore.rotation.x += 0.001;
        aiCore.rotation.y += 0.002;
        aiCore.children[0].rotation.x -= 0.002;
        aiCore.children[0].rotation.y -= 0.001;

        // Pulse effect
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.1;
        aiCore.scale.set(scale, scale, scale);
    }

    // Animate Data Orbs
    dataOrbs.forEach(orb => {
        orb.userData.angle += orb.userData.speed;
        orb.position.x = Math.cos(orb.userData.angle) * orb.userData.radius;
        orb.position.y = Math.sin(orb.userData.angle) * orb.userData.radius;
        orb.rotation.x += orb.userData.rotationSpeed;
        orb.rotation.y += orb.userData.rotationSpeed * 0.7;
    });

    // Animate Data Streams
    dataStreams.forEach(stream => {
        stream.rotation.z += 0.001;
        stream.userData.offset += 1;
        if (stream.userData.offset > 100) stream.userData.offset = 0;
    });

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
