import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Configuration
const CONFIG = {
    brainParticles: 200,
    connectionDistance: 150,
    floatingSpheres: 8,
    backgroundParticles: 500,
    mouseInfluence: 0.0005
};

let scene, camera, renderer, composer;
let brain, particles, floatingSpheres = [];
let hologramCube, waves = [];
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;

function init() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0005);

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1000;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    container.appendChild(renderer.domElement);

    // Post-processing for bloom/glow
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,  // strength
        0.4,  // radius
        0.85  // threshold
    );
    composer.addPass(bloomPass);

    // Create 3D elements
    createAIBrain();
    createFloatingSpheres();
    createHologramCube();
    createWaves();
    createBackgroundParticles();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x005CFF, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x005CFF, 2, 1500);
    pointLight1.position.set(300, 300, 300);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7F00FF, 2, 1500);
    pointLight2.position.set(-300, -300, -300);
    scene.add(pointLight2);

    // Event Listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    animate();
}

function createAIBrain() {
    const brainGroup = new THREE.Group();

    // Create nodes
    const nodeGeometry = new THREE.SphereGeometry(4, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({
        color: 0x005CFF,
        transparent: true,
        opacity: 0.9
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

        // Glow pulse animation data
        node.userData = {
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.01
        };

        brainGroup.add(node);
        nodes.push(node);
    }

    // Create connections
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x005CFF,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            const distance = positions[i].distanceTo(positions[j]);
            if (distance < CONFIG.connectionDistance) {
                const geometry = new THREE.BufferGeometry().setFromPoints([positions[i], positions[j]]);
                const line = new THREE.Line(geometry, lineMaterial);
                brainGroup.add(line);
            }
        }
    }

    brainGroup.userData = { nodes };
    brain = brainGroup;
    scene.add(brain);
}

function createFloatingSpheres() {
    const sizes = [40, 60, 50, 45, 55, 35, 48, 52];

    for (let i = 0; i < CONFIG.floatingSpheres; i++) {
        const geometry = new THREE.SphereGeometry(sizes[i], 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: i % 2 === 0 ? 0x005CFF : 0x7F00FF,
            transparent: true,
            opacity: 0.15,
            emissive: i % 2 === 0 ? 0x005CFF : 0x7F00FF,
            emissiveIntensity: 0.5,
            shininess: 100
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
            floatSpeed: 0.001 + Math.random() * 0.002,
            floatOffset: Math.random() * Math.PI * 2,
            rotationSpeed: 0.001 + Math.random() * 0.002
        };

        floatingSpheres.push(sphere);
        scene.add(sphere);
    }
}

function createHologramCube() {
    const group = new THREE.Group();

    // Outer cube wireframe
    const cubeGeometry = new THREE.BoxGeometry(150, 150, 150);
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00FFFF,
        transparent: true,
        opacity: 0.6
    });
    const cube = new THREE.LineSegments(edges, lineMaterial);
    group.add(cube);

    // Inner rotating core
    const coreGeometry = new THREE.IcosahedronGeometry(60, 0);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x005CFF,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    group.position.set(500, -200, -300);
    group.userData = { cube, core };

    hologramCube = group;
    scene.add(hologramCube);
}

function createWaves() {
    for (let i = 0; i < 3; i++) {
        const geometry = new THREE.RingGeometry(100, 105, 64);
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
            startTime: Date.now() + i * 1000,
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
        size: 4,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;

    targetRotationY = mouseX * 0.5;
    targetRotationX = mouseY * 0.5;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    const time = Date.now() * 0.001;

    // Rotate AI Brain
    if (brain) {
        brain.rotation.y += 0.002;
        brain.rotation.x += (targetRotationX - brain.rotation.x) * 0.05;
        brain.rotation.y += (targetRotationY - brain.rotation.y) * 0.05;

        // Pulse nodes
        brain.userData.nodes.forEach(node => {
            const pulse = Math.sin(time * node.userData.pulseSpeed + node.userData.pulsePhase);
            node.scale.setScalar(1 + pulse * 0.3);
            node.material.opacity = 0.7 + pulse * 0.3;
        });
    }

    // Animate floating spheres
    floatingSpheres.forEach(sphere => {
        sphere.position.y += Math.sin(time * sphere.userData.floatSpeed + sphere.userData.floatOffset) * 0.5;
        sphere.rotation.x += sphere.userData.rotationSpeed;
        sphere.rotation.y += sphere.userData.rotationSpeed;

        // Mouse parallax
        sphere.position.x += (mouseX * 50 - sphere.position.x * 0.001) * 0.05;
        sphere.position.z += (mouseY * 50 - sphere.position.z * 0.001) * 0.05;
    });

    // Rotate hologram cube
    if (hologramCube) {
        hologramCube.userData.cube.rotation.x += 0.005;
        hologramCube.userData.cube.rotation.y += 0.005;
        hologramCube.userData.core.rotation.x -= 0.01;
        hologramCube.userData.core.rotation.y -= 0.01;
    }

    // Animate waves
    waves.forEach(wave => {
        const elapsed = Date.now() - wave.userData.startTime;
        const progress = (elapsed % wave.userData.duration) / wave.userData.duration;

        const scale = 1 + progress * 3;
        wave.scale.set(scale, scale, 1);
        wave.material.opacity = (1 - progress) * 0.5;

        if (progress > 0.95) {
            wave.userData.startTime = Date.now();
        }
    });

    // Rotate background particles
    if (particles) {
        particles.rotation.y += 0.0002;
    }

    // Camera parallax
    camera.position.x += (mouseX * 100 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 100 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Render with bloom
    composer.render();
}

// Initialize
init();
