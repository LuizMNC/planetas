/**
 * SIMULADOR ASTROFÍSICO 3D - ENGINE DE ALTA FIDELIDADE
 * Desenvolvido sob princípios de Computação Gráfica Avançada e PBR
 */

const textureLoader = new THREE.TextureLoader(); // Inicializa o carregador de texturas assíncrono da GPU
textureLoader.setCrossOrigin('anonymous'); // Bypass crítico de CORS para liberar texturas de domínios externos

// Metadados espaciais compactados
const issData = { id: 'iss', name: "Estação Espacial", type: "Laboratório Artificial", distSol: "420 km da Terra", size: "109 metros", atm: "Pressurizada (N2/O2)", temp: "-150°C a 120°C", fact: "Viaja a 27.600 km/h, completando uma órbita completa a cada 92 minutos em queda livre estável." }; // Estrutura de dados didáticos da ISS

// Banco de dados hierárquico PBR com cores calibradas de fallback
const celestialData = { // Dicionário central de propriedades astrofísicas
    sun: { name: "Sol", type: "Estrela anã amarela (G2V)", radius: 32.0, dist: 0, speed: 0, color: 0xffaa00, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg', data: { distSol: "0 km", size: "1.392.700 km", atm: "Plasma Incandescente", temp: "~5.500 °C (Superfície)", fact: "Concentra 99,86% de toda a massa do Sistema Solar, sustentando a curvatura do espaço-tempo que rege as órbitas." } }, // Emissor primário
    mercury: { name: "Mercúrio", type: "Planeta Rochoso", radius: 1.1, dist: 65, speed: 0.03, color: 0x8c8c8c, textureUrl: 'https://unpkg.com/three-globe/example/img/earth-dark.jpg', data: { distSol: "57,9 M km", size: "4.879 km", atm: "Exosfera Tênue", temp: "-173°C a 427°C", fact: "Devido à ausência de atmosfera espessa para retenção térmica, possui a maior amplitude térmica do sistema." } }, // Planeta interno
    venus: { name: "Vênus", type: "Planeta Rochoso", radius: 1.9, dist: 100, speed: 0.02, color: 0xe3bb76, textureUrl: null, data: { distSol: "108,2 M km", size: "12.104 km", atm: "96% Dióxido de Carbono", temp: "464°C", fact: "O efeito estufa descontrolado em sua atmosfera de alta densidade gera pressões equivalentes a 92 vezes a terrestre." } }, // Planeta com estufa global
    earth: { name: "Terra", type: "Planeta Rochoso", radius: 2.2, dist: 145, speed: 0.015, color: 0x2b82c9, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg', normalUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg', specularUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg', hasISS: true, // Planeta habitável com texturas complexas
        moons: [ { id: 'moon', name: "Lua", radius: 0.6, dist: 5.5, speed: 0.04, color: 0xb0b0b0, data: { distSol: "149,6 M km", size: "3.474 km", atm: "Inexistente", temp: "-130°C a 120°C", fact: "Apresenta acoplamento de maré perfeito (Tidal Locking), rotacionando em sincronia geométrica exata com sua translação." } } ], // Satélite natural com acoplamento
        data: { distSol: "149,6 M km", size: "12.742 km", atm: "Nitrogênio e Oxigênio", temp: "15°C", fact: "O único corpo celeste conhecido a abrigar água em três estados físicos simultâneos e atividade biológica complexa." } }, // Metadados biológicos
    mars: { name: "Marte", type: "Planeta Rochoso", radius: 1.5, dist: 195, speed: 0.011, color: 0xb2462e, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1k_color.jpg', // Cor de óxido de ferro PBR (fallback corrigido)
        moons: [ { id: 'phobos', name: "Fobos", radius: 0.4, dist: 3.8, speed: 0.06, color: 0x7a6b5d, data: { distSol: "227,9 M km", size: "22 km", atm: "Nenhuma", temp: "-40°C", fact: "Orbita Marte abaixo da altitude síncrona; forças de maré gravitacionais estão reduzindo seu raio de órbita continuamente." } } ], // Satélite decadente
        data: { distSol: "227,9 M km", size: "6.779 km", atm: "Dióxido de Carbono (Fina)", temp: "-62°C", fact: "Abriga o Monte Olimpo, o maior vulcão em escudo do Sistema Solar, com uma altitude de 21,9 km." } }, // Metadados orográficos
    jupiter: { name: "Júpiter", type: "Gigante Gasoso", radius: 10.5, dist: 290, speed: 0.005, color: 0xb07f35, textureUrl: null, // Gigante com forte influência magnética
        moons: [ { id: 'europa', name: "Europa", radius: 0.7, dist: 17.0, speed: 0.035, color: 0xe0e0e0, data: { distSol: "778,5 M km", size: "3.121 km", atm: "Oxigênio Tênue", temp: "-160°C", fact: "Sua crosta de gelo global oculta um oceano líquido aquecido por forças de maré geradas pela gravidade jupitariana." } } ], // Satélite aquático subglacial
        data: { distSol: "778,5 M km", size: "139.820 km", atm: "Hidrogênio e Hélio", temp: "-108°C", fact: "Seu massivo campo magnético gera um cinturão de radiação severo, capturando poeira cósmica e gerando auroras intensas." } }, // Metadados magnetosféricos
    saturn: { name: "Saturno", type: "Gigante Gasoso", radius: 8.5, dist: 410, speed: 0.003, color: 0xe2bf7d, textureUrl: null, hasRings: true, // Gigante anelado clássico
        moons: [ { id: 'titan', name: "Titã", radius: 0.9, dist: 19.5, speed: 0.022, color: 0xdca842, data: { distSol: "1,4 B km", size: "5.149 km", atm: "Nitrogênio Denso", temp: "-179°C", fact: "Único satélite do sistema com uma atmosfera densa e ciclos hidrológicos ativos baseados em metano e etano líquidos." } } ], // Satélite com ciclo de metano
        data: { distSol: "1,4 B km", size: "116.460 km", atm: "Hidrogênio e Hélio", temp: "-139°C", fact: "Seus anéis são compostos por bilhões de partículas de gelo puro e rocha, cujo plano possui menos de 10 metros de espessura vertical." } }, // Metadados de anéis
    uranus: { name: "Urano", type: "Gigante de Gelo", radius: 4.8, dist: 540, speed: 0.001, color: 0x71b2c9, textureUrl: null, // Gigante inclinado
        data: { distSol: "2,9 B km", size: "50.724 km", atm: "Hidrogênio, Hélio e Metano", temp: "-197°C", fact: "Possui uma obliquidade extrema de 98°, fazendo com que o planeta rotacione praticamente deitado em sua linha de trânsito." } }, // Efeito de obliquidade
    neptune: { name: "Netuno", type: "Gigante de Gelo", radius: 4.6, dist: 660, speed: 0.0008, color: 0x274687, textureUrl: null, // Gigante de alta pressão dinâmica
        data: { distSol: "4,5 B km", size: "49.244 km", atm: "Hidrogênio, Hélio e Metano", temp: "-201°C", fact: "Exibe os ventos mais violentos do Sistema Solar, atingindo velocidades supersônicas de até 2.100 km/h." } } // Vórtices atmosféricos supersônicos
}; // Fim do dicionário cósmico

let scene, camera, renderer, controls, clock; // Declarações globais de core WebGL
let planetsSystem = []; // Array estrutural de corpos transladantes
let raycasterObjects = []; // Vetor de malhas testáveis por interseção óptica (Raycaster)
let starfieldPoints = null; // Buffer de partículas do campo estelar
let focusedPlanetMesh = null; // Ponteiro para a malha em foco pela câmera

const previousTargetPos = new THREE.Vector3(); // Vetor espacial auxiliar de origem
const targetCamPos = new THREE.Vector3(); // Vetor espacial auxiliar de destino da câmera
let isLerpingCamera = false; // Flag booleana de transição de estado da câmera

let orbitsActive = true; // Chave condicional de translação planetária
let moonsActive = true; // Chave condicional de translação lunar
let issActive = true; // Chave condicional de translação orbital da ISS

const sharedSphereGeo = new THREE.SphereGeometry(1, 64, 64); // Geometria base compartilhada (instanciamento de GPU)
const sharedLowPolyGeo = new THREE.SphereGeometry(1, 16, 16); // Geometria de baixo custo para LOD/Hitboxes
const invisibleHitboxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }); // Material ocluso para testes de raio eficientes

const atmosVertexShader = ` // Início do Vertex Shader (Atmosfera)
    varying vec3 vNormal; // Exporta a normal da malha
    varying vec3 vViewPosition; // Exporta o vetor visão do fragmento
    void main() { // Função primária da GPU para vértices
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); // Converte pos para model view
        vNormal = normalize(normalMatrix * normal); // Normaliza para incidência de luz
        vViewPosition = -mvPosition.xyz; // Inverte visão no espaço local
        gl_Position = projectionMatrix * mvPosition; // Projeta no clip space 2D
    } // Fim do bloco GLSL Vertex
`;

const atmosFragmentShader = ` // Início do Fragment Shader (Atmosfera)
    varying vec3 vNormal; // Recebe normal interpolada
    varying vec3 vViewPosition; // Recebe vetor visão interpolado
    uniform vec3 uColor; // Recebe cor dinâmica via CPU
    void main() { // Função primária da GPU para pixels
        vec3 normal = normalize(vNormal); // Garante normais unitárias
        vec3 viewDir = normalize(vViewPosition); // Garante direção visual unitária
        float intensity = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0); // Cálculo de Fresnel óptico (dispersão de Rayleigh simulada)
        gl_FragColor = vec4(uColor, 1.0) * intensity; // Saída com alfa baseada no rim light
    } // Fim do bloco GLSL Fragment
`;

const starVertexShader = ` // Vertex shader do campo estelar cintilante
    attribute float aPhase; // Atributo temporal instanciado
    attribute float aSize; // Atributo de tamanho escalar
    varying float vAlpha; // Pass-through de opacidade
    uniform float uTime; // Tempo global (Clock) da CPU
    void main() { // Main GLSL
        vAlpha = 0.4 + 0.6 * sin(uTime * 2.5 + aPhase * 6.28); // Oscilação senoidal com fase (Twinkle effect)
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); // Transformação model view
        gl_PointSize = aSize * (350.0 / -mvPosition.z); // Atenuação de tamanho por profundidade z (Z-Depth)
        gl_Position = projectionMatrix * mvPosition; // Passa coords da projeção final
    } // Fim GLSL Vertex
`;

const starFragmentShader = ` // Fragment shader estelar pseudo-radial
    varying float vAlpha; // Opacidade temporal interpolada
    void main() { // Main Fragment GLSL
        float dist = distance(gl_PointCoord, vec2(0.5)); // Calcula raio polar do sprite
        if (dist > 0.5) discard; // Descarta pixels fora do círculo para manter FPS alto (Clipping)
        float alphaSmooth = smoothstep(0.5, 0.1, dist) * vAlpha; // Suaviza borda antialiasing (falloff)
        gl_FragColor = vec4(1.0, 1.0, 1.0, alphaSmooth); // Pinta partícula de branco com alfa suavizado
    } // Fim GLSL Fragment
`;

function init() { // Função bootstrap de inicialização
    scene = new THREE.Scene(); // Instancia grafo de cena principal
    clock = new THREE.Clock(); // Dispara o relógio global (delta times)
    
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 20000); // Cria frustum perspectivo com amplo clipping Z
    camera.position.set(0, 400, 700); // Eleva a câmera para overview isométrico

    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, powerPreference: "high-performance" }); // Ativa hardware anti-aliasing e buffer logarítmico z-fighting
    renderer.setSize(window.innerWidth, window.innerHeight); // Acopla resolução de renderização à viewport física
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limita o Device Pixel Ratio <= 2 para proteger GPUs de Thermal Throttling
    
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Habilita compressão de faixa dinâmica ACES (Padrão cinemático)
    renderer.toneMappingExposure = 1.2; // Aumenta limite de white point global
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Gamut sRGB exigido pelo workflow PBR moderno
    
    document.getElementById('canvas-container').appendChild(renderer.domElement); // Injeta o DOM element gerado pelo buffer gráfico

    controls = new THREE.OrbitControls(camera, renderer.domElement); // Associa controles quaternianos de giro orbital
    controls.enableDamping = true; // Habilita inércia e suavização de inputs matemáticos
    controls.dampingFactor = 0.05; // Ajusta atrito (drag) da câmera
    controls.maxDistance = 8000; // Bloqueia dolly out excessivo do usuário
    controls.minDistance = 0.5; // Impede colisão extrema com plano central

    scene.add(new THREE.AmbientLight(0x0a0a16, 1.2)); // Injecta Global Illumination de base espúria e fria
    const sunLight = new THREE.PointLight(0xffffff, 4.5, 5000, 0.5); // Fonte omnidirecional representando fusão solar (inverse-square law mitigado)
    scene.add(sunLight); // Insere fótons principais no node da cena

    Object.keys(celestialData).forEach((key) => { // Itera grafo local construindo as esferas procedurais
        const data = celestialData[key]; // Extrai ref

        if (key === 'sun') { // Condicional estrela emissiva
            const sunMat = new THREE.MeshBasicMaterial({ color: data.color, map: textureLoader.load(data.textureUrl) }); // Cria material unlit (não reage à PointLight local)
            const sunMesh = new THREE.Mesh(sharedSphereGeo, sunMat); // Acopla malha à matriz emissiva
            sunMesh.scale.set(data.radius, data.radius, data.radius); // Dimensiona volume no world space
            sunMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius }; // Armazena dados astronômicos em metadata
            
            const coronaMat = new THREE.SpriteMaterial({ map: generateCoronaTexture(), blending: THREE.AdditiveBlending, transparent: true, opacity: 0.85 }); // Billboard aditivo de coroa estelar
            const coronaSprite = new THREE.Sprite(coronaMat); // Fixa orientação de face-camera para sprite
            coronaSprite.scale.set(data.radius * 3.8, data.radius * 3.8, 1.0); // Projeta o halo coronal magnético além da malha
            sunMesh.add(coronaSprite); // Associa halo como hierarquia (child node)

            scene.add(sunMesh); // Acopla sol no root
            raycasterObjects.push(sunMesh); // Cadastra no pool de colisão óptica
            planetsSystem.push({ isSun: true, mesh: sunMesh }); // Registra na lista de translação (Sol orbita nulo mas rotaciona)
            return; // Escapa da iteração estelar (não necessita PBR standard)
        } // Fim bloco solar

        const planetGroup = new THREE.Group(); // Cria pivô (Origem) para calcular translação perfeitamente radial
        planetGroup.userData.currentAngle = Math.random() * Math.PI * 2; // Semeia anomalia verdadeira aleatória da órbita
        planetGroup.userData.speed = data.speed; // Armazena velocidade angular tangencial
        planetGroup.userData.dist = data.dist; // Armazena raio do vetor de translação

        const pMat = new THREE.MeshStandardMaterial({ color: data.color }); // Instancia BRDF PBR base usando cor primária como fallback obrigatório
        
        if (data.textureUrl) pMat.map = textureLoader.load(data.textureUrl); // Carrega difusa se host permitir
        if (data.normalUrl) { // Testa pipeline de bump
            pMat.normalMap = textureLoader.load(data.normalUrl); // Injecão de normais por pixel
            pMat.normalScale.set(0.15, 0.15); // Suaviza vales da malha de normais para realismo
        } // Fim bloco normal
        if (data.specularUrl) { // Mapa de reflexão isolado
            pMat.roughnessMap = textureLoader.load(data.specularUrl); // Traduz mapa especular clássico para roughness invertida padrão glTF
        } // Fim bloco reflexo

        if (data.type.includes("Gasoso") || data.type.includes("Gelo")) { // Lógica PBR para fluidos gigantes
            pMat.roughness = 0.6; // Refletância Lambertiana espalhada em atmosferas densas
            pMat.metalness = 0.05; // Absorção dielétrica majoritária (não reflete como metal puro)
        } else if (key === 'mars') { // Calibração termodinâmica crítica para Marte (Fix CORS/Albedo)
            pMat.roughness = 0.9; // Óxido de ferro é estruturalmente árido e dispersivo
            pMat.metalness = 0.0; // Elimina todo highlight direcional forçando modelo Oren-Nayar
        } else { // Rochosos terrestres padrão
            pMat.roughness = 0.85; // Rugosidade genérica
            pMat.metalness = 0.1; // Traços microscópicos condutivos no terreno
        } // Fim do pipeline de calibração termodinâmica e PBR

        const pMesh = new THREE.Mesh(sharedSphereGeo, pMat); // Finaliza agregação de Mesh local
        pMesh.scale.set(data.radius, data.radius, data.radius); // Scale global da matriz astrofísica
        pMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius }; // Armazena ponteiros visuais para a UI Html
        raycasterObjects.push(pMesh); // Adiciona ao escaneamento de mouse/touch
        planetGroup.add(pMesh); // Aninha topologia no grupo translacional

        if (key === 'earth' || key === 'venus') { // Adiciona invólucro de rayleigh customizado
            const colorAtm = key === 'earth' ? new THREE.Color(0x2b82c9) : new THREE.Color(0xe0a96d); // Define crominância da difração atmosférica
            const atmosMat = new THREE.ShaderMaterial({ vertexShader: atmosVertexShader, fragmentShader: atmosFragmentShader, uniforms: { uColor: { value: colorAtm } }, blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true }); // Compila material custom GLSL para shader pass
            const atmosMesh = new THREE.Mesh(sharedSphereGeo, atmosMat); // Instancia domo atmosférico
            atmosMesh.scale.set(data.radius * 1.12, data.radius * 1.12, data.radius * 1.12); // Extrude em 12% a atmosfera acima da malha
            planetGroup.add(atmosMesh); // Aninha atmosfera no referencial planetário
        } // Fim rayleigh pass

        if (data.hasRings) { // Pipeline subgerador de anéis (partículas densas pseudo-solidas)
            const ringGeo = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.6, 64); // Cria malha poligonal 2D de anel
            const ringMat = new THREE.MeshStandardMaterial({ color: 0xbfa37a, side: THREE.DoubleSide, transparent: true, opacity: 0.7, roughness: 0.6 }); // Trata opacidade difusa e two-sided cull disabled
            const ringMesh = new THREE.Mesh(ringGeo, ringMat); // Compilação de malha do disco
            ringMesh.rotation.x = Math.PI / 2.3; // Aplica pitch oblíquo de Cassini
            planetGroup.add(ringMesh); // Registra anéis no grupo
        } // Fim de anéis

        let moonsArr = []; // Pool de luas restrito ao referencial local
        if (data.moons) { // Iterador lunar subordinado
            data.moons.forEach(moonData => { // Mapeia satélites
                const moonPivot = new THREE.Group(); // Eixo baricêntrico lunar
                const mMat = new THREE.MeshStandardMaterial({ color: moonData.color, roughness: 0.9, metalness: 0.0 }); // Superfície lunar árida padrão nula
                const moonMesh = new THREE.Mesh(sharedLowPolyGeo, mMat); // Malha low-poly para poupar fill rate secundário
                moonMesh.scale.set(moonData.radius, moonData.radius, moonData.radius); // Raio geodésico lunar
                moonMesh.position.set(moonData.dist, 0, 0); // Translate lateral inicial de órbita

                const moonHitbox = new THREE.Mesh(sharedLowPolyGeo, invisibleHitboxMat); // Raycaster proxy (malha invisível maior para facilitar click)
                moonHitbox.scale.set(moonData.radius * 3.5, moonData.radius * 3.5, moonData.radius * 3.5); // Multiplicador de tolerância de tap em mobile
                moonHitbox.position.copy(moonMesh.position); // Sincroniza proxy com a render mesh
                moonHitbox.userData = { id: moonData.id, ...moonData.data, name: moonData.name, type: "Satélite Natural", radius: moonData.radius }; // Acopla metadados ao hit proxy
                
                moonPivot.add(moonMesh, moonHitbox); // Aninha mesh e hitbox no sub-pivô lunar
                raycasterObjects.push(moonHitbox); // Coloca hitbox invisível no raycaster
                planetGroup.add(moonPivot); // Acopla subsistema lunar ao planeta pai
                moonsArr.push({ pivot: moonPivot, mesh: moonMesh, speed: moonData.speed }); // Cadastra para update cinemático
            }); // Fim laço lunar
        } // Fim bloco lunar

        let issPivot; // Escopo condicional da Estação Internacional
        if (data.hasISS) { // Somente terrestre (ou artificial futura)
            issPivot = new THREE.Group(); // Centro baricêntrico orbital de baixa altitude LEO
            const scaleISS = 0.04; // Escala extrema de contração micrométrica
            
            const metalSpaceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.15 }); // Titânio/Alumínio ultrarrefletivo
            const solarPanelMat = new THREE.MeshStandardMaterial({ color: 0x0a2342, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide }); // Célula fotovoltaica azul escura

            const coreMesh = new THREE.Mesh(new THREE.CylinderGeometry(scaleISS, scaleISS, scaleISS * 4, 8), metalSpaceMat); // Módulo habitacional cilíndrico
            coreMesh.rotation.x = Math.PI / 2; // Alinhamento tangencial
            
            const panel1 = new THREE.Mesh(new THREE.BoxGeometry(scaleISS * 7, scaleISS * 0.1, scaleISS * 1.8), solarPanelMat); // Array solar esquerdo
            panel1.position.z = scaleISS * 1.6; // Desloca offset Z
            const panel2 = panel1.clone(); // Otimização via clonagem de memória GPU
            panel2.position.z = -(scaleISS * 1.6); // Espelha oposto

            issPivot.add(coreMesh, panel1, panel2); // Monta a geometria composta do satélite
            issPivot.position.set(data.radius + 0.6, 0, 0); // Trava altitude na LEO (Low Earth Orbit) em offset ao raio principal

            const issHitbox = new THREE.Mesh(sharedLowPolyGeo, invisibleHitboxMat); // Cria proxy click volumoso para a ISS
            issHitbox.scale.set(0.6, 0.6, 0.6); // Área esférica capturadora de input
            issHitbox.position.copy(issPivot.position); // Sincroniza vetores cartesianos
            issHitbox.userData = { id: 'iss', ...issData, radius: scaleISS * 3 }; // Acopla metadados da ISS

            const issRotator = new THREE.Group(); // Pivô raiz LEO acoplado ao núcleo planetário
            issRotator.add(issPivot, issHitbox); // Vincula malha e hit proxy
            raycasterObjects.push(issHitbox); // Cadastra ISS no pipeline de tap
            planetGroup.add(issRotator); // Subordina LEO ao movimento de rotação terrestre principal
            issPivot = issRotator; // Sobrescreve ref de animação p/ Update
        } // Fim montagem ISS

        createOrbitLine(data.dist); // Rotina de traçado em LineBasicMaterial da órbita eclíptica
        scene.add(planetGroup); // Despeja complexo hierárquico na raiz do mundo
        planetsSystem.push({ isSun: false, group: planetGroup, pMesh: pMesh, moonsArr: moonsArr, issPivot: issPivot }); // Empilha dados de física iterativa
    }); // Fim iteração de astros

    createDynamicStarfield(); // Dispara buffer shader points para estrelas
    connectUserInterface(); // Conecta DOM listeners lógicos

    let touchStartPos = new THREE.Vector2(); // Instancia cache de vetor 2D para validação de clique/touch
    renderer.domElement.addEventListener('pointerdown', (e) => touchStartPos.set(e.clientX, e.clientY)); // Captura coordenada bruta do pointer no momento de press
    renderer.domElement.addEventListener('pointerup', (e) => { // Dispara callback no release do touch/mouse
        const distClick = touchStartPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY)); // Calcula Delta Euclidiano vetorial em Screen Space
        if (distClick < 4) executeRaycastSelect(e); // Anti-Ghosting: Raycast só aprova cliques que não deslizaram (tolerância 4px para suprimir orbit controls panning)
    }); // Fim do listener anti-ghosting WebGL

    window.addEventListener('resize', onWindowResize); // Re-projeta Matrizes sob distorção de janela
} // Fim de Init

function generateCoronaTexture() { // API Canvas 2D auxiliar de sprite map procedural
    const canvas = document.createElement('canvas'); // Aloca buffer 2D offscreen
    canvas.width = 512; canvas.height = 512; // Resolução binária amigável à GPU P2
    const ctx = canvas.getContext('2d'); // Pega engine de desenho nativo
    const grad = ctx.createRadialGradient(256, 256, 32, 256, 256, 256); // Formula matriz radial de plasma emissivo
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)'); // Núcleo superaquecido opaco (White Hot)
    grad.addColorStop(0.15, 'rgba(255, 200, 50, 0.8)'); // Transição fotossférica cromada
    grad.addColorStop(0.45, 'rgba(230, 70, 10, 0.25)'); // Decaimento difuso de radiação (Efeito falloff)
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)'); // Clipping invisível final
    ctx.fillStyle = grad; // Seta preenchimento com o shader gradient
    ctx.fillRect(0, 0, 512, 512); // Pinta quadro inteiro extraindo canais RGBA puros
    return new THREE.CanvasTexture(canvas); // Envelopa no sistema ThreeJS de Map Gen dinâmico
} // Retorna textura

function createDynamicStarfield() { // Função construtora do fundo estelar animado via GLSL
    const isMobile = window.innerWidth < 768; // Avalia capabilidade do hardware (Heurística CSS/Pixel)
    const countStars = isMobile ? 2000 : 5000; // Limita orçamento poli paramétrico para GPUs fracas (Fill rate reduction)
    
    const geo = new THREE.BufferGeometry(); // Cria geometria plana orientada para dados arbitrários Float32
    const positions = new Float32Array(countStars * 3); // Aloca flat array vetorial xyz puro
    const phases = new Float32Array(countStars); // Aloca flat array de seeds oscilatórios temporais
    const sizes = new Float32Array(countStars); // Aloca buffer de scale variacional pseudo-randomico

    for(let i = 0; i < countStars; i++) { // Loop de distribuição esférica uniforme
        const r = 2500 + Math.random() * 3500; // Raio base distante bloqueando frustum z-near (Evita colisão focal)
        const theta = Math.random() * Math.PI * 2; // Distribui ângulo azimutal completo 360
        const phi = Math.acos((Math.random() * 2) - 1); // Compensação trigonométrica esférica no zenith para evitar aglomeração nos polos da esfera celeste

        positions[i*3] = r * Math.sin(phi) * Math.cos(theta); // Converte Coord Esférica -> Euclidiana X
        positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta); // Converte Coord Esférica -> Euclidiana Y
        positions[i*3+2] = r * Math.cos(phi); // Converte Coord Esférica -> Euclidiana Z

        phases[i] = Math.random(); // Injeta ruído 0-1 no array phase para quebrar unissonância cintilante
        sizes[i] = Math.random() * 2.2 + 0.8; // Restringe tamanho das pontas visuais evitando borrões
    } // Fim de loop gerador

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3)); // Fornece posições xyz de 3 dimensões (Stride)
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1)); // Fornece Atributo paralelo GLSL 1D (Custom prop)
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1)); // Atribui escala escalar 1D gl_PointSize

    const starMat = new THREE.ShaderMaterial({ // Inicia Pipeline Híbrido GPU
        vertexShader: starVertexShader, // Link código vertex programado anteriormente em GLSL
        fragmentShader: starFragmentShader, // Link rasterizador estelar GLSL custom
        uniforms: { uTime: { value: 0.0 } }, // Abre canal CPU->GPU para envio constante do Clock (Tempo linear)
        transparent: true, // Libera blending mode alfa
        depthWrite: false, // Ignora gravação em Z-Buffer evitando recorte forçado em sobreposição de partículas
        blending: THREE.AdditiveBlending // Soma perfis de cores produzindo luz aparente intensa (Overtone/Glow)
    }); // Fim das specs do material

    starfieldPoints = new THREE.Points(geo, starMat); // Instancia construtor de GPU de Point Cloud
    scene.add(starfieldPoints); // Carrega cloud estelar perimetral no background
} // Fim rotina estelar

function createOrbitLine(radius) { // Helper function linear geométrica
    if (radius === 0) return; // Ignora se for Estrela central nula
    const pts = []; // Cria buffer temporário CPU RAM
    for(let i = 0; i <= 180; i++) pts.push(new THREE.Vector3(Math.cos(i/180 * Math.PI * 2) * radius, 0, Math.sin(i/180 * Math.PI * 2) * radius)); // Usa trigonometria pura para calcular segmentos radiais incrementais a cada 2 graus iterativos (180 cortes XZ polares)
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x3a86ff, transparent: true, opacity: 0.08 }))); // Desenha linhas opacas sutis renderizadas estaticamente na VRAM economizando updates GPU
} // Retorna o Void

function executeRaycastSelect(event) { // API Analítica Óptica
    if (event.target.tagName === 'BUTTON' || event.target.closest('#info-panel') || event.target.closest('#physics-modal') || event.target.closest('#astro-menu')) return; // Filtra colisões de evento DOM nativas CSS anulando overlap com HTML GUI
    const mouseCoords = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1); // Normaliza coordenadas NDC (Normalized Device Coordinates) (-1 a +1)
    const raycaster = new THREE.Raycaster(); // Instancia raio balístico de colisão OBB esférica
    raycaster.setFromCamera(mouseCoords, camera); // Configura matriz de projeção origem (câmera) -> Alvo (espaço mundial)
    const intersects = raycaster.intersectObjects(raycasterObjects); // Testa penetração poligonal no pool filtrado `raycasterObjects` (Desprezando malhas decorativas)
    if (intersects.length > 0) focusAstro(intersects[0].object); // Intersecta primeiro array pos z-index acionando Callback visual
} // Fim validação Raycast

function focusAstro(mesh) { // Função LERPER mestre de controle focal de view
    if (focusedPlanetMesh === mesh) { resetCamera(); return; } // Executa toggle se malha clicada já for alvo atual cancelando foco
    const info = mesh.userData; // Extrai repositório acoplado metadata PBR/Orbital local do mesh target
    focusedPlanetMesh = mesh; // Substitui var global com ponteiro de memória
    focusedPlanetMesh.getWorldPosition(previousTargetPos); // Calcula matriz de translação mundo atual do objeto (Bypassa parent group offset relacional)
    
    const r = info.radius || 1; // Resgata raio do bounding volume para calcular safe distance focal
    targetCamPos.copy(previousTargetPos).add(new THREE.Vector3(r * 2.8, r * 1.2, r * 3.6)); // Compõe Offset angular de visualização assimétrica via adição vetorial tridimensional (Evitando colisão no plano central nulo Z e clipping de Near Plane)
    
    isLerpingCamera = true; // Ativa chave lógica para liberar cálculos matemáticos densos (L.E.R.P. Interpolation frame-a-frame) do `animate()` Loop
    controls.enabled = false; // Dá bypass temporário total nos OrbitalControls travando panning livre para evitar stutter de conflito de eixos vetoriais opostos

    document.getElementById('planet-name').textContent = info.name; // Injeta HTML info DOM Nome
    document.getElementById('planet-type').textContent = info.type; // Injeta HTML Info OID estrutural
    document.getElementById('planet-dist').textContent = info.distSol; // Injeta texto Distância no Sidebar
    document.getElementById('planet-size').textContent = info.size; // Injeta Diametro real formatado
    document.getElementById('planet-atm').textContent = info.atm; // Passa dado atmosferico text para view
    document.getElementById('planet-temp').textContent = info.temp; // Passa dado termodinâmico HTML view
    document.getElementById('planet-fact').textContent = info.fact; // Finaliza injeção texto científico de side content
    
    const panel = document.getElementById('info-panel'); // Resgata Nó DOM do Drawer overlay
    panel.classList.add('visible'); // Comuta tag state CSS animation Transition hardware accelerada via compósito Gpu do browser (Transform)
    panel.setAttribute('aria-hidden', 'false'); // Altera status Acessibilidade ARIA W3C Padrão
} // Fim API focadora principal 

function resetCamera() { // Rotina unbinder reset
    focusedPlanetMesh = null; // Purga GC var memory reference target mesh focus
    isLerpingCamera = false; // Aborta interpolação LERP vetorial prematuramente travando drift
    controls.enabled = true; // Reativa orbit controls Quaternion Euler panner master listener lock
    camera.position.set(0, 400, 700); // Resseta eixo origin hardcoded panorâmico view macro
    controls.target.set(0, 0, 0); // Re-trava lookAt() do render point pivot pro Solar Core estático nativo
    
    const panel = document.getElementById('info-panel'); // Coleta DOM Sidebar Reference Array pointer
    panel.classList.remove('visible'); // Oculta painel slideOut transição via CSS class ref
    panel.setAttribute('aria-hidden', 'true'); // Anula leitura de e-readers no DOM Tree escondido ARIA 
} // Fim Reset panorâmico

function connectUserInterface() { // Linker de lógicas UI -> Contexto Webgl isolado
    document.querySelectorAll('.astro-btn').forEach(btn => { // Itera toda nodelist botões siderais dinâmicos do catálogo HTML lateral
        btn.addEventListener('click', (e) => { // Acopla closure no trigger Click Pointer 
            const targetId = e.target.getAttribute('data-target'); // Extrai Tag UID string relacional em runtime
            const foundMesh = raycasterObjects.find(obj => obj.userData.id === targetId); // Escaneia Array Hitbox buscando ID Hash equivalente O(N) linear sweep Search
            if (foundMesh) focusAstro(foundMesh); // Dispara Rotina Focus 3D vetorial ao mesh pointer achado
        }); // Fim Call UI Click
    }); // Fim ForEach Bindings

    document.getElementById('close-panel').addEventListener('click', resetCamera); // Listener Icon X UI escape Drawer slide
    document.getElementById('btn-reset').addEventListener('click', resetCamera); // Listener master reset Pan view topo
    document.getElementById('btn-view').addEventListener('click', () => { resetCamera(); camera.position.set(0, 950, 0.1); }); // Listener pseudo Zenital orthogonal view emulation

    document.getElementById('btn-toggle-planets').addEventListener('click', (e) => { orbitsActive = !orbitsActive; e.target.classList.toggle('active'); }); // Pausa boolean orbit updates engine planetas e intercala Botão CSS Toggle class state visual
    document.getElementById('btn-toggle-moons').addEventListener('click', (e) => { moonsActive = !moonsActive; e.target.classList.toggle('active'); }); // Pausa boolean orbit updates motores luas
    document.getElementById('btn-toggle-iss').addEventListener('click', (e) => { issActive = !issActive; e.target.classList.toggle('active'); }); // Pausa cinemática orbital LEO submodulo Espacial ISS toggle

    const pModal = document.getElementById('physics-modal'); // Seleciona DOM object janela modal didática centro-tela
    document.getElementById('btn-physics').addEventListener('click', () => pModal.classList.remove('hidden')); // Remove hide lock Display class disparando Opacity render CSS 
    document.getElementById('close-physics').addEventListener('click', () => pModal.classList.add('hidden')); // Re-Oculta Physics explainer Box Overlay Screen logic
} // Fim Integrador Contextos HTML JS WebGL Bind

function onWindowResize() { // Função trigger listener Mutation UI resize Observer Call
    camera.aspect = window.innerWidth / window.innerHeight; // Corrige distorção matriz de view perspectivo Proporção Aspec Ratio Aspect recalculation H/W
    camera.updateProjectionMatrix(); // Compila obrigatoriamente a nova matriz de refração e frustum interno da Câmera Padrão Threejs Call
    renderer.setSize(window.innerWidth, window.innerHeight); // Acopla Raster Canvas element CSS pixels internos pra coincidir viewport scale size nativo real tela física user 
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limita pixel ratio via clamping dinâmico a 2X para mitigar thermal throttling persistente ao maximizar app no resize (Mobile Fix)
} // Fim de Handler Responsive Resize Scale Engine Window

function animate() { // Loop master Game State Updater Engine Frame Call RAF recursivo principal base performance runtime script
    requestAnimationFrame(animate); // Recurso assíncrono bloqueante Call CPU Sync tela Monitor Refresh Rate (60/120Hz V-Sync wait loop callback register API navegador nativo)
    const elapsedTime = clock.getElapsedTime(); // Captura frame delta cronológico Delta Time Secs Linear progressivo absoluto CPU Time tracker reference number float real

    if (starfieldPoints) starfieldPoints.material.uniforms.uTime.value = elapsedTime; // Injeta update de tempo na variável uTime linkada pro Shader CPU->GPU Push Uniform pra oscilação Sin Phase Stars GLSL Engine Buffer Update Call Pass

    planetsSystem.forEach((sys) => { // Update Lógico Rotacional Translacional de todo Graph Object Grouped array System Bodies Mechanics (O(N) Complexidade linear framesync time budget)
        if (sys.isSun) { // Filtro condicional solar node pivot rotine central block update exception
            sys.mesh.rotation.y += 0.001; // Spin simples solar Y Up axis estático polar local offset delta contínuo constante
        } else { // Ramo Planetário standard Translacional e Spin complex multi vector node block updates math
            sys.pMesh.rotation.y += 0.004;  // Eixo Rotação Global dia sideral estático pseudo vel update axis pitch Yaw contínuo delta number add offset polar

            let systemIsFocused = false; // Instancia flag boolean temp local iterativa pra congelar órbita do respectivo group focus node isolado
            if (focusedPlanetMesh) { // Confere existence ponteiro alocação alvo Raycast global memory ref
                if (sys.pMesh === focusedPlanetMesh) systemIsFocused = true; // Se própria malha Planetária target for o focus pointer = trave local group update boolean True setter match
                if (sys.issPivot && sys.issPivot.children.includes(focusedPlanetMesh)) systemIsFocused = true; // Se child group ISS hitbox ref pointer match sub node raycaster parent check array lookup = lock track
                if (sys.moonsArr.some(m => m.pivot.children.includes(focusedPlanetMesh))) systemIsFocused = true; // Array SOME iterator Check Lua proxy match = lock focus boolean true logic path conditional array
            } // Fim Verificação sub Focus Lock tree search

            if (orbitsActive && !systemIsFocused) { // Libera passe de matemática iteradora Cos/Sin translacional global somente se PAUSE global orbits false e LOCAL FOCUS boolean target falso liberando loop tick update group
                sys.group.userData.currentAngle += sys.group.userData.speed; // Incrementa Ângulo Polar anomalia verdadeira radianos velocidade linear pseudo constante math step add
                sys.group.position.x = Math.cos(sys.group.userData.currentAngle) * sys.group.userData.dist; // Atribui Posição transladada cartesian euclidiana transform matriz Vector X Trig Cos proj
                sys.group.position.z = Math.sin(sys.group.userData.currentAngle) * sys.group.userData.dist; // Atribui profudidade polar transladada matriz Vector Z Trig Seno proj (Circulo Fechado Órbita Euler Update Matrix Local 2D Axis plano fixo Y=0)
            } // Fim Update Translacional Raiz Group Parent Matrix position transform vector

            sys.moonsArr.forEach(moon => { if (moonsActive) moon.pivot.rotation.y += moon.speed; }); // Dispara Call iterativa translação Y orbital speed param constante Euler Yaw Matrix update Moon child pivôs isolados matriz local child relacional

            if (sys.issPivot && issActive) { // Pass de verificação ISS node root presence check condition bool flag boolean UI toggle button link
                sys.issPivot.rotation.y += 0.045; // Translacional velocidade pseudo rápida ISS Matrix Pivot Yaw Y update Orbital motion speed sim logic track LEO circle vector
                sys.issPivot.rotation.x += 0.008; // Rotação precessão tangencial inclinação X Pitch node LEO ISS mesh tumble flip drift orbital axis inclination add
            } // Fim update ISS frame pass logic subnode child
        } // Fim else node pass rotinas cinemáticas standard group
    }); // Fim Iterate Grafo Objects World Space Update loop step

    if (focusedPlanetMesh) { // Tracker de smooth damping câmera vetorial condicional se Ref var Global existir alocada != nulo Raycast state lock target bool
        const currentTargetPos = new THREE.Vector3(); // Aloca instanciamento Vetor Zero Vector3 coord var temp memory alloc alloc tracking
        focusedPlanetMesh.getWorldPosition(currentTargetPos); // Extrai Posição Real Global Mundo World Matrix Coordinate Absolute Vector bypassing group aninhamentos matriz local sub nodes
        const diffVector = new THREE.Vector3().subVectors(currentTargetPos, previousTargetPos); // Calcula Delta vetorial Subtração V2 - V1 Deslocamento vetorial linear translation update tracking speed

        if (isLerpingCamera) { // Ramo interpolação inicial aproximação suave transição curva animação Lerp camera start bool check
            targetCamPos.add(diffVector); // Corrige Vetor alvo somando diff tracking em target destination pra seguir planeta transladando simultâneo enquanto foca Vector Add transform calc
            camera.position.lerp(targetCamPos, 0.05); // Interpolação linear Vetorial Alpha step Tensão matemática L.E.R.P Camera XYZ Follow track point smooth move anim equation 5% frame step damp
            controls.target.lerp(currentTargetPos, 0.05); // Lerpa OrbitControls point lookAt target Vector central point track interpolation smooth pan focus tracking target LookAt calc matrix look
            if (camera.position.distanceTo(targetCamPos) < 0.1) { isLerpingCamera = false; controls.enabled = true; } // Release condicional LERP cancel se raio chegado threshold Delta limite tolerância Euclidiana dist Check distance To method break bool reset reativa Pan user manual UI orbit Controls free cam logic
        } else { // Ramo seguimento estrito locked follow tracking Panning já focado Hard lock node track mode follow pos matrix copy
            camera.position.add(diffVector); // Soma delta linear absoluto rígido pra tracking perfeitamente síncrono posicional Camera offset Follow update Add Vector Diff calc update frame time
            controls.target.copy(currentTargetPos); // Clona coordenada World center alvo estrita Override OrbitTarget LookAt center focus track follow copy vector
        } // Fim tracking branch tree Follow Update logic
        previousTargetPos.copy(currentTargetPos); // Cache last frame vector World Pos clone Override salva memória pra próxima iteração subtrair novo Diff delta frame anterior tracker
    } // Fim Camera Matrix Tracker update

    controls.update(); // Dispara método interno matriz OrbitControls Euler damping inertia physics drag input resolve apply quaternion transforms API lib method wrapper native core Threejs Control class pass
    renderer.render(scene, camera); // Mestre Raster Call Despeja Grafo cena Final World Space e Projeção Viewport Array Buffer Flush pra placa gráfica Render Engine Frame Output pipeline Draw Calls GPU sync
} // Fim Call Loop Animate recursivo frame master Tick

init(); // Disparo de ignição do motor Gráfico JS main boot caller function call sequence init app script execute load begin flow pass end
