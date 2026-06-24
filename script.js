const textureLoader = new THREE.TextureLoader();

// --- ESCALA SEMI-PROPORCIONAL DE USABILIDADE ---
// O Sol foi reduzido (Raio 30) e os planetas rochosos levemente ampliados
// As distâncias foram espaçadas para melhor clareza visual
const issData = { id: 'iss', name: "Estação Espacial", type: "Laboratório", distSol: "400 km da Terra", size: "109 metros", atm: "Vácuo", temp: "Variável", fact: "Completa uma volta na Terra a cada 90 minutos." };

const celestialData = {
    sun: { name: "Sol", type: "Estrela", radius: 30.0, dist: 0, speed: 0, color: 0xffdd00, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg', data: { distSol: "0 km", size: "1.392.700 km", atm: "Plasma", temp: "5.500°C", fact: "Responsável por 99,86% da massa do Sistema Solar." } },
    mercury: { name: "Mercúrio", type: "Planeta Rochoso", radius: 1.0, dist: 60, speed: 0.04, color: 0x888888, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/moon_1024.jpg', data: { distSol: "57,9 M km", size: "4.879 km", atm: "Exosfera", temp: "-173°C a 427°C", fact: "É o planeta mais rápido, orbitando o Sol em apenas 88 dias." } },
    venus: { name: "Vênus", type: "Planeta Rochoso", radius: 1.8, dist: 95, speed: 0.015, color: 0xe3bb76, textureUrl: null, data: { distSol: "108,2 M km", size: "12.104 km", atm: "Dióxido de Carbono", temp: "464°C", fact: "Seu efeito estufa é tão forte que derrete chumbo na superfície." } },
    earth: { name: "Terra", type: "Planeta Rochoso", radius: 2.0, dist: 135, speed: 0.01, color: 0x2233ff, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg', hasISS: true, 
        moons: [ { id: 'moon', name: "Lua", radius: 0.6, dist: 5.0, speed: 0.03, color: 0xcccccc, data: { distSol: "384.400 km da Terra", size: "3.474 km", atm: "Nenhuma", temp: "-173 a 127°C", fact: "A gravidade lunar é a principal causadora das marés nos oceanos." } } ],
        data: { distSol: "149,6 M km", size: "12.742 km", atm: "Nitrogênio e Oxigênio", temp: "15°C", fact: "Único lugar no universo onde sabemos haver vida." } },
    mars: { name: "Marte", type: "Planeta Rochoso", radius: 1.4, dist: 180, speed: 0.008, color: 0xc1440e, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/mars_1k_color.jpg', 
        moons: [ { id: 'phobos', name: "Fobos", radius: 0.4, dist: 3.5, speed: 0.05, color: 0x887766, data: { distSol: "Órbita marciana", size: "22 km", atm: "Nenhuma", temp: "-40°C", fact: "Fobos está se aproximando de Marte e acabará colidindo com ele." } } ],
        data: { distSol: "227,9 M km", size: "6.779 km", atm: "Fina (CO2)", temp: "-62°C", fact: "Apresenta a maior montanha do Sistema Solar, o Monte Olimpo." } },
    jupiter: { name: "Júpiter", type: "Gigante Gasoso", radius: 11.0, dist: 280, speed: 0.002, color: 0xb07f35, textureUrl: null, 
        moons: [ { id: 'europa', name: "Europa", radius: 0.8, dist: 16.0, speed: 0.04, color: 0xffffff, data: { distSol: "Órbita jupiteriana", size: "3.121 km", atm: "Oxigênio", temp: "-160°C", fact: "Esconde um imenso oceano de água líquida sob sua crosta de gelo." } } ],
        data: { distSol: "778,5 M km", size: "139.820 km", atm: "Hidrogênio e Hélio", temp: "-108°C", fact: "É tão imenso que caberiam mais de 1.300 Terras dentro dele." } },
    saturn: { name: "Saturno", type: "Gigante Gasoso", radius: 9.0, dist: 400, speed: 0.0009, color: 0xe2bf7d, textureUrl: null, hasRings: true, 
        moons: [ { id: 'titan', name: "Titã", radius: 0.9, dist: 18.0, speed: 0.02, color: 0xddaa55, data: { distSol: "Órbita saturniana", size: "5.149 km", atm: "Nitrogênio espesso", temp: "-179°C", fact: "Única lua com nuvens e rios (embora de metano líquido)." } } ],
        data: { distSol: "1,4 B km", size: "116.460 km", atm: "Hidrogênio e Hélio", temp: "-139°C", fact: "Possui os anéis mais complexos e brilhantes já observados." } },
    uranus: { name: "Urano", type: "Gigante de Gelo", radius: 5.0, dist: 530, speed: 0.0004, color: 0x71b2c9, textureUrl: null, 
        data: { distSol: "2,9 B km", size: "50.724 km", atm: "Metano, Hidrogênio", temp: "-197°C", fact: "Seu eixo de rotação é inclinado em 98 graus, orbitando 'deitado'." } },
    neptune: { name: "Netuno", type: "Gigante de Gelo", radius: 4.8, dist: 650, speed: 0.0001, color: 0x274687, textureUrl: null, 
        data: { distSol: "4,5 B km", size: "49.244 km", atm: "Metano, Hidrogênio", temp: "-201°C", fact: "Possui ventos extremamente violentos que quebram a barreira do som." } }
};

let scene, camera, renderer, controls;
let planetsSystem = [];
let raycasterObjects = [];
let galaxyMesh = null;

let focusedPlanetMesh = null;
let previousTargetPos = new THREE.Vector3();
let targetCamPos = new THREE.Vector3();
let isLerpingCamera = false;

let orbitsActive = true;
let moonsActive = true;
let issActive = true;

const sharedSphereGeo = new THREE.SphereGeometry(1, 48, 48);
const sharedLowPolyGeo = new THREE.SphereGeometry(1, 16, 16);
const invisibleHitboxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });

function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 15000);
    camera.position.set(0, 300, 500);

    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 6000;
    controls.minDistance = 0.05;

    scene.add(new THREE.AmbientLight(0x444444));
    scene.add(new THREE.PointLight(0xffffff, 3.5, 3000));

    Object.keys(celestialData).forEach((key) => {
        const data = celestialData[key];

        if (key === 'sun') {
            const sunMat = new THREE.MeshBasicMaterial({ color: data.color });
            const sunMesh = new THREE.Mesh(sharedSphereGeo, sunMat);
            sunMesh.scale.set(data.radius, data.radius, data.radius);
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
        const pMesh = new THREE.Mesh(sharedSphereGeo, pMat);
        pMesh.scale.set(data.radius, data.radius, data.radius);
        pMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius };
        raycasterObjects.push(pMesh);
        planetGroup.add(pMesh);

        if (data.hasRings) {
            const ringMesh = new THREE.Mesh(new THREE.RingGeometry(data.radius * 1.5, data.radius * 2.8, 64), new THREE.MeshStandardMaterial({ color: 0xbf9b65, side: THREE.DoubleSide, transparent: true, opacity: 0.6 }));
            ringMesh.rotation.x = Math.PI / 2.5;
            planetGroup.add(ringMesh);
        }

        let moonsArr = [];
        if (data.moons) {
            data.moons.forEach(moonData => {
                const moonPivot = new THREE.Group();
                const moonMesh = new THREE.Mesh(sharedLowPolyGeo, new THREE.MeshStandardMaterial({ color: moonData.color }));
                moonMesh.scale.set(moonData.radius, moonData.radius, moonData.radius);
                moonMesh.position.set(moonData.dist, 0, 0);

                const moonHitbox = new THREE.Mesh(sharedLowPolyGeo, invisibleHitboxMat);
                moonHitbox.scale.set(moonData.radius * 4, moonData.radius * 4, moonData.radius * 4);
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
            const issScale = 0.05;
            const core = new THREE.Mesh(new THREE.CylinderGeometry(issScale*0.8, issScale*0.8, issScale*4, 8), new THREE.MeshStandardMaterial({ color: 0xdddddd }));
            core.rotation.x = Math.PI / 2;
            const panelMat = new THREE.MeshStandardMaterial({ color: 0x2244bb, side: THREE.DoubleSide });
            const p1 = new THREE.Mesh(new THREE.BoxGeometry(issScale*6, issScale*0.2, issScale*1.5), panelMat); p1.position.z = issScale*1.5;
            const p2 = new THREE.Mesh(new THREE.BoxGeometry(issScale*6, issScale*0.2, issScale*1.5), panelMat); p2.position.z = -issScale*1.5;
            issPivot.add(core); issPivot.add(p1); issPivot.add(p2);
            
            issPivot.position.set(data.radius + 0.5, 0, 0); // Distanciado para ser facilmente visível

            const issHitbox = new THREE.Mesh(sharedLowPolyGeo, invisibleHitboxMat);
            issHitbox.scale.set(0.6, 0.6, 0.6);
            issHitbox.position.copy(issPivot.position);
            issHitbox.userData = { ...issData, radius: issScale * 3 };
            
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
    buildNavigationMenu(); // Constrói a aba de navegação
    
    window.addEventListener('resize', onWindowResize);
    let pointerDownPos = new THREE.Vector2();
    renderer.domElement.addEventListener('pointerdown', (e) => pointerDownPos.set(e.clientX, e.clientY));
    renderer.domElement.addEventListener('pointerup', (e) => {
        if (pointerDownPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) < 5) onCanvasClick(e);
    });

    setupUIControls();
}

// --- POPULA O MENU LATERAL (ABA) DINAMICAMENTE ---
function buildNavigationMenu() {
    const list = document.getElementById('astro-list');
    
    // Adiciona cada astro que está configurado em celestialData
    Object.keys(celestialData).forEach(key => {
        const data = celestialData[key];
        const li = document.createElement('li');
        li.textContent = data.name;
        
        li.addEventListener('click', () => {
            // Encontra a malha baseada no ID associado ao userData
            const targetMesh = raycasterObjects.find(obj => obj.userData.id === key);
            if(targetMesh) {
                focusAstro(targetMesh);
            }
        });
        
        list.appendChild(li);
    });
}

function createMilkyWay() {
    const isMobile = window.innerWidth < 768;
    const particles = isMobile ? 25000 : 50000; 

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);
    
    const colorInside = new THREE.Color(0xffeebb);
    const colorOutside = new THREE.Color(0x1133aa);

    for(let i = 0; i < particles; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 6000;
        const spinAngle = radius * 4 / 6000;
        const branchAngle = (i % 5) * ((Math.PI * 2) / 5);

        const scatterX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 300 * (6000/radius);
        const scatterY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 300 * (1 - radius/6000);
        const scatterZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 300 * (6000/radius);

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + scatterX;
        positions[i3 + 1] = scatterY - 800;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + scatterZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / 6000);
        colors[i3] = mixedColor.r; colors[i3 + 1] = mixedColor.g; colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: isMobile ? 12 : 8, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true, transparent: true, opacity: 0.6 });
    galaxyMesh = new THREE.Points(geometry, material);
    galaxyMesh.visible = false;
    scene.add(galaxyMesh);
}

function createOrbitLine(radius) {
    if(radius === 0) return;
    const points = [];
    for (let i = 0; i <= 128; i++) points.push(new THREE.Vector3(Math.cos(i/128 * Math.PI*2) * radius, 0, Math.sin(i/128 * Math.PI*2) * radius));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 })));
}

function createStarfield() {
    const isMobile = window.innerWidth < 768;
    const totalStars = isMobile ? 1500 : 3500;
    const pos = new Float32Array(totalStars * 3);
    for (let i = 0; i < totalStars * 3; i += 3) {
        const r = 1500 + Math.random() * 2000, u = Math.random(), v = Math.random();
        const theta = u * 2 * Math.PI, phi = Math.acos(2 * v - 1);
        pos[i] = r * Math.sin(phi) * Math.cos(theta); pos[i+1] = r * Math.sin(phi) * Math.sin(theta); pos[i+2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 2.0, transparent: true, opacity: 0.6 })));
}

// Interatividade Unificada (Mouse e Lista)
function onCanvasClick(event) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('#info-panel') || event.target.closest('#physics-modal') || event.target.closest('#astro-menu')) return;

    const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(raycasterObjects);
    if (intersects.length > 0) focusAstro(intersects[0].object);
}

// Lógica isolada para permitir ser chamada pelos cliques da lista e do 3D
function focusAstro(mesh) {
    if (focusedPlanetMesh === mesh) {
        resetCamera();
        return;
    }

    const info = mesh.userData;
    focusedPlanetMesh = mesh;
    focusedPlanetMesh.getWorldPosition(previousTargetPos);
    
    const r = info.radius || 1;
    targetCamPos.copy(previousTargetPos).add(new THREE.Vector3(r * 3.0, r * 1.5, r * 4.0));
    
    isLerpingCamera = true;
    controls.enabled = false; 

    document.getElementById('planet-name').textContent = info.name;
    document.getElementById('planet-type').textContent = info.type;
    document.getElementById('planet-dist').textContent = info.distSol;
    document.getElementById('planet-size').textContent = info.size;
    document.getElementById('planet-atm').textContent = info.atm;
    document.getElementById('planet-temp').textContent = info.temp;
    document.getElementById('planet-fact').textContent = info.fact;
    document.getElementById('info-panel').classList.add('visible');
}

function resetCamera() {
    focusedPlanetMesh = null;
    isLerpingCamera = false;
    controls.enabled = true;
    camera.position.set(0, 300, 500);
    controls.target.set(0,0,0);
    document.getElementById('info-panel').classList.remove('visible');
}

function animate() {
    requestAnimationFrame(animate);

    if(galaxyMesh && galaxyMesh.visible) galaxyMesh.rotation.y += 0.0003; 

    planetsSystem.forEach((sys) => {
        if (sys.isSun) {
            sys.mesh.rotation.y += 0.001;
        } else {
            sys.pMesh.rotation.y += 0.005;

            let isFocusedSystem = false;
            if (focusedPlanetMesh) {
                if (sys.pMesh === focusedPlanetMesh) isFocusedSystem = true;
                if (sys.issPivot && sys.issPivot.children.includes(focusedPlanetMesh)) isFocusedSystem = true;
                if (sys.moonsArr.some(m => m.pivot.children.includes(focusedPlanetMesh))) isFocusedSystem = true;
            }

            if (orbitsActive && !isFocusedSystem) {
                sys.group.userData.currentAngle += sys.group.userData.speed;
                sys.group.position.x = Math.cos(sys.group.userData.currentAngle) * sys.group.userData.dist;
                sys.group.position.z = Math.sin(sys.group.userData.currentAngle) * sys.group.userData.dist;
            }

            sys.moonsArr.forEach(moon => {
                moon.mesh.rotation.y += 0.01;
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
            camera.position.lerp(targetCamPos, 0.05); 
            controls.target.lerp(currentTargetPos, 0.05);
            if (camera.position.distanceTo(targetCamPos) < 0.2) { isLerpingCamera = false; controls.enabled = true; }
        } else {
            camera.position.add(delta);
            controls.target.copy(currentTargetPos);
        }
        previousTargetPos.copy(currentTargetPos);
    }

    controls.update();
    renderer.render(scene, camera);
}

function setupUIControls() {
    document.getElementById('close-panel').addEventListener('click', () => document.getElementById('info-panel').classList.remove('visible'));
    document.getElementById('btn-reset').addEventListener('click', resetCamera);
    document.getElementById('btn-view').addEventListener('click', () => { resetCamera(); camera.position.set(0, 800, 0.1); });

    const btnGalaxy = document.getElementById('btn-toggle-galaxy');
    btnGalaxy.addEventListener('click', () => {
        galaxyMesh.visible = !galaxyMesh.visible;
        btnGalaxy.classList.toggle('active');
        btnGalaxy.innerText = galaxyMesh.visible ? "Via-Láctea: ON" : "Via-Láctea: OFF";
        if(galaxyMesh.visible) camera.position.set(0, 1000, 1500);
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
