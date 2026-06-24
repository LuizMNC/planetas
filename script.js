/**
 * SIMULADOR ASTROFÍSICO 3D - ENGINE DE ALTA FIDELIDADE
 * Desenvolvido sob princípios de Computação Gráfica Avançada e PBR
 */

const textureLoader = new THREE.TextureLoader();

// Banco de Dados Celestial - Escala Visual Didática Otimizada
const issData = { id: 'iss', name: "Estação Espacial", type: "Laboratório Artificial", distSol: "420 km da Terra", size: "109 metros", atm: "Pressurizada (N2/O2)", temp: "-150°C a 120°C", fact: "Viaja a 27.600 km/h, completando uma órbita completa a cada 92 minutos em queda livre estável." };

const celestialData = {
    sun: { name: "Sol", type: "Estrela anã amarela (G2V)", radius: 32.0, dist: 0, speed: 0, color: 0xffaa00, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg', data: { distSol: "0 km", size: "1.392.700 km", atm: "Plasma Incandescente", temp: "~5.500 °C (Superfície)", fact: "Concentra 99,86% de toda a massa do Sistema Solar, sustentando a curvatura do espaço-tempo que rege as órbitas." } },
    mercury: { name: "Mercúrio", type: "Planeta Rochoso", radius: 1.1, dist: 65, speed: 0.03, color: 0x8c8c8c, textureUrl: 'https://unpkg.com/three-globe/example/img/earth-dark.jpg', data: { distSol: "57,9 M km", size: "4.879 km", atm: "Exosfera Tênue", temp: "-173°C a 427°C", fact: "Devido à ausência de atmosfera espessa para retenção térmica, possui a maior amplitude térmica do sistema." } },
    venus: { name: "Vênus", type: "Planeta Rochoso", radius: 1.9, dist: 100, speed: 0.02, color: 0xe3bb76, textureUrl: null, data: { distSol: "108,2 M km", size: "12.104 km", atm: "96% Dióxido de Carbono", temp: "464°C", fact: "O efeito estufa descontrolado em sua atmosfera de alta densidade gera pressões equivalentes a 92 vezes a terrestre." } },
    earth: { name: "Terra", type: "Planeta Rochoso", radius: 2.2, dist: 145, speed: 0.015, color: 0x2b82c9, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg', normalUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg', specularUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg', hasISS: true, 
        moons: [ { id: 'moon', name: "Lua", radius: 0.6, dist: 5.5, speed: 0.04, color: 0xb0b0b0, data: { distSol: "149,6 M km", size: "3.474 km", atm: "Inexistente", temp: "-130°C a 120°C", fact: "Apresenta acoplamento de maré perfeito (Tidal Locking), rotacionando em sincronia geométrica exata com sua translação." } } ],
        data: { distSol: "149,6 M km", size: "12.742 km", atm: "Nitrogênio e Oxigênio", temp: "15°C", fact: "O único corpo celeste conhecido a abrigar água em três estados físicos simultâneos e atividade biológica complexa." } },
    mars: { name: "Marte", type: "Planeta Rochoso", radius: 1.5, dist: 195, speed: 0.011, color: 0xc1440e, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1k_color.jpg', 
        moons: [ { id: 'phobos', name: "Fobos", radius: 0.4, dist: 3.8, speed: 0.06, color: 0x7a6b5d, data: { distSol: "227,9 M km", size: "22 km", atm: "Nenhuma", temp: "-40°C", fact: "Orbita Marte abaixo da altitude síncrona; forças de maré gravitacionais estão reduzindo seu raio de órbita continuamente." } } ],
        data: { distSol: "227,9 M km", size: "6.779 km", atm: "Dióxido de Carbono (Fina)", temp: "-62°C", fact: "Abriga o Monte Olimpo, o maior vulcão em escudo do Sistema Solar, com uma altitude de 21,9 km." } },
    jupiter: { name: "Júpiter", type: "Gigante Gasoso", radius: 10.5, dist: 290, speed: 0.005, color: 0xb07f35, textureUrl: null, 
        moons: [ { id: 'europa', name: "Europa", radius: 0.7, dist: 17.0, speed: 0.035, color: 0xe0e0e0, data: { distSol: "778,5 M km", size: "3.121 km", atm: "Oxigênio Tênue", temp: "-160°C", fact: "Sua crosta de gelo global oculta um oceano líquido aquecido por forças de maré geradas pela gravidade jupitariana." } } ],
        data: { distSol: "778,5 M km", size: "139.820 km", atm: "Hidrogênio e Hélio", temp: "-108°C", fact: "Seu massivo campo magnético gera um cinturão de radiação severo, capturando poeira cósmica e gerando auroras intensas." } },
    saturn: { name: "Saturno", type: "Gigante Gasoso", radius: 8.5, dist: 410, speed: 0.003, color: 0xe2bf7d, textureUrl: null, hasRings: true, 
        moons: [ { id: 'titan', name: "Titã", radius: 0.9, dist: 19.5, speed: 0.022, color: 0xdca842, data: { distSol: "1,4 B km", size: "5.149 km", atm: "Nitrogênio Denso", temp: "-179°C", fact: "Único satélite do sistema com uma atmosfera densa e ciclos hidrológicos ativos baseados em metano e etano líquidos." } } ],
        data: { distSol: "1,4 B km", size: "116.460 km", atm: "Hidrogênio e Hélio", temp: "-139°C", fact: "Seus anéis são compostos por bilhões de partículas de gelo puro e rocha, cujo plano possui menos de 10 metros de espessura vertical." } },
    uranus: { name: "Urano", type: "Gigante de Gelo", radius: 4.8, dist: 540, speed: 0.001, color: 0x71b2c9, textureUrl: null, 
        data: { distSol: "2,9 B km", size: "50.724 km", atm: "Hidrogênio, Hélio e Metano", temp: "-197°C", fact: "Possui uma obliquidade extrema de 98°, fazendo com que o planeta rotacione praticamente deitado em sua linha de trânsito." } },
    neptune: { name: "Netuno", type: "Gigante de Gelo", radius: 4.6, dist: 660, speed: 0.0008, color: 0x274687, textureUrl: null, 
        data: { distSol: "4,5 B km", size: "49.244 km", atm: "Hidrogênio, Hélio e Metano", temp: "-201°C", fact: "Exibe os ventos mais violentos do Sistema Solar, atingindo velocidades supersônicas de até 2.100 km/h." } }
};

let scene, camera, renderer, controls, clock;
let planetsSystem = [];
let raycasterObjects = [];
let galaxyPoints = null;
let starfieldPoints = null;
let focusedPlanetMesh = null;

const previousTargetPos = new THREE.Vector3();
const targetCamPos = new THREE.Vector3();
let isLerpingCamera = false;

let orbitsActive = true;
let moonsActive = true;
let issActive = true;

const sharedSphereGeo = new THREE.SphereGeometry(1, 64, 64);
const sharedLowPolyGeo = new THREE.SphereGeometry(1, 16, 16);
const invisibleHitboxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });

const atmosVertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const atmosFragmentShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform vec3 uColor;
    void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float intensity = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);
        gl_FragColor = vec4(uColor, 1.0) * intensity;
    }
`;

const starVertexShader = `
    attribute float aPhase;
    attribute float aSize;
    varying float vAlpha;
    uniform float uTime;
    void main() {
        vAlpha = 0.4 + 0.6 * sin(uTime * 2.5 + aPhase * 6.28);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * (350.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const starFragmentShader = `
    varying float vAlpha;
    void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;
        float alphaSmooth = smoothstep(0.5, 0.1, dist) * vAlpha;
        gl_FragColor = vec4(1.0, 1.0, 1.0, alphaSmooth);
    }
`;

function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 20000);
    camera.position.set(0, 400, 700);

    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 8000;
    controls.minDistance = 0.5;

    scene.add(new THREE.AmbientLight(0x0a0a16, 1.2));
    const sunLight = new THREE.PointLight(0xffffff, 4.5, 5000, 0.5);
    scene.add(sunLight);

    Object.keys(celestialData).forEach((key) => {
        const data = celestialData[key];

        if (key === 'sun') {
            const sunMat = new THREE.MeshBasicMaterial({ color: data.color, map: textureLoader.load(data.textureUrl) });
            const sunMesh = new THREE.Mesh(sharedSphereGeo, sunMat);
            sunMesh.scale.set(data.radius, data.radius, data.radius);
            sunMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius };
            
            const coronaMat = new THREE.SpriteMaterial({ map: generateCoronaTexture(), blending: THREE.AdditiveBlending, transparent: true, opacity: 0.85 });
            const coronaSprite = new THREE.Sprite(coronaMat);
            coronaSprite.scale.set(data.radius * 3.8, data.radius * 3.8, 1.0);
            sunMesh.add(coronaSprite);

            scene.add(sunMesh);
            raycasterObjects.push(sunMesh);
            planetsSystem.push({ isSun: true, mesh: sunMesh });
            return;
        }

        const planetGroup = new THREE.Group();
        planetGroup.userData.currentAngle = Math.random() * Math.PI * 2;
        planetGroup.userData.speed = data.speed;
        planetGroup.userData.dist = data.dist;

        const pMat = new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0.1 });
        
        if (data.textureUrl) pMat.map = textureLoader.load(data.textureUrl);
        if (data.normalUrl) {
            pMat.normalMap = textureLoader.load(data.normalUrl);
            pMat.normalScale.set(0.15, 0.15);
        }
        if (data.specularUrl) {
            pMat.roughnessMap = textureLoader.load(data.specularUrl);
            pMat.metalness = 0.2;
        }
        if (!data.textureUrl) pMat.color.setHex(data.color);
        if (data.type.includes("Gasoso")) { pMat.roughness = 0.45; pMat.metalness = 0.05; }

        const pMesh = new THREE.Mesh(sharedSphereGeo, pMat);
        pMesh.scale.set(data.radius, data.radius, data.radius);
        pMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius };
        raycasterObjects.push(pMesh);
        planetGroup.add(pMesh);

        if (key === 'earth' || key === 'venus') {
            const colorAtm = key === 'earth' ? new THREE.Color(0x2b82c9) : new THREE.Color(0xe0a96d);
            const atmosMat = new THREE.ShaderMaterial({ vertexShader: atmosVertexShader, fragmentShader: atmosFragmentShader, uniforms: { uColor: { value: colorAtm } }, blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true });
            const atmosMesh = new THREE.Mesh(sharedSphereGeo, atmosMat);
            atmosMesh.scale.set(data.radius * 1.12, data.radius * 1.12, data.radius * 1.12);
            planetGroup.add(atmosMesh);
        }

        if (data.hasRings) {
            const ringGeo = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.6, 64);
            const ringMat = new THREE.MeshStandardMaterial({ color: 0xbfa37a, side: THREE.DoubleSide, transparent: true, opacity: 0.7, roughness: 0.6 });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.x = Math.PI / 2.3;
            planetGroup.add(ringMesh);
        }

        let moonsArr = [];
        if (data.moons) {
            data.moons.forEach(moonData => {
                const moonPivot = new THREE.Group();
                const mMat = new THREE.MeshStandardMaterial({ color: moonData.color, roughness: 0.9, metalness: 0.0 });
                const moonMesh = new THREE.Mesh(sharedLowPolyGeo, mMat);
                moonMesh.scale.set(moonData.radius, moonData.radius, moonData.radius);
                moonMesh.position.set(moonData.dist, 0, 0);

                const moonHitbox = new THREE.Mesh(sharedLowPolyGeo, invisibleHitboxMat);
                moonHitbox.scale.set(moonData.radius * 3.5, moonData.radius * 3.5, moonData.radius * 3.5);
                moonHitbox.position.copy(moonMesh.position);
                moonHitbox.userData = { id: moonData.id, ...moonData.data, name: moonData.name, type: "Satélite Natural", radius: moonData.radius };
                
                moonPivot.add(moonMesh, moonHitbox);
                raycasterObjects.push(moonHitbox);
                planetGroup.add(moonPivot);
                moonsArr.push({ pivot: moonPivot, mesh: moonMesh, speed: moonData.speed });
            });
        }

        let issPivot;
        if (data.hasISS) {
            issPivot = new THREE.Group();
            const scaleISS = 0.04;
            
            const metalSpaceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.15 });
            const solarPanelMat = new THREE.MeshStandardMaterial({ color: 0x0a2342, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide });

            const coreMesh = new THREE.Mesh(new THREE.CylinderGeometry(scaleISS, scaleISS, scaleISS * 4, 8), metalSpaceMat);
            coreMesh.rotation.x = Math.PI / 2;
            
            const panel1 = new THREE.Mesh(new THREE.BoxGeometry(scaleISS * 7, scaleISS * 0.1, scaleISS * 1.8), solarPanelMat);
            panel1.position.z = scaleISS * 1.6;
            const panel2 = panel1.clone();
            panel2.position.z = -(scaleISS * 1.6);

            issPivot.add(coreMesh, panel1, panel2);
            issPivot.position.set(data.radius + 0.6, 0, 0);

            const issHitbox = new THREE.Mesh(sharedLowPolyGeo, invisibleHitboxMat);
            issHitbox.scale.set(0.6, 0.6, 0.6);
            issHitbox.position.copy(issPivot.position);
            issHitbox.userData = { id: 'iss', ...issData, radius: scaleISS * 3 };

            const issRotator = new THREE.Group();
            issRotator.add(issPivot, issHitbox);
            raycasterObjects.push(issHitbox);
            planetGroup.add(issRotator);
            issPivot = issRotator;
        }

        createOrbitLine(data.dist);
        scene.add(planetGroup);
        planetsSystem.push({ isSun: false, group: planetGroup, pMesh: pMesh, moonsArr: moonsArr, issPivot: issPivot });
    });

    createDynamicStarfield();
    createProceduralMilkyWay();
    connectUserInterface();

    let touchStartPos = new THREE.Vector2();
    renderer.domElement.addEventListener('pointerdown', (e) => touchStartPos.set(e.clientX, e.clientY));
    renderer.domElement.addEventListener('pointerup', (e) => {
        const distClick = touchStartPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY));
        if (distClick < 4) executeRaycastSelect(e);
    });

    window.addEventListener('resize', onWindowResize);
}

function generateCoronaTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(256, 256, 32, 256, 256, 256);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.15, 'rgba(255, 200, 50, 0.8)');
    grad.addColorStop(0.45, 'rgba(230, 70, 10, 0.25)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(canvas);
}

function createDynamicStarfield() {
    const isMobile = window.innerWidth < 768;
    const countStars = isMobile ? 2000 : 5000;
    
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(countStars * 3);
    const phases = new Float32Array(countStars);
    const sizes = new Float32Array(countStars);

    for(let i = 0; i < countStars; i++) {
        const r = 2500 + Math.random() * 3500;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i*3+2] = r * Math.cos(phi);

        phases[i] = Math.random();
        sizes[i] = Math.random() * 2.2 + 0.8;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starMat = new THREE.ShaderMaterial({
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        uniforms: { uTime: { value: 0.0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    starfieldPoints = new THREE.Points(geo, starMat);
    scene.add(starfieldPoints);
}

function createProceduralMilkyWay() {
    const isMobile = window.innerWidth < 768;
    const countParticles = isMobile ? 30000 : 75000;

    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(countParticles * 3);
    const colors = new Float32Array(countParticles * 3);

    const innerColor = new THREE.Color(0xffcca3);
    const outerColor = new THREE.Color(0x0e173d);

    for(let i = 0; i < countParticles; i++) {
        const idx = i * 3;
        const rad = Math.random() * 7000;
        const angleSpin = rad * 4.5 / 7000;
        const armAngle = (i % 5) * ((Math.PI * 2) / 5);

        const dev = 350 * (7000 / (rad + 500));
        const sX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * dev;
        const sY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 250 * (1.0 - rad/7000);
        const sZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * dev;

        positions[idx] = Math.cos(armAngle + angleSpin) * rad + sX;
        positions[idx+1] = sY - 900;
        positions[idx+2] = Math.sin(armAngle + angleSpin) * rad + sZ;

        const mixCol = innerColor.clone().lerp(outerColor, rad / 7000);
        const dustDensity = Math.random() * 0.85 + 0.15;
        colors[idx] = mixCol.r * dustDensity;
        colors[idx+1] = mixCol.g * dustDensity;
        colors[idx+2] = mixCol.b * dustDensity;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mWayMat = new THREE.PointsMaterial({ size: isMobile ? 14 : 9, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });

    galaxyPoints = new THREE.Points(geo, mWayMat);
    galaxyPoints.visible = false;
    scene.add(galaxyPoints);
}

function createOrbitLine(radius) {
    if (radius === 0) return;
    const pts = [];
    for(let i = 0; i <= 180; i++) pts.push(new THREE.Vector3(Math.cos(i/180 * Math.PI * 2) * radius, 0, Math.sin(i/180 * Math.PI * 2) * radius));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x3a86ff, transparent: true, opacity: 0.08 })));
}

function executeRaycastSelect(event) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('#info-panel') || event.target.closest('#physics-modal') || event.target.closest('#astro-menu')) return;
    const mouseCoords = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouseCoords, camera);
    const intersects = raycaster.intersectObjects(raycasterObjects);
    if (intersects.length > 0) focusAstro(intersects[0].object);
}

function focusAstro(mesh) {
    if (focusedPlanetMesh === mesh) { resetCamera(); return; }
    const info = mesh.userData;
    focusedPlanetMesh = mesh;
    focusedPlanetMesh.getWorldPosition(previousTargetPos);
    
    const r = info.radius || 1;
    targetCamPos.copy(previousTargetPos).add(new THREE.Vector3(r * 2.8, r * 1.2, r * 3.6));
    
    isLerpingCamera = true;
    controls.enabled = false; 

    document.getElementById('planet-name').textContent = info.name;
    document.getElementById('planet-type').textContent = info.type;
    document.getElementById('planet-dist').textContent = info.distSol;
    document.getElementById('planet-size').textContent = info.size;
    document.getElementById('planet-atm').textContent = info.atm;
    document.getElementById('planet-temp').textContent = info.temp;
    document.getElementById('planet-fact').textContent = info.fact;
    
    const panel = document.getElementById('info-panel');
    panel.classList.add('visible');
    panel.setAttribute('aria-hidden', 'false');
}

function resetCamera() {
    focusedPlanetMesh = null;
    isLerpingCamera = false;
    controls.enabled = true;
    camera.position.set(0, 400, 700);
    controls.target.set(0, 0, 0);
    
    const panel = document.getElementById('info-panel');
    panel.classList.remove('visible');
    panel.setAttribute('aria-hidden', 'true');
}

function connectUserInterface() {
    document.querySelectorAll('.astro-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-target');
            const foundMesh = raycasterObjects.find(obj => obj.userData.id === targetId);
            if (foundMesh) focusAstro(foundMesh);
        });
    });

    document.getElementById('close-panel').addEventListener('click', resetCamera);
    document.getElementById('btn-reset').addEventListener('click', resetCamera);
    document.getElementById('btn-view').addEventListener('click', () => { resetCamera(); camera.position.set(0, 950, 0.1); });

    const btnG = document.getElementById('btn-toggle-galaxy');
    btnG.addEventListener('click', () => {
        galaxyPoints.visible = !galaxyPoints.visible;
        btnG.classList.toggle('active');
        btnG.innerText = galaxyPoints.visible ? "Via-Láctea: ON" : "Via-Láctea: OFF";
        if(galaxyPoints.visible) camera.position.set(0, 1500, 2200);
    });

    document.getElementById('btn-toggle-planets').addEventListener('click', (e) => { orbitsActive = !orbitsActive; e.target.classList.toggle('active'); });
    document.getElementById('btn-toggle-moons').addEventListener('click', (e) => { moonsActive = !moonsActive; e.target.classList.toggle('active'); });
    document.getElementById('btn-toggle-iss').addEventListener('click', (e) => { issActive = !issActive; e.target.classList.toggle('active'); });

    const pModal = document.getElementById('physics-modal');
    document.getElementById('btn-physics').addEventListener('click', () => pModal.classList.remove('hidden'));
    document.getElementById('close-physics').addEventListener('click', () => pModal.classList.add('hidden'));
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (starfieldPoints) starfieldPoints.material.uniforms.uTime.value = elapsedTime;
    if (galaxyPoints && galaxyPoints.visible) galaxyPoints.rotation.y += 0.0002;

    planetsSystem.forEach((sys) => {
        if (sys.isSun) {
            sys.mesh.rotation.y += 0.001;
        } else {
            sys.pMesh.rotation.y += 0.004; 

            let systemIsFocused = false;
            if (focusedPlanetMesh) {
                if (sys.pMesh === focusedPlanetMesh) systemIsFocused = true;
                if (sys.issPivot && sys.issPivot.children.includes(focusedPlanetMesh)) systemIsFocused = true;
                if (sys.moonsArr.some(m => m.pivot.children.includes(focusedPlanetMesh))) systemIsFocused = true;
            }

            if (orbitsActive && !systemIsFocused) {
                sys.group.userData.currentAngle += sys.group.userData.speed;
                sys.group.position.x = Math.cos(sys.group.userData.currentAngle) * sys.group.userData.dist;
                sys.group.position.z = Math.sin(sys.group.userData.currentAngle) * sys.group.userData.dist;
            }

            sys.moonsArr.forEach(moon => { if (moonsActive) moon.pivot.rotation.y += moon.speed; });

            if (sys.issPivot && issActive) {
                sys.issPivot.rotation.y += 0.045;
                sys.issPivot.rotation.x += 0.008; 
            }
        }
    });

    if (focusedPlanetMesh) {
        const currentTargetPos = new THREE.Vector3();
        focusedPlanetMesh.getWorldPosition(currentTargetPos);
        const diffVector = new THREE.Vector3().subVectors(currentTargetPos, previousTargetPos);

        if (isLerpingCamera) {
            targetCamPos.add(diffVector);
            camera.position.lerp(targetCamPos, 0.05);
            controls.target.lerp(currentTargetPos, 0.05);
            if (camera.position.distanceTo(targetCamPos) < 0.1) { isLerpingCamera = false; controls.enabled = true; }
        } else {
            camera.position.add(diffVector);
            controls.target.copy(currentTargetPos);
        }
        previousTargetPos.copy(currentTargetPos);
    }

    controls.update();
    renderer.render(scene, camera);
}

init();
