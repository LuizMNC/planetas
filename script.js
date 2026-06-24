const textureLoader = new THREE.TextureLoader();

// --- ESCALA PROPORCIONAL DE TAMANHOS ---
// Referência: Terra = raio 1.0. 
// As distâncias foram espaçadas logaritmicamente para usabilidade.
const issData = { id: 'iss', name: "Estação Espacial", type: "Satélite Artificial", distSol: "400 km de altitude", size: "109 metros", atm: "Vácuo", temp: "Variável", fact: "Orbita a Terra a 28.000 km/h." };

const celestialData = {
    sun: { name: "Sol", type: "Estrela", radius: 25.0, dist: 0, speed: 0, color: 0xffdd00, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg', data: { distSol: "0 km", size: "1.392.700 km (109x a Terra)", atm: "Plasma", temp: "5.500°C", fact: "É uma esfera perfeita de gás incandescente que sustenta todo o sistema." } },
    mercury: { name: "Mercúrio", type: "Planeta Rochoso", radius: 0.38, dist: 45, speed: 0.04, color: 0x888888, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/moon_1024.jpg', data: { distSol: "57,9 M km", size: "4.879 km", atm: "Exosfera", temp: "-173°C a 427°C", fact: "Menor planeta do sistema, um pouco maior que nossa Lua." } },
    venus: { name: "Vênus", type: "Planeta Rochoso", radius: 0.95, dist: 55, speed: 0.015, color: 0xe3bb76, textureUrl: null, data: { distSol: "108,2 M km", size: "12.104 km", atm: "Altamente densa (CO2)", temp: "464°C", fact: "Tem tamanho e massa quase idênticos aos da Terra." } },
    earth: { name: "Terra", type: "Planeta Rochoso", radius: 1.0, dist: 75, speed: 0.01, color: 0x2233ff, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg', hasISS: true, 
        moons: [ { id: 'moon', name: "Lua", radius: 0.27, dist: 2.0, speed: 0.03, color: 0xcccccc, data: { distSol: "384.400 km da Terra", size: "3.474 km", atm: "Nenhuma", temp: "-173 a 127°C", fact: "É o único corpo celeste visitado por humanos." } } ],
        data: { distSol: "149,6 M km (1 UA)", size: "12.742 km", atm: "Nitrogênio e Oxigênio", temp: "15°C", fact: "O ponto azul pálido, nosso único lar conhecido." } },
    mars: { name: "Marte", type: "Planeta Rochoso", radius: 0.53, dist: 95, speed: 0.008, color: 0xc1440e, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/mars_1k_color.jpg', 
        moons: [ { id: 'phobos', name: "Fobos", radius: 0.1, dist: 1.0, speed: 0.05, color: 0x887766, data: { distSol: "Órbita marciana", size: "22 km", atm: "Nenhuma", temp: "-40°C", fact: "Parece mais um asteroide capturado pela gravidade marciana." } },
                 { id: 'deimos', name: "Deimos", radius: 0.08, dist: 1.5, speed: 0.03, color: 0x999999, data: { distSol: "Órbita marciana", size: "12 km", atm: "Nenhuma", temp: "-40°C", fact: "Gira tão longe que demora 30 horas para dar uma volta." } } ],
        data: { distSol: "227,9 M km", size: "6.779 km", atm: "Fina (CO2)", temp: "-62°C", fact: "Tem metade do tamanho da Terra." } },
    jupiter: { name: "Júpiter", type: "Gigante Gasoso", radius: 11.2, dist: 155, speed: 0.002, color: 0xb07f35, textureUrl: null, 
        moons: [ { id: 'io', name: "Io", radius: 0.28, dist: 13, speed: 0.06, color: 0xffffaa, data: { distSol: "Órbita jupiteriana", size: "3.642 km", atm: "Dióxido de Enxofre", temp: "-130°C", fact: "Planeta vulcânico." } },
                 { id: 'europa', name: "Europa", radius: 0.24, dist: 15, speed: 0.04, color: 0xffffff, data: { distSol: "Órbita jupiteriana", size: "3.121 km", atm: "Oxigênio tênue", temp: "-160°C", fact: "Tem um oceano sob o gelo." } },
                 { id: 'ganymede', name: "Ganimedes", radius: 0.41, dist: 17, speed: 0.03, color: 0xcccccc, data: { distSol: "Órbita jupiteriana", size: "5.268 km", atm: "Oxigênio", temp: "-163°C", fact: "Maior lua do Sistema Solar." } } ],
        data: { distSol: "778,5 M km", size: "139.820 km", atm: "Hidrogênio e Hélio", temp: "-108°C", fact: "Cabem mais de 1.300 Terras dentro dele." } },
    saturn: { name: "Saturno", type: "Gigante Gasoso", radius: 9.4, dist: 240, speed: 0.0009, color: 0xe2bf7d, textureUrl: null, hasRings: true, 
        moons: [ { id: 'titan', name: "Titã", radius: 0.4, dist: 14, speed: 0.02, color: 0xddaa55, data: { distSol: "Órbita saturniana", size: "5.149 km", atm: "Nitrogênio e Metano", temp: "-179°C", fact: "Maior que o planeta Mercúrio." } } ],
        data: { distSol: "1,4 B km", size: "116.460 km", atm: "Hidrogênio e Hélio", temp: "-139°C", fact: "Famoso por seus anéis incrivelmente extensos e finos." } },
    uranus: { name: "Urano", type: "Gigante de Gelo", radius: 4.0, dist: 310, speed: 0.0004, color: 0x71b2c9, textureUrl: null, 
        data: { distSol: "2,9 B km", size: "50.724 km", atm: "Metano", temp: "-197°C", fact: "4 vezes mais largo que a Terra." } },
    neptune: { name: "Netuno", type: "Gigante de Gelo", radius: 3.8, dist: 380, speed: 0.0001, color: 0x274687, textureUrl: null, 
        moons: [ { id: 'triton', name: "Tritão", radius: 0.21, dist: 6.0, speed: 0.02, color: 0xbbbbbb, data: { distSol: "Órbita netuniana", size: "2.706 km", atm: "Nitrogênio", temp: "-235°C", fact: "Lua retrógrada extremamente fria." } } ],
        data: { distSol: "4,5 B km", size: "49.244 km", atm: "Metano", temp: "-201°C", fact: "Sua gravidade é muito similar à da Terra." } }
};

let scene, camera, renderer, controls;
let planetsSystem = [];
let raycasterObjects = [];
let milkyWayGroup;

let focusedPlanetMesh = null;
let previousTargetPos = new THREE.Vector3();
let targetCamPos = new THREE.Vector3();
let isLerpingCamera = false;

// Toggles de Física
let orbitsActive = true;
let moonsActive = true;
let issActive = true;

const infoPanel = document.getElementById('info-panel');

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 100, 200);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 1500;
    controls.minDistance = 0.5; // Zoom minúsculo para permitir ver a ISS

    scene.add(new THREE.AmbientLight(0x222222));
    scene.add(new THREE.PointLight(0xffffff, 2.5, 1000));

    // Montagem do Sistema
    Object.keys(celestialData).forEach((key) => {
        const data = celestialData[key];

        if (key === 'sun') {
            const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 64, 64), new THREE.MeshBasicMaterial({ color: data.color }));
            sunMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius };
            scene.add(sunMesh);
            raycasterObjects.push(sunMesh);
            planetsSystem.push({ isSun: true, mesh: sunMesh });
            return;
        }

        const planetGroup = new THREE.Group();
        planetGroup.userData.currentAngle = Math.random() * Math.PI * 2;
        planetGroup.userData.speed = data.speed;
        planetGroup.userData.dist = data.dist;

        let pMat = data.textureUrl ? new THREE.MeshStandardMaterial({ map: textureLoader.load(data.textureUrl), roughness: 0.8 }) : new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.7 });
        const pMesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 32, 32), pMat);
        pMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius };
        raycasterObjects.push(pMesh);
        planetGroup.add(pMesh);

        if (data.hasRings) {
            const ringMesh = new THREE.Mesh(new THREE.RingGeometry(data.radius * 1.3, data.radius * 2.2, 64), new THREE.MeshStandardMaterial({ color: 0xbf9b65, side: THREE.DoubleSide, transparent: true, opacity: 0.6 }));
            ringMesh.rotation.x = Math.PI / 2.5;
            planetGroup.add(ringMesh);
        }

        let moonsArr = [];
        if (data.moons) {
            data.moons.forEach(moonData => {
                const moonPivot = new THREE.Group();
                const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(moonData.radius, 16, 16), new THREE.MeshStandardMaterial({ color: moonData.color }));
                moonMesh.position.set(moonData.dist + data.radius, 0, 0);

                const moonHitbox = new THREE.Mesh(new THREE.SphereGeometry(moonData.radius * 3, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
                moonHitbox.position.copy(moonMesh.position);
                moonHitbox.userData = { ...moonData.data, name: moonData.name, type: "Satélite Natural", radius: moonData.radius };
                
                moonPivot.add(moonMesh); moonPivot.add(moonHitbox);
                raycasterObjects.push(moonHitbox); planetGroup.add(moonPivot);
                moonsArr.push({ pivot: moonPivot, mesh: moonMesh, speed: moonData.speed });
            });
        }

        let issPivot;
        if (data.hasISS) {
            issPivot = new THREE.Group();
            const core = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.15, 8), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
            core.rotation.x = Math.PI / 2;
            const pMat = new THREE.MeshStandardMaterial({ color: 0x1133aa, side: THREE.DoubleSide });
            const pGeo = new THREE.BoxGeometry(0.2, 0.01, 0.05);
            const p1 = new THREE.Mesh(pGeo, pMat); p1.position.z = 0.06;
            const p2 = new THREE.Mesh(pGeo, pMat); p2.position.z = -0.06;
            issPivot.add(core); issPivot.add(p1); issPivot.add(p2);
            issPivot.position.set(data.radius + 0.3, 0, 0);

            const issHitbox = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
            issHitbox.position.copy(issPivot.position);
            issHitbox.userData = { ...issData, radius: 0.1 };
            
            const issRotator = new THREE.Group();
            issRotator.add(issPivot); issRotator.add(issHitbox);
            raycasterObjects.push(issHitbox); planetGroup.add(issRotator);
            issPivot = issRotator;
        }

        createOrbitLine(data.dist);
        scene.add(planetGroup);
        planetsSystem.push({ isSun: false, group: planetGroup, pMesh: pMesh, moonsArr: moonsArr, issPivot: issPivot });
    });

    createStarfield();
    createMilkyWay();

    window.addEventListener('resize', onWindowResize);
    
    // Suporte a detecção de clique sem atrapalhar o arrasto
    let pointerDownPos = new THREE.Vector2();
    renderer.domElement.addEventListener('pointerdown', (e) => pointerDownPos.set(e.clientX, e.clientY));
    renderer.domElement.addEventListener('pointerup', (e) => {
        if (pointerDownPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) < 5) onPlanetClick(e);
    });

    setupUIControls();
}

// Estrelas Comuns de Fundo
function createStarfield() {
    const pos = new Float32Array(3000 * 3);
    for (let i = 0; i < 9000; i += 3) {
        const r = 600 + Math.random() * 800, u = Math.random(), v = Math.random();
        const theta = u * 2 * Math.PI, phi = Math.acos(2 * v - 1);
        pos[i] = r * Math.sin(phi) * Math.cos(theta); pos[i+1] = r * Math.sin(phi) * Math.sin(theta); pos[i+2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.6, transparent: true, opacity: 0.6 })));
}

// Construção Procedural da Via-Láctea (Faixa Galáctica)
function createMilkyWay() {
    milkyWayGroup = new THREE.Group();
    const particleCount = 25000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const colorInside = new THREE.Color(0xffcc88); // Centro dourado
    const colorOutside = new THREE.Color(0x2244aa); // Bordas azuladas

    for (let i = 0; i < particleCount; i++) {
        // Distribuição em forma de disco achatado
        const r = 800 + Math.random() * 1200;
        const theta = Math.random() * 2 * Math.PI;
        const yDist = (Math.random() - 0.5) * (150000 / r); 
        
        positions[i * 3] = r * Math.cos(theta);
        positions[i * 3 + 1] = yDist;
        positions[i * 3 + 2] = r * Math.sin(theta);

        // Interpola a cor baseado na distância do centro
        const mix = Math.min(1, (r - 800) / 1200);
        const c = colorInside.clone().lerp(colorOutside, mix);
        colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.4 });
    const mwMesh = new THREE.Points(geometry, material);
    mwMesh.rotation.x = Math.PI / 4; // Inclina a galáxia no céu
    
    milkyWayGroup.add(mwMesh);
    milkyWayGroup.visible = false; // Desativada por padrão
    scene.add(milkyWayGroup);
}

// Câmera Dinâmica e Foco Otimizado
function onPlanetClick(event) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('#info-panel') || event.target.closest('#physics-modal')) return;

    const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(raycasterObjects);

    if (intersects.length > 0) {
        const clickedObj = intersects[0].object;

        if (focusedPlanetMesh === clickedObj) {
            resetCamera();
            return;
        }

        const info = clickedObj.userData;
        focusedPlanetMesh = clickedObj;
        focusedPlanetMesh.getWorldPosition(previousTargetPos);
        
        // Offset dinâmico: Permite chegar muito perto de objetos pequenos (ISS) e ficar mais longe de gigantes (Sol)
        const r = info.radius || 1;
        const distOffset = Math.max(r * 2.5, 0.4); 
        const heightOffset = Math.max(r * 1.0, 0.2);
        
        targetCamPos.copy(previousTargetPos).add(new THREE.Vector3(distOffset, heightOffset, distOffset * 1.5));
        isLerpingCamera = true;
        controls.enabled = false; 

        document.getElementById('planet-name').textContent = info.name;
        document.getElementById('planet-type').textContent = info.type;
        document.getElementById('planet-dist').textContent = info.distSol;
        document.getElementById('planet-size').textContent = info.size;
        document.getElementById('planet-atm').textContent = info.atm;
        document.getElementById('planet-temp').textContent = info.temp;
        document.getElementById('planet-fact').textContent = info.fact;
        infoPanel.classList.add('visible');
    }
}

function resetCamera() {
    focusedPlanetMesh = null;
    isLerpingCamera = false;
    controls.enabled = true;
    camera.position.set(0, 100, 200);
    controls.target.set(0,0,0);
    infoPanel.classList.remove('visible');
}

function animate() {
    requestAnimationFrame(animate);

    planetsSystem.forEach((sys) => {
        if (sys.isSun) {
            sys.mesh.rotation.y += 0.001;
        } else {
            sys.pMesh.rotation.y += 0.01;

            let isFocusedSystem = false;
            if (focusedPlanetMesh) {
                if (sys.pMesh === focusedPlanetMesh) isFocusedSystem = true;
                if (sys.issPivot && sys.issPivot.children.includes(focusedPlanetMesh)) isFocusedSystem = true;
                if (sys.moonsArr.some(m => m.pivot.children.includes(focusedPlanetMesh))) isFocusedSystem = true;
            }

            // Translação (Para o astro focado, ou global se pausado pelo usuário)
            if (orbitsActive && !isFocusedSystem) {
                sys.group.userData.currentAngle += sys.group.userData.speed;
                sys.group.position.x = Math.cos(sys.group.userData.currentAngle) * sys.group.userData.dist;
                sys.group.position.z = Math.sin(sys.group.userData.currentAngle) * sys.group.userData.dist;
            }

            sys.moonsArr.forEach(moon => {
                moon.mesh.rotation.y += 0.02; 
                if (moonsActive) moon.pivot.rotation.y += moon.speed; 
            });

            if (sys.issPivot && issActive) {
                sys.issPivot.rotation.y += 0.05;
                sys.issPivot.rotation.x += 0.01;
            }
        }
    });

    if (focusedPlanetMesh) {
        const currentTargetPos = new THREE.Vector3();
        focusedPlanetMesh.getWorldPosition(currentTargetPos);
        const delta = new THREE.Vector3().subVectors(currentTargetPos, previousTargetPos);

        if (isLerpingCamera) {
            targetCamPos.add(delta); 
            camera.position.lerp(targetCamPos, 0.08);
            controls.target.lerp(currentTargetPos, 0.08);
            if (camera.position.distanceTo(targetCamPos) < (focusedPlanetMesh.userData.radius * 0.5 || 0.2)) { 
                isLerpingCamera = false; controls.enabled = true; 
            }
        } else {
            camera.position.add(delta);
            controls.target.copy(currentTargetPos);
        }
        previousTargetPos.copy(currentTargetPos);
    }

    if(milkyWayGroup.visible) milkyWayGroup.rotation.y -= 0.0001; // Rotação sutil da galáxia de fundo

    controls.update();
    renderer.render(scene, camera);
}

function setupUIControls() {
    document.getElementById('close-panel').addEventListener('click', () => infoPanel.classList.remove('visible'));
    document.getElementById('btn-reset').addEventListener('click', resetCamera);
    document.getElementById('btn-view').addEventListener('click', () => { resetCamera(); camera.position.set(0, 250, 0.1); });

    // Botão Via Láctea
    const btnMw = document.getElementById('btn-toggle-mw');
    btnMw.addEventListener('click', () => {
        milkyWayGroup.visible = !milkyWayGroup.visible;
        btnMw.classList.toggle('active');
        btnMw.innerText = milkyWayGroup.visible ? "🌌 Via-Láctea: ON" : "🌌 Via-Láctea: OFF";
    });

    const btnPlanets = document.getElementById('btn-toggle-planets');
    btnPlanets.addEventListener('click', () => { orbitsActive = !orbitsActive; btnPlanets.classList.toggle('active'); btnPlanets.innerText = orbitsActive ? "Planetas: ON" : "Planetas: OFF"; });

    const btnMoons = document.getElementById('btn-toggle-moons');
    btnMoons.addEventListener('click', () => { moonsActive = !moonsActive; btnMoons.classList.toggle('active'); btnMoons.innerText = moonsActive ? "Luas: ON" : "Luas: OFF"; });

    const btnIss = document.getElementById('btn-toggle-iss');
    btnIss.addEventListener('click', () => { issActive = !issActive; btnIss.classList.toggle('active'); btnIss.innerText = issActive ? "ISS: ON" : "ISS: OFF"; });

    const modal = document.getElementById('physics-modal');
    document.getElementById('btn-physics').addEventListener('click', () => modal.classList.remove('hidden'));
    document.getElementById('close-physics').addEventListener('click', () => modal.classList.add('hidden'));
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();
