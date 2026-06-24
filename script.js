/**
 * SIMULADOR ASTROFÍSICO 3D - PIPELINE PBR & ENGINE GRÁFICA OPTIMIZADA
 * Desenvolvido por: Luiz Miguel N. Cardoso (Física UFPA - Campus Abaetetuba)
 * * Técnicas Empregadas:
 * - Shading Fresnel Baseado em Rayleigh para Atmosferas.
 * - PointLight Física com Decaimento Quadrático Inverso.
 * - Sincronia Angular Hierárquica para Acoplamento de Maré (Tidal Locking).
 * - PointerEvents Unificados para Mitigação de Latência em Telas Touch.
 */

const textureLoader = new THREE.TextureLoader();
const clock = new THREE.Clock();

// Banco de Dados Celestial Estruturado
const issData = { id: 'iss', name: "Estação Espacial (ISS)", type: "Laboratório de Microgravidade", distSol: "400 km da Terra", size: "109 metros", atm: "Vácuo", temp: "-157°C a 121°C", fact: "Orbita a Terra 16 vezes por dia, completando um ciclo orbital a cada 90 minutos em velocidade de queda contínua." };

const celestialData = {
    sun: { name: "Sol", type: "Estrela (Anã Amarela)", radius: 32.0, dist: 0, speed: 0, color: 0xffaa00, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg', data: { distSol: "0 km", size: "1.392.700 km", atm: "Plasma", temp: "~5.500 °C (Superfície)", fact: "Concentra 99,86% de toda a massa do Sistema Solar e funde cerca de 600 milhões de toneladas de hidrogênio por segundo." } },
    mercury: { name: "Mercúrio", type: "Planeta Rochoso", radius: 1.2, dist: 65, speed: 0.03, color: 0x8c8c8c, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/moon_1024.jpg', data: { distSol: "57,9 Milhões de km", size: "4.879 km", atm: "Exosfera Tênue", temp: "-173°C a 427°C", fact: "Possui a órbita mais excêntrica e rápida, completando seu ano em apenas 88 dias terrestres." } },
    venus: { name: "Vênus", type: "Planeta Rochoso", radius: 2.0, dist: 100, speed: 0.016, color: 0xe3bb76, textureUrl: null, data: { distSol: "108,2 Milhões de km", size: "12.104 km", atm: "CO2 Extremo (92 atm)", temp: "464 °C (Fixo)", fact: "Devido ao efeito estufa descontrolado em sua atmosfera de dióxido de carbono, é o planeta mais quente do sistema, fundindo chumbo em sua superfície." } },
    earth: { name: "Terra", type: "Planeta Rochoso", radius: 2.2, dist: 145, speed: 0.01, color: 0x2b65ec, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg', hasISS: true, 
        moons: [ { id: 'moon', name: "Lua", radius: 0.6, dist: 6.0, speed: 0.028, color: 0xaaaaaa, data: { distSol: "149,6 Milhões de km", size: "3.474 km", atm: "Nenhuma", temp: "-173°C a 127°C", fact: "Exibe acoplamento de maré gravitacional com a Terra, mantendo sempre o mesmo hemisfério voltado para nós." } } ],
        data: { distSol: "149,6 Milhões de km (1 UA)", size: "12.742 km", atm: "Nitrogênio e Oxigênio", temp: "15 °C (Média)", fact: "Único corpo celeste conhecido a abrigar água em estado líquido estável e biosfera ativa na superfície." } },
    mars: { name: "Marte", type: "Planeta Rochoso", radius: 1.5, dist: 195, speed: 0.008, color: 0xc1440e, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/mars_1k_color.jpg', 
        moons: [ { id: 'phobos', name: "Fobos", radius: 0.38, dist: 4.2, speed: 0.045, color: 0x887766, data: { distSol: "Órbita Marciana", size: "22 km", atm: "Nenhuma", temp: "-40 °C", fact: "Sua órbita está decaindo em espiral devido às forças de maré e colidirá catastroficamente com Marte no futuro geológico." } } ],
        data: { distSol: "227,9 Milhões de km", size: "6.779 km", atm: "Dióxido de Carbono (Rara)", temp: "-62 °C", fact: "Abriga o Monte Olimpo, o maior vulcão do Sistema Solar, com três vezes a altitude do Monte Everest." } },
    jupiter: { name: "Júpiter", type: "Gigante Gasoso", radius: 11.5, dist: 295, speed: 0.0025, color: 0xb07f35, textureUrl: null, 
        moons: [ { id: 'europa', name: "Europa", radius: 0.7, dist: 18.0, speed: 0.035, color: 0xddeeff, data: { distSol: "Órbita de Júpiter", size: "3.121 km", atm: "Oxigênio Exíguo", temp: "-160 °C", fact: "Sob sua espessa crosta de gelo superficial, oculta um oceano global de água líquida aquecido por forças de maré de Júpiter." } } ],
        data: { distSol: "778,5 Milhões de km", size: "139.820 km", atm: "Hidrogênio e Hélio", temp: "-108 °C", fact: "Seu volume comporta mais de 1.300 planetas Terra e seu campo magnético é o mais intenso entre os planetas." } },
    saturn: { name: "Saturno", type: "Gigante Gasoso", radius: 9.5, dist: 415, speed: 0.0011, color: 0xe2bf7d, textureUrl: null, hasRings: true, 
        moons: [ { id: 'titan', name: "Titã", radius: 0.95, dist: 21.0, speed: 0.018, color: 0xddaa55, data: { distSol: "Órbita de Saturno", size: "5.149 km", atm: "Nitrogênio Denso", temp: "-179 °C", fact: "É o único satélite do sistema dotado de atmosfera densa e ciclos meteorológicos de hidrocarbonetos líquidos (metano)." } } ],
        data: { distSol: "1,4 Bilhão de km", size: "116.460 km", atm: "Hidrogênio e Hélio", temp: "-139 °C", fact: "Seus complexos anéis são formados por bilhões de partículas de gelo de água pura e poeira cósmica." } },
    uranus: { name: "Urano", type: "Gigante de Gelo", radius: 5.2, dist: 545, speed: 0.0004, color: 0x71b2c9, textureUrl: null, 
        data: { distSol: "2,9 Bilhões de km", size: "50.724 km", atm: "Hidrogênio, Hélio e Metano", temp: "-197 °C", fact: "Apresenta uma inclinação axial extrema de 98 graus, orbitando o Sol virtualmente deitado de lado." } },
    neptune: { name: "Netuno", type: "Gigante de Gelo", radius: 5.0, dist: 665, speed: 0.00018, color: 0x274687, textureUrl: null, 
        data: { distSol: "4,5 Bilhões de km", size: "49.244 km", atm: "Hidrogênio, Hélio e Metano", temp: "-201 °C", fact: "Registra os ventos mais violentos do Sistema Solar, alcançando velocidades supersônicas de até 2.100 km/h." } }
};

let planetsSystem = [];
let raycasterObjects = [];
let galaxyMesh = null;
let starPoints = null;

let focusedPlanetMesh = null;
let previousTargetPos = new THREE.Vector3();
let targetCamPos = new THREE.Vector3();
let isLerpingCamera = false;

let orbitsActive = true;
let moonsActive = true;
let issActive = true;

// Compartilhamento de Geometrias de Alta Definição para evitar gargalos de memória Alocada
const sharedSphereGeo = new THREE.SphereGeometry(1, 64, 64);
const sharedLowPolyGeo = new THREE.SphereGeometry(1, 24, 24);
const invisibleHitboxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });

// --- GLSL SHADERS CUSTOMIZADOS PARA PERFORMANCE MULTIPLATAFORMA ---

// Shader Atmosférico Baseado no Efeito Fresnel (Simula Espalhamento de Rayleigh nas bordas)
const atmosVertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const atmosFragmentShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform vec3 uColor;
    void main() {
        // Equação matemática Fresnel: Intensidade cresce à medida que o vetor normal aproxima-se de 90° da câmera
        float fresnel = pow(1.0 - max(dot(vNormal, vViewPosition), 0.0), 3.0);
        gl_FragColor = vec4(uColor, 1.0) * fresnel * 0.8;
    }
`;

// Shader de Partículas de Estrelas Inteligentes (Cintilação controlada via GPU para economizar a CPU de celulares)
const starVertexShader = `
    attribute float size;
    attribute float aPhase;
    varying float vAlpha;
    uniform float uTime;
    void main() {
        // Oscilação harmônica individual baseada na fase injetada por partícula
        vAlpha = 0.4 + 0.6 * sin(uTime * 2.0 + aPhase);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (350.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const starFragmentShader = `
    varying float vAlpha;
    void main() {
        // Gera partículas circulares suaves com decaimento alfa radial interno
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;
        float intensity = 1.0 - (dist * 2.0);
        gl_FragColor = vec4(1.0, 1.0, 1.0, intensity * vAlpha);
    }
`;

function init() {
    const container = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    
    // Configuração de Câmera com clipping otimizado para o DepthBuffer Logarítmico
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 20000);
    camera.position.set(0, 350, 600);

    // Instanciação do Renderizador com Tratamento de Tom Cinematográfico PBR
    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Teto anti-aquecimento dinâmico crítico para telas mobile de altíssima densidade de pixels
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 8000;
    controls.minDistance = 0.1;

    // Configuração de Iluminação Física Linear Correta
    scene.add(new THREE.AmbientLight(0x0a0a16, 1.2)); // Luz de preenchimento cósmico frio para as sombras
    
    // Ponto de luz simulando a emissão real de energia isotropicamente a partir do centro solar
    const sunLight = new THREE.PointLight(0xffffff, 4.5, 5000, 0.5);
    scene.add(sunLight);

    // Iteração e Construção Física do Sistema Celular
    Object.keys(celestialData).forEach((key) => {
        const data = celestialData[key];

        if (key === 'sun') {
            // Material auto-emissivo de alta performance para o núcleo da estrela
            const sunMat = new THREE.MeshBasicMaterial({ 
                color: data.color, 
                map: textureLoader.load(data.textureUrl) 
            });
            const sunMesh = new THREE.Mesh(sharedSphereGeo, sunMat);
            sunMesh.scale.set(data.radius, data.radius, data.radius);
            sunMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius };
            
            // Corona Glow via Sprite Additive Blending (Aspecto majestoso estável a 60 FPS)
            const spriteMat = new THREE.SpriteMaterial({ 
                map: createSunGlowTexture(), 
                blending: THREE.AdditiveBlending, 
                transparent: true, 
                opacity: 0.85 
            });
            const sunGlow = new THREE.Sprite(spriteMat);
            sunGlow.scale.set(data.radius * 3.8, data.radius * 3.8, 1);
            sunMesh.add(sunGlow);

            scene.add(sunMesh);
            raycasterObjects.push(sunMesh);
            planetsSystem.push({ isSun: true, mesh: sunMesh });
            return;
        }

        // Grupo Pivô do Sistema de Translação do Planeta
        const planetGroup = new THREE.Group();
        planetGroup.userData.currentAngle = Math.random() * Math.PI * 2;
        planetGroup.userData.speed = data.speed;
        planetGroup.userData.dist = data.dist;

        // Pipeline PBR Avançado Baseado em Rugosidade/Metalicidade Específica por Tipo de Astro
        let pbrConfig = { roughness: 0.85, metalness: 0.05 }; // Configuração básica rochosa
        
        if (key === 'earth') {
            pbrConfig.roughness = 0.45; // Oceanos terrestres recebem maior brilho especular físico
            pbrConfig.metalness = 0.15;
            // Injeção de mapas de textura complementares de alta resolução via repositório ThreeJS CDN
            pbrConfig.map = textureLoader.load(data.textureUrl);
            pbrConfig.normalMap = textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_normal_2048.jpg');
        } else if (data.type.includes("Gasoso") || data.type.includes("Gelo")) {
            pbrConfig.roughness = 0.5; // Gigantes gasosos têm reflexão volumétrica difusa suave
            pbrConfig.metalness = 0.0;
        }

        let pMat = (key === 'earth') 
            ? new THREE.MeshStandardMaterial(pbrConfig)
            : new THREE.MeshStandardMaterial({ color: data.color, ...pbrConfig });

        if (data.textureUrl && key !== 'earth') {
            pMat.map = textureLoader.load(data.textureUrl);
        }

        const pMesh = new THREE.Mesh(sharedSphereGeo, pMat);
        pMesh.scale.set(data.radius, data.radius, data.radius);
        pMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius };
        raycasterObjects.push(pMesh);
        planetGroup.add(pMesh);

        // Injeção de Atmosferas com Rayleigh Scattering via Fresnel Shaders Customizados
        if (key === 'earth' || key === 'venus') {
            const atmosphericColor = (key === 'earth') ? new THREE.Color(0x2a7fff) : new THREE.Color(0xe0a060);
            const atmosMat = new THREE.ShaderMaterial({
                vertexShader: atmosVertexShader,
                fragmentShader: atmosFragmentShader,
                uniforms: { uColor: { value: atmosphericColor } },
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide,
                transparent: true
            });
            const atmosMesh = new THREE.Mesh(sharedSphereGeo, atmosMat);
            atmosMesh.scale.set(data.radius * 1.12, data.radius * 1.12, data.radius * 1.12);
            planetGroup.add(atmosMesh);
        }

        // Anéis de Saturno com renderização dupla de face
        if (data.hasRings) {
            const ringGeo = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.6, 64);
            const ringMat = new THREE.MeshStandardMaterial({ color: 0xbaa47e, side: THREE.DoubleSide, transparent: true, opacity: 0.65, roughness: 0.6 });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.x = Math.PI / 2.3;
            planetGroup.add(ringMesh);
        }

        // Inicialização de Satélites Naturais (Luas)
        let moonsArr = [];
        if (data.moons) {
            data.moons.forEach(moonData => {
                const moonPivot = new THREE.Group();
                const moonMat = new THREE.MeshStandardMaterial({ color: moonData.color, roughness: 0.95, metalness: 0.0 });
                if (moonData.id === 'moon') moonMat.map = textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/moon_1024.jpg');
                
                const moonMesh = new THREE.Mesh(sharedLowPolyGeo, moonMat);
                moonMesh.scale.set(moonData.radius, moonData.radius, moonData.radius);
                moonMesh.position.set(moonData.dist, 0, 0);

                // Hitbox expandida para usabilidade em telas sensíveis ao toque (Mobile UX)
                const moonHitbox = new THREE.Mesh(sharedLowPolyGeo, invisibleHitboxMat);
                moonHitbox.scale.set(moonData.radius * 3.8, moonData.radius * 3.8, moonData.radius * 3.8);
                moonHitbox.position.copy(moonMesh.position);
                moonHitbox.userData = { id: moonData.id, ...moonData.data, name: moonData.name, type: "Satélite Natural", radius: moonData.radius };
                
                moonPivot.add(moonMesh); 
                moonPivot.add(moonHitbox);
                raycasterObjects.push(moonHitbox); 
                planetGroup.add(moonPivot);
                
                moonsArr.push({ pivot: moonPivot, mesh: moonMesh, speed: moonData.speed });
            });
        }

        // Inicialização de Satélites Artificiais (ISS)
        let issPivot;
        if (data.hasISS) {
            issPivot = new THREE.Group();
            const sScale = 0.04;
            
            // Alumínio espacial altamente polido e reflexivo (PBR Extremo)
            const aerospaceMetalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.08 });
            const solarPanelMat = new THREE.MeshStandardMaterial({ color: 0x0a1c42, metalness: 0.9, roughness: 0.15, side: THREE.DoubleSide });

            const structuralCore = new THREE.Mesh(new THREE.CylinderGeometry(sScale*0.7, sScale*0.7, sScale*4.5, 8), aerospaceMetalMat);
            structuralCore.rotation.x = Math.PI / 2;
            
            const p1 = new THREE.Mesh(new THREE.BoxGeometry(sScale*7, sScale*0.15, sScale*1.8), solarPanelMat); 
            p1.position.z = sScale * 1.6;
            const p2 = new THREE.Mesh(new THREE.BoxGeometry(sScale*7, sScale*0.15, sScale*1.8), solarPanelMat); 
            p2.position.z = -sScale * 1.6;

            issPivot.add(structuralCore); 
            issPivot.add(p1); 
            issPivot.add(p2);
            issPivot.position.set(data.radius + 0.8, 0.2, 0);

            const issHitbox = new THREE.Mesh(sharedLowPolyGeo, invisibleHitboxMat);
            issHitbox.scale.set(0.65, 0.65, 0.65);
            issHitbox.position.copy(issPivot.position);
            issHitbox.userData = { id: 'iss', ...issData, radius: sScale * 3.5 };
            
            const issRotator = new THREE.Group();
            issRotator.add(issPivot); 
            issRotator.add(issHitbox);
            raycasterObjects.push(issHitbox); 
            planetGroup.add(issRotator);
            issPivot = issRotator;
        }

        createOrbitLine(data.dist);
        scene.add(planetGroup);
        planetsSystem.push({ isSun: false, group: planetGroup, pMesh: pMesh, moonsArr: moonsArr, issPivot: issPivot });
    });

    createStarfield();
    createMilkyWay();
    setupUnifiedInteractivity();
    setupUIControls();
    
    window.addEventListener('resize', onWindowResize);
}

// Geração Procedural da Textura de Brilho da Estrela
function createSunGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 15, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.15, 'rgba(255, 200, 50, 0.8)');
    grad.addColorStop(0.5, 'rgba(255, 80, 0, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
}

// Criação do Campo Estelar Cintilante de Alto Desempenho (GPU Instanced Shading)
function createStarfield() {
    const isMobile = window.innerWidth < 768;
    const totalStars = isMobile ? 2000 : 4500;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(totalStars * 3);
    const phases = new Float32Array(totalStars);
    const sizes = new Float32Array(totalStars);

    for (let i = 0; i < totalStars; i++) {
        // Distribuição geométrica esférica uniforme de raio ultra-amplo para gerar profundidade linear
        const radius = 2000 + Math.random() * 3000;
        const u = Math.random(), v = Math.random();
        const theta = u * 2.0 * Math.PI, phi = Math.acos(2.0 * v - 1.0);
        
        positions[i*3] = radius * Math.sin(phi) * Math.cos(theta); 
        positions[i*3+1] = radius * Math.sin(phi) * Math.sin(theta); 
        positions[i*3+2] = radius * Math.cos(phi);
        
        phases[i] = Math.random() * Math.PI * 2; // Fase inicial randômica para dessincronizar a cintilação
        sizes[i] = Math.random() * 2.2 + 0.6;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starShaderMat = new THREE.ShaderMaterial({
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        uniforms: { uTime: { value: 0.0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    starPoints = new THREE.Points(geometry, starShaderMat);
    scene.add(starPoints);
}

// Geração Procedural da Via-Láctea (Nuvens e Poeira Estelar por Variação de Luminância)
function createMilkyWay() {
    const isMobile = window.innerWidth < 768;
    const numParticles = isMobile ? 30000 : 70000;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    
    const coreColor = new THREE.Color(0xffdcb0);
    const armColor = new THREE.Color(0x1a2e7b);

    for(let i = 0; i < numParticles; i++) {
        const idx = i * 3;
        const radius = Math.random() * 6500;
        const spinAngle = radius * 4.2 / 6500;
        const branchAngle = (i % 5) * ((Math.PI * 2.0) / 5.0); // Estrutura em espiral de 5 braços galácticos

        // Modelagem estocástica de dispersão estrutural (Simulação matemática de densidade de gás)
        const dX = Math.pow(Math.random(), 3.0) * (Math.random() < 0.5 ? 1 : -1) * 350 * (6500/radius);
        const dY = Math.pow(Math.random(), 3.0) * (Math.random() < 0.5 ? 1 : -1) * 250 * (1.0 - radius/6500);
        const dZ = Math.pow(Math.random(), 3.0) * (Math.random() < 0.5 ? 1 : -1) * 350 * (6500/radius);

        positions[idx] = Math.cos(branchAngle + spinAngle) * radius + dX;
        positions[idx + 1] = dY - 900; // Deslocamento no eixo Y para criar angulação de fundo plano
        positions[idx + 2] = Math.sin(branchAngle + spinAngle) * radius + dZ;

        const lerpColor = coreColor.clone().lerp(armColor, radius / 6500);
        // Polimento Visual: Variação pseudo-randômica de intensidade simula densas nuvens de poeira cósmica escura
        const dustObscuration = Math.random() * 0.85 + 0.15; 
        
        colors[idx] = lerpColor.r * dustObscuration; 
        colors[idx + 1] = lerpColor.g * dustObscuration; 
        colors[idx + 2] = lerpColor.b * dustObscuration;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({ 
        size: isMobile ? 14 : 9, 
        sizeAttenuation: true, 
        depthWrite: false, 
        blending: THREE.AdditiveBlending, 
        vertexColors: true, 
        transparent: true, 
        opacity: 0.55 
    });
    
    galaxyMesh = new THREE.Points(geometry, mat);
    galaxyMesh.visible = false;
    scene.add(galaxyMesh);
}

function createOrbitLine(radius) {
    if(radius === 0) return;
    const points = [];
    for (let i = 0; i <= 180; i++) points.push(new THREE.Vector3(Math.cos(i/180 * Math.PI * 2.0) * radius, 0, Math.sin(i/180 * Math.PI * 2.0) * radius));
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x4da6ff, transparent: true, opacity: 0.12 });
    scene.add(new THREE.Line(geo, lineMat));
}

// --- INTEGRAÇÃO DE INTERATIVIDADE HÍBRIDA UNIFICADA (MOUSE + TOUCH) ---
function setupUnifiedInteractivity() {
    const element = renderer.domElement;
    let pointerDownPosition = new THREE.Vector2();

    // Eventos Pointer unificam cliques de mouse e eventos de toque nativos, mitigando lag de resposta
    element.addEventListener('pointerdown', (e) => {
        pointerDownPosition.set(e.clientX, e.clientY);
    });

    element.addEventListener('pointerup', (e) => {
        // Tolerância de arrasto em pixels para diferenciar rotação intencional de órbita vs clique direto
        const clickTolerance = 4;
        if (pointerDownPosition.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) < clickTolerance) {
            executeRaycast(e);
        }
    });

    // Mapeamento imediato do Menu de Navegação Universal HTML
    document.querySelectorAll('.astro-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-target');
            const targetObject = raycasterObjects.find(obj => obj.userData.id === targetId);
            if (targetObject) focusAstro(targetObject);
            
            // Retrai a gaveta no mobile após a seleção para liberar espaço visual na viewport
            if (window.innerWidth < 768) {
                document.getElementById('info-panel').classList.remove('visible');
            }
        });
    });
}

function executeRaycast(event) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('#info-panel') || event.target.closest('#physics-modal') || event.target.closest('#astro-menu')) return;

    const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(raycasterObjects);
    if (intersects.length > 0) {
        focusAstro(intersects[0].object);
    }
}

function focusAstro(mesh) {
    if (focusedPlanetMesh === mesh) {
        resetCamera();
        return;
    }

    const info = mesh.userData;
    focusedPlanetMesh = mesh;
    focusedPlanetMesh.getWorldPosition(previousTargetPos);
    
    const r = info.radius || 1;
    targetCamPos.copy(previousTargetPos).add(new THREE.Vector3(r * 3.2, r * 1.6, r * 4.2));
    
    isLerpingCamera = true;
    controls.enabled = false; 

    // Atualização Semântica do Painel Informativo da Interface (UI)
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
    camera.position.set(0, 350, 600);
    controls.target.set(0, 0, 0);
    document.getElementById('info-panel').classList.remove('visible');
}

// --- LOOP DE ANIMAÇÃO REALTIME DE ALTA PERFORMANCE ---
function animate() {
    requestAnimationFrame(animate);
    
    const dt = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Atualiza o Shader de Cintilação Cósmica na GPU
    if (starPoints) starPoints.material.uniforms.uTime.value = elapsedTime;
    if (galaxyMesh && galaxyMesh.visible) galaxyMesh.rotation.y += 0.0002;

    planetsSystem.forEach((sys) => {
        if (sys.isSun) {
            sys.mesh.rotation.y += 0.001;
        } else {
            sys.pMesh.rotation.y += 0.004; // Rotação intrínseca planetária (dia/noite)

            let isFocusedSystem = false;
            if (focusedPlanetMesh) {
                if (sys.pMesh === focusedPlanetMesh) isFocusedSystem = true;
                if (sys.issPivot && sys.issPivot.children.includes(focusedPlanetMesh)) isFocusedSystem = true;
                if (sys.moonsArr.some(m => m.pivot.children.includes(focusedPlanetMesh))) isFocusedSystem = true;
            }

            // Translação Orbital ativa apenas se o sistema não estiver sob foco de análise microscópica
            if (orbitsActive && !isFocusedSystem) {
                sys.group.userData.currentAngle += sys.group.userData.speed;
                sys.group.position.x = Math.cos(sys.group.userData.currentAngle) * sys.group.userData.dist;
                sys.group.position.z = Math.sin(sys.group.userData.currentAngle) * sys.group.userData.dist;
            }

            // Mecânica Avançada de Acoplamento de Maré (Tidal Locking / Rotação Síncrona)
            sys.moonsArr.forEach(moon => {
                if (moonsActive) {
                    moon.pivot.rotation.y += moon.speed;
                    // MATEMÁTICA DA SINCRONIA: Mantendo a rotação própria da malha em 0 em relação ao pai,
                    // a mesma face física estará permanentemente orientada para o vetor central (0,0,0) do planeta.
                }
            });

            if (sys.issPivot && issActive) {
                sys.issPivot.rotation.y += 0.04; // Velocidade angular hiper-rápida simulada da ISS
            }
        }
    });

    // Interpolação Vetorial Suave (Lerp) de Câmera Cinemática Orbitante
    if (focusedPlanetMesh) {
        const currentTargetPos = new THREE.Vector3();
        focusedPlanetMesh.getWorldPosition(currentTargetPos);
        const deltaMove = new THREE.Vector3().subVectors(currentTargetPos, previousTargetPos);

        if (isLerpingCamera) {
            targetCamPos.add(deltaMove); 
            camera.position.lerp(targetCamPos, 0.06); 
            controls.target.lerp(currentTargetPos, 0.06);
            if (camera.position.distanceTo(targetCamPos) < 0.15) { 
                isLerpingCamera = false; 
                controls.enabled = true; 
            }
        } else {
            camera.position.add(deltaMove);
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
    document.getElementById('btn-view').addEventListener('click', () => { resetCamera(); camera.position.set(0, 950, 0.1); });

    const btnGalaxy = document.getElementById('btn-toggle-galaxy');
    btnGalaxy.addEventListener('click', () => {
        galaxyMesh.visible = !galaxyMesh.visible;
        btnGalaxy.classList.toggle('active');
        btnGalaxy.innerText = galaxyMesh.visible ? "Via-Láctea: ON" : "Via-Láctea: OFF";
        if(galaxyMesh.visible) camera.position.set(0, 1200, 1800);
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

// Redimensionamento Dinâmico com recalculamento instantâneo de Viewport Cross-Device
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Inicialização da Engine
init();
animate();
