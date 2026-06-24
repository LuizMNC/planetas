// Banco de dados dos planetas
const planetsData = {
    mercury: {
        name: "Mercúrio",
        dist: "57,9 milhões de km",
        size: "4.879 km",
        moons: "0",
        atm: "Extremamente fina (Oxigênio, Sódio, Hidrogênio)",
        temp: "-173°C a 427°C",
        fact: "É o planeta mais rápido, orbitando o Sol em apenas 88 dias."
    },
    venus: {
        name: "Vênus",
        dist: "108,2 milhões de km",
        size: "12.104 km",
        moons: "0",
        atm: "Densa (Dióxido de Carbono, Nitrogênio)",
        temp: "462°C",
        fact: "Gira no sentido oposto ao da maioria dos planetas (rotação retrógrada)."
    },
    earth: {
        name: "Terra",
        dist: "149,6 milhões de km",
        size: "12.742 km",
        moons: "1 (Lua)",
        atm: "Nitrogênio (78%), Oxigênio (21%)",
        temp: "15°C",
        fact: "Único planeta conhecido por abrigar vida e possuir água líquida na superfície."
    },
    mars: {
        name: "Marte",
        dist: "227,9 milhões de km",
        size: "6.779 km",
        moons: "2 (Fobos e Deimos)",
        atm: "Fina (Dióxido de Carbono, Argônio, Nitrogênio)",
        temp: "-60°C",
        fact: "Possui o maior vulcão do sistema solar, o Monte Olimpo."
    },
    jupiter: {
        name: "Júpiter",
        dist: "778,5 milhões de km",
        size: "139.820 km",
        moons: "95 (conhecidas)",
        atm: "Hidrogênio, Hélio",
        temp: "-108°C",
        fact: "Sua Grande Mancha Vermelha é uma tempestade gigante que dura há séculos."
    },
    saturn: {
        name: "Saturno",
        dist: "1,4 bilhão de km",
        size: "116.460 km",
        moons: "146 (conhecidas)",
        atm: "Hidrogênio, Hélio",
        temp: "-139°C",
        fact: "Tem o sistema de anéis mais espetacular, feito de pedaços de gelo e rocha."
    },
    uranus: {
        name: "Urano",
        dist: "2,9 bilhões de km",
        size: "50.724 km",
        moons: "28 (conhecidas)",
        atm: "Hidrogênio, Hélio, Metano",
        temp: "-195°C",
        fact: "Gira praticamente 'deitado' de lado, com o eixo inclinado em 98 graus."
    },
    neptune: {
        name: "Netuno",
        dist: "4,5 bilhões de km",
        size: "49.244 km",
        moons: "16 (conhecidas)",
        atm: "Hidrogênio, Hélio, Metano",
        temp: "-200°C",
        fact: "Possui os ventos mais fortes do sistema solar, chegando a 2.100 km/h."
    }
};

// Variáveis de controle de Zoom e Estado
let currentScale = 1;
const zoomSpeed = 0.05;
let isPaused = false;
let is3D = true;

// Seleção de elementos do DOM
const solarSystem = document.getElementById('solar-system');
const infoPanel = document.getElementById('info-panel');
const orbits = document.querySelectorAll('.orbit');
const planets = document.querySelectorAll('.planet');

// Funcionalidade: Clique nos Planetas
planets.forEach(planet => {
    planet.addEventListener('click', (e) => {
        // Impede que o clique afete elementos atrás
        e.stopPropagation(); 
        
        const id = planet.getAttribute('data-id');
        const data = planetsData[id];

        // Popula o painel com os dados
        document.getElementById('planet-name').innerText = data.name;
        document.getElementById('planet-dist').innerText = data.dist;
        document.getElementById('planet-size').innerText = data.size;
        document.getElementById('planet-moons').innerText = data.moons;
        document.getElementById('planet-atm').innerText = data.atm;
        document.getElementById('planet-temp').innerText = data.temp;
        document.getElementById('planet-fact').innerText = data.fact;

        // Mostra o painel
        infoPanel.classList.add('visible');
    });
});

// Fechar painel
document.getElementById('close-panel').addEventListener('click', () => {
    infoPanel.classList.remove('visible');
});

// Funcionalidade: Pausar/Continuar Animação
document.getElementById('btn-pause').addEventListener('click', () => {
    isPaused = !isPaused;
    orbits.forEach(orbit => {
        orbit.style.animationPlayState = isPaused ? 'paused' : 'running';
    });
});

// Funcionalidade: Alternar 2D/3D
document.getElementById('btn-view').addEventListener('click', () => {
    is3D = !is3D;
    updateTransform();
});

// Funcionalidade: Resetar Câmera
document.getElementById('btn-reset').addEventListener('click', () => {
    currentScale = 1;
    is3D = true;
    updateTransform();
});

// Funcionalidade: Zoom com Scroll do Mouse
document.addEventListener('wheel', (e) => {
    // Evita scroll natural da página
    e.preventDefault();
    
    if (e.deltaY < 0) {
        // Scroll para cima: Zoom In
        currentScale += zoomSpeed;
    } else {
        // Scroll para baixo: Zoom Out
        currentScale -= zoomSpeed;
    }

    // Limites de zoom para evitar quebrar o visual
    currentScale = Math.max(0.3, Math.min(currentScale, 3));
    updateTransform();
}, { passive: false });

// Função central para aplicar as transformações CSS no container
function updateTransform() {
    const rotation = is3D ? 'rotateX(60deg)' : 'rotateX(0deg)';
    solarSystem.style.transform = `${rotation} scale(${currentScale})`;
}

// Criação do fundo estrelado dinâmico
function createStars() {
    const universe = document.getElementById('universe');
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.background = 'white';
        // Posição aleatória na tela
        star.style.top = Math.random() * 100 + 'vh';
        star.style.left = Math.random() * 100 + 'vw';
        // Brilho aleatório
        star.style.opacity = Math.random();
        // Colocando as estrelas num plano de fundo distante
        star.style.transform = 'translateZ(-1000px)';
        universe.appendChild(star);
    }
}

// Inicializa as estrelas
createStars();
