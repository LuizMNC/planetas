const textureLoader = new THREE.TextureLoader();
// (Mantenha o seu issData e celestialData intactos aqui...)

let scene, camera, renderer, controls;
let planetsSystem = [];
let raycasterObjects = [];
let galaxyMesh = null;
let starMesh = null; // Para atualizar o shader de tempo

let focusedPlanetMesh = null;
let previousTargetPos = new THREE.Vector3();
let targetCamPos = new THREE.Vector3();
let isLerpingCamera = false;
let clock = new THREE.Clock(); // Necessário para controlar os Shaders no tempo

let orbitsActive = true;
let moonsActive = true;
let issActive = true;

const sharedSphereGeo = new THREE.SphereGeometry(1, 64, 64); // Aumentado polígonos para melhor edge fresnel
const sharedLowPolyGeo = new THREE.SphereGeometry(1, 16, 16);
const invisibleHitboxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });

// --- SHADERS DO EFEITO ATMOSFÉRICO (FRESNEL) ---
const atmosVertexShader = `
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const atmosFragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    uniform vec3 color;
    void main() {
        // Cálculo do Fresnel: maior intensidade nas bordas, menor no centro
        float intensity = pow(0.55 - dot(vNormal, vPositionNormal), 3.5);
        gl_FragColor = vec4(color, 1.0) * intensity;
    }
`;

// --- SHADERS DAS ESTRELAS (TWINKLING) ---
const starVertexShader = `
    attribute float size;
    attribute float aAlpha;
    varying float vAlpha;
    uniform float time;
    void main() {
        // Função seno atrelada ao tempo para criar cintilação sutil
        vAlpha = aAlpha * (0.6 + 0.4 * sin(time * 1.5 + aAlpha * 20.0));
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const starFragmentShader = `
    varying float vAlpha;
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha);
    }
`;

function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 15000);
    camera.position.set(0, 300, 500);

    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Polimento: Mapeamento de tom fotorealista
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 6000;
    controls.minDistance = 0.05;

    // Polimento: Luz principal vindo do centro com decaimento físico (decay)
    scene.add(new THREE.AmbientLight(0x111122, 1.5)); // Azul escuro para sombras do espaço
    const sunLight = new THREE.PointLight(0xffffff, 5.0, 4000, 1);
    scene.add(sunLight);

    Object.keys(celestialData).forEach((key) => {
        const data = celestialData[key];

        if (key === 'sun') {
            // Material do Sol: Emissivo para parecer incandescente e não sofrer sombras
            const sunMat = new THREE.MeshStandardMaterial({ 
                color: data.color, emissive: data.color, emissiveIntensity: 1.2, 
                map: textureLoader.load(data.textureUrl) 
            });
            const sunMesh = new THREE.Mesh(sharedSphereGeo, sunMat);
            sunMesh.scale.set(data.radius, data.radius, data.radius);
            sunMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius };
            
            // Polimento: Corona Solar Procedural (Glow Effect performático via Sprite)
            const spriteMat = new THREE.SpriteMaterial({ 
                map: createRadialGradient(), blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8 
            });
            const corona = new THREE.Sprite(spriteMat);
            corona.scale.set(data.radius * 3.5, data.radius * 3.5, 1);
            sunMesh.add(corona);

            scene.add(sunMesh);
            raycasterObjects.push(sunMesh);
            planetsSystem.push({ isSun: true, mesh: sunMesh });
            return;
        }

        const planetGroup = new THREE.Group();
        planetGroup.userData.currentAngle = Math.random() * Math.PI * 2;
        planetGroup.userData.speed = data.speed;
        planetGroup.userData.dist = data.dist;

        // Polimento: Distinção de materiais (Metálico/Árido)
        let matConfig = { roughness: 0.9, metalness: 0.0 }; // Rochoso Padrão
        if (key === 'earth') matConfig = { roughness: 0.6, metalness: 0.3 }; // Oceanos refletem
        if (data.type.includes("Gasoso")) matConfig = { roughness: 0.4, metalness: 0.1 };

        let pMat = data.textureUrl 
            ? new THREE.MeshStandardMaterial({ map: textureLoader.load(data.textureUrl), ...matConfig }) 
            : new THREE.MeshStandardMaterial({ color: data.color, ...matConfig });
        
        const pMesh = new THREE.Mesh(sharedSphereGeo, pMat);
        pMesh.scale.set(data.radius, data.radius, data.radius);
        pMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius };
        raycasterObjects.push(pMesh);
        planetGroup.add(pMesh);

        // Polimento: Efeito Atmosférico (Fresnel)
        if (key === 'earth' || key === 'venus') {
            const atmColor = key === 'earth' ? new THREE.Color(0x3388ff) : new THREE.Color(0xffaa55);
            const atmMat = new THREE.ShaderMaterial({
                vertexShader: atmosVertexShader, fragmentShader: atmosFragmentShader,
                uniforms: { color: { value: atmColor } },
                blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true
            });
            const atmMesh = new THREE.Mesh(sharedSphereGeo, atmMat);
            atmMesh.scale.set(data.radius * 1.15, data.radius * 1.15, data.radius * 1.15);
            planetGroup.add(atmMesh);
        }

        // --- Restante das Luas e Anéis continuam iguais, apenas adicionando userData.id na lua hitboxes ---
        if (data.hasRings) {
            const ringMesh = new THREE.Mesh(new THREE.RingGeometry(data.radius * 1.5, data.radius * 2.8, 64), new THREE.MeshStandardMaterial({ color: 0xbf9b65, side: THREE.DoubleSide, transparent: true, opacity: 0.6 }));
            ringMesh.rotation.x = Math.PI / 2.5;
            planetGroup.add(ringMesh);
        }

        let moonsArr = [];
        if (data.moons) {
            data.moons.forEach(moonData => {
                const moonPivot = new THREE.Group();
                const moonMesh = new THREE.Mesh(sharedLowPolyGeo, new THREE.MeshStandardMaterial({ color: moonData.color, roughness: 1.0 }));
                moonMesh.scale.set(moonData.radius, moonData.radius, moonData.radius);
                moonMesh.position.set(moonData.dist, 0, 0);

                // Tidal Locking passivo: Ao ser filha do Pivot que gira e não girar localmente,
                // a face sempre apontará para o (0,0,0) do Pivot (que é o Planeta).

                const moonHitbox = new THREE.Mesh(sharedLowPolyGeo, invisibleHitboxMat);
                moonHitbox.scale.set(moonData.radius * 4, moonData.radius * 4, moonData.radius * 4);
                moonHitbox.position.copy(moonMesh.position);
                moonHitbox.userData = { id: moonData.id, ...moonData.data, name: moonData.name, type: "Satélite Natural", radius: moonData.radius };
                
                moonPivot.add(moonMesh); moonPivot.add(moonHitbox);
                raycasterObjects.push(moonHitbox); planetGroup.add(moonPivot);
                moonsArr.push({ pivot: moonPivot, mesh: moonMesh, speed: moonData.speed });
            });
        }

        let issPivot;
        if (data.hasISS) {
            issPivot = new THREE.Group();
            const issScale = 0.05;
            // Polimento ISS: Alto metalness para refletir o sol brutalmente
            const coreMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 1.0, roughness: 0.2 });
            const core = new THREE.Mesh(new THREE.CylinderGeometry(issScale*0.8, issScale*0.8, issScale*4, 8), coreMat);
            core.rotation.x = Math.PI / 2;
            const panelMat = new THREE.MeshStandardMaterial({ color: 0x112255, metalness: 0.8, roughness: 0.3, side: THREE.DoubleSide });
            const p1 = new THREE.Mesh(new THREE.BoxGeometry(issScale*6, issScale*0.2, issScale*1.5), panelMat); p1.position.z = issScale*1.5;
            const p2 = new THREE.Mesh(new THREE.BoxGeometry(issScale*6, issScale*0.2, issScale*1.5), panelMat); p2.position.z = -issScale*1.5;
            issPivot.add(core); issPivot.add(p1); issPivot.add(p2);
            
            issPivot.position.set(data.radius + 0.5, 0, 0);

            const issHitbox = new THREE.Mesh(sharedLowPolyGeo, invisibleHitboxMat);
            issHitbox.scale.set(0.6, 0.6, 0.6);
            issHitbox.position.copy(issPivot.position);
            issHitbox.userData = { id: 'iss', ...issData, radius: issScale * 3 };
            
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
    
    // Conecta botões do HTML via "data-target"
    document.querySelectorAll('.astro-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-target');
            const targetMesh = raycasterObjects.find(obj => obj.userData.id === targetId);
            if (targetMesh) focusAstro(targetMesh);
        });
    });
    
    window.addEventListener('resize', onWindowResize);
    let pointerDownPos = new THREE.Vector2();
    renderer.domElement.addEventListener('pointerdown', (e) => pointerDownPos.set(e.clientX, e.clientY));
    renderer.domElement.addEventListener('pointerup', (e) => {
        if (pointerDownPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) < 5) onCanvasClick(e);
    });

    setupUIControls();
}

// Utilitário performático: Corona Solar sem pesar no shader
function createRadialGradient() {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(255, 230, 100, 0.8)');
    grad.addColorStop(0.6, 'rgba(255, 100, 0, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
}

function createMilkyWay() {
    const isMobile = window.innerWidth < 768;
    const particles = isMobile ? 25000 : 50000; 

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);
    
    const colorInside = new THREE.Color(0xffcc88);
    const colorOutside = new THREE.Color(0x112266);

    for(let i = 0; i < particles; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 6000;
        const spinAngle = radius * 4 / 6000;
        const branchAngle = (i % 5) * ((Math.PI * 2) / 5);

        const scatterX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 400 * (6000/radius);
        const scatterY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 300 * (1 - radius/6000);
        const scatterZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 400 * (6000/radius);

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + scatterX;
        positions[i3 + 1] = scatterY - 800;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + scatterZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / 6000);
        
        // Polimento: "Poeira interestelar" - aleatorizar a intensidade da cor para simular nuvens escuras/claras
        const brightness = Math.random() * 0.8 + 0.2; 
        colors[i3] = mixedColor.r * brightness; 
        colors[i3 + 1] = mixedColor.g * brightness; 
        colors[i3 + 2] = mixedColor.b * brightness;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: isMobile ? 12 : 8, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true, transparent: true, opacity: 0.6 });
    galaxyMesh = new THREE.Points(geometry, material);
    galaxyMesh.visible = false;
    scene.add(galaxyMesh);
}

function createStarfield() {
    const isMobile = window.innerWidth < 768;
    const totalStars = isMobile ? 1500 : 3500;
    const pos = new Float32Array(totalStars * 3);
    const alphas = new Float32Array(totalStars);
    const sizes = new Float32Array(totalStars);

    for (let i = 0; i < totalStars; i++) {
        const r = 1500 + Math.random() * 2000, u = Math.random(), v = Math.random();
        const theta = u * 2 * Math.PI, phi = Math.acos(2 * v - 1);
        pos[i*3] = r * Math.sin(phi) * Math.cos(theta); 
        pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta); 
        pos[i*3+2] = r * Math.cos(phi);
        alphas[i] = Math.random();
        sizes[i] = Math.random() * 2.5 + 0.5;
    }
    const geo = new THREE.BufferGeometry(); 
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const shaderMat = new THREE.ShaderMaterial({
        vertexShader: starVertexShader, fragmentShader: starFragmentShader,
        uniforms: { time: { value: 0.0 } },
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    });

    starMesh = new THREE.Points(geo, shaderMat);
    scene.add(starMesh);
}

// ... [Mantenha createOrbitLine, onCanvasClick, focusAstro, resetCamera e setupUIControls inalterados] ...

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (starMesh) starMesh.material.uniforms.time.value = elapsedTime;
    if (galaxyMesh && galaxyMesh.visible) galaxyMesh.rotation.y += 0.0003; 

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
                // Matemática de Rotação Síncrona: A rotação intrínseca da Lua ao redor do próprio eixo
                // foi removida. O mesh fica estático em relação ao 'pivot' que orbita o planeta.
                if (moonsActive) moon.pivot.rotation.y += moon.speed;
            });

            if (sys.issPivot && issActive) {
                sys.issPivot.rotation.y += 0.05; 
                // ISS estabilizada no próprio eixo para os painéis receberem sol consistentemente
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

// ... [Mantenha onWindowResize e o final do script inalterados] ...
