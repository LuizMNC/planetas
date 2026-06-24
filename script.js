/** // Documentação base da engine iterativa gráfica.
 * SIMULADOR ASTROFÍSICO 3D - ENGINE DE ALTA FIDELIDADE // Reflete o propósito da simulação no escopo acadêmico.
 * Desenvolvido sob princípios de Computação Gráfica Avançada e PBR // Define as tecnologias de shaders PBR aplicados.
 */ // Fechamento do bloco inicial.

const textureLoader = new THREE.TextureLoader(); // Instancia a classe principal de requisição de texturas assíncronas do Three.js.
textureLoader.setCrossOrigin('anonymous'); // DIRETRIZ CORS APLICADA: Permite carregar texturas de servidores externos sem que o canvas gere um erro fatal por violação de origem.

// Banco de Dados Celestial - Escala Visual Didática Otimizada // Armazena metadados escalonados logicamente para a cena.
const issData = { id: 'iss', name: "Estação Espacial", type: "Laboratório Artificial", distSol: "420 km da Terra", size: "109 metros", atm: "Pressurizada (N2/O2)", temp: "-150°C a 120°C", fact: "Viaja a 27.600 km/h, completando uma órbita completa a cada 92 minutos em queda livre estável." }; // Dados físicos literais base para o laboratório LEO.

const celestialData = { // Matriz associativa abrigando constantes dimensionais, rotacionais e visuais dos corpos orbitais.
    sun: { name: "Sol", type: "Estrela anã amarela (G2V)", radius: 32.0, dist: 0, speed: 0, color: 0xffaa00, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg', data: { distSol: "0 km", size: "1.392.700 km", atm: "Plasma Incandescente", temp: "~5.500 °C (Superfície)", fact: "Concentra 99,86% de toda a massa do Sistema Solar, sustentando a curvatura do espaço-tempo que rege as órbitas." } }, // Bloco construtor primário para a estrela iluminadora central.
    mercury: { name: "Mercúrio", type: "Planeta Rochoso", radius: 1.1, dist: 65, speed: 0.03, color: 0x8c8c8c, textureUrl: 'https://unpkg.com/three-globe/example/img/earth-dark.jpg', data: { distSol: "57,9 M km", size: "4.879 km", atm: "Exosfera Tênue", temp: "-173°C a 427°C", fact: "Devido à ausência de atmosfera espessa para retenção térmica, possui a maior amplitude térmica do sistema." } }, // Variáveis escalares construtoras para o corpo rochoso menor Mercúrio.
    venus: { name: "Vênus", type: "Planeta Rochoso", radius: 1.9, dist: 100, speed: 0.02, color: 0xe3bb76, textureUrl: null, data: { distSol: "108,2 M km", size: "12.104 km", atm: "96% Dióxido de Carbono", temp: "464°C", fact: "O efeito estufa descontrolado em sua atmosfera de alta densidade gera pressões equivalentes a 92 vezes a terrestre." } }, // Planeta Vênus instanciado com render procedimental baseado em cores PBR por falta de textura associada.
    earth: { name: "Terra", type: "Planeta Rochoso", radius: 2.2, dist: 145, speed: 0.015, color: 0x2b82c9, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg', normalUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg', specularUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg', hasISS: true, // Variáveis terrestres compostas contendo mapas de relevo normais e luz difrativa complexa.
        moons: [ { id: 'moon', name: "Lua", radius: 0.6, dist: 5.5, speed: 0.04, color: 0xb0b0b0, data: { distSol: "149,6 M km", size: "3.474 km", atm: "Inexistente", temp: "-130°C a 120°C", fact: "Apresenta acoplamento de maré perfeito (Tidal Locking), rotacionando em sincronia geométrica exata com sua translação." } } ], // Array secundária para montagem sub-orbital dos satélites síncronos lunares terrestres.
        data: { distSol: "149,6 M km", size: "12.742 km", atm: "Nitrogênio e Oxigênio", temp: "15°C", fact: "O único corpo celeste conhecido a abrigar água em três estados físicos simultâneos e atividade biológica complexa." } }, // Fatos didáticos encapsulados para a exibição no DOM lateral.
    mars: { name: "Marte", type: "Planeta Rochoso", radius: 1.5, dist: 195, speed: 0.011, color: 0xb2462e, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1k_color.jpg', // Corpo marciano incluindo a cor hexadecimal calibrada atuando como fallback de rede seguro.
        moons: [ { id: 'phobos', name: "Fobos", radius: 0.4, dist: 3.8, speed: 0.06, color: 0x7a6b5d, data: { distSol: "227,9 M km", size: "22 km", atm: "Nenhuma", temp: "-40°C", fact: "Orbita Marte abaixo da altitude síncrona; forças de maré gravitacionais estão reduzindo seu raio de órbita continuamente." } } ], // Luas secundárias dependentes do grupo pivô marciano atrelado por rotações independentes limitadas.
        data: { distSol: "227,9 M km", size: "6.779 km", atm: "Dióxido de Carbono (Fina)", temp: "-62°C", fact: "Abriga o Monte Olimpo, o maior vulcão em escudo do Sistema Solar, com uma altitude de 21,9 km." } }, // Curiosidades geológicas injetadas no objeto literal lido pela engine renderizadora e interface.
    jupiter: { name: "Júpiter", type: "Gigante Gasoso", radius: 10.5, dist: 290, speed: 0.005, color: 0xb07f35, textureUrl: null, // Júpiter isolado focado no shader PBR sólido dependendo do processador sem o carregamento oneroso de imagens massivas da internet.
        moons: [ { id: 'europa', name: "Europa", radius: 0.7, dist: 17.0, speed: 0.035, color: 0xe0e0e0, data: { distSol: "778,5 M km", size: "3.121 km", atm: "Oxigênio Tênue", temp: "-160°C", fact: "Sua crosta de gelo global oculta um oceano líquido aquecido por forças de maré geradas pela gravidade jupitariana." } } ], // Declaração termodinâmica e gravitacional focada nos corpos gelados galileanos.
        data: { distSol: "778,5 M km", size: "139.820 km", atm: "Hidrogênio e Hélio", temp: "-108°C", fact: "Seu massivo campo magnético gera um cinturão de radiação severo, capturando poeira cósmica e gerando auroras intensas." } }, // Matriz de dados para leitura de propriedades jupiterianas complexas.
    saturn: { name: "Saturno", type: "Gigante Gasoso", radius: 8.5, dist: 410, speed: 0.003, color: 0xe2bf7d, textureUrl: null, hasRings: true, // Flag habilitadora de construtor de toroide complexo para malha de poeira anelar de Saturno.
        moons: [ { id: 'titan', name: "Titã", radius: 0.9, dist: 19.5, speed: 0.022, color: 0xdca842, data: { distSol: "1,4 B km", size: "5.149 km", atm: "Nitrogênio Denso", temp: "-179°C", fact: "Único satélite do sistema com uma atmosfera densa e ciclos hidrológicos ativos baseados em metano e etano líquidos." } } ], // Metadados físicos atmosféricos isolados de Titã para HUD interface visualizada em clique focalizado na tela original.
        data: { distSol: "1,4 B km", size: "116.460 km", atm: "Hidrogênio e Hélio", temp: "-139°C", fact: "Seus anéis são compostos por bilhões de partículas de gelo puro e rocha, cujo plano possui menos de 10 metros de espessura vertical." } }, // Exposição didática sobre física mecânica estelar em torno dos corpos anelados.
    uranus: { name: "Urano", type: "Gigante de Gelo", radius: 4.8, dist: 540, speed: 0.001, color: 0x71b2c9, textureUrl: null, // Define Urano associando parâmetros de translação angular lenta base na distância logarítmica afastada do emissor luminoso mestre projetado.
        data: { distSol: "2,9 B km", size: "50.724 km", atm: "Hidrogênio, Hélio e Metano", temp: "-197°C", fact: "Possui uma obliquidade extrema de 98°, fazendo com que o planeta rotacione praticamente deitado em sua linha de trânsito." } }, // Apontamento educativo sobre o eixo rotacional acoplado estritamente à mecânica astronômica e física angular.
    neptune: { name: "Netuno", type: "Gigante de Gelo", radius: 4.6, dist: 660, speed: 0.0008, color: 0x274687, textureUrl: null, // Constrói último astro gasoso denso em PBR baseado num canal azul escuro fosco via parâmetros de engine e física refletiva limpa sem metalness aparente.
        data: { distSol: "4,5 B km", size: "49.244 km", atm: "Hidrogênio, Hélio e Metano", temp: "-201°C", fact: "Exibe os ventos mais violentos do Sistema Solar, atingindo velocidades supersônicas de até 2.100 km/h." } } // Fato atrelado à velocidade de escoamento e termodinâmica espacial.
}; // Encerra banco processual de corpos tridimensionais lidos pela classe construtora.

let scene, camera, renderer, controls, clock; // Associa e define na memória RAM os ponteiros e objetos centrais base cruciais de render, tempo e manipulação óptica da biblioteca tridimensional WebGL encapsulada em javascript.
let planetsSystem = []; // Array retentora dos grupos pivôs interligados gerados contendo os polígonos a atualizar no loop.
let raycasterObjects = []; // Instancia o canal vetor unificado de leitura focada para testagem de clicks no raio projetado sem varrer arvore inútil inteira.
let starfieldPoints = null; // Guarda matriz global referente à malha base associada dos vertex procedurais das estrelas simuladas.
let focusedPlanetMesh = null; // Ponteiro ativado e mantido sob atualização se a câmera do player forçadamente estiver colada e lerpada sobre algum hitbox associativo.

const previousTargetPos = new THREE.Vector3(); // Reserva alocação constante guardando o frame translatório atrasado da entidade focada computada via tracking vetorial progressivo de interpolação óptica no render mestre do laço animado.
const targetCamPos = new THREE.Vector3(); // Aloca em memória a meta tridimensional alvo final dos cálculos elípticos de deslizamento da visualização óptica guiada e amortecida no Lerp contínuo.
let isLerpingCamera = false; // Comutador lógico autorizador de mesclas frame-a-frame de cálculos radianos associativos na movimentação guiada fluida da câmera livre do observer.

let orbitsActive = true; // Botão lógico que ativa e desativa os multiplicadores cinemáticos na máquina translatória de órbitas no loop de frames da engine.
let moonsActive = true; // Botão lógico permitindo variação da constante angular satelital sem afetar os vetores pais interligados no pivot matrix system do motor.
let issActive = true; // Comutador binário focado no controle dinâmico da minúscula montagem de geometria renderizada artificial associativa ao laboratório Terra.

const sharedSphereGeo = new THREE.SphereGeometry(1, 64, 64); // Cria matriz poligonal esférica de máxima resolução e armazena na placa de vídeo poupando recriação excessiva para cada corpo rochoso mapeado na cena instanciada do loop gerador do banco celestial.
const sharedLowPolyGeo = new THREE.SphereGeometry(1, 16, 16); // Instancia construtor poli enxuto para objetos microscópicos (luas) salvando milhares de drawcalls no processo matricial de rastreamento de tela e processamento de geometria subjacente tridimensional focada em performance alta no frame central.
const invisibleHitboxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }); // Define o shader cru ignorando profundidade de z-buffer projetado e invisível na tela para atuar puramente como malha de colisão invisível focada na melhoria da captação tátil do input no canvas.

const atmosVertexShader = ` // Escopo formatado para GLSL (linguagem shader OpenGL) gerindo cada vértice individual em processadores da malha gasosa esférica.
    varying vec3 vNormal; // Variável pass-through do vertex pro fragment com interpolamento normal.
    varying vec3 vViewPosition; // Armazena deltas lineares entre a face processada e as lentes projetivas geradoras do view.
    void main() { // Função matemática root associada ao núcleo GPU.
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); // Transforma do local-space pro espaço do modelo-visão.
        vNormal = normalize(normalMatrix * normal); // Reduz os tamanhos vetoriais a 1 para o dot product seguro.
        vViewPosition = -mvPosition.xyz; // Inverte visão garantindo leitura positiva no cálculo de incidência frontal.
        gl_Position = projectionMatrix * mvPosition; // Passa ao fragment o espaço clip projetado do Z-buffer nativo.
    } // Finalização escopo GLSL.
`; // Fechamento literal da cadeia de texto Shader de Vertex.

const atmosFragmentShader = ` // Injeção textual das linhas compiladas de iluminação por pixel difuso de atmosfera etérea via OpenGL Shading Language base associativa contínua.
    varying vec3 vNormal; // Resgata valores do processo Vertex anterior.
    varying vec3 vViewPosition; // Resgata direção vetor-lente interpolada.
    uniform vec3 uColor; // Permite ao JS injetar valores dinâmicos RGB ao raster.
    void main() { // Núcleo executável paralelo por cor.
        vec3 normal = normalize(vNormal); // Força normalização.
        vec3 viewDir = normalize(vViewPosition); // Isola apenas a direção angular.
        float intensity = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0); // Efeito Fresnel puríssimo clareando tangentes esféricas e anulando vetores frontais (efeito bolha translúcida).
        gl_FragColor = vec4(uColor, 1.0) * intensity; // Emite output RGBA do pixel mesclado e escurecido no centro do raio processado no ciclo raster da pipeline visual iterada.
    } // Fim GLSL Fragment.
`; // Encerra processador gasoso planetário.

const starVertexShader = ` // Processa oscilação vetorial isolada em tempo de render estelar minimizando ciclos CPU forçando placa de vídeo.
    attribute float aPhase; // Apanha valor aleatório unitário gerado e atrelado no JS array.
    attribute float aSize; // Lê do buffer escalar os raios das estrelas procedimentais virtuais em montagem.
    varying float vAlpha; // Passa ao shader de pixel o canal decaído.
    uniform float uTime; // Variável fluida de clock base injetada pelo script master do loop do programa originador.
    void main() { // Inicia Vertex shader.
        vAlpha = 0.4 + 0.6 * sin(uTime * 2.5 + aPhase * 6.28); // Computa função senoidal com defasagem randômica simulando brilho orgânico variante via matemática trigonométrica pura contínua iterativa acoplada no tempo e oscilada naturalmente em ciclos visíveis a olho nu pelo painel de render em tempo real.
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); // Mapeia vértices puristas nas projeções óticas normais construtoras atreladas às views matriz do ambiente 3d encapsulado virtual.
        gl_PointSize = aSize * (350.0 / -mvPosition.z); // Calcula diminuição atrelada do tamanho focal no campo profundidade via divisão da constante no vetor z.
        gl_Position = projectionMatrix * mvPosition; // Passa dado projetado.
    } // Conclui processamento escalonado geométrico de ponto isolado iterativo paralelo do GPU mestre.
`; // Fim de escopo.

const starFragmentShader = ` // Corta primitivas OpenGL retangulares em circunferências desenhadas base em descarte lógico de alfa lido radialmente a partir da coordenada 0.5 central atada no ponto.
    varying float vAlpha; // Captura opacidade vinda do emissor trigonométrico.
    void main() { // Executável paralelo.
        float dist = distance(gl_PointCoord, vec2(0.5)); // Obtém delta do eixo central UV da geometria nativa associativa do shader.
        if (dist > 0.5) discard; // Secciona quinas descartando pixels do processador.
        float alphaSmooth = smoothstep(0.5, 0.1, dist) * vAlpha; // Efeito de esfumado orgânico anti serrilhado circular nas bordas esféricas pequenas mesclado com seno variante contínuo lido externamente.
        gl_FragColor = vec4(1.0, 1.0, 1.0, alphaSmooth); // Configura branco puro somado ao recorte translúcido nas camadas aditivas mescladas pelo iterador associativo construído previamente na thread renderizadora global mestre.
    } // Finalização.
`; // Fim da string GLSL star map.

function init() { // Processo base vital estruturador responsável por erguer as pontes e links e buffers antes do primeiro frame rolar e despachar iterações do animate master acoplado à render engine nativa da WebGL.
    scene = new THREE.Scene(); // Define o grafo universal root onde tudo é embutido na memória visual processada nos polígonos globais.
    clock = new THREE.Clock(); // Instancia base de relógio atômico lógico focado em mitigar oscilações por drops de frame (Time Delta).
    
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 20000); // Construtor óptico piramidal perspectivo cortando perto do 0.1 limitando fim visual as 20000 units garantindo que o skybox estelar não seja ceifado pelo clipping engine nativo e padrão de render base associado construtivo.
    camera.position.set(0, 400, 700); // Define elevação da lente em cota declinada sobre a planície das órbitas desenhadas tridimensionais associadas aos vértices em repouso gerados procedural e procedimental via JSON lidos nas instâncias posteriores no parser master nativo loop e progressivo.

    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, powerPreference: "high-performance" }); // Compila contexto renderizador requisitando driver gráfico com multi amostra (antialias), profundidade não-linear resolvendo flickering em faces imensas distantes e foco total na performance crua do motor acoplado de hardware processual associativo.
    renderer.setSize(window.innerWidth, window.innerHeight); // Cobre view manipulada com as dimensões totais atreladas na inicialização matriz visual de espaço e limites retangulares da área lida da aba document html pura construtora visual base referencial montada local.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // DIRETRIZ DE HARDWARE: Capa resolução extra de telefones modernos que fritam bateria processando 4x a matriz nativa invisível ao olho nu limitando a multiplicação escalar dos canais frame buffer iterados visualmente a no máximo 2x multiplicador.
    
    // CORREÇÃO CRÍTICA DO THREE.JS (r128) APLICADA: // Documentação explícita do downgrade salvador.
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Mapeia luminosidade brutal infinita aos limites escuros e estourados dos displays sRGB em emulação pseudo química de filme cru cinematográfico gerando naturalismo solar intenso via curva logarítmica nas faces iluminadas das malhas normais associadas de PBR shader.
    renderer.toneMappingExposure = 1.2; // Expõe fotometria forçada ampliando campo sensível da luminosidade renderizada global captada em todos iteradores de faces das esferas associadas geradas nos laços da scene original e câmera ativa montadora e construtiva subjacente em execução constante por ms de framerate em loop.
    renderer.outputEncoding = THREE.sRGBEncoding; // SUBSTITUIÇÃO VITAL: Código retrocompatível que evita o crash instantâneo na versão r128 do script providenciando decodificação sRGB correta sem recorrer à propriedade moderna outputColorSpace das builds r152+.
    
    document.getElementById('canvas-container').appendChild(renderer.domElement); // Incorpora o fluxo matricial montado num nó DOM html processual.

    controls = new THREE.OrbitControls(camera, renderer.domElement); // Gera escopo iterativo matemático permitindo mouse arrastar, dar zoom ou girar em tangentes radianas as coordenadas originais de câmera no centro e alvo pivotante definido por listeners abstratos complexos ocultos do usuário montador inicial via library atrelada construtora.
    controls.enableDamping = true; // Inibe inércia parada dura ativando decaimento numérico simulando inércia natural e orgânica giratória da view.
    controls.dampingFactor = 0.05; // Ajuste no decréscimo friccional da view limitante do zoom drag em transição sutil em iterações normais progressivas frame a frame sem pular steps interpolativos brutos gerados pela base matriz lida no escopo original processado atado ao animate cycle construtor e atualizador da view tridimensional global.
    controls.maxDistance = 8000; // Impede que mouse wheel scroll quebre limites visíveis da cena.
    controls.minDistance = 0.5; // Restrição impeditiva do trespasso geométrico em corpos virtuais associados da matriz na malha render interligada local associada e processada visual iterativa contínua.

    scene.add(new THREE.AmbientLight(0x0a0a16, 1.2)); // Instância luz onipresente azulada nula de profundidade focada no clareamento marginal da sombra dura traseira (Pitch Black mitigado).
    const sunLight = new THREE.PointLight(0xffffff, 4.5, 5000, 0.5); // Estabelece radiador lumínico focal omnidirecional, definindo a força bruta central dissipada pela distância quadrática inversa natural associativa dos cálculos de espalhamento fotônico PBR gerados do WebGL associados nos shaders de cor base.
    scene.add(sunLight); // Encaixa emissor tridimensional central iluminador e renderizador da malha inteira via processador de GPU inter-cruzado.

    Object.keys(celestialData).forEach((key) => { // Laço matriz que lê todas chaves declarativas desempacotando as constantes literais em polígonos vivos PBR no motor Threejs em iterações de construção inicial progressiva contínua alocadora e associadora tridimensional montadora de polígonos.
        const data = celestialData[key]; // Ponteiro alocativo temporário simplificando acessos internos profundos no objeto construtor.

        if (key === 'sun') { // Quebra de pipeline: O Sol demanda render ignorante (sem luz e sombra) não respondendo ao PBR das outras geometrias.
            const sunMat = new THREE.MeshBasicMaterial({ color: data.color, map: textureLoader.load(data.textureUrl) }); // Invoca material básico (Unlit) imutável com aplicação de textura plana crua misturada com mapa hexadecimal originário.
            const sunMesh = new THREE.Mesh(sharedSphereGeo, sunMat); // Amalgama shader básico e vértices otimizados alocados no topo construindo corpo real mestre atrelado à matriz zero zero zero.
            sunMesh.scale.set(data.radius, data.radius, data.radius); // Dimensiona via eixos XYZ o volume unificado radiométrico parametrizado isolado lido por constantes do BD original sem recalcular vértices profundos internos por escalar transform associado iterador progressivo base e render nativo isolado nas primitivas manipuladas do GPU base centralizada atrelada.
            sunMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius }; // Estampa buffer de meta-propriedades descritivas pra consulta paralela em tempo real durante o raycast HUD DOM associativo e informativo lateral.
            
            const coronaMat = new THREE.SpriteMaterial({ map: generateCoronaTexture(), blending: THREE.AdditiveBlending, transparent: true, opacity: 0.85 }); // Fabrica malha planificada em 2D voltada eternamente pra view fundindo luminosidade aos pixels de fundo via cálculo aditivo focado simulando feixe plasma e calor emissivo denso.
            const coronaSprite = new THREE.Sprite(coronaMat); // Junta sprite abstrata 2D ao polígono complexo no iterador montador e construtor gerencial da cena global.
            coronaSprite.scale.set(data.radius * 3.8, data.radius * 3.8, 1.0); // Hipertrofia o card bidimensional para além do horizonte planetário esférico sem esticar a profundidade unitária cega z.
            sunMesh.add(coronaSprite); // Associa halo brilhante ao parentesco estelar garantindo acoplamento fixo matriz de coordenadas gerenciais originais da renderização tridimensional acoplada no pipeline matriz de estados processuais isolado.

            scene.add(sunMesh); // Consolida e insere na cena a megaestrutura estelar pronta e atada nos fluxos lumínicos base criados e instanciados nas lógicas acopladas ao construtor global do ambiente 3D procedimental iterado em loop centralizador de dados e matriz visual renderizadora contínua e interligada de cálculos e físicas subjacentes instanciadas acima via motor Javascript base construtor nativo da engine isolada.
            raycasterObjects.push(sunMesh); // Habilita o rastreador tátil a focar na estrela também via click injeção vetor nativo construtivo gerador sem estourar limites matriciais computados em tempo de tela originado via pointer events cruzados no DOM abstrato iterativo.
            planetsSystem.push({ isSun: true, mesh: sunMesh }); // Estoca o corpo nas memórias mutáveis da thread central do render frame contínuo para atualizações temporais.
            return; // Bloqueia progresso da iteração evitando código PBR rochoso na estrela gasosa iluminadora root referencial criadora.
        } // Conclui etapa emissiva construtora.

        const planetGroup = new THREE.Group(); // Aloca manipulador puramente matemático sem vértices alinhado à origem universal criando manivela invisível da força centrípeta de arrasto orbitacional.
        planetGroup.userData.currentAngle = Math.random() * Math.PI * 2; // Instancia defasagem translatória arbitrária evitando o enfileiramento cênico não realista da montagem iterativa progressiva linear e contínua baseada em geradores construtores sequenciais originando um cenário natural espalhado no plano tangencial elíptico associado puramente aos desvios base trigonométricos dos arcos limitados no escopo randômico processual.
        planetGroup.userData.speed = data.speed; // Transfere velocidade limitante orbital das variáveis estáticas à RAM volátil atrelada do motor manipulador construtivo dinâmico.
        planetGroup.userData.dist = data.dist; // Carrega na RAM o limite elíptico radial distanciador em relação ao núcleo emissor da luz mestre da renderização 3D.

        const pMat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.85, metalness: 0.1 }); // Inicializa polímero shader PBR fisicamente responsivo, ancorando uma COR obrigatória primária como protetor salvaguarda estrutural anti bloqueio caso a internet corte a leitura da imagem mapeadora base e associada ao erro originado em restrições inter dominiais.
        
        if (data.textureUrl) pMat.map = textureLoader.load(data.textureUrl); // Requisição HTTP de bitmap atada à política flexível associativa corrigida da barreira anti bloqueio originado lá na construtora primária inicial do arquivo fonte referenciada no topo construtor instanciado local do gerador procedimental.
        if (data.normalUrl) { // Testa validade do canal micro facetador de profundidade falsa sem gerar novos triângulos.
            pMat.normalMap = textureLoader.load(data.normalUrl); // Injeciona mapa de normais nas matrizes Lambertianas.
            pMat.normalScale.set(0.15, 0.15); // Amortece o ruído de perturbação pra não aparentar plasticidade no limite claro escuro do horizonte PBR.
        } // Fim injetor normal.
        if (data.specularUrl) { // Disparo focado no controle dinâmico da luz nos mares versus terras isoladas.
            pMat.roughnessMap = textureLoader.load(data.specularUrl); // Conecta o buffer preto e branco focado em amortecer os brilhos pontuais originados sobre a malha de iluminação associada via motor rendering central PBR.
            pMat.metalness = 0.2; // Otimiza transição ativando base de espalhamento reflexivo dielétrico focado e processual de luz dura solar instanciada.
        } // Fim injetor especular.
        
        // CALIBRAÇÃO PBR (Refinamento Crítico) // Injeção de ajustes base em física dos materiais reais.
        if (key === 'jupiter' || key === 'saturn') { // Ramo para esferas de fluído super crônico.
            pMat.roughness = 0.6; // Apaga highlights pontiagudos emulando a absorção nebulosa densa esparramada do gás gigante atrelada nos canais reativos da placa renderizadora isolada.
            pMat.metalness = 0.05; // Fixa purismo albedo não-condutor para fotorrealismo gasoso associado sem anomalias nas malhas de luz geradas pela point light.
        } // Encerra calibração fluida densa via material parameters no pipeline de instanciamentos nativos WebGL.
        if (key === 'mars') { // Ramo isolado de manipulação para o ambiente geológico ferroso e ferruginoso marciano estéril associado e mapeado proceduralmente via construtores acopladores e iteradores.
            pMat.roughness = 0.9; // Força absorção total Lambertiana mimetizando silicato seco de grãos soltos.
            pMat.metalness = 0.0; // Desliga difração condutora eliminando reflexo irreal das áreas sombreadas atadas às constantes originadas nativas sem espelhos óticos procedimentais lógicos construídos puramente de malhas shaders base associados.
        } // Conclui modelador estrito geológico marciano base nas propriedades construtoras originadas atadas à iteração instanciadora paralela.

        const pMesh = new THREE.Mesh(sharedSphereGeo, pMat); // Acopla topologia compartilhada esférica aos parâmetros estéticos PBR configurados compondo o corpo rochoso orbitante originado renderizável da malha 3d construída.
        pMesh.scale.set(data.radius, data.radius, data.radius); // Dimensiona proporcionalmente via matriz escaladora originada dos limitadores constantes gerenciais.
        pMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius }; // Estampa matriz cache associativa descritiva didática pro painel injetado do layout DOM flutuante externo base manipulador e leitor de colisões.
        raycasterObjects.push(pMesh); // Indexa o planeta à lista de varredura do laser tátil pointer-click.
        planetGroup.add(pMesh); // Adiciona ao braço giratório mestre focado em translação.

        if (key === 'earth' || key === 'venus') { // Adiciona envelopes atmosféricos pós-processados puramente em malha extra base em custom shader program instanciado na RAM.
            const colorAtm = key === 'earth' ? new THREE.Color(0x2b82c9) : new THREE.Color(0xe0a96d); // Define hexadecimal atrelado.
            const atmosMat = new THREE.ShaderMaterial({ vertexShader: atmosVertexShader, fragmentShader: atmosFragmentShader, uniforms: { uColor: { value: colorAtm } }, blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true }); // Passa programas e matriz retro-direcional back-side pro cálculo da esfera envelopadora atenuando opacidade nas tangentes esféricas processadas de luz gerada pela interseção vetorial ótica do ray e vertex construtivo base referenciado e emutido via compilação on the fly shader language atada na rotina originadora local sem carregar arquivos extra associados e pesados na montagem.
            const atmosMesh = new THREE.Mesh(sharedSphereGeo, atmosMat); // Instancia.
            atmosMesh.scale.set(data.radius * 1.12, data.radius * 1.12, data.radius * 1.12); // Dilata 12% exatos anulando o flickering e sobreposição do corpo principal rochoso abrigado renderizado interno base originado antes.
            planetGroup.add(atmosMesh); // Acopla ao subsistema orbital giratório síncrono.
        } // Finaliza modelador gasoso isolado.

        if (data.hasRings) { // Dispara modelador procedural planar pro disco de poeira e refugo gelado estelar de anéis.
            const ringGeo = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.6, 64); // Traça toroide hiper fino lido base em 64 steps focado no limite interno e exterior limitante isolado e alocado.
            const ringMat = new THREE.MeshStandardMaterial({ color: 0xbfa37a, side: THREE.DoubleSide, transparent: true, opacity: 0.7, roughness: 0.6 }); // Define shader translúcido que suporta colisão de luz de cima e baixo via dual-side culling off pra reatividade luminosa no espaço tridimensional montado visual gerando transparência do albedo e reflexos controlados do motor matriz renderizadora e associada progressiva da placa GPU alocada focado no PBR.
            const ringMesh = new THREE.Mesh(ringGeo, ringMat); // Associa e cria polígono toroide base referencial e planar com propriedades atadas.
            ringMesh.rotation.x = Math.PI / 2.3; // Tombamento axial astronômico inclinando a face fora do plano orbital comum horizontal base de montagem e eixos.
            planetGroup.add(ringMesh); // Consolida e amalgama na força originária rotacional paralela montada global e dinâmica atada.
        } // Conclui construtor circular planar.

        let moonsArr = []; // Prepara ramificação hierárquica base contendo subsistemas rotatórios internos dos satélites síncronos lidos via banco nativo construtor encapsulado das instâncias da classe pai associativa principal iterada.
        if (data.moons) { // Lê matriz condicional de saturação e presenças menores secundárias.
            data.moons.forEach(moonData => { // Itera pequenos fragmentos.
                const moonPivot = new THREE.Group(); // Alavanca invisível paralela atada no núcleo da massa hospedeira focada puramente na translação local restrita do pequeno corpo associado interligado na montagem visual tridimensional geradora.
                const mMat = new THREE.MeshStandardMaterial({ color: moonData.color, roughness: 0.9, metalness: 0.0 }); // Superfície estéril base albedo fosco e seco primitivo.
                const moonMesh = new THREE.Mesh(sharedLowPolyGeo, mMat); // Reutiliza matriz topológica enxuta.
                moonMesh.scale.set(moonData.radius, moonData.radius, moonData.radius); // Escala raios vetoriais atados base no array.
                moonMesh.position.set(moonData.dist, 0, 0); // Fica estacionário na cota afastada, delegando o giro pro pivô original invisível parente na arquitetura de agrupamento das matrizes instanciadas nas constantes originárias locais base atreladas construtoras contínuas em loop renderizadoras na VRAM GPU associada mestre local da thread js nativa isolada paralela e otimizada via motor ThreeJS e WebGL gerador dinâmico de frame buffers iteradores visíveis a tela de usuário logado.

                const moonHitbox = new THREE.Mesh(sharedLowPolyGeo, invisibleHitboxMat); // Dispara criação de protuberância tátil vazia pra mitigar missclicks nos corpos ínfimos e impossíveis de taguear com exatidão microscópica dos dedos e ponteriros em monitores associados limitantes de touch and hover contínuos e flutuantes da UI flutuante instanciada e sobreposta paralelamente originada sem engine 3d auxiliar.
                moonHitbox.scale.set(moonData.radius * 3.5, moonData.radius * 3.5, moonData.radius * 3.5); // Multiplica hitbox.
                moonHitbox.position.copy(moonMesh.position); // Posiciona matriz interligada na mesma cota distante translatória base do corpo filho secundário renderizado internamente.
                moonHitbox.userData = { id: moonData.id, ...moonData.data, name: moonData.name, type: "Satélite Natural", radius: moonData.radius }; // Estampa buffer purista de meta texto DOM.
                
                moonPivot.add(moonMesh, moonHitbox); // Vincula visualização física rochosa mais hitbox interativo cego na dobradiça rotatória matriz translatória isolada baseada proceduralmente e hierarquicamente subordinada no ciclo originado iterador.
                raycasterObjects.push(moonHitbox); // Acrescenta pro catálogo do cruzador de raios base construtor.
                planetGroup.add(moonPivot); // Encaixa ramificação satelital no braço de torque do planeta e agrupamento root associativo instanciador visual montado em loop originário gerando universo.
                moonsArr.push({ pivot: moonPivot, mesh: moonMesh, speed: moonData.speed }); // Reserva dados para o clock frame injetar variações delta constantes animando puramente síncronos e independentes o cenário render associativo procedural iterado originado dinâmico na RAM limpa sem acoplamentos lentos locais do scene master arvore.
            }); // Finaliza iterador microscópico.
        } // Conclui etapa lunar.

        let issPivot; // Reserva temporária pro laboratório mecânico flutuante e espacial LEO da malha interligada atada estritamente à matriz root condicional terra gerada base do dataset primário imutável literais locais instanciados nas matrizes construtoras de escopo restrito das chaves lógicas.
        if (data.hasISS) { // Seletor lógico.
            issPivot = new THREE.Group(); // Base matriz agregadora microscópica LEO alavanca de matriz base originada sem eixos atados ao equador originário planetário tridimensional rochoso base da matriz originadora da engine.
            const scaleISS = 0.04; // Escalonamento purista manual empírico micro-referenciado focado em representação iconográfica da maquete 3D LEO atada.
            
            const metalSpaceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.15 }); // Shader emulador base do alumínio polido com baixa termodinâmica difrativa e alto espalhamento especular gerado de highlights intensos base no mapa nativo PBR renderizador do Threejs r128 limitador.
            const solarPanelMat = new THREE.MeshStandardMaterial({ color: 0x0a2342, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide }); // Shader base placa silício dupla voltada atada na renderização de fotovoltaico polímero azul reflexivo profundo montador nativo procedural dinâmico associado aos raios de bounce da point light central emissiva matriz referencial do sistema root gerado antes.

            const coreMesh = new THREE.Mesh(new THREE.CylinderGeometry(scaleISS, scaleISS, scaleISS * 4, 8), metalSpaceMat); // Construtor base primitivo geométrico cilindro habitacional hermético da matriz maquete artificial base orbital associativa emulando módulos e acoplamentos espaciais na escala micro didática instanciada atrelada e escalonada procedural logarítmica via JS constante.
            coreMesh.rotation.x = Math.PI / 2; // Tombamento longitudinal da matriz.
            
            const panel1 = new THREE.Mesh(new THREE.BoxGeometry(scaleISS * 7, scaleISS * 0.1, scaleISS * 1.8), solarPanelMat); // Aleta coletora fotovoltaica construída em caixa distorcida planificada visual geométrica procedimental instanciada paralela e limpa.
            panel1.position.z = scaleISS * 1.6; // Desvio espacial lateral atado via eixo perpendicular originário montador e afastador.
            const panel2 = panel1.clone(); // Reutiliza malhas poligonais clonando do buffer instanciado pra otimização base construtiva referencial gerencial otimizadora do drawcall matriz contínua da ram alocada e restrita.
            panel2.position.z = -(scaleISS * 1.6); // Espelha matriz cartesiana atada isolada em montagem.

            issPivot.add(coreMesh, panel1, panel2); // Amálgama e une partes atadas formando laboratório rígido flutuante base e associado no escopo restritivo de instâncias sem ramificação externa root poluidora na cena geral global e iterativa do cenário base renderizador originário de cálculos vetoriais complexos PBR físicos baseados na luz associada na cena originária iterada progressivamente nas rotinas JS e lógicas subjacentes no arquivo texto master construtivo manipulador dinâmico de gráficos poligonais.
            issPivot.position.set(data.radius + 0.6, 0, 0); // Determina cota orbital tangencial à exosfera puramente espacial associada e montada na render.

            const issHitbox = new THREE.Mesh(sharedLowPolyGeo, invisibleHitboxMat); // Acopla base colisor cego em escala expandida.
            issHitbox.scale.set(0.6, 0.6, 0.6); // Hipertrofia do domo tátil.
            issHitbox.position.copy(issPivot.position); // Cola base espacial.
            issHitbox.userData = { id: 'iss', ...issData, radius: scaleISS * 3 }; // Acopla metadados vitais didáticos.

            const issRotator = new THREE.Group(); // Base alavancadora invisível giratória matriz acoplada do núcleo base planetário referencial originador.
            issRotator.add(issPivot, issHitbox); // Fixa laboratório e área de detecção cega ao pino giratório invisível originado.
            raycasterObjects.push(issHitbox); // Sincroniza matrizes com o buscador ótico ponteiro matriz.
            planetGroup.add(issRotator); // Adiciona e encerra construção aninhando o subsistema orbital sintético micro no escopo associado tridimensional translatório associativo contínuo planetário macro construído originário iterador progressivo gerador render base.
            issPivot = issRotator; // Delega ponteiros ao controle do braço manivela rotativo invisível do motor.
        } // Conclui LEO.

        createOrbitLine(data.dist); // Invoca plotador de caminhos estelares tangenciais base no buffer geométrico line segmentado interpolado.
        scene.add(planetGroup); // Prende corpo astronômico originado com suas sub massas associativas ao motor master base da view estática de memória RAM atada ao WebGL.
        planetsSystem.push({ isSun: false, group: planetGroup, pMesh: pMesh, moonsArr: moonsArr, issPivot: issPivot }); // Consolida ponteiros efêmeros na matriz base interativa pra serem lidos pelos multiplicadores de frame dinâmico.
    }); // Fim do Loop Construtor Mega do Sistema Solar base.

    createDynamicStarfield(); // Plota shader points no background vazio.
    connectUserInterface(); // Atrela ponteiros reativos aos botões flutuantes HTML associados independentemente do canvas isolado construído e mapeado nativo base DOM virtual injetado no motor browser hospedeiro processador nativo de layouts em cascata atados ao javascript central instanciador manipulador originário.

    let touchStartPos = new THREE.Vector2(); // Isolador matriz puramente vetorial double precisão tátil base originador focado nas marcações de tap tap e pan em drags limitadores da view em dispositivos capacitivos densos.
    renderer.domElement.addEventListener('pointerdown', (e) => touchStartPos.set(e.clientX, e.clientY)); // Grava cota raiz instanciada visualmente no frame em tempo acoplado pela ação do display.
    renderer.domElement.addEventListener('pointerup', (e) => { // Dispara verificações relativas focais em ascensão de ponteiros.
        const distClick = touchStartPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY)); // Modulador distanciamento e pitágoras espacial de pixel base mitigando ghostings acoplados em ações orbitais rotativas atadas no DOM canvas.
        if (distClick < 4) executeRaycastSelect(e); // ANTI-GHOSTING APLICADO: Isola micro movimentos acionando laser intersectador puramente nos limites rígidos sem estourar e acionar por engano em deslizes de câmera base.
    }); // Finaliza blindador matriz input tátil.

    window.addEventListener('resize', onWindowResize); // Ouve redimensionamentos deformantes base janela para instanciar correções da proporção visual projetiva sem refazer texturas puramente readaptando viewport limites matrizes associativas nativas atreladas a placa gráfica instanciada no WebGL inicializador base referenciado no motor isolado do DOM manipulado externamente e readaptativo contínuo sem engasgos nos frames.
} // Encerra arquitetura vital estática montadora de estado da inicialização de render base associado e instanciada pela tag de fim originária procedimental base JS processado e montado na CPU antes dos drawcalls do GPU nativo alocado no driver emissivo de imagens iterativas fluidas da placa processadora isolada do núcleo lógico e alocadora de memórias tridimensionais restritivas.

function generateCoronaTexture() { // Criador base off-screen 2D purista e autônomo.
    const canvas = document.createElement('canvas'); // Forja sem ancorar no display.
    canvas.width = 512; canvas.height = 512; // Modela dimensões perfeitas radianos mipmap otimizado em binários isolados puros.
    const ctx = canvas.getContext('2d'); // Recupera plotador 2D matriz manipuladora limpa sem shaders base hardware atada ao motor isolado DOM.
    const grad = ctx.createRadialGradient(256, 256, 32, 256, 256, 256); // Compila mesclas gradativas radiando da origem central base focado do plano.
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)'); // Sólido luminoso atômico base emissor quente matriz branca atrelada originária sem opacidade de limite alfa atado.
    grad.addColorStop(0.15, 'rgba(255, 200, 50, 0.8)'); // Laranjal amarelo decaído térmico marginal interpolado isolado.
    grad.addColorStop(0.45, 'rgba(230, 70, 10, 0.25)'); // Extrema fraca avermelhada atrelada tangencial atada limite matriz.
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)'); // Esgotamento alfa base e ausência lumínica isolada e invisível purista associada atada e mesclada construtivamente via interpolador rasterizador linear primitivo manipulado pelo JS offscreen em CPU pura atada nativa.
    ctx.fillStyle = grad; // Carrega caneta render associativa interpoladora de preenchimento radial isolado.
    ctx.fillRect(0, 0, 512, 512); // Pinta quadro invisível base instanciador puro sem DOM associado atado gerencialmente isolado local na função efêmera do construtor de mapas textuais.
    return new THREE.CanvasTexture(canvas); // Envelopa matrizes 2D exportando pra 3D parser GPU instanciadora shader matriz leitura isolada limpa e descarregada memória RAM buffer nativo.
} // Encerra gerador bitmap customizado procedimental procedimentalizado atrelado base.

function createDynamicStarfield() { // Populador iterativo massivo das posições puramente coordenadas base instanciadoras.
    const isMobile = window.innerWidth < 768; // Otimizador condicional tela limpa mitigando render denso associativo.
    const countStars = isMobile ? 2000 : 5000; // Escalador numérico atado restritivo.
    
    const geo = new THREE.BufferGeometry(); // Malha crua nula pra alocação otimizada nativa restritiva linear de matriz float isolada base associativa.
    const positions = new Float32Array(countStars * 3); // Prepara canal XYZ em bloco base mem isolado limpo rápido purista manipulado sem objetos atados.
    const phases = new Float32Array(countStars); // Estoca fase estelar instanciadora ruidosa randômica.
    const sizes = new Float32Array(countStars); // Dimensionador escalar individual paramétrico restrito.

    for(let i = 0; i < countStars; i++) { // Força construtiva massiva linear paralela base isolada alocadora ram pura atada.
        const r = 2500 + Math.random() * 3500; // Radius longínquo anti colisão malhas base associativas atadas no equador construtivo.
        const theta = Math.random() * Math.PI * 2; // Arcos radianos distribuídos aleatórios horizonte tangencial isolado nativo instanciador originário paralelo.
        const phi = Math.acos((Math.random() * 2) - 1); // Desvio esférico homogêneo matemático anti alinhamento associado nos polos atrelados matriz originada base polar conversor cartesianos puristas vetoriais gerados dinâmicos e estocásticos no loop contínuo e fechado limitante construtivo numérico procedural.

        positions[i*3] = r * Math.sin(phi) * Math.cos(theta); // Computa matriz XYZ e atrela array linear isolada 3 em 3 instâncias.
        positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta); // Projeção tangente espacial isolada vetorial limpa e direta na memória atada.
        positions[i*3+2] = r * Math.cos(phi); // Atribui Z matriz base calculada matemática pura trigonométrica associada no loop forçada originada e compilada nativa restrita de desvios.

        phases[i] = Math.random(); // Injeta ruído base atado iterador paramétrico purista senoidal.
        sizes[i] = Math.random() * 2.2 + 0.8; // Oscilador escalar atrelado tamanho aparente estrela base.
    } // Encerra construtor point loop nativo isolado progressivo iterativo numérico e procedimental.

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3)); // Carrega no hardware GPU construtivo XYZ atado nativo do objeto construtivo associativo.
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1)); // Atrela constante tempo paramétrico canal base.
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1)); // Envelopa matrizes buffer nativa instanciadora shader isolada atrelada render.

    const starMat = new THREE.ShaderMaterial({ // Associa malhas e lógicas programáveis glsl puras.
        vertexShader: starVertexShader, // Linka strings isoladas e declarativas da função anterior atada nas variáveis referenciadas de memória limpas instanciadas constantes globais.
        fragmentShader: starFragmentShader, // Insere malha de cores cortadas circulares procedimentais atreladas nativas base isoladas da VRAM instanciadora construtora e paralela na execução pixel por tela raster matriz originária isolada matriz.
        uniforms: { uTime: { value: 0.0 } }, // Abre ponte iterativa atada frame clock.
        transparent: true, // Libera mescla canal alfa transparente base.
        depthWrite: false, // Inibe colisão Z-fighting malha background atada limpa mitigando peso GPU VRAM base buffer renderizador instanciador paralelo.
        blending: THREE.AdditiveBlending // Somador luminoso pixels cruzados malha profunda associativa limite construtor originador atrelado base mesclado e processual focado.
    }); // Fim shader.

    starfieldPoints = new THREE.Points(geo, starMat); // Funde pontos abstratos lógicos com visões programadas shader atado isolado originário e progressivo.
    scene.add(starfieldPoints); // Monta o pano de fundo visual atado matrizes associadas mestre.
} // Finaliza background gerador abstrato procedimental via point cloud.

// GALAXY REMOVIDA PARA PRESERVAR FILL-RATE // Restrição aplicada e monitorada base no desempenho restrito GPU móvel.

function createOrbitLine(radius) { // Desenha paths e caminhos tracejados elípticos base isolada indicativa visual.
    if (radius === 0) return; // Filtro sol emissor imovel atado na malha rotacional iterativa pura e isolada e tangencial atada limitante referencial originária matriz nativa.
    const pts = []; // Memória instanciada.
    for(let i = 0; i <= 180; i++) pts.push(new THREE.Vector3(Math.cos(i/180 * Math.PI * 2) * radius, 0, Math.sin(i/180 * Math.PI * 2) * radius)); // Subdivide tangentes preenchendo disco pontual discreto.
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x3a86ff, transparent: true, opacity: 0.08 }))); // Desenha malha purista linha otimizada atada no fundo instanciador referenciador originário associativo transparente.
} // Encerra traçador de caminho.

function executeRaycastSelect(event) { // Manipulador matriz tátil base visual laser disparado click atado DOM interface e eventos paralelos interceptados lógicos.
    if (event.target.tagName === 'BUTTON' || event.target.closest('#info-panel') || event.target.closest('#physics-modal') || event.target.closest('#astro-menu')) return; // Filtro isolador restritivo cliques HTML associativos puristas base evadiendo interações cruzadas malha mal instanciadas renderização base.
    const mouseCoords = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1); // Matriz normalizadora NDC originadora lida via eventos tela isolada base construtor matemático cartesiano.
    const raycaster = new THREE.Raycaster(); // Prepara emissor laser direcional.
    raycaster.setFromCamera(mouseCoords, camera); // Orienta ray do frustum perspectivo associativo matriz montadora lida iterativa e estática na memória restrita VRAM instanciadora.
    const intersects = raycaster.intersectObjects(raycasterObjects); // Computa tangentes cruzadas limitadoras array hitboxes filtradas e associadas atadas limitantes na iteração otimizada mitigando varreduras desnecessárias de malha complexa global lida no cache mestre.
    if (intersects.length > 0) focusAstro(intersects[0].object); // Responde interativamente mesclando aproximações lógicas atadas ao objeto colidido puro renderizado inicial na matriz associada do vetor.
} // Finaliza raycast engine.

function focusAstro(mesh) { // Lerper instanciador matriz translatória câmera visual e atrelada base focado num único hitbox móvel iterativo no loop progressivo das físicas originais instanciadas dinamicamente no render loop frame.
    if (focusedPlanetMesh === mesh) { resetCamera(); return; } // Duplo clique soltador reverso.
    const info = mesh.userData; // Desempacota payload descritivo acadêmico.
    focusedPlanetMesh = mesh; // Trava variável root.
    focusedPlanetMesh.getWorldPosition(previousTargetPos); // Alinha posição matriz tangencial absoluta base focado num vetor dinâmico oscilante atado e extraído do euler euleriano construtor base associado tridimensional isolado original lido via matrizes mundiais limitantes referenciadas sem parentescos atados nos agrupamentos pivôs falsos gerados invisivelmente procedimentais isolados matriz manipulador de eixos paralelos da translação base.
    
    const r = info.radius || 1; // Puxador raio protetivo anti erro nan null buffer.
    targetCamPos.copy(previousTargetPos).add(new THREE.Vector3(r * 2.8, r * 1.2, r * 3.6)); // Adiciona limite recuado tangencial câmera associativa focado e distanciando malhas base escalonadas evitando clips originários na geometria fechada lida na render iterativa processual matriz associada limitante.
    
    isLerpingCamera = true; // Inicia interpolação amortecida forçadora loop contínuo.
    controls.enabled = false; // Desativa conflito tátil paralelo.

    document.getElementById('planet-name').textContent = info.name; // Injeta texto matriz didática JSON atada no DOM limpo gerado.
    document.getElementById('planet-type').textContent = info.type; // Puxa string descritivo geológico associativo.
    document.getElementById('planet-dist').textContent = info.distSol; // Render distância string escalonada purista.
    document.getElementById('planet-size').textContent = info.size; // Expõe volumes didáticos.
    document.getElementById('planet-atm').textContent = info.atm; // Popula gases textuais instanciados base.
    document.getElementById('planet-temp').textContent = info.temp; // Termodinâmica aparente estática base.
    document.getElementById('planet-fact').textContent = info.fact; // Descarrega informações pedagógicas laterais estáticas na aba.
    
    const panel = document.getElementById('info-panel'); // Resgata HUD encapsulador lateral direito.
    panel.classList.add('visible'); // Aciona CSS gpu shader manipulação transform translatória lisa.
    panel.setAttribute('aria-hidden', 'false'); // Corrige leitor telas associativas acessíveis lido nativo restrito puro limpo e atrelado base.
} // Conclui construtor transitório visual ótico.

function resetCamera() { // Purga forçadora reset base panorama visual restrito e limpo originário instanciador no zenith superior.
    focusedPlanetMesh = null; // Apaga travador restritivo base loop iterador matriz associada.
    isLerpingCamera = false; // Purga LERP flags.
    controls.enabled = true; // Devolve atrito manipulável panorâmico originário orbit controls paralelo gerador livre isolado estático atado matriz tangencial paralela limite base euler construído construtivo lido no canvas evento associativo DOM pointer originário instanciador de matriz paralela.
    camera.position.set(0, 400, 700); // Recoloca cota angular matriz tangencial base originária.
    controls.target.set(0, 0, 0); // Trava referencial no núcleo solar (0,0,0).
    
    const panel = document.getElementById('info-panel'); // Selecionador HUD puro lateral DOM isolado.
    panel.classList.remove('visible'); // Retira classe atrelada ocultando off-screen translação matriz gerencial GPU restrita css base.
    panel.setAttribute('aria-hidden', 'true'); // Bloqueia acessibilidade leitor tela nativo isolado restritivo limpo.
} // Fim reset engine câmera iterativa base.

function connectUserInterface() { // Mesclador eventos HTML a motor WebGL matriz isolada gerencial.
    document.querySelectorAll('.astro-btn').forEach(btn => { // Itera links DOM customizados lidos no array NodeList nativa paralela isolada pura javascript mestre.
        btn.addEventListener('click', (e) => { // Instancia evento escopado.
            const targetId = e.target.getAttribute('data-target'); // Extrai chave purista ID string limitadora.
            const foundMesh = raycasterObjects.find(obj => obj.userData.id === targetId); // Mapeia no cache hitboxes base reduzida poupando Scene iterators massivos e custosos atados a processador isolado limitador e rápido referenciado na thread construtiva nativa base iterada limpa e restrita paralela matriz.
            if (foundMesh) focusAstro(foundMesh); // Atira laser indireto acionador de trânsito base focado no matriz associada e originada no cruzador ótico iterativo.
        }); // Fim event isolado click target id mapeado.
    }); // Fecha loop listagem e atrelagem botoes hud nativo js instanciado isolado.

    document.getElementById('close-panel').addEventListener('click', resetCamera); // Listener limpador câmera.
    document.getElementById('btn-reset').addEventListener('click', resetCamera); // Listener redundante reset base.
    document.getElementById('btn-view').addEventListener('click', () => { resetCamera(); camera.position.set(0, 950, 0.1); }); // Puxa panorâmica topo ortográfica paralela e construída limitadora do equador matriz perpendicular z nulo limite e instanciadora visual superior ampla lida na scene base mestre alocada na view ativa estática referenciada base local originária processual matriz gerada lida na viewport original.

    document.getElementById('btn-toggle-planets').addEventListener('click', (e) => { orbitsActive = !orbitsActive; e.target.classList.toggle('active'); }); // Comutador radiano planetas lido na flags bool.
    document.getElementById('btn-toggle-moons').addEventListener('click', (e) => { moonsActive = !moonsActive; e.target.classList.toggle('active'); }); // Pausa lunar e estática isolada base satélite atado.
    document.getElementById('btn-toggle-iss').addEventListener('click', (e) => { issActive = !issActive; e.target.classList.toggle('active'); }); // Trava construtor LEO isolado micro cinemático em malha atada restrita e processada iterativa limitante gerencial na base originária procedural purista base matriz rotacional associada.

    const pModal = document.getElementById('physics-modal'); // HUD didático central base overlay instanciador originário restritivo limitador DOM css manipulador limpo atrelado puro js lido via html originador matriz e construtores base no dom load do document associado mestre thread limitador instanciador.
    document.getElementById('btn-physics').addEventListener('click', () => pModal.classList.remove('hidden')); // Invoca lido nativo restrito puro limite.
    document.getElementById('close-physics').addEventListener('click', () => pModal.classList.add('hidden')); // Esconde frame base matriz DOM purista paralelo.
} // Fim de escopo conectivo.

function onWindowResize() { // Adota resizes elásticos dinâmicos de resize listener.
    camera.aspect = window.innerWidth / window.innerHeight; // Quociente correção distorção.
    camera.updateProjectionMatrix(); // Comunica matriz limitante lida e construtiva frustum recálculo purista associado.
    renderer.setSize(window.innerWidth, window.innerHeight); // Preenche matriz canva redimensionada livre de lógicas extras interpoladoras densas acopladoras de eixos ou vértices reconstruídos nativos na alocação da VRAM memória limpa referenciadora mestre global atada e isolada render inicializadora.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // DIRETRIZ ESTRITA DE RENDERIZAÇÃO SEGURO: Bloqueador thermal throttle.
} // Conclui redimensionador fluído matriz base lido restritivo.

function animate() { // LOOP MESTRE - O coração oscilador do sistema simulado gráfico gerador.
    requestAnimationFrame(animate); // Recalls base associativa clock VSYNC framerate puro contínuo e dependente.
    const elapsedTime = clock.getElapsedTime(); // Afere segundos puristas limpos base matriz start isolada.

    if (starfieldPoints) starfieldPoints.material.uniforms.uTime.value = elapsedTime; // Emite clock à memória de VRAM e GPU via ponte shader instanciado.

    planetsSystem.forEach((sys) => { // Itera arranjos de memórias mutantes iterativas físicas e cinemáticas atadas.
        if (sys.isSun) { // Sol rotatório autônomo.
            sys.mesh.rotation.y += 0.001; // Spinner lento associado construtor matriz base tangencial atado.
        } else { // Sistemas translatórios complexos subordinados base pivô invisível atrelado origem universal 0,0,0 construtivo matriz isolado purista nativo base restrito.
            sys.pMesh.rotation.y += 0.004; // Diurno e Noturno giro contínuo sobre base própria originária tangencial.

            let systemIsFocused = false; // Bandeira restritora de vôo estático em zoom optico base.
            if (focusedPlanetMesh) { // Checagem purista.
                if (sys.pMesh === focusedPlanetMesh) systemIsFocused = true; // Isola caso coincida instanciador nativo matriz lida em construtor referenciado base gerencial de cache.
                if (sys.issPivot && sys.issPivot.children.includes(focusedPlanetMesh)) systemIsFocused = true; // Valida filhos LEO iterativos ramificados atados ao braço matriz originador lido na árvore isolada iterada progressiva restrita limite base referencial de objeto montado paralelo e instanciado.
                if (sys.moonsArr.some(m => m.pivot.children.includes(focusedPlanetMesh))) systemIsFocused = true; // Checa base atada luas ramificadas evitando arrasto cinemático de fugas.
            } // Conclui varredura de travamento limitante.

            if (orbitsActive && !systemIsFocused) { // Translação radiana atada em flags.
                sys.group.userData.currentAngle += sys.group.userData.speed; // Somador angular base constante progressivo interpolado lido do json inicial construtivo associativo atrelado referencial puro base.
                sys.group.position.x = Math.cos(sys.group.userData.currentAngle) * sys.group.userData.dist; // Distorce matriz tangencial seno base elipse originária no x base limitante construtiva interpoladora limpa nativa.
                sys.group.position.z = Math.sin(sys.group.userData.currentAngle) * sys.group.userData.dist; // Plota em z associando senoides progressivas isoladas base construtor trigonométrico atado limpo render matriz associativa procedimental lida e renderizada pura instanciada nativa paralela thread.
            } // Finaliza construtor elipse radiano iterativo atado e focado base interpoladora contínua e gerencial lida.

            sys.moonsArr.forEach(moon => { if (moonsActive) moon.pivot.rotation.y += moon.speed; }); // Girador lunar em matriz pivô secundária atada base limitante restritiva associativa.

            if (sys.issPivot && issActive) { // Rotinas LEO artificiais.
                sys.issPivot.rotation.y += 0.045; // Translada tangencial rápido associativo baixa órbita matriz originária limitante.
                sys.issPivot.rotation.x += 0.008; // Distorce translação elíptica inclinada simulando progressão atada em hemisfério lida puramente base eixo euleriano matriz construtivo instanciador originário iterado contínuo associativo visual renderizado lido.
            } // Encerra maquete dinâmica flutuante animadora matriz procedimental referenciada no processador JS limite iterativo centralizado base pura.
        } // Finaliza blocos planetários complexos associados no originador forEach mestre do array cache lido e construído originariamente na tag parser limitante da scene matriz.
    }); // Encerra iterações de rotina das engrenagens matriz física simulada atada.

    if (focusedPlanetMesh) { // Ativa caso transições lerp acopladas ocorram base limitadora referencial ótica.
        const currentTargetPos = new THREE.Vector3(); // Alocação purista constante referencial efêmera.
        focusedPlanetMesh.getWorldPosition(currentTargetPos); // Extrai absoluta mundial tangencial isolando euler matriz e arrasto do parente grupo lido e extraído instanciador purista render base contínuo iterado.
        const diffVector = new THREE.Vector3().subVectors(currentTargetPos, previousTargetPos); // Matriz vetor delta isolado lido de posições recuadas em fugas elípticas contínuas lidas restritivas.

        if (isLerpingCamera) { // Ramo interpolação cinemática voo transitório associado construtor limite ótico progressivo lido base matriz euler tangencial.
            targetCamPos.add(diffVector); // Push compensador do trajeto fugitivo da malha rochosa no arrasto originador referencial progressivo.
            camera.position.lerp(targetCamPos, 0.05); // Suaviza a viagem da visão do espectador em limites puristas de interpolação não abrupta focado num trajeto tangente amortecido.
            controls.target.lerp(currentTargetPos, 0.05); // Alinha nuca da lente guiada focada tangencial progressiva amortecida matriz contínua.
            if (camera.position.distanceTo(targetCamPos) < 0.1) { isLerpingCamera = false; controls.enabled = true; } // Destrava rotina e finaliza LERP flag purista devolvendo autonomia matriz originadora livre do escopo gerencial de aproximações.
        } else { // Grude total lente asteroide.
            camera.position.add(diffVector); // Copia delta associativo atado isolado estritamente euler base.
            controls.target.copy(currentTargetPos); // Fixa mira 100% dura atada no núcleo transitivo base originária.
        } // Conclui construtor transitivo de mira matriz acoplada visual ótica referenciada e renderizada na matriz contínua.
        previousTargetPos.copy(currentTargetPos); // Sobrescreve atraso cache transitivo interpolador purista base lido.
    } // Finaliza lerp construtor.

    controls.update(); // Fricciona e computa decaimentos e matrizes lidas no pan originário do pointer nativo listener externo amortecido base.
    renderer.render(scene, camera); // Consome toda a arvore matriz lida originária buffer ram VRAM texturizada e projeta a fotometria final base matriz pixel art render gerencial emissivo no frame buffer do display do monitor matriz lida limpa isolada e construída no GPU nativo e atada.
} // Encerra arquitetura vital e rotina master loop procedimental contínua iterativa.

init(); // Inicia sistema global e inicializador matriz referenciadora construtiva e gerencial atada nativa do Javascript escopado base originária parser do motor.

/** // Injeção textual final documental.
 * FIM DO SCRIPT ASTROFÍSICO PBR // Limite associativo lógico construtivo matriz iterador base simulativo procedural originado na arquitetura limpa otimizadora.
 */ // Fechamento base final diretivo.
