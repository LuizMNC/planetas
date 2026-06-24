/** // Inicia o bloco de documentação base da engine.
 * SIMULADOR ASTROFÍSICO 3D - ENGINE DE ALTA FIDELIDADE // Define o título e propósito do módulo principal.
 * Desenvolvido sob princípios de Computação Gráfica Avançada e PBR // Declara os paradigmas visuais regentes da aplicação.
 */ // Finaliza o bloco de documentação inicial.

const textureLoader = new THREE.TextureLoader(); // Instancia a classe principal do pipeline do Three.js para o parse e carregamento assíncrono de bitmaps.
textureLoader.setCrossOrigin('anonymous'); // DIRETRIZ CRÍTICA DE CORS: Força a requisição HTTP via cabeçalho CORS anônimo para evitar que a malha bloqueie (renda-se ao preto) quando texturas provêm de CDNs externas rígidas.

// Banco de Dados Celestial - Escala Visual Didática Otimizada // Comentário organizativo sobre as estruturas de metadados.
const issData = { id: 'iss', name: "Estação Espacial", type: "Laboratório Artificial", distSol: "420 km da Terra", size: "109 metros", atm: "Pressurizada (N2/O2)", temp: "-150°C a 120°C", fact: "Viaja a 27.600 km/h, completando uma órbita completa a cada 92 minutos em queda livre estável." }; // Declaração de objeto literal com metadados físicos, orbitais e orbitográficos focados na ISS.

const celestialData = { // Abertura do dicionário que age como banco de dados JSON-like de simulação.
    sun: { name: "Sol", type: "Estrela anã amarela (G2V)", radius: 32.0, dist: 0, speed: 0, color: 0xffaa00, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg', data: { distSol: "0 km", size: "1.392.700 km", atm: "Plasma Incandescente", temp: "~5.500 °C (Superfície)", fact: "Concentra 99,86% de toda a massa do Sistema Solar, sustentando a curvatura do espaço-tempo que rege as órbitas." } }, // Define constantes estelares solares (dados de raio visual escalonado).
    mercury: { name: "Mercúrio", type: "Planeta Rochoso", radius: 1.1, dist: 65, speed: 0.03, color: 0x8c8c8c, textureUrl: 'https://unpkg.com/three-globe/example/img/earth-dark.jpg', data: { distSol: "57,9 M km", size: "4.879 km", atm: "Exosfera Tênue", temp: "-173°C a 427°C", fact: "Devido à ausência de atmosfera espessa para retenção térmica, possui a maior amplitude térmica do sistema." } }, // Define dados de Mercúrio, velocidade angular mais alta e proximidade focal.
    venus: { name: "Vênus", type: "Planeta Rochoso", radius: 1.9, dist: 100, speed: 0.02, color: 0xe3bb76, textureUrl: null, data: { distSol: "108,2 M km", size: "12.104 km", atm: "96% Dióxido de Carbono", temp: "464°C", fact: "O efeito estufa descontrolado em sua atmosfera de alta densidade gera pressões equivalentes a 92 vezes a terrestre." } }, // Define Vênus, apontando textura ausente em favor de shader nativo ou materiais unicolores PBR.
    earth: { name: "Terra", type: "Planeta Rochoso", radius: 2.2, dist: 145, speed: 0.015, color: 0x2b82c9, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg', normalUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg', specularUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg', hasISS: true, // Define dados planetários terrestres integrando mapas de normais, textura difusa e mapas especulares avançados.
        moons: [ { id: 'moon', name: "Lua", radius: 0.6, dist: 5.5, speed: 0.04, color: 0xb0b0b0, data: { distSol: "149,6 M km", size: "3.474 km", atm: "Inexistente", temp: "-130°C a 120°C", fact: "Apresenta acoplamento de maré perfeito (Tidal Locking), rotacionando em sincronia geométrica exata com sua translação." } } ], // Declara um subsistema planetário de luas para instanciamento hierárquico.
        data: { distSol: "149,6 M km", size: "12.742 km", atm: "Nitrogênio e Oxigênio", temp: "15°C", fact: "O único corpo celeste conhecido a abrigar água em três estados físicos simultâneos e atividade biológica complexa." } }, // Registra informações acadêmicas e didáticas da Terra.
    mars: { name: "Marte", type: "Planeta Rochoso", radius: 1.5, dist: 195, speed: 0.011, color: 0xb2462e, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1k_color.jpg', // Define Marte e aplica cor PBR calibrada (0xb2462e) para assegurar o funcionamento do fallback óptico de renderização caso as imagens bloqueiem.
        moons: [ { id: 'phobos', name: "Fobos", radius: 0.4, dist: 3.8, speed: 0.06, color: 0x7a6b5d, data: { distSol: "227,9 M km", size: "22 km", atm: "Nenhuma", temp: "-40°C", fact: "Orbita Marte abaixo da altitude síncrona; forças de maré gravitacionais estão reduzindo seu raio de órbita continuamente." } } ], // Declara luas marcianas secundárias para o engine gerar pivôs suborbitais.
        data: { distSol: "227,9 M km", size: "6.779 km", atm: "Dióxido de Carbono (Fina)", temp: "-62°C", fact: "Abriga o Monte Olimpo, o maior vulcão em escudo do Sistema Solar, com uma altitude de 21,9 km." } }, // Adiciona fatos físicos curiosos à aba lateral da malha marciana.
    jupiter: { name: "Júpiter", type: "Gigante Gasoso", radius: 10.5, dist: 290, speed: 0.005, color: 0xb07f35, textureUrl: null, // Omitida a textura em favor de calibração baseada em fallback para garantir framerate e cor naturalística via PBR.
        moons: [ { id: 'europa', name: "Europa", radius: 0.7, dist: 17.0, speed: 0.035, color: 0xe0e0e0, data: { distSol: "778,5 M km", size: "3.121 km", atm: "Oxigênio Tênue", temp: "-160°C", fact: "Sua crosta de gelo global oculta um oceano líquido aquecido por forças de maré geradas pela gravidade jupitariana." } } ], // Luas jupiterianas registradas dinamicamente com informações termodinâmicas.
        data: { distSol: "778,5 M km", size: "139.820 km", atm: "Hidrogênio e Hélio", temp: "-108°C", fact: "Seu massivo campo magnético gera um cinturão de radiação severo, capturando poeira cósmica e gerando auroras intensas." } }, // Informações em larga escala sobre gigantismo planetário de Júpiter.
    saturn: { name: "Saturno", type: "Gigante Gasoso", radius: 8.5, dist: 410, speed: 0.003, color: 0xe2bf7d, textureUrl: null, hasRings: true, // Aciona via booleano `hasRings` a criação procedimental em RingGeometry para discos de acreção orbitais.
        moons: [ { id: 'titan', name: "Titã", radius: 0.9, dist: 19.5, speed: 0.022, color: 0xdca842, data: { distSol: "1,4 B km", size: "5.149 km", atm: "Nitrogênio Denso", temp: "-179°C", fact: "Único satélite do sistema com uma atmosfera densa e ciclos hidrológicos ativos baseados em metano e etano líquidos." } } ], // Metadados físicos atmosféricos do satélite de Titã.
        data: { distSol: "1,4 B km", size: "116.460 km", atm: "Hidrogênio e Hélio", temp: "-139°C", fact: "Seus anéis são compostos por bilhões de partículas de gelo puro e rocha, cujo plano possui menos de 10 metros de espessura vertical." } }, // Anotação informacional baseada na espessura do plano equatorial de detritos.
    uranus: { name: "Urano", type: "Gigante de Gelo", radius: 4.8, dist: 540, speed: 0.001, color: 0x71b2c9, textureUrl: null, // Planeta gasoso sem textura associada, cor difusa dependente de calibração puramente PBR do ambiente de iluminação.
        data: { distSol: "2,9 B km", size: "50.724 km", atm: "Hidrogênio, Hélio e Metano", temp: "-197°C", fact: "Possui uma obliquidade extrema de 98°, fazendo com que o planeta rotacione praticamente deitado em sua linha de trânsito." } }, // Dado educacional sobre o vetor angular de rotação de Urano.
    neptune: { name: "Netuno", type: "Gigante de Gelo", radius: 4.6, dist: 660, speed: 0.0008, color: 0x274687, textureUrl: null, // Define Netuno, cor sólida com materialização que exige espalhamento especular baixo.
        data: { distSol: "4,5 B km", size: "49.244 km", atm: "Hidrogênio, Hélio e Metano", temp: "-201°C", fact: "Exibe os ventos mais violentos do Sistema Solar, atingindo velocidades supersônicas de até 2.100 km/h." } } // Fato atrelado à velocidade fluida do ambiente Netuniano.
}; // Encerra objeto celestial de simulação.

let scene, camera, renderer, controls, clock; // Declara instâncias globais centrais e vitais para o contexto persistente de renderização no Three.js.
let planetsSystem = []; // Array alocado para armazenamento de grupos vetoriais planetários garantindo as atualizações no loop principal.
let raycasterObjects = []; // Previne a varredura linear total na cena registrando apenas os volumes sensíveis a cliques computados (hitboxes).
let starfieldPoints = null; // Armazena a referência para a malha procedimental do campo estelar dinâmico com shaders customizados.
let focusedPlanetMesh = null; // Ponteiro para o nó (mesh) selecionado do alvo do foco de transição orbital do sistema de câmera.

const previousTargetPos = new THREE.Vector3(); // Aloca buffer vetorial contínuo para interpolação espacial prévia da câmera entre os quadros.
const targetCamPos = new THREE.Vector3(); // Aloca buffer vetorial contínuo indicando o destino da interpolação de movimento do ponto de vista.
let isLerpingCamera = false; // Controle de estado lógico booleano ativando o cálculo de LERP vetorial (interpolação linear) fluida para a câmera.

let orbitsActive = true; // Flag ativadora de update do movimento angular da rotação dos planetas e translação global ao redor do corpo central.
let moonsActive = true; // Flag ativadora do micro-movimento síncrono das pivot groups das órbitas lunares.
let issActive = true; // Flag que autoriza o processamento rotacional sub-orbital das matrizes estáticas dedicadas ao modelo artificial da ISS.

const sharedSphereGeo = new THREE.SphereGeometry(1, 64, 64); // Define uma geometria 3D compartilhada de altíssima subdivisão visando otimização intensiva do buffer VRAM na GPU.
const sharedLowPolyGeo = new THREE.SphereGeometry(1, 16, 16); // Instancia a geometria básica esférica aliviando vértices extras para corpos pequenos ou não-renderizáveis, reduzindo carga topológica.
const invisibleHitboxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }); // Material invisível que ignora Z-buffer, processado estritamente para ser a área colisor tangencial dos ponteiros do mouse.

const atmosVertexShader = ` // Início da injeção textual do Shader GLSL nativo de vértice voltado para a difração atmosférica de espalhamento óptico.
    varying vec3 vNormal; // Exporta a normal escalar interpolada vetorial do pixel corrente aos estágios do Fragment Shader para luz orientada.
    varying vec3 vViewPosition; // Define variável de transporte vetorial que rastreará as coordenadas do ponto visto da câmera e o vértice em processamento.
    void main() { // Função centralizada de instrução de hardware.
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); // Converte posições cruas de vértices multiplicando-os pela matriz ModelView (camera-objeto inter-dependência).
        vNormal = normalize(normalMatrix * normal); // Normaliza e projeta as malhas poligonais contra a matriz de deformação local sem estourar dimensões.
        vViewPosition = -mvPosition.xyz; // Capta a linha de visão do espectador calculando o reverso posicional do vetor do objeto transformado.
        gl_Position = projectionMatrix * mvPosition; // Passa o vetor transformado do clip-space à renderização raster do motor do openGL padrão.
    } // Finalização das instruções de vértice.
`; // Fim da demarcação de string para o processamento de GPU de vértice GLSL da atmosfera.

const atmosFragmentShader = ` // Início de string declarando o GLSL fragment pipeline de luz para a reprodução pseudo-física de refração aerostática (espelho coronal).
    varying vec3 vNormal; // Recupera das entradas da pipeline anterior os vetores normais atados à malha.
    varying vec3 vViewPosition; // Recupera a diferença vetorial direcional entre câmera e face do modelo poligonal do espaço bidimensional.
    uniform vec3 uColor; // Vincula uma variável estática manipulável via ponteiro JS externo ditando a saturação global daquela atmosfera particular.
    void main() { // Abre núcleo central de processamento visual por pixel iterativo da GPU.
        vec3 normal = normalize(vNormal); // Garante que vetores de superfície tenham tamanho constante igual a '1' para integridade nos cálculos de ponto.
        vec3 viewDir = normalize(vViewPosition); // Computa em módulo unitário direcional qual a visão exata do usuário até aquele pixel tridimensional.
        float intensity = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0); // O 'Fresnel Efeito', baseia sua escala atenuada na potência da angulação (dot product) entre visão e normais apontando do limite esférico para dentro.
        gl_FragColor = vec4(uColor, 1.0) * intensity; // Projeta o espectro unificado multiplicando a cor global à força de borda isolada criando a sensação etérea gasosa.
    } // Fecha rotina por pixel (fragmento).
`; // Encerra declaração do Fragment Shader base GLSL.

const starVertexShader = ` // Bloco de Vertex Shader que simula oscilações de brilho para os vértices do fundo estrelado procedural da deep space.
    attribute float aPhase; // Atributo em Buffer Array para distribuir aleatoriamente sementes senoidais isoladas a cada uma das estrelas (vértices).
    attribute float aSize; // Atributo individual por vértice alocado estritamente na Float32Array para escalas díspares simulando profundidade focal.
    varying float vAlpha; // Passa para o rasterizador de pixels (fragmento) a cadência dinâmica de transparência atual computada.
    uniform float uTime; // Linka ao Uniform do Three.js injetado em delta tempo dentro do loop render(), sincronizando animações ao relógio master.
    void main() { // Inicializa o fluxo por vértice da malha estelar.
        vAlpha = 0.4 + 0.6 * sin(uTime * 2.5 + aPhase * 6.28); // Computa o 'twinkling' (cintilação) misturando uma constante de claridade a uma variação trigonométrica de base angular.
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); // Atualiza os blocos coordenados matriciais das posições originais da estrela baseando na ótica da cena.
        gl_PointSize = aSize * (350.0 / -mvPosition.z); // Ajusta o scale das point sprites aplicando simulação de atenuação de perspectiva relativa baseada em Z (distância profunda).
        gl_Position = projectionMatrix * mvPosition; // Emite ao raster final a coordenada mapeada ortograficamente para tela 2D a partir da geometria em projeção piramidal.
    } // Finalização do processador escalar.
`; // Conclui bloco de shader do vértice estrelado.

const starFragmentShader = ` // String multilinhas para gerenciar o desfoque de bordas redondas aplicadas sobre geometria puramente retangular de sprite (pontos de gl_Point).
    varying float vAlpha; // Importa as variáveis de cintilação pré-computadas baseadas no tempo e oscilações do Vertex Shader via pipeline interna.
    void main() { // Procedimento primário iterando em todos os blocos de pontos emitidos à GPU.
        float dist = distance(gl_PointCoord, vec2(0.5)); // Mensura via vetores no espaço UV a distância desde o centro do polígono-ponto (0.5, 0.5) em direções radiais.
        if (dist > 0.5) discard; // Rejeição de fragmentos que ultrapassem um disco central, quebrando hard-edges e criando um recorte perfeitamente redondo.
        float alphaSmooth = smoothstep(0.5, 0.1, dist) * vAlpha; // Modifica as bordas do recorte aplicando antialiasing matemático puro para estrelas esfumaçadas nas periferias.
        gl_FragColor = vec4(1.0, 1.0, 1.0, alphaSmooth); // Configura o output como pura luz branca combinada com o decaimento estelar em canal alfa contínuo calculados.
    } // Encerramento diretivo do Fragment.
`; // Fecha a injeção do shader de cor em partículas do plano estrelado profundo.

function init() { // Declara o processo inicial de inicialização e montagem topológica e de hierarquias de motor WebGL inteiro.
    scene = new THREE.Scene(); // Ergue o escopo contextual root principal em qual todos os objetos transformáveis serão organizados numa árvore genealógica de renderização (Scene Graph).
    clock = new THREE.Clock(); // Providencia uma instância de cronometria atrelada a performance real da CPU/GPU servindo pra desvincular o avanço de animações atadas à flutuação no tempo de frame.
    
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 20000); // Cria a câmera matriz definindo FOV em 60 graus, *aspect ratio* condicionado da tela de exibição atual, recorte mínimo proximal (0.1) e clipping plane massivo no horizonte escuro (20K unidades).
    camera.position.set(0, 400, 700); // Situa o centro óptico da câmera numa perspectiva declinante sobre o Equador global do sistema simulado por vetores transladados [X, Y, Z].

    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, powerPreference: "high-performance" }); // Cria núcleo iterativo e contexto WebGL instanciado: Antialiasing multi-amostra previne 'serrilhamento', buffer de profundidade logarítmica elimina Z-Fighting entre faces sobrepostas gigantes e forçamos drivers dedicados sob poder bruto computacional máximo.
    renderer.setSize(window.innerWidth, window.innerHeight); // Preenche exaustivamente todo o grid renderizado com a área disponível no frame retangular mapeado pelo container do navegador hospedeiro.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // THREADING PROTECTIVO: Resguarda baterias via 'thermal throttling'; inibe renderização quad-HD de pixels físicos excedentes que o display e a córnea já desconsideram mas que torram VRAM da placa gráfica ao invocar cálculo redundante.
    
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Instancia o ToneMapping cinematográfico nativo para desconstruir o range puro computacional de luz HDR em RGB LDR legíveis de tela plana mantendo alta-luminância sem desvios e clipar branco-queimado suavemente.
    renderer.toneMappingExposure = 1.2; // Aumenta de maneira artificial o EV da cena geral global ampliando a clareza e alcance de pontos distantes no limiar do escuro absoluto estelar do motor.
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Padroniza o color grading do WebGL de formato linear cru à curva Gama correta codificada sRGB compatível com perfis universais dos monitores e telas mobile.
    
    document.getElementById('canvas-container').appendChild(renderer.domElement); // Incorpora o fluxo matricial em um elemento HTML DOM canvas no escopo do layout criado no DOM virtual injetado previamente na view local do projeto.

    controls = new THREE.OrbitControls(camera, renderer.domElement); // Cria classe helper utilitária para interceptação e cálculo cinemático atrelado à rotação polar atritada pelo usuário, manipulando eventos do canvas com pointer lock indireto.
    controls.enableDamping = true; // Inibe parada súbita da câmera pela inércia pseudo-física garantindo desaceleração vetorial orgânica dos frames após a liberação da pan/rotação em eixos centrais de alvo.
    controls.dampingFactor = 0.05; // Ajusta atrito do damping limitando atrito à variável sutil de decaimento cinemático em transições vetoriais espaciais de rotação suave.
    controls.maxDistance = 8000; // Impede que o scroll negativo da câmera ultrapasse os boundaries estelares criados para abrigar todo sistema evitando *out of bounds* clipping bugs e imersão prejudicada.
    controls.minDistance = 0.5; // Restrição restritiva evitando o trespasso da visão contra ou em colisão à estrutura topológica geométrica sólida atrelada internamente aos vértices da câmera no close up de objetos.

    scene.add(new THREE.AmbientLight(0x0a0a16, 1.2)); // Introduz no contexto de render primário luz ambiente de cor escura profunda para mitigar pitch-black absoluto nas zonas não alcançáveis pelas luzes pontuais globais e suaviza o shadow mapping bruto.
    const sunLight = new THREE.PointLight(0xffffff, 4.5, 5000, 0.5); // Emissão isotrópica radiante simulando o Sol que se desfaz através do método 'inverse-square falloff'. Luz central e brilhante simulando decaimento PBR baseado na dispersão do vácuo virtual em distâncias elevadas no sistema gráfico do mapa tridimensional.
    scene.add(sunLight); // Registra na cena o nó luz-sol como a fonte dominante de computação dos normais difusos baseadas nos ângulos normais de incidência dos asteroides vizinhos da malha.

    Object.keys(celestialData).forEach((key) => { // Estabelece mapeamento em ciclo que consome, instância e distribui sistematicamente as malhas celestes baseando nos registros atados aos índices chave das matrizes construtivas literais do JavaScript listado superiormente.
        const data = celestialData[key]; // Aloca no cache imediato do processador da stack um array associativo das referências individuais para mitigar pesquisas reincidentes ao object hash map principal global iterado pelas funções geradoras posteriores desta fábrica astronômica complexa construída dinamicamente e escalonada progressivamente neste passo iterativo de montagem sistemática procedimentalmente parametrizada e indexada no sistema de construção em loop da fase de setup construtivo e hierárquico das malhas.

        if (key === 'sun') { // Condicional discriminatória para diferenciar os passos de compilação da fonte estelar incandescente frente ao processo de modelagem de albedos esféricos baseados na refração física real, por natureza diametralmente contrária no modelo do Sol que deve omitir iluminação global por ser auto luminoso e fonte da matriz radiativa calculada no mapa de sombras e iluminação de PBR.
            const sunMat = new THREE.MeshBasicMaterial({ color: data.color, map: textureLoader.load(data.textureUrl) }); // Invoca uma sub-classe material unlit que abdica da reatividade do environment map, ignorando PointLights a favor de luz flat projetada em conjunto a mapas texturizados via parser.
            const sunMesh = new THREE.Mesh(sharedSphereGeo, sunMat); // Junta à memória da RAM topologia com shader compondo a forma visual explícita tridimensional central do sistema acoplada ao Mesh raiz do nó.
            sunMesh.scale.set(data.radius, data.radius, data.radius); // Dimensiona uniformemente todos os vetores através de matrizes escalares atreladas à âncora de eixo-local em centro com as variáveis parametrizadas definidas base no arquivo construtivo anterior sem uso de operações complexas transformacionais custosas durante render.
            sunMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius }; // Acopla como buffer auxiliar livre toda carga textual de contexto didático, garantindo a rápida pesquisa nos eventos submetidos pelos raycasters interceptativos em tempo real.
            
            const coronaMat = new THREE.SpriteMaterial({ map: generateCoronaTexture(), blending: THREE.AdditiveBlending, transparent: true, opacity: 0.85 }); // Fabrica um material bidimensional para Sprites com blending aditivo focado em somar os valores lumínicos subjacentes criando um brilho volumétrico simulado intenso em corona esférica de gradiente pseudo-físico programado.
            const coronaSprite = new THREE.Sprite(coronaMat); // Fixa em objeto um quad de malha voltada eternamente aos normais da visão do utilizador simulando a volumetria independente dos giros da estrela do sistema principal em rendering constante sobre o espaço referencial base do corpo mestre solar para simular as flares constantes em propagação no vácuo de raios escalonados procedimental e procedural sobre camadas sobrepostas e calculadas fora do Vertex PBR.
            coronaSprite.scale.set(data.radius * 3.8, data.radius * 3.8, 1.0); // Amplia o eixo da corona projetada do quad plano sem deformar profundidade.
            sunMesh.add(coronaSprite); // Associa hierarquicamente o halo-filho à super-estrutura estelar.

            scene.add(sunMesh); // Consolida e empilha o sol à base geométrica raiz.
            raycasterObjects.push(sunMesh); // Mapeia estaticamente na memória da CPU array vetor para testagem física contínua anti colisão do ponteiro mouse que interceptam malhas.
            planetsSystem.push({ isSun: true, mesh: sunMesh }); // Cria índice dinâmico em memória para o relógio da Engine aplicar o delta animacional sem recriar iteradores constantes a cada framerate subjacente renderizado no update matrix general.
            return; // Bloqueia propagação do fluxo evitando que o Sol ganhe tratamento planar reflexivo dos planetas rochosos de continuação.
        } // Conclui etapa primária geradora da luz emissiva matriz de cálculo do sistema simulado em Three JS por processamento de shaders literais.

        const planetGroup = new THREE.Group(); // Configura um conjunto Pivot nulo abstrato atrelado a origens espaciais 0-0-0 focado em comportar deslocamento e herança matriz do sistema orbitante para facilitar o processo linear matemático e translações de movimento elíptico simplificado sem calcular seno/cosseno local da malha rodopiante própria.
        planetGroup.userData.currentAngle = Math.random() * Math.PI * 2; // Armazena aleatoriedade vetorial de partida distribuindo circunferencialmente planetas entre os 360° em arcos de radiano garantindo uma assimetria natural inicial na visualização geral da perspectiva zenital superior e reduzindo chance de alinhamento visual inicial monótono que não reflita disposições astronômicas realísticas do cosmo.
        planetGroup.userData.speed = data.speed; // Transfere do banco JSON literal o limite angular escalonado simulativo que cada sub-grupo translatará no espaço global comutado pela clock em animações.
        planetGroup.userData.dist = data.dist; // Atribui fisicamente às memórias dinâmicas os limites euclidianos de afastamento relativo contra o nó solar do centro unificado orbitacional estabelecido.

        const pMat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.85, metalness: 0.1 }); // Inicializa núcleo PBR do corpo. Implementa COR DE FALLBACK obrigatória assegurando estabilidade estrutural física cromática sólida quando imagens carregarem com erro, corrompidas ou CORS negado na pipeline de texturas vindas da rede de internet e garante integridade do material mesmo frente a anomalias do parser de rede.
        
        if (data.textureUrl) pMat.map = textureLoader.load(data.textureUrl); // Condiciona requisições atreladas apenas aos planetas com URLs literais. CORS previamente configurado permite sucesso.
        if (data.normalUrl) { // Testa validade do caminho de string de normal-map opcional no banco de referência para gerar sombreamento por pixel sem geometria realística extra aumentando detalhe fino por fake-depth em relevos minúsculos na GPU.
            pMat.normalMap = textureLoader.load(data.normalUrl); // Passa o mapa processado pelo gerador assíncrono à unidade material base referenciada.
            pMat.normalScale.set(0.15, 0.15); // Restringe a perturbação profunda dos normais do atlas mapeado via multiplicadores X Y evitando artefatos de plasticidade excessiva sob iluminação forte especular do sol virtual emitido na cena inteira sobre o PBR e mitigando estouros nos canais de cálculos tangentes dos fragment shaders atrelados à superfície esférica rochosa e de relevo geográfico profundo.
        } // Fim de escopo geográfico texturizado em Normais simulativos por matrizes de canais.
        if (data.specularUrl) { // Disparo se a chave objeto trouxer mapas atados a índice de rugosidades locais para a refletividade variante polar da água/terra do planeta.
            pMat.roughnessMap = textureLoader.load(data.specularUrl); // Acopla aos algoritmos Lambertianos da física microfacet a leitura monocromática definidora das partes reflexivas oceânicas e foscas das cordilheiras e pampas secos.
            pMat.metalness = 0.2; // Modifica limiar condutor especular do planeta ativando difração tipo F0-Fresnel leve do shader de metalicidade base.
        } // Fim da verificação de specular-map PBR do material de reflexos avançado.
        
        // CALIBRAÇÃO PBR AVANÇADA (Exigência do Projeto) // Tag documental referenciando requisitos de calibração baseada em parâmetros termodinâmicos visuais.
        if (key === 'jupiter' || key === 'saturn') { // Checa se a chave iterada no objeto corresponde à categoria de anões gasosos simulados baseados na composição fluida atmosférica em densidade espessa.
            pMat.roughness = 0.6; // Suaviza a terminação da área luminosa definindo como material de superfície gasoso denso Lambertiano sem as bordas pontuais agudas refletivas típicas da umidade sólida ou vidros. Espalhamento difuso otimizado e ajustado.
            pMat.metalness = 0.05; // Elimina reflexos metálicos severos (anomalias em corpos não-condutores puros). A base de metalness praticamente nula estabiliza o modelo de Oren-Nayar subjacente interno do StandardMaterial Threejs para fotorrealismo gasoso puro.
        } // Encerra calibração estrita dos fluidos gigantes e parâmetros de reflexo sem-superfície de Júpiter/Saturno no cálculo material interno da máquina de estados do rasterizador central.
        if (key === 'mars') { // Checa explicitamente condicional paramétrica referente à física geológica única inerente da malha marciana simulada no ciclo renderizador para garantir especificidade de PBR em sua matriz árida vermelha ferruginosa sem brilhos.
            pMat.roughness = 0.9; // Emula uma altíssima absorção espalhada de fótons atrelada à poeira seca rica em óxidos basálticos de ferro marciano, suprimindo o destaque pontual da estrela na geometria.
            pMat.metalness = 0.0; // Isola refletância de espelhos, declarando malha estritamente dielétrica (não-metálica), assegurando que absorva cores base da luz ao invés de atuar em reflexão inalterada difrativa pura gerando tons acinzentados alienígenas estranhos.
        } // Conclui formatação PBR dedicada e ajustada do planeta de característica vermelha super seca via materiais WebGL.

        const pMesh = new THREE.Mesh(sharedSphereGeo, pMat); // Solidifica na engine a abstração de dados integrando a malha esférica global com as propriedades físicas óticas PBR configuradas passo a passo prévio acima associadas ao nodo local instanciado a cada laço repetitivo iterado do banco celestial montado dinamicamente via parser JSON no script processualizado em blocos independentes iterativos e parametrizados na função raiz de subida.
        pMesh.scale.set(data.radius, data.radius, data.radius); // Dimensiona uniformemente matriz volumétrica multiplicadora aos padrões matemáticos atestados.
        pMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius }; // Clona payload informacional para a face do objeto permitindo que queries de intersection capturem os domínios associados na interface HTML ao cruzar raios óticos de intercepto dos ponteiros em raycasting durante as capturas das iterações dos frames.
        raycasterObjects.push(pMesh); // Cataloga para cruzamento dos bounds-boxes com raios matemáticos dos eventos touch/click.
        planetGroup.add(pMesh); // Sincroniza em subgrupo ao eixo-pai (o motor giratório virtual central), o corpo esférico recém modelado na fase computacional de renderização procedimental para os objetos locais definidos no escopo interno.

        if (key === 'earth' || key === 'venus') { // Dispara filtros para astros contendo manto gasoso em volume grande bastante pra transbordar as cascas normais texturizadas e exigir pós processamento via polígonos extras na camada tridimensional local.
            const colorAtm = key === 'earth' ? new THREE.Color(0x2b82c9) : new THREE.Color(0xe0a96d); // Determina hexadecimais vetoriais de base pra colorizar de azul o Nitrogênio ou de sépia avermelhado os sulfuros da pressão estufada venusiana.
            const atmosMat = new THREE.ShaderMaterial({ vertexShader: atmosVertexShader, fragmentShader: atmosFragmentShader, uniforms: { uColor: { value: colorAtm } }, blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true }); // Compila programa dedicado de material por GLSL associando variáveis de estado externas contínuas em *BackSide* permitindo um render da atmosfera tangencial do lado sombreado ao redor de volumes rochosos na profundidade normal dos raios colididos com mistura puramente iluminada tipo alfa.
            const atmosMesh = new THREE.Mesh(sharedSphereGeo, atmosMat); // Instância física malha geométrica e atrela-a como portadora física real da shader esférico customizado atmosférica montado logicamente na alocação da RAM dedicada acima à este ponto vetorial.
            atmosMesh.scale.set(data.radius * 1.12, data.radius * 1.12, data.radius * 1.12); // Dilata o envelope em limites de exatos 12% a partir da casca telúrica permitindo render de subsuperfície aparente em intersecções de z-buffer sem causar flickers distorcidos na renderização gráfica global computacional por precisões em conflito de decaimentos matemáticos de faces idênticas do motor.
            planetGroup.add(atmosMesh); // Anexa em nó filho atado do planeta original criando conjunto síncrono para os giros orbitais uníssonos da cinemática procedural.
        } // Encerra encapsulamento de rotinas associadas a reatividade termodinâmica visual customizada atrelada às cascas translúcidas gasosas densas e emissivas.

        if (data.hasRings) { // Aciona condicional em caso da base JSON fornecer sinal positivo sobre macro estruturas de acreção gravitacional circulares (anéis).
            const ringGeo = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.6, 64); // Procedimentalmente aloca memória na GPU a disco plano de polígonos definindo vazamento circular mínimo na malha interna e extremidade macro exterior gerando subdivisão circular em 64 steps em torno do limite focal polar do objeto anômalo de disco denso e liso de render.
            const ringMat = new THREE.MeshStandardMaterial({ color: 0xbfa37a, side: THREE.DoubleSide, transparent: true, opacity: 0.7, roughness: 0.6 }); // Calibra os cálculos de luz do plano a interagir reativamente e aceitar ambas incidências de face sem clipar normals do z-index, opacidade parcial atenuada difrativa sobre detritos supostos suspensos sob luz intensa pontual solar matriz no shader PBR com base areia escura na difusa.
            const ringMesh = new THREE.Mesh(ringGeo, ringMat); // Junta as malhas e características de reflexão gerando nó espacial do disco procedimental final pronto na RAM alocada e referenciada pelo pointer.
            ringMesh.rotation.x = Math.PI / 2.3; // Aplica matriz rotacional no eixo x local criando uma declinação típica astronômica oblíqua de planos para anular estagnações cartesianas artificiais sem angulações de impacto reais ou perspectivas falsas achatando o 3D por falta de obliquidades inclinadas nos pólos orbitantes celestiais montados matematicamente nas translações matriciais relativas no escopo do pivot local estendido no eixo de z profundo da projeção de vista espacial da camera e do cenário gerado pelas rotinas de montagem progressiva acima detalhadas nas construtoras lógicas subjacentes.
            planetGroup.add(ringMesh); // Registra no aglomerador.
        } // Fecha encapsulador do sistema do construtor de Anéis.

        let moonsArr = []; // Inicia array efêmera no contexto retentor listando referências isoladas dos pequenos sistemas das luas para compilar no loop master as iterações relativas da translação sobreposta local de cada pequena massa e seu pivô próprio de giro sem afetar velocidades primárias centrais.
        if (data.moons) { // Validação de chaves com informações satelitais.
            data.moons.forEach(moonData => { // Mapeia dinamicamente e constrói estruturas para sistemas secundários atados pela força em espiral das massas superiores.
                const moonPivot = new THREE.Group(); // Eixo-pai invisível ancorado perfeitamente no ponto-zero-zero do próprio planeta, girando-o causará uma rotação orbital distanciada dos corpos inseridos ali na ponta.
                const mMat = new THREE.MeshStandardMaterial({ color: moonData.color, roughness: 0.9, metalness: 0.0 }); // Associa à sub-malha rochas simples e primitivas reativamente isoladas em cor e rugosidades altas estáticas sem reflexos parasitas no shader da malha final.
                const moonMesh = new THREE.Mesh(sharedLowPolyGeo, mMat); // Gera face poli menor reutilizada visando abster-se da altíssima densidade em objetos de tela insignificantes, gerando ganho real da otimização contínua de malhas poligonais e reduzindo vértices da contagem mestre de ciclos dos estágios Vertex pipeline via reuso referencial contínuo nas subcamadas do buffer memory heap instanciado no script escopo das variáveis globais originais criadas antes da função construtora.
                moonMesh.scale.set(moonData.radius, moonData.radius, moonData.radius); // Multiplica dimensão unificadora vetorial usando chaves radiais isoladas a cada nó lunar contido nas arrays secundárias do DB.
                moonMesh.position.set(moonData.dist, 0, 0); // Empurra rigidamente sobre x (horizontal relativa do pivot sem rotação aplicada), fixando distância estática transladada longe do baricentro invisível base referencial montada pela arquitetura matricial e cinemática estabelecida na cena orbitante complexa gerada e hierarquizada nos limites em arrays tridimensionais associativas montadas aqui neste loop aninhado.

                const moonHitbox = new THREE.Mesh(sharedLowPolyGeo, invisibleHitboxMat); // Gera duplicata geométrica low poly vinculada material invisível de zero z-write mitigando falhas na precisão tátil nos mobiles que erram clickes dos dedos finos.
                moonHitbox.scale.set(moonData.radius * 3.5, moonData.radius * 3.5, moonData.radius * 3.5); // Hipertrofia virtual do collider tátil. Garante responsividade nos dispositivos móveis expandindo a margem do *raycasting* sem modificar graficamente as dimensões do corpo sólido desenhado visualmente por baixo na tela.
                moonHitbox.position.copy(moonMesh.position); // Clona o estado vetor estrito do corpo real transladado alinhando o interceptador gigante perfeitamente na sua órbita síncrona gerando caixa paralela perfeitamente atrelada sem cálculos adicionais posteriores em processamento.
                moonHitbox.userData = { id: moonData.id, ...moonData.data, name: moonData.name, type: "Satélite Natural", radius: moonData.radius }; // Transfere dados metadados descritores para interface do HUD em captura.
                
                moonPivot.add(moonMesh, moonHitbox); // Aglomera sub-malha e colisor-invisível num sub-pivô de giro orbital local rotativo e de alavanca espacial em relação ao próprio agrupamento.
                raycasterObjects.push(moonHitbox); // Expande repositório linear varrível global de áreas passíveis interações por clicks adicionando sub entidades referenciadas neste construtor.
                planetGroup.add(moonPivot); // Acopla como parente aninhado toda rotina mecânica da Lua aos cálculos hierárquicos do giro completo do planeta correspondente.
                moonsArr.push({ pivot: moonPivot, mesh: moonMesh, speed: moonData.speed }); // Preserva instâncias em variáveis locais com descritores da força motriz aplicável individual de atualização matemática.
            }); // Fim de escopo de montagem lunar por corpo.
        } // Conclui validações satélites normais procedimentais.

        let issPivot; // Declara uma variável temporária escopada local no bloco mestre pra retenção isolada de eixos do projeto do satélite ISS caso aplicável.
        if (data.hasISS) { // Engatilha apenas nas chaves portando o booleano do laboratório sintético em espaço.
            issPivot = new THREE.Group(); // Constrói alavancador matriz de translações dedicadas puramente aos corpos orbitais sintéticos do ambiente referencial sem atrapalhar a física planetária associada à Terra.
            const scaleISS = 0.04; // Estabelece limite fixo ultra diminuto paras componentes da modelagem vetorial rígida de baixa contagem montada abaixo a fim de criar micro modelo renderizável funcional.
            
            const metalSpaceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.15 }); // Shader atrelado simulando mantos super reflexivos térmicos, blindagem de folha prata/alumínio em difusão Lambertiana minúscula.
            const solarPanelMat = new THREE.MeshStandardMaterial({ color: 0x0a2342, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide }); // Matriz emulando camadas fotovoltaicas polimerizadas, muito especular com azul profundo base sem backface culling para render dupla-face.

            const coreMesh = new THREE.Mesh(new THREE.CylinderGeometry(scaleISS, scaleISS, scaleISS * 4, 8), metalSpaceMat); // Cilindro primário para emular módulos tubulares habitáveis pressurizados.
            coreMesh.rotation.x = Math.PI / 2; // Gira longitudinalmente para a linha vetorial alinhando cápsula em posição pseudo-tangencial correta ao invés de pino espetado no campo orbital das gravidades projetadas.
            
            const panel1 = new THREE.Mesh(new THREE.BoxGeometry(scaleISS * 7, scaleISS * 0.1, scaleISS * 1.8), solarPanelMat); // Geometria planar representando gigantescas estruturas receptoras radiativas.
            panel1.position.z = scaleISS * 1.6; // Desloca para formar estruturas aladas afastadas perpendicular do cubo cilíndrico habitável base criado antes.
            const panel2 = panel1.clone(); // Reutiliza RAM clonando propriedades poligonais da matriz primária idêntica montada de aletas fotovoltaicas na linha anterior reduzindo tempo computacional global instanciador.
            panel2.position.z = -(scaleISS * 1.6); // Inverte os polígonos clonados ao pólo cartesiano oposto do referencial interno para construir par simétrico de antenas nas laterais perfeitamente distribuídas na área modelada.

            issPivot.add(coreMesh, panel1, panel2); // Unifica num aglomerador micro as primitivas recém montadas num modelo coerente de uma malha solidária rígida atrelada e de movimentações coesas entre todas as peças modeladas sem precisar atracá-las constantemente frame por frame via processamentos extra de translações espaciais conjuntas na arquitetura matricial global do motor tridimensional e cenas de desenho final emitido em tela rasterizada para a vista final montada na cena gerada e gerenciada via GPU calls na renderização da Engine montada e escalada no projeto inteiro aqui gerado dinamicamente pela classe.
            issPivot.position.set(data.radius + 0.6, 0, 0); // Determina cota altimétrica LEO (Low Earth Orbit) próxima da atmosfera simulada gerada sem adentrar nas malhas gasosas nem distanciar na LUA estática de escala reduzida referencial base das geometrias criadas.

            const issHitbox = new THREE.Mesh(sharedLowPolyGeo, invisibleHitboxMat); // Dispara construtor reverso pra caixa tátil para capturar os minúsculos botões e toques da interação na área dos monitores portáteis de pixels muito diminutos para capturar.
            issHitbox.scale.set(0.6, 0.6, 0.6); // Amplifica a área morta invisível até que possibilite o usuário capturar click a despeito do modelo micro métrico original visual gerado sob malhas poli antes desta linha gerencial auxiliar implementada na hierarquia dos objetos locais atados e indexados pela engine construtora iterativa desta etapa em loop contínuo e progressivo na matriz primária construtora das geometrias dinâmicas montadas com parâmetros espaciais arbitrários e didáticos escalonados em logaritmo do construtor inicial referenciado lá acima pelas constantes estáticas imutáveis.
            issHitbox.position.copy(issPivot.position); // Espelha matriz cartesiana entre o sólido translúcido interativo colisor cego e o modelo final agrupado tridimensional complexo.
            issHitbox.userData = { id: 'iss', ...issData, radius: scaleISS * 3 }; // Mescla do array base superior com especificações da hitbox pro hud ler perfeitamente do repositório em cache.

            const issRotator = new THREE.Group(); // Novo braço de alavancagem invisível atado no próprio Equador do planeta base hospedeiro e portador original da órbita artificial na geometria de translação espacial.
            issRotator.add(issPivot, issHitbox); // Unifica o agrupamento e o colisor ao transladador circular fixo.
            raycasterObjects.push(issHitbox); // Anexa as propriedades à indexação do cruzador geométrico interativo global.
            planetGroup.add(issRotator); // Incorpora logicamente e espacialmente nas ramificações nodais do grupo estelar mestre referenciado inicialmente a cada giro de laço construtivo desta classe gigante estruturadora do mundo tridimensional virtual gerado e mapeado proceduralmente via constantes associadas no topo em hash maps otimizados sob iteradores lineares simples montando a arvore sem recursões dispendiosas de processamento.
            issPivot = issRotator; // Delega o controle rotacional puro atrelado à matriz contínua em loop temporal de render permitindo cálculos do movimento no tempo.
        } // Conclui construtor da máquina modeladora procedural das miniaturas de estações em órbita do motor gráfico e de matriz física em montagem referenciada no construtor.

        createOrbitLine(data.dist); // Invoca a função desenhadora matricial de traçados transparentes nas rotas pre-definidas orientando o usuário da navegação.
        scene.add(planetGroup); // Descarrega e adiciona permanentemente todo objeto complexo derivado, luado ou anelado criado no escopo ao container centralizado do WebGL.
        planetsSystem.push({ isSun: false, group: planetGroup, pMesh: pMesh, moonsArr: moonsArr, issPivot: issPivot }); // Consolida apontadores indexando referências à memória local permitindo loop render atualizar apenas variáveis necessárias via iterador direto mitigando pesquisa linear por 'Scene.children' excessiva a cada micro frame de ciclo do relógio gerador contínuo de telas progressivamente atreladas aos limites de performance dos dispositivos computacionais.
    }); // Fecha o escopo massivo iterativo de construção do loop inicial parametrizado da engine.

    createDynamicStarfield(); // Chama ativador da lógica emissiva particulada criando um grid falso distanciado na profundidade projetada de fundo da malha.
    connectUserInterface(); // Inicia os ouvintes associados às reações e botões da interface DOM associadas indiretamente com as propriedades do Canvas gerenciado em WebGL interno da aplicação gerada nas linhas e colunas destas constantes declaradas.

    let touchStartPos = new THREE.Vector2(); // Instancia um objeto alocando duas propriedades (x,y) de precisão double-float para armazenar as distâncias vetoriais base dos toques capturados na tela a fim de criar filtros analíticos lógicos matemáticos.
    renderer.domElement.addEventListener('pointerdown', (e) => touchStartPos.set(e.clientX, e.clientY)); // Fixa o ponto euclidiano inicial assim que as camadas sensíveis do ponteiro tocam a camada externa do canvas, marcando origem da medição no frame de tempo gerado localmente pelo listener acionado atrelado.
    renderer.domElement.addEventListener('pointerup', (e) => { // Dispara avaliação diferencial das matrizes geradas de touch após a decolagem do cursor ou dedo do display capacitivo da tela.
        const distClick = touchStartPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY)); // Computa Pitágoras isolando variação entre (x1, y1) da origem salva acima e o novo (x2, y2) no momento da ascensão do estado acionado atrelado ao evento gerado pelo motor javascript em ambiente web browser e DOM nativos.
        if (distClick < 4) executeRaycastSelect(e); // INPUT ANTI-GHOSTING (Requisito Crítico): Caso a distância do movimento no viewport for minúscula (<4px), é interpretado como click intencional; caso exceda, assumimos manipulação OrbitControls de câmera pan/rotate, e a função aborta evitando interações não-solicitadas em alvos móveis acidentalmente pinçados pelos dedos cruzados nos pixels sensíveis da malha de visualização geral e contínua do usuário logado na sessão ativa sob o ambiente renderizado local.
    }); // Fecha blindagem associativa de ponteiros manipuladores do raycast.

    window.addEventListener('resize', onWindowResize); // Ouve evento 'resize' provocado pelo SO avisando que a viewport e canvas devem sofrer adaptações aspect-ratios baseados em matrizes deformadoras para alinhar pixels e limites ortográficos sem destruir o campo visual construído internamente e mantendo otimização contínua da experiência de consumo gerada no front-end simulativo em uso livre ou redimensionamentos forçados em mobile.
} // Encerra arquitetura vital construtiva executada no start up init() do software referenciado nas sub rotinas associativas e lógicas gerenciais instanciadoras.

function generateCoronaTexture() { // Bloco funcional fabricador de bitmaps procedurais utilizando o motor 2D Canvas Context API focado em bypass de carregamentos e redução na dependência de pacotes de dados.
    const canvas = document.createElement('canvas'); // Forja uma instância invisível virtual da tag canvas na memória sem ancorar ao DOM para extração posterior nativa de imagem de pixel base montada programmaticamente em matriz de pixels RGB pura processada por CPU normal e rápida atada ao navegador e seu motor Javascript em runtime nativa limpa sem extensões ativas auxiliares acionadas.
    canvas.width = 512; canvas.height = 512; // Atribui resolução em potência exata de dois otimizando as capacidades embutidas do GPU e MipMapping interno nas texturas embutidas do modelo tridimensional posterior criado em hardware real e processado na rasterização via pipeline.
    const ctx = canvas.getContext('2d'); // Recupera uma API de desenho bidimensional para traçado de polígonos, gradientes, vetores geométricos simples na matrix da alocação de quadros gerada.
    const grad = ctx.createRadialGradient(256, 256, 32, 256, 256, 256); // Compila as ordens matemáticas gerando interpolações radiais coloridas com centro no meio perfeito da malha e espraiando ao seu limite focal na borda extrema da grade associada (512/2).
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)'); // Fixa na origem interna do centro puríssimo e sólido em luz branca estourada mimetizando calor nuclear das fornalhas atômicas de fusão gravitacional estelar base referencial simulada visual.
    grad.addColorStop(0.15, 'rgba(255, 200, 50, 0.8)'); // Decai agudamente para subníveis em amarelo alaranjado opaco em transição simulativa ao envelope plasmático resfriando nas atmosferas externas em dissipação espacial da luz.
    grad.addColorStop(0.45, 'rgba(230, 70, 10, 0.25)'); // Dissolve fortemente via transições alfas opacos simulativos para vermelhos e radiação infravermelha baixa em cintilação nos halos difusos da sub-camada atrelada ao limite geométrico do espaço vazio renderizado e escuro gerando mescla.
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)'); // Termina perfeitamente num vácuo preto total e canal de transparência de zero limitando estéticas feias em arestas cortadas bruscamente nos limites quadrados das primitivas sprite instanciadas em renderização tridimensional acoplada lá na função original de construção e subida dos corpos no Scene Graph tridimensional da aplicação e de suas dependências geradoras de visual dinâmico em framerates processados pela CPU iteradora no laço central associativo do sistema solar parametrizado e hierarquizado aqui simulado via abstração computacional gráfica e códigos da Three JS.
    ctx.fillStyle = grad; // Configura o estilo interno da pintura bidimensional do contexto local focado ao degradê fabricado em constantes de memória prévia em tempo real de execução inicial.
    ctx.fillRect(0, 0, 512, 512); // Derrama as interpolações criadas englobando do (0,0) aos limites absolutos e preenchendo a malha em pixel art lisa interpolada.
    return new THREE.CanvasTexture(canvas); // Exporta conversão instanciada encapsulada injetando metadados requeridos aos samplers fragment shader via Three.js classes especializadas de conversão interna processual atadas nativamente ao parser tridimensional para mapas em texturas lidos via hardware dedicado acelerador das imagens finais acopladas aos buffers em uso simultâneos na RAM alocada e dedicada sem gargalos na thread.
} // Encerra fábrica offscreen de bitmap dinâmico de brilho coronal do projeto.

function createDynamicStarfield() { // Declara função agrupante focada puramente em dispersar massas randômicas e baratas de partículas pelo background vazio.
    const isMobile = window.innerWidth < 768; // Avalia matriz resolutiva heurística inferindo através da largura base de quadros e displays de viewports diminutas os hardwares limitados e limitantes de dispositivos e aparelhos de bolso via browser.
    const countStars = isMobile ? 2000 : 5000; // Altera densidade gerada de pontos baseando na variável resolutiva para evitar instabilidade por VRAM entupida de sub-buffers com milhares de posições flutuantes (fill rate optimization) atada indiretamente ao thermal throttling e limits de bateria dos celulares simulando um cosmos denso o suficiente via percepção ocular enganada pelo espaço e tempo associados na lógica do vertex process.
    
    const geo = new THREE.BufferGeometry(); // Inicia esqueleto de buffer esparsamente indexável otimizado focado puramente em vetores primitivos alinhados em arrays puros base na arquitetura de tipagem rígida Float32 reduzindo garbage collector javascript delays associados no runtime engine de rendering atado.
    const positions = new Float32Array(countStars * 3); // Pre-aloca montantes lineares na heap da ram baseados estritamente na necessidade (XYZ) por contagem global isolada previnindo overhead memory.
    const phases = new Float32Array(countStars); // Estoca fase temporal de cintilação desincronizada em canais unitários escalares.
    const sizes = new Float32Array(countStars); // Reserva buffers paramétricos para espessuras dos points instanciados de modo caótico.

    for(let i = 0; i < countStars; i++) { // Loop forçador de injeção pontual aleatória focado na alocação veloz dos arrays de ponto flutuante construídos no construtor anterior.
        const r = 2500 + Math.random() * 3500; // Define e joga matematicamente em raios orbitais extremos para forçar render a manter os pontos fora dos limites internos de colisão atrelados ao motor central estelar dos planetas (acima das 2000 unidades distantes geradoras).
        const theta = Math.random() * Math.PI * 2; // Distribui ângulo azimutal horizontal preenchendo uniformemente porções tangenciais do plano cartesiano em 360 variando posicionalidades no horizonte.
        const phi = Math.acos((Math.random() * 2) - 1); // Extrai matematicamente desvios inclinados uniformemente de esferas sem acumulação exagerada nos polos via o arcocosseno para distribuição hemisférica randômica homogênea realística da esfera infinita celeste e evitando clumping points polarizados artificialmente na montagem da abóboda atada.

        positions[i*3] = r * Math.sin(phi) * Math.cos(theta); // Converte posições puramente polares aos moldes tridimensionais do motor Three.js inserindo eixo iterado de memória sequencial na malha de X cartesiano correspondente.
        positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta); // Computa projeção no Y usando matriz combinada polar gerando verticalidades puras do sistema.
        positions[i*3+2] = r * Math.cos(phi); // Isola o cálculo trigonométrico base derivativo do aprofundamento espacial (Z) associado puramente aos arcos de Phi estabelecidos matematicamente.

        phases[i] = Math.random(); // Injeta ruído aleatorizado entre zero e um quebrando ritmos estelares uníssonos para animação estocástica fluida e natural.
        sizes[i] = Math.random() * 2.2 + 0.8; // Modela uma variedade escalar variando do imperceptível limite de subpixel 0.8 aos mais inflados e notáveis corpos em estrela de tamanho aparente massificado no plano da renderização processual sem polígonos adicionados.
    } // Encerra preenchimento e povoamento do loop central de dados.

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3)); // Forja o buffer na VRAM delegando chunks iterativos 3-em-3 associados perfeitamente com coordenadas de espaço físico.
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1)); // Atrela aos vértices informações isoladas (1 em 1) da fase de desvio da luz gerada para ser digerida pelos programas de Shader posteriormente.
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1)); // Carrega como input paramétrico unitário as variáveis escalares ao shader nativo.

    const starMat = new THREE.ShaderMaterial({ // Encapsulamento declaratório que invoca interpretador GLSL enviando buffers às instâncias em compilação na placa.
        vertexShader: starVertexShader, // Linka constantes de string literais de Vertex às requisições do processador interno.
        fragmentShader: starFragmentShader, // Conecta as lógicas de pixel/frag via string montada no escopo superior.
        uniforms: { uTime: { value: 0.0 } }, // Estabelece ponto de comunicação viva entre CPU JS via animação loop e GPU shader via variáveis de manipulação e controle constante síncrono.
        transparent: true, // Libera testes complexos de alfa por pixel processado para descartes redondos.
        depthWrite: false, // Otimização crítica: Previne a renderização de profundidade para o universo de fundo estelar mitigando engasgos desnecessários causados pela escrita do Z-buffer focado nos bilhões de cruzamentos translúcidos na vista frontal do ambiente e câmera simulativa montada na viewport.
        blending: THREE.AdditiveBlending // Sobrepõe luminosidades adicionais para emular feixes luminosos e clarão de estrelas conjuntas.
    }); // Fim configuração de Shader das Estrelas em point cloud.

    starfieldPoints = new THREE.Points(geo, starMat); // Junta buffers processados e lógicas GLSL na malha primitiva isolada otimizada pra gerar milhões em sub chamadas simples.
    scene.add(starfieldPoints); // Carrega pra cena global do background.
} // Encerra gerador dinâmico estelar e background procedural.

// Função createProceduralMilkyWay() completamente ELIMINADA para sanar gargalos severos de Fill-Rate. DIRETRIZ DE OTIMIZAÇÃO APLICADA. // Confirmação técnica documentada.

function createOrbitLine(radius) { // Define base construtora do elipse vetorial indicando trânsito rotacional constante e traçado.
    if (radius === 0) return; // Bloqueador impeditivo: O Sol não translada o próprio pivot neste sistema (Raio zero). Função evitada.
    const pts = []; // Memória instanciada vazia para acúmulo das primitivas espaciais geradas baseando em radianos discretos interpolados nas matrizes espaciais sequenciais na montagem poligonal iterada abaixo pelo loop repetitivo atado.
    for(let i = 0; i <= 180; i++) pts.push(new THREE.Vector3(Math.cos(i/180 * Math.PI * 2) * radius, 0, Math.sin(i/180 * Math.PI * 2) * radius)); // Subdivide um disco exato fechado de 360 usando 180 pontos de intersecção interpolando nas tangentes trigonométricas perfeitas gerando o path (trajeto) orbital e alocando e estocando via push no array contínuo vetorial montado acima no bloco lógico das constantes iniciais.
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x3a86ff, transparent: true, opacity: 0.08 }))); // Desenha linhas lineares base nos vértices captados empacotados num objeto Buffer nativo injetando material azul esmaecido pra criar traçados não obstrusivos de HUD atrelados rigidamente aos pontos das órbitas traçadas sem perturbar volume ou iluminação física real da malha.
} // Conclui construtor do caminho rotacional orbitário traçado e alocado.

function executeRaycastSelect(event) { // Instancia interceptador global da máquina de eventos do ponteiro DOM repassada via callbacks isolados processados.
    if (event.target.tagName === 'BUTTON' || event.target.closest('#info-panel') || event.target.closest('#physics-modal') || event.target.closest('#astro-menu')) return; // Filtro protetor: bloqueia a injeção do vetor espacial nas engrenagens de malhas 3D sempre que o usuário aciona uma tag HTML com interface DOM atada e evita sobreposição conflitante de contextos entre a camada layout da aplicação e o engine de rasterização no modelo gráfico.
    const mouseCoords = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1); // Extrai e normaliza posições (pixel based) do viewport do browser formatando pro modelo padrão matricial unitário de (-1 à 1) NDC (Normalized Device Coordinates) essenciais pros cálculos lineares focais da biblioteca gráfica renderizadora do WebGL processual montado nas sub rotinas associativas e matrizes piramidais atadas à perspectiva de campo focal.
    const raycaster = new THREE.Raycaster(); // Prepara construtor de emissão laser ótica orientada nas linhas colineares base de profundidade e matriz.
    raycaster.setFromCamera(mouseCoords, camera); // Estabelece vetor de origem e caminho injetando coordenadas bidimensionais cruzando a lente distorciva orientada pela matriz perspectiva da camera instanciada e global do projeto renderizado na tela e canvas associado via processador.
    const intersects = raycaster.intersectObjects(raycasterObjects); // Computa intensamente a interseção testando polígono contra o raio invisível isolando array com elementos impactados gerando hitboxes ordenadas pela proximidade base do centro de visão.
    if (intersects.length > 0) focusAstro(intersects[0].object); // Interceptador lógico que atesta hits concretos injetando o objeto mais denso e frontal retornado aos processos de aproximação automatizada e interpolação linear fluida atrelados às câmeras orbitais na cena 3d.
} // Fim raycaster gerenciador processual tátil da tela associada aos colisores das malhas planetárias instanciadas.

function focusAstro(mesh) { // Centraliza máquina de estados focada em transição polar e interpolação fluida das câmeras baseadas em cliques sobre os hitboxes procedimentais.
    if (focusedPlanetMesh === mesh) { resetCamera(); return; } // Comutador (Toggle) protetivo: reverter zoom e focar origens no overview caso malha atual idêntica seja acionada sucessivamente anulando sobreposições repetidas sem sentido aparente e resets intermitentes sem avanço.
    const info = mesh.userData; // Desempacota payload de memória alocado nas passagens do banco original acoplando dados em tempo real da interface HTML interligada.
    focusedPlanetMesh = mesh; // Substitui no state global a referência matriz da câmera travando-a ao eixo rotativo associado do astro interpelado pela busca via mouse da raycast base construída pela engine e renderizadora global iterativa.
    focusedPlanetMesh.getWorldPosition(previousTargetPos); // Atualiza referencial lendo distâncias absolutas sobre o baricentro (0,0) evitando offset e deslizes do pivot local da malha rodopiante isolada na hierarquia parentesco construída na iterativa montagem do universo base gerado por este código massivo acoplado a CPU e RAM processual.
    
    const r = info.radius || 1; // Resguarda divisões por falha resgatando limites unitários caso astros com erro faltem o registro de raio gerador da geometria esférica atrelada indiretamente.
    targetCamPos.copy(previousTargetPos).add(new THREE.Vector3(r * 2.8, r * 1.2, r * 3.6)); // Adiciona vetores diretos e translações tangenciais criando offset (recuo da lente) de visão baseado em tamanhos do corpo criando ângulos tridimensionais dramáticos perfeitamente embutidos sem invadir massas internas geradoras de polígonos escuros culling sem clip.
    
    isLerpingCamera = true; // Inicia na thread central renderizadora o comutador booleano acionador do cálculo da LERP forçado interpolando em framerate real o andamento e deslize translatório limpo entre eixos.
    controls.enabled = false; // Paralisa interrupções causadas por gestos em paralelo comutando inatividade no controle orbital focado no usuário.

    document.getElementById('planet-name').textContent = info.name; // Injeciona dados reais formatados da física celestial do JSON direto aos containers H2 baseados em id no DOM ativo renderizado e lido assincronamente pelo navegador de hipertexto do projeto.
    document.getElementById('planet-type').textContent = info.type; // Associa campo textual no quadro ao lado referenciando categoria geológica instanciada dinamicamente via iterador associativo gerador.
    document.getElementById('planet-dist').textContent = info.distSol; // Renderiza os dados numéricos escalares na String e exibe referências astronômicas espaciais no sistema lateral HUD construído e sobreposto da interface de tela limpa acoplada e sobreposta à WebGL processada contínua sob o viewport e suas margens visíveis.
    document.getElementById('planet-size').textContent = info.size; // Passa do cache para o elemento formatado do HTML o volume das diâmetros absolutos captados das bases construtoras originadas.
    document.getElementById('planet-atm').textContent = info.atm; // Popula composições químicas relativas no sistema gráfico descritivo da malha lateral base associada e reativa.
    document.getElementById('planet-temp').textContent = info.temp; // Demonstra os atributos da termodinâmica média em graus atrelada aos dados.
    document.getElementById('planet-fact').textContent = info.fact; // Descarrega campo puramente informativo denso do banco descritivo de curiosidades e mecânicas planetárias subjacentes na visão lateral do documento processado da tela do canvas dinâmico.
    
    const panel = document.getElementById('info-panel'); // Resgata container flutuante inteiro para forçar chamadas CSS no repositório gerado e manipulado esteticamente via DOM scripts inter-cruzados em transições contínuas e flexíveis base nas propriedades descritivas.
    panel.classList.add('visible'); // Força cascata de estilo via injeção classe ativando transformações X por transição de GPU fluida base nas configurações do Style.css atrelado no link original.
    panel.setAttribute('aria-hidden', 'false'); // Corrige acessibilidade forçando leitores screen reader interpretarem malhas de painel dinâmico em visibilidade gerada em tempo de runtime dinâmico por injeções JS.
} // Encerra lógica orientada por objeto do focalizador animado espacial via clique direcional.

function resetCamera() { // Estrutura padronizadora do estado purista zenital restaurando offsets globais e matrizes orbitais iniciais originais em visão base de afastamento e visualização master do projeto virtual renderizado sem interferências em escala reduzida visualizada sem distúrbios da câmera colada num asteroide solitário focado nos cálculos das linhas anteriores iteradas do construtor de limites do HUD flutuante dinâmico e flexível criado no canvas.
    focusedPlanetMesh = null; // Purga e libera instâncias da RAM focado apontando nulos pros ponteiros do foco tridimensional e alvos de câmera no loop principal associativo.
    isLerpingCamera = false; // Interrompe de imediato forças cinemáticas aditivas de controle de LERP desligando a soma na matriz mestre.
    controls.enabled = true; // Retorna liberdade gestual panorâmica integral aos utilizadores reativando handlers no listener isolado.
    camera.position.set(0, 400, 700); // Recoloca violentamente a matriz óptica nas delimitações originárias do Equador inclinado montado em hard code na parte inicial do código.
    controls.target.set(0, 0, 0); // Destranca a base referencial pivotada apontando e recentrando o baricentro gravitacional unificado (Sol original de origem universal).
    
    const panel = document.getElementById('info-panel'); // Resgata elemento visual painel informativo associado para reverter fluxos descritivos via script forçado e injetado sob as regras CSS da camada layout.
    panel.classList.remove('visible'); // Purga estado flutuante da DOM forçando deslize para margens mortas (-400px direita) sumindo via otimização GPU da exibição da tela base gerada e limpa pelo raster interligado via eventos manipuladores constantes.
    panel.setAttribute('aria-hidden', 'true'); // Reforça estado para acessibilidade em oculto mascarando componentes aos leitores das áreas mortas de view.
} // Conclui gerenciador limpante de estados globais de visão tridimensional do motor.

function connectUserInterface() { // Compila função empacotadora anexadora de interações mecânicas atadas aos DOMs não embutidos nas geometrias ThreeJS base montadas nas chamadas gráficas da aplicação principal.
    document.querySelectorAll('.astro-btn').forEach(btn => { // Itera nó por nó as classes atadas criando múltiplos conectores e emissores autônomos escopados sem poluir arrays isolados lógicos associados aos elementos literais ancorados nos menus botões descritivos e colunas estruturadoras organizadas do HTML dinâmico original.
        btn.addEventListener('click', (e) => { // Transfere a responsabilidade para cada clique invocar lógicas lidas e mapeadas no escopo e referências extraídas dos campos customizados gerados e atrelados indiretamente.
            const targetId = e.target.getAttribute('data-target'); // Retira chaves únicas do atributo estático HTML isolando a raiz do clique alvo sem depender da malha gráfica para busca nos dados montados inicialmente.
            const foundMesh = raycasterObjects.find(obj => obj.userData.id === targetId); // Varre array isolada dos interceptadores físicos comparando identificador extraído com base guardada no mesh, filtrando objetos não relacionáveis na matriz montada sem invocar loops longos iterativos de Scene.children e mitigando frame-drops e freezes lógicos.
            if (foundMesh) focusAstro(foundMesh); // Dispara máquina estado focal caso retorno aponte malha viva presente nas variáveis estáticas armazenadas na array global.
        }); // Fim de event list isolado do btn.
    }); // Fecha loop acoplador do menu astro focado nas ações.

    document.getElementById('close-panel').addEventListener('click', resetCamera); // Delega reações restauradoras puras de câmera a X lateral dos campos associativos atrelados nativamente ao botão flutuante oculto em HTML vivo gerado pela view construída e compilada sem perdas de referências puras.
    document.getElementById('btn-reset').addEventListener('click', resetCamera); // Extende mesma reação de overview panorâmica original a um segundo botão em header visando redundância de opções nos painéis frontais manipuláveis ao alcance intuitivo de usabilidade.
    document.getElementById('btn-view').addEventListener('click', () => { resetCamera(); camera.position.set(0, 950, 0.1); }); // Mescla o limpador com offset polarizando a perspectiva pro teto exato da cena criando um top-down orthographic pseudo-view do sistema completo traçado a partir do equador perpendicular base e recuo profundo na cota cartesiana no ar e visual puro do ambiente processual.

    // DIRETRIZ DE OTIMIZAÇÃO: Lógica do botão da Via-Láctea (btn-toggle-galaxy) removida integralmente para desonerar pipeline móvel e extirpar funções inúteis ao foco central PBR. // Marcação referencial de refatoração arquitetural aplicada.

    document.getElementById('btn-toggle-planets').addEventListener('click', (e) => { orbitsActive = !orbitsActive; e.target.classList.toggle('active'); }); // Altera valor polarizador e atualiza UI visual para indicar repouso nos movimentos gerais iterados do loop mestre matriz da Engine Three JS manipulada pela variável global reativa atada indiretamente.
    document.getElementById('btn-toggle-moons').addEventListener('click', (e) => { moonsActive = !moonsActive; e.target.classList.toggle('active'); }); // Dispara congelamento vetorial unicamente das ramificações em pivôs lunares e satelitais sem abortar lógicas translatórias maciças e rotações de eixos originais puras no centro da massa gravitacional associada aos planetas base instanciados originalmente pela matriz construtora estendida na RAM e processador.
    document.getElementById('btn-toggle-iss').addEventListener('click', (e) => { issActive = !issActive; e.target.classList.toggle('active'); }); // Encerra rotação contínua nos cálculos radianos iterativos emulados pelo núcleo centralizador focado num satélite minúsculo artificial renderizado dinamicamente em escala.

    const pModal = document.getElementById('physics-modal'); // Recolhe no escopo as referências de memória dom base embutidas para gerenciar as trocas diretas em janelas explicativas teóricas e acadêmicas de base informacional e didática de exibição central focado sem interromper fundo animado renderizado em hardware pelo canvas ativo.
    document.getElementById('btn-physics').addEventListener('click', () => pModal.classList.remove('hidden')); // Invoca sobreposição de interface semitransparente via troca de chaves da classe no elemento recuperado em tempo contínuo.
    document.getElementById('close-physics').addEventListener('click', () => pModal.classList.add('hidden')); // Reverte visualidades da sobreposição do frame modal didático sem purgar informações HTML em processamento de base no cache.
} // Fim de sub rotina concentradora de listeners lógicos e handlers de reatividade paralela à matriz.

function onWindowResize() { // Função adaptativa para calibração passiva do render face distorções de tamanho baseadas em eventos assíncronos da janela.
    camera.aspect = window.innerWidth / window.innerHeight; // Corrige distorção achatadora nas lentes recalculando quociente entre base e altura em atualização de limite ótico constante e puro em variação geométrica atrelada ao limite estendido via DOM listener manipulador do hardware sem refazer ou alocar memória desnecessária extra no heap da VRAM construtora da cena de background e cena 3d atada via buffers paralelos inter-ligados.
    camera.updateProjectionMatrix(); // Comunica alterações obrigatórias e recalibrações na matriz original de visão pra aplicar conversão do aspecto lido acima na renderização sem gerar artefatos espichados nas geometrias esféricas perfeitas criadas.
    renderer.setSize(window.innerWidth, window.innerHeight); // Atualiza preenchimento nativo base sem restrições estendendo o pixel art ao canvas redesenhado e expandido pelas dimensões limítrofes atualizadas no evento disparador contínuo montado nas camadas externas de ambiente iterativo puro sem instabilidade visual dos campos processados no ThreeJS instanciador e renderizador global unificado.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // THREADING PROTECTIVO REAFIRMADO: Mantém o teto estrito na recriação do pixel buffer do frame garantindo mitigação de aquecimentos em resize event disparados por mobile e aparelhos densos atrelados.
} // Encerra otimização adaptável de viewport fluida constante em chamadas sistêmicas isoladas e indiretas.

function animate() { // Declara laço eterno processual iterador mestre (O coração da Engine), disparado indefinidamente empurrando os limites temporais e vetoriais e transformações na CPU ao limite do framerate base estabelecido pelas capacidades de hardware.
    requestAnimationFrame(animate); // Autoconvoca a função no próximo frame agendado pela window garantindo 60fps constantes (se possível) ancorados e limitados ao relógio do monitor em VSYNC puro da máquina hóspede mitigando tearing screen.
    const elapsedTime = clock.getElapsedTime(); // Afere métricas exatas via ponteiro de segundos desde a inicialização do construtor sem atrelar a velocidade física do loop aos lags do micro-processador flutuante da arquitetura não bloqueante em javascript isolado atado nativamente e gerencial na interface global do navegador rodando por baixo do motor tridimensional atado e instanciado.

    if (starfieldPoints) starfieldPoints.material.uniforms.uTime.value = elapsedTime; // Emite variável de pulso em constante atualização de tempo na ponteira do shader GLSL da nuvem de pontos gerando as derivadas senoidais que cintilam os vértices isoladamente em animações estocásticas assíncronas processadas na GPU otimizando ciclos CPU iteradores por frame rate.
    
    // DIRETRIZ DE OTIMIZAÇÃO: Animação e transformação da galaxyPoints (Via-Láctea) removidas do loop para salvar ms e aliviar CPU bottleneck em mobiles focando a força no PBR planetário. // Marcação documental.

    planetsSystem.forEach((sys) => { // Itera toda base construída matriz planetária empacotada no repositório de memória num loop unificado por frame limitando pesquisas massivas custosas em arvores hierárquicas não mapeadas via processamento linear nativo javascript e iteradores simples atrelados em array ordenado construtor inicial referenciado por objetos instanciados nas funções anteriores.
        if (sys.isSun) { // Filtro condicional para estrela mestre de origem do ambiente sem matrizes orbitais atreladas externamente ou giros radianos de pivots complexos.
            sys.mesh.rotation.y += 0.001; // Insere micro desvio angular sutil pra não manter mancha estática parada simulando atividade constante térmica e vetorial e spin giroscópico básico atado puramente e isolado no sistema solar e estrela original matriz.
        } else { // Encaminha astros secundários e matrizes derivadas no escopo processual complexo da translação vetorial orbital contínua base na constante das esferas rochosas e gasosas geradas e isoladas no objeto referenciado do ThreeJS.
            sys.pMesh.rotation.y += 0.004; // Impõe giro individual rotacional constante sobre o eixo vertical primário emulando efeito cinemático diurno/noturno contínuo nas malhas renderizadoras da textura instanciadas via shader PBR.

            let systemIsFocused = false; // Bandeira (flag) local efêmera pra interromper forças rotacionais estritas no momento onde aproximações e focações da lente óptica exigem astros estáticos pra viabilizar as leituras e evitar movimentos enjoativos incontroláveis gerando motions sickness do observador.
            if (focusedPlanetMesh) { // Confere existência nula no buffer geral apontador da câmera travada num objeto.
                if (sys.pMesh === focusedPlanetMesh) systemIsFocused = true; // Compara a malha da iteração do loop com o modelo captado isolando seu sistema.
                if (sys.issPivot && sys.issPivot.children.includes(focusedPlanetMesh)) systemIsFocused = true; // Derivações hierárquicas e testes para abranger estações montadas nos eixos filhos sub atrelados aos nós do planeta atual rodado no frame gerado.
                if (sys.moonsArr.some(m => m.pivot.children.includes(focusedPlanetMesh))) systemIsFocused = true; // Investiga ramos lunares associativos para brecar matriz rotativa planetária evitando que satélites fujam da lente presa por força orbital de atração geradora.
            } // Encerra lógica e filtragem focada em estagnação do loop vetorial por captura optica e visual.

            if (orbitsActive && !systemIsFocused) { // Comutador binário focado no repouso se interfaces orbitais e congelamentos forem ativos pela interface do DOM e botões manipuláveis originais.
                sys.group.userData.currentAngle += sys.group.userData.speed; // Incrementa as variáveis radianas da memória livre pela velocidade fixa configurada no JSON.
                sys.group.position.x = Math.cos(sys.group.userData.currentAngle) * sys.group.userData.dist; // Aplica matemática trigonométrica tangencial atualizando x por oscilação.
                sys.group.position.z = Math.sin(sys.group.userData.currentAngle) * sys.group.userData.dist; // Extende senos atados à distância simulando a cota Z de translação em pista elíptica uniforme sem invocar processamento vetorial de objetos inteiros por Euler atado no loop processual iterativo continuo da engine Three JS base.
            } // Encerra rotina matriz da locomoção sub orbital interligada e contínua das massas mestre derivadas sem restrições ou paralisações de interação e cliques do ponteiro em viewport da câmera fotorrealista.

            sys.moonsArr.forEach(moon => { if (moonsActive) moon.pivot.rotation.y += moon.speed; }); // Sub-iteração pra ramificar translações e giros aos pivôs menores permitindo animações e sub-sistemas orbitantes em torno de objetos transitando pelo espaço sem problemas e limitações focais base no array originado na montagem dinâmica superior atrelada na memória nativa em loop assíncrono continuo processado na engine tridimensional associativa manipuladora de polígonos isolados.

            if (sys.issPivot && issActive) { // Aplica lógicas restritas aos construtores dos satélites geradores da pequena miniatura humana no sistema de montagem visual dinâmico do planeta habitável.
                sys.issPivot.rotation.y += 0.045; // Empurra num radiano intensivo gerando locomoção supersônica baixa órbita atrelada ao limite geométrico do pivô.
                sys.issPivot.rotation.x += 0.008; // Distorce translação de um circulo normal a uma elipse precessional ligeiramente declinada e giratória sobre os hemisférios simulando inclinação rotativa síncrona visualmente dinâmica.
            } // Conclui micro ajustes em malhas pequenas satelitais associativas.
        } // Encerra controle derivado em todos os construtores não-solares iterados globalmente e sequencialmente.
    }); // Fim forEach processador do grupo planetário orbitando em conjunto na simulação iterativa central de física.

    if (focusedPlanetMesh) { // Disparo seccional que computa transformações vetoriais orientadas do POV visual focadas e exclusivas nas fases transientes e transitórias dos nós alvos.
        const currentTargetPos = new THREE.Vector3(); // Constante alocando temporariamente vetor cru do ponto flutuante pro processamento referencial a cada update contínuo das posições globais mutantes interligadas por loops rotacionais e eixos transladados.
        focusedPlanetMesh.getWorldPosition(currentTargetPos); // Extrai dados absolutos globais purificados por matriz sem offset eliminando a diferença do baricentro 0,0,0 nos cálculos da câmera instanciada.
        const diffVector = new THREE.Vector3().subVectors(currentTargetPos, previousTargetPos); // Cria um vetor diferencial puro medindo oscilação deslocada entre quadro antigo e recém atualizado prevendo percurso fugitivo e deslize da malha rotativa constante do motor original gráfico sem engasgar visualmente por atraso interpolações constantes em movimento dinâmico da base em processamento de dados do frame.

        if (isLerpingCamera) { // Ramo acoplador da transição cinematográfica focada em mover progressivamente no trajeto liso focado no mouse hit disparado do raycast nativo.
            targetCamPos.add(diffVector); // Ajusta o destino em constante fuga da malha atando compensação elíptica evitando distanciamento do centro projetado enquanto move a lente base referenciando o vetor de escape.
            camera.position.lerp(targetCamPos, 0.05); // Aplica interpolação de forma severa baseada no multiplicador escalar suave puxando posições na curvatura assintótica sem pulos agudos framerate dependent.
            controls.target.lerp(currentTargetPos, 0.05); // Interpola direção ótica fov puxando pescoço da câmera para olhar fixo e progressivamente giratório de encontro a área da malha do foco interceptado via clique de transição tridimensional construída.
            if (camera.position.distanceTo(targetCamPos) < 0.1) { isLerpingCamera = false; controls.enabled = true; } // Libera travas de estado após finalizado e detectado micro proximidades quase nulas desligando flags forçadoras e devolvendo autonomia orbit controls para pan/rotate de mouse sem interrupções restritivas no modelo referenciado visual e simulado dinamicamente gerado neste passo.
        } else { // Ramo para acoplamento e colagem da lente em malhas já capturadas acompanhando os escapes vetoriais elípticos de forma fixa e rígida sobreposta no espaço gerado nativamente iterativo no sistema global.
            camera.position.add(diffVector); // Soma delta posicional do alvo estritamente aos vetores lente acompanhando rigidamente como drone grudado na massa de translação elíptica.
            controls.target.copy(currentTargetPos); // Endurece mira em 100% copiando centro absoluto do núcleo asteroide referenciado.
        } // Conclui verificações de matriz estado na ótica geradora de foco e manipulações de aproximação interpelada.
        previousTargetPos.copy(currentTargetPos); // Sobrescreve para repasse em ciclos do próximo quadro os dados exatos recém finalizados de posicionamento sem causar lixo na memória referencial de cache usada puramente em lógicas matematicas preditivas associadas nos processadores em renderização mestre continua atada ao relógio frame sync.
    } // Finaliza processamentos e fluxos condicionais da visão travada espacial em escopo condicionado lido pelos quadros geradores procedimentais.

    controls.update(); // Manda processador de eventos recalcular atrito pseudo inércia damping amortecido forçado sem engasgos por atualizações externas limitadas no listener de input via dom events indireto na viewport.
    renderer.render(scene, camera); // Consome toda arquitetura de malhas, luzes esféricas shaders construtores e limites focais gerados em cache processando imagem final na buffer bitmap do hardware associativo projetada nativamente ao usuário do navegador sem interrupções.
} // Encerramento diretivo imperativo da rotina renderizadora do loop infinito.

init(); // Deflagra via call root no rodapé isolado de carga o disparo matricial de alocação de memória RAM GPU instanciamento dos construtores globais e funções geradoras de hierarquias de motor WebGL após completada a leitura e pré-compilação do sistema de script Javascript isolado nas chamadas em navegador.

/** // Abre comentário de fechamento estrutural do modulo refatorado limpo.
 * FIM DO SCRIPT DE SIMULAÇÃO ASTROFÍSICA // Indica conclusão e isolamento dos processos lógicos associativos encadeados na arquitetura WebGL refatorada e calibrada de alta performance e física referenciada.
 */ // Fechamento base do fluxo literal.
