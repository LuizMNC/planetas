const textureLoader = new THREE.TextureLoader();

// --- SISTEMA DE ESCALA VOLUMÉTRICA PROPORCIONAL ---
// Terra = 1.0 Raio. O Sol em proporção real tem 109 Raios Terrestres.
// Distâncias foram ajustadas logaritmicamente para evitar o vazio absoluto.

const issData = { id: 'iss', name: "Estação Espacial Internacional", type: "Laboratório Espacial", distSol: "400 km de Altitude Terrestre", size: "109 metros", atm: "Vácuo", temp: "Varia de -157°C a 121°C", fact: "Completa uma volta na Terra a cada 90 minutos a 28.000 km/h." };

const celestialData = {
    sun: { name: "Sol", type: "Estrela", radius: 109.0, dist: 0, speed: 0, color: 0xffdd00, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg', data: { distSol: "0 km", size: "1.392.700 km (Escala Real de Volume)", atm: "Plasma", temp: "5.500°C", fact: "A gravidade esmagadora no núcleo funde hidrogênio em hélio, criando luz." } },
    mercury: { name: "Mercúrio", type: "Planeta Rochoso", radius: 0.38, dist: 150, speed: 0.04, color: 0x888888, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/moon_1024.jpg', data: { distSol: "57,9 M km", size: "4.879 km", atm: "Exosfera", temp: "-173°C a 427°C", fact: "É o menor planeta do sistema, mas possui o núcleo de ferro mais denso." } },
    venus: { name: "Vênus", type: "Planeta Rochoso", radius: 0.95, dist: 200, speed: 0.015, color: 0xe3bb76, textureUrl: null, data: { distSol: "108,2 M km", size: "12.104 km", atm: "Dióxido de Carbono Densa", temp: "464°C", fact: "Possui uma pressão atmosférica 90 vezes maior que a da Terra." } },
    earth: { name: "Terra", type: "Planeta Rochoso", radius: 1.0, dist: 280, speed: 0.01, color: 0x2233ff, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg', hasISS: true, 
        moons: [ { id: 'moon', name: "Lua", radius: 0.27, dist: 15.0, speed: 0.03, color: 0xcccccc, data: { distSol: "384.400 km da Terra", size: "3.474 km", atm: "Nenhuma", temp: "-173 a 127°C", fact: "Sincronia de maré faz com que mostre sempre a mesma face para nós." } } ],
        data: { distSol: "149,6 M km (1 UA)", size: "12.742 km", atm: "Nitrogênio e Oxigênio", temp: "15°C", fact: "Sua inclinação axial gera as quatro estações climáticas." } },
    mars: { name: "Marte", type: "Planeta Rochoso", radius: 0.53, dist: 380, speed: 0.008, color: 0xc1440e, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/mars_1k_color.jpg', 
        moons: [ { id: 'phobos', name: "Fobos", radius: 0.15, dist: 3.0, speed: 0.05, color: 0x887766, data: { distSol: "Órbita marciana", size: "22 km", atm: "Nenhuma", temp: "-40°C", fact: "Orbita tão rápido que nasce no oeste e se põe no leste marciano." } },
                 { id: 'deimos', name: "Deimos", radius: 0.1, dist: 6.0, speed: 0.03, color: 0x999999, data: { distSol: "Órbita marciana", size: "12 km", atm: "Nenhuma", temp: "-40°C", fact: "Provavelmente é um asteroide capturado pela gravidade do planeta." } } ],
        data: { distSol: "227,9 M km", size: "6.779 km", atm: "Fina (CO2)", temp: "-62°C", fact: "Sua coloração vem da alta concentração de óxido de ferro." } },
    jupiter: { name: "Júpiter", type: "Gigante Gasoso", radius: 11.2, dist: 580, speed: 0.002, color: 0xb07f35, textureUrl: null, 
        moons: [ { id: 'io', name: "Io", radius: 0.28, dist: 16.0, speed: 0.06, color: 0xffffaa, data: { distSol: "Órbita jupiteriana", size: "3.642 km", atm: "Enxofre", temp: "-130°C", fact: "Vulcanismo intenso causado pela gigantesca força de maré de Júpiter." } },
                 { id: 'europa', name: "Europa", radius: 0.24, dist: 20.0, speed: 0.04, color: 0xffffff, data: { distSol: "Órbita jupiteriana", size: "3.121 km", atm: "Oxigênio", temp: "-160°C", fact: "Sob sua crosta de gelo existe um imenso oceano líquido." } } ],
        data: { distSol: "778,5 M km", size: "139.820 km", atm: "Hidrogênio e Hélio", temp: "-108°C", fact: "Tem volume suficiente para engolir 1.300 Terras de uma vez." } },
    saturn: { name: "Saturno", type: "Gigante Gasoso", radius: 9.4, dist: 850, speed: 0.0009, color: 0xe2bf7d, textureUrl: null, hasRings: true, 
        moons: [ { id: 'titan', name: "Titã", radius: 0.4, dist: 22.0, speed: 0.02, color: 0xddaa55, data: { distSol: "Órbita saturniana", size: "5.149 km", atm: "Nitrogênio espesso", temp: "-179°C", fact: "A atmosfera é tão espessa que a pressão na superfície é maior que na Terra." } } ],
        data: { distSol: "1,4 B km", size: "116.460 km", atm: "Hidrogênio e Hélio", temp: "-139°C", fact: "O sistema de anéis cobre uma área gigantesca, mas tem apenas 10m de espessura." } },
    uranus: { name: "Urano", type: "Gigante de Gelo", radius: 4.0, dist: 1200, speed: 0.0004, color: 0x71b2c9, textureUrl: null, 
        data: { distSol: "2,9 B km", size: "50.724 km", atm: "Metano, Hidrogênio", temp: "-197°C", fact: "Seu núcleo de gelo o torna o planeta mais frio fisicamente documentado." } },
    neptune: { name: "Netuno", type: "Gigante de Gelo", radius: 3.9, dist: 1550, speed: 0.0001, color: 0x274687, textureUrl: null, 
        moons: [ { id: 'triton', name: "Tritão", radius: 0.21, dist: 12.0, speed: 0.02, color: 0xbbbbbb, data: { distSol: "Órbita netuniana", size: "2.706 km", atm: "Nitrogênio", temp: "-235°C", fact: "Possui gêiseres criovulcânicos que cospem nitrogênio líquido." } } ],
        data: { distSol: "4,5 B km", size: "49.244 km", atm: "Metano, Hidrogênio", temp: "-201°C", fact: "Ventos em Netuno quebram a barreira do som no padrão da Terra." } }
};

let scene, camera, renderer, controls;
let planetsSystem = [];
let raycasterObjects = [];
let galaxyMesh = null;

// Foco Câmera
let focusedPlanetMesh = null;
let previousTargetPos = new THREE.Vector3();
let targetCamPos = new THREE.Vector3();
let isLerpingCamera = false;

// Cinemática
let orbitsActive = true;
let moonsActive = true;
let issActive = true;

const infoPanel = document.getElementById('info-panel');
const container = document.getElementById('canvas-container');

function init() {
    scene = new THREE.Scene();
    
    // Frustum drástico: Do milímetro espacial até 10000 unidades (Para enxergar a Galáxia)
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 15000);
    camera.position.set(0, 400, 700);

    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true }); // Corrige Z-Fighting devido à escala imensa
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 6000;
    controls.minDistance = 0.05; // Permite entrar nas crateras da Lua e na ISS

    scene.add(new THREE.AmbientLight(0x444444));
    scene.add(new THREE.PointLight(0xffffff, 3.5, 3000)); // Luz solar hiper-brilhante

    // Inicializa a Estrutura Espacial
    Object.keys(celestialData).forEach((key) => {
        const data = celestialData[key];

        if (key === 'sun') {
            const sunMat = new THREE.MeshBasicMaterial({ color: data.color });
            const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 64, 64), sunMat);
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
        const pMesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 64, 64), pMat);
        pMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius };
        raycasterObjects.push(pMesh);
        planetGroup.add(pMesh);

        if (data.hasRings) {
            const ringMesh = new THREE.Mesh(new THREE.RingGeometry(data.radius * 1.5, data.radius * 2.8, 128), new THREE.MeshStandardMaterial({ color: 0xbf9b65, side: THREE.DoubleSide, transparent: true, opacity: 0.6 }));
            ringMesh.rotation.x = Math.PI / 2.5;
            planetGroup.add(ringMesh);
        }

        let moonsArr = [];
        if (data.moons) {
            data.moons.forEach(moonData => {
                const moonPivot = new THREE.Group();
                const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(moonData.radius, 32, 32), new THREE.MeshStandardMaterial({ color: moonData.color }));
                moonMesh.position.set(moonData.dist, 0, 0);

                // Hitbox expansiva logarítmica
                const moonHitbox = new THREE.Mesh(new THREE.SphereGeometry(moonData.radius * 4, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
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
            
            // ISS em Escala Absurda (Ajustada minimamente para renderizar)
            const issScale = 0.02;
            const core = new THREE.Mesh(new THREE.CylinderGeometry(issScale*0.8, issScale*0.8, issScale*4, 8), new THREE.MeshStandardMaterial({ color: 0xdddddd }));
            core.rotation.x = Math.PI / 2;
            const panelMat = new THREE.MeshStandardMaterial({ color: 0x2244bb, side: THREE.DoubleSide });
            const p1 = new THREE.Mesh(new THREE.BoxGeometry(issScale*6, issScale*0.2, issScale*1.5), panelMat); p1.position.z = issScale*1.5;
            const p2 = new THREE.Mesh(new THREE.BoxGeometry(issScale*6, issScale*0.2, issScale*1.5), panelMat); p2.position.z = -issScale*1.5;
            
            issPivot.add(core); issPivot.add(p1); issPivot.add(p2);
            
            // Posiciona raspando a atmosfera terrestre (Raio Terra 1.0 + 0.05 Altitude)
            issPivot.position.set(data.radius + 0.05, 0, 0);

            const issHitbox = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
            issHitbox.position.copy(issPivot.position);
            issHitbox.userData = { ...issData, radius: issScale * 2 };
            
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
    let pointerDownPos = new THREE.Vector2();
    renderer.domElement.addEventListener('pointerdown', (e) => pointerDownPos.set(e.clientX, e.clientY));
    renderer.domElement.addEventListener('pointerup', (e) => {
        if (pointerDownPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) < 5) onPlanetClick(e);
    });

    setupUIControls();
}

// Geração Procedural da Via-Láctea (Espiral Logarítmica e Colorida)
function createMilkyWay() {
    const particles = 80000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);
    
    const colorInside = new THREE.Color(0xffeebb); // Núcleo amarelado denso
    const colorOutside = new THREE.Color(0x1133aa); // Braços azuis gélidos

    const arms = 5;
    const armSpin = 4;
    const galaxyRadius = 6000;
    const galaxyThickness = 300;

    for(let i = 0; i < particles; i++) {
        const i3 = i * 3;
        const radius = Math.random() * galaxyRadius;
        const spinAngle = radius * armSpin / galaxyRadius;
        const branchAngle = (i % arms) * ((Math.PI * 2) / arms);

        // Dispersão parabólica para dar volume natural ao disco
        const scatterX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 300 * (galaxyRadius/radius);
        const scatterY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * galaxyThickness * (1 - radius/galaxyRadius);
        const scatterZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 300 * (galaxyRadius/radius);

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + scatterX;
        positions[i3 + 1] = scatterY - 1000; // Galáxia posicionada fisicamente "abaixo" do plano solar
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + scatterZ;

        // Interpolação radial de cores
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / galaxyRadius);
        colors[i3] = mixedColor.r; colors[i3 + 1] = mixedColor.g; colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: 10, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true, transparent: true, opacity: 0.7 });

    galaxyMesh = new THREE.Points(geometry, material);
    galaxyMesh.visible = false;
    scene.add(galaxyMesh);
}

function createOrbitLine(radius) {
    if(radius === 0) return;
    const points = [];
    for (let i = 0; i <= 256; i++) points.push(new THREE.Vector3(Math.cos(i/256 * Math.PI*2) * radius, 0, Math.sin(i/256 * Math.PI*2) * radius));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05 })));
}

function createStarfield() {
    const pos = new Float32Array(4000 * 3);
    for (let i = 0; i < 12000; i += 3) {
        const r = 2000 + Math.random() * 2000, u = Math.random(), v = Math.random();
        const theta = u * 2 * Math.PI, phi = Math.acos(2 * v - 1);
        pos[i] = r * Math.sin(phi) * Math.cos(theta); pos[i+1] = r * Math.sin(phi) * Math.sin(theta); pos[i+2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 2.0, transparent: true, opacity: 0.6 })));
}

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
        
        // Offset Dinâmico Inteligente de Câmera baseado no tamanho da estrutura real!
        const r = info.radius || 1;
        targetCamPos.copy(previousTargetPos).add(new THREE.Vector3(r * 2.5, r * 1.5, r * 3.5));
        
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
    camera.position.set(0, 400, 700);
    controls.target.set(0,0,0);
    infoPanel.classList.remove('visible');
}

function animate() {
    requestAnimationFrame(animate);

    if(galaxyMesh && galaxyMesh.visible) {
        galaxyMesh.rotation.y += 0.0005; // Galáxia rotacionando majestosamente e muito devagar
    }

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
                sys.issPivot.rotation.y += 0.1; // ISS Orbita em velocidade extrema
                sys.issPivot.rotation.x += 0.02;
            }
        }
    });

    if (focusedPlanetMesh) {
        const currentTargetPos = new THREE.Vector3();
        focusedPlanetMesh.getWorldPosition(currentTargetPos);
        const delta = new THREE.Vector3().subVectors(currentTargetPos, previousTargetPos);

        if (isLerpingCamera) {
            targetCamPos.add(delta); 
            camera.position.lerp(targetCamPos, 0.05); // Interpolação suave e cinematográfica
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
    document.getElementById('close-panel').addEventListener('click', () => infoPanel.classList.remove('visible'));
    document.getElementById('btn-reset').addEventListener('click', resetCamera);
    document.getElementById('btn-view').addEventListener('click', () => { resetCamera(); camera.position.set(0, 1000, 0.1); });

    // Alternar Galáxia
    const btnGalaxy = document.getElementById('btn-toggle-galaxy');
    btnGalaxy.addEventListener('click', () => {
        galaxyMesh.visible = !galaxyMesh.visible;
        btnGalaxy.classList.toggle('active');
        btnGalaxy.innerText = galaxyMesh.visible ? "Via-Láctea: ON" : "Via-Láctea: OFF";
        if(galaxyMesh.visible) {
            camera.position.set(0, 1500, 2000); // Afasta a visão para abraçar o cosmos
        }
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
