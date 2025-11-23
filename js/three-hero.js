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

// Optimized configuration - always enabled but scaled
const CONFIG = {
    brainParticles: QUALITY.HIGH ? 80 : QUALITY.MEDIUM ? 50 : 30,
    connectionDistance: 150,
    maxConnections: QUALITY.HIGH ? 100 : QUALITY.MEDIUM ? 60 : 30,
    floatingSpheres: QUALITY.HIGH ? 4 : QUALITY.MEDIUM ? 3 : 2,
    backgroundParticles: QUALITY.HIGH ? 150 : QUALITY.MEDIUM ? 80 : 40,
    enableBloom: QUALITY.HIGH || QUALITY.MEDIUM,
    enableWaves: !QUALITY.LOW,
    geometryDetail: QUALITY.HIGH ? 12 : QUALITY.MEDIUM ? 8 : 6,
    targetFPS: 60,
    updateInterval: QUALITY.LOW ? 2 : 1  // Update every N frames
};

let scene, camera, renderer, composer;
let brain, particles, floatingSpheres = [];
let hologramCube, waves = [];
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
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

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

    // Create 3D elements with adaptive quality
    createAIBrain();
    createFloatingSpheres();
    if (CONFIG.enableWaves) {
        createHologramCube();
        createWaves();
    }
    createBackgroundParticles();

    // Optimized lighting
    const ambientLight = new THREE.AmbientLight(0x005CFF, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x005CFF, 1.5, 1500);
    pointLight1.position.set(300, 300, 300);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7F00FF, 1.5, 1500);
    pointLight2.position.set(-300, -300, -300);
    scene.add(pointLight2);

    // Event Listeners with throttling
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

    console.log(`3D initialized with ${QUALITY.HIGH ? 'HIGH' : QUALITY.MEDIUM ? 'MEDIUM' : 'LOW'} quality`);
}

function createAIBrain() {
    const brainGroup = new THREE.Group();

    // Optimized node geometry
    const nodeGeometry = new THREE.SphereGeometry(4, CONFIG.geometryDetail, CONFIG.geometryDetail);
    const nodeMaterial = new THREE.MeshBasicMaterial({
        color: 0x005CFF,
        transparent: true,
        opacity: 0.8
    });

    const positions = [];
    const nodes = [];

    for (let i = 0; i < CONFIG.brainParticles; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 300 + Math.random() * 50;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions.push(new THREE.Vector3(x, y, z));

        const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
        node.position.set(x, y, z);
        node.matrixAutoUpdate = false;  // Performance optimization
        node.updateMatrix();

        node.userData = {
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.015 + Math.random() * 0.01,
            baseScale: 1
        };

        brainGroup.add(node);
        nodes.push(node);
    }

    // Optimized connections
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x005CFF,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
    });

    let connectionCount = 0;

    for (let i = 0; i < positions.length && connectionCount < CONFIG.maxConnections; i++) {
        for (let j = i + 1; j < positions.length && connectionCount < CONFIG.maxConnections; j++) {
            const distance = positions[i].distanceTo(positions[j]);
            if (distance < CONFIG.connectionDistance) {
                const geometry = new THREE.BufferGeometry().setFromPoints([positions[i], positions[j]]);
                const line = new THREE.Line(geometry, lineMaterial);
                brainGroup.add(line);
                connectionCount++;
            }
        }
    }

    brainGroup.userData = { nodes };
    brain = brainGroup;
    scene.add(brain);
}

function createFloatingSpheres() {
    const sizes = [40, 55, 45, 50];

    for (let i = 0; i < CONFIG.floatingSpheres; i++) {
        const geometry = new THREE.SphereGeometry(sizes[i], CONFIG.geometryDetail * 1.5, CONFIG.geometryDetail * 1.5);
        const material = new THREE.MeshPhongMaterial({
            color: i % 2 === 0 ? 0x005CFF : 0x7F00FF,
            transparent: true,
            opacity: 0.12,
            emissive: i % 2 === 0 ? 0x005CFF : 0x7F00FF,
            emissiveIntensity: 0.4,
            shininess: 80,
            flatShading: true  // Performance optimization
        });

        const sphere = new THREE.Mesh(geometry, material);

        const angle = (i / CONFIG.floatingSpheres) * Math.PI * 2;
        const radius = 600 + Math.random() * 200;
        sphere.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 400,
            Math.sin(angle) * radius
        );

        sphere.userData = {
            floatSpeed: 0.0008 + Math.random() * 0.0015,
            floatOffset: Math.random() * Math.PI * 2,
            rotationSpeed: 0.0008 + Math.random() * 0.0015,
            baseY: sphere.position.y
        };

        floatingSpheres.push(sphere);
        scene.add(sphere);
    }
}

function createHologramCube() {
    const group = new THREE.Group();

    const cubeGeometry = new THREE.BoxGeometry(150, 150, 150);
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00FFFF,
        transparent: true,
        opacity: 0.5
    });
    const cube = new THREE.LineSegments(edges, lineMaterial);
    group.add(cube);

    const coreGeometry = new THREE.IcosahedronGeometry(60, 0);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x005CFF,
        wireframe: true,
        transparent: true,
        opacity: 0.7
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    group.position.set(500, -200, -300);
    group.userData = { cube, core };

    hologramCube = group;
    scene.add(hologramCube);
}

function createWaves() {
    for (let i = 0; i < 2; i++) {  // Reduced from 3 to 2
        const geometry = new THREE.RingGeometry(100, 105, 24);
        const material = new THREE.MeshBasicMaterial({
            color: 0x005CFF,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        });

        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0, -400, 0);

        ring.userData = {
            startTime: Date.now() + i * 1500,
            duration: 3000
        };

        waves.push(ring);
        scene.add(ring);
    }
}

function createBackgroundParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    const color1 = new THREE.Color(0x005CFF);
    const color2 = new THREE.Color(0x7F00FF);
    const color3 = new THREE.Color(0x00FFFF);

    for (let i = 0; i < CONFIG.backgroundParticles; i++) {
        positions.push(
            (Math.random() - 0.5) * 3000,
            (Math.random() - 0.5) * 3000,
            (Math.random() - 0.5) * 2000
        );

        const colorChoice = Math.random();
        const color = colorChoice < 0.33 ? color1 : colorChoice < 0.66 ? color2 : color3;
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
    targetRotationY = mouseX * 0.3;
    targetRotationX = mouseY * 0.3;
}

function animate() {
    requestAnimationFrame(animate);

    // FPS monitoring
    frameCount++;
    const currentTime = Date.now();
    if (currentTime >= lastTime + 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
    }

    render();
}

function render() {
    const time = Date.now() * 0.001;
    const shouldUpdate = frameCount % CONFIG.updateInterval === 0;

    // Rotate AI Brain
    if (brain && shouldUpdate) {
        brain.rotation.y += 0.0008;
        brain.rotation.x += (targetRotationX - brain.rotation.x) * 0.03;
        brain.rotation.y += (targetRotationY - brain.rotation.y) * 0.03;

        // Optimized node pulsing - update only visible nodes
        const nodesToUpdate = Math.ceil(brain.userData.nodes.length / CONFIG.updateInterval);
        const startIdx = (frameCount % CONFIG.updateInterval) * nodesToUpdate;
        const endIdx = Math.min(startIdx + nodesToUpdate, brain.userData.nodes.length);

        for (let i = startIdx; i < endIdx; i++) {
            const node = brain.userData.nodes[i];
            const pulse = Math.sin(time * node.userData.pulseSpeed + node.userData.pulsePhase);
            const scale = 1 + pulse * 0.25;
            node.scale.set(scale, scale, scale);
            node.material.opacity = 0.6 + pulse * 0.2;
            node.matrixAutoUpdate = true;
            node.updateMatrix();
            node.matrixAutoUpdate = false;
        }
    }

    // Animate floating spheres
    if (shouldUpdate) {
        floatingSpheres.forEach(sphere => {
            const floatAmount = Math.sin(time * sphere.userData.floatSpeed + sphere.userData.floatOffset);
            sphere.position.y = sphere.userData.baseY + floatAmount * 15;
            sphere.rotation.x += sphere.userData.rotationSpeed;
            sphere.rotation.y += sphere.userData.rotationSpeed;
        });
    }

    // Rotate hologram cube
    if (hologramCube && shouldUpdate) {
        hologramCube.userData.cube.rotation.x += 0.004;
        hologramCube.userData.cube.rotation.y += 0.004;
        hologramCube.userData.core.rotation.x -= 0.008;
        hologramCube.userData.core.rotation.y -= 0.008;
    }

    // Animate waves
    if (shouldUpdate) {
        waves.forEach(wave => {
            const elapsed = Date.now() - wave.userData.startTime;
            const progress = (elapsed % wave.userData.duration) / wave.userData.duration;

            const scale = 1 + progress * 2.5;
            wave.scale.set(scale, scale, 1);
            wave.material.opacity = (1 - progress) * 0.4;

            if (progress > 0.95) {
                wave.userData.startTime = Date.now();
            }
        });
    }

    // Rotate background particles
    if (particles) {
        particles.rotation.y += 0.0001;
    }

    // Smooth camera parallax
    camera.position.x += (mouseX * 80 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 80 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    // Render
    renderer.render(scene, camera);
}

// Initialize
init();

