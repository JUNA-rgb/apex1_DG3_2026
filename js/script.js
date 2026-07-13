// ==========================================================================
// BASE DE DATOS DE MONOPLAZAS (APEX SHOWROOM)
// ==========================================================================
const APEX_GARAGE = [
    {
        name: "Formula 1 - Apex Pro", manufacturer: "APEX Advanced Engineering", category: "F1 CLASS",
        power: "1050 CV", weight: "798 KG", engine: "1.6L V6 Turbo Híbrido", ratio: "0.76 KG/CV", difficulty: "EXPERTO MÁXIMO",
        topSpeed: 355, grip: 99, aero: 98, tracks: ["Monza", "Spa", "Silverstone", "Interlagos"]
    },
    {
        name: "Formula 2 - Dallara", manufacturer: "Mecachrome Motorsport", category: "F2 CLASS",
        power: "620 CV", weight: "755 KG", engine: "3.4L V6 Turbo", ratio: "1.21 KG/CV", difficulty: "AVANZADO PRO",
        topSpeed: 335, grip: 95, aero: 92, tracks: ["Monza", "Mónaco", "Red Bull Ring"]
    },
    {
        name: "Formula 3 - Apex Start", manufacturer: "Campos Technology", category: "F3 CLASS",
        power: "380 CV", weight: "673 KG", engine: "3.4L V6 N/A", ratio: "1.77 KG/CV", difficulty: "INTERMEDIO / ROOKIE",
        topSpeed: 300, grip: 88, aero: 82, tracks: ["Barcelona", "Spa", "Imola", "Zandvoort"]
    }
];

// INICIALIZADORES AL CARGAR LA WEB
document.addEventListener("DOMContentLoaded", () => {
    initTelemetryLiveEngine();
    initGarageSelectorEngine();
    
    // Forzar carga inicial de los textos de F1
    updateApexShowroomUI(APEX_GARAGE[0]);
    
    // Ejecutar la grilla animada de fondo de Three.js
    setTimeout(() => {
        initThreeJsBackgroundEngine();
    }, 300);
});

// TELEMETRÍA DIGITAL EN TIEMPO REAL
function initTelemetryLiveEngine() {
    const rpmDisplay = document.getElementById("tel-rpm");
    const speedDisplay = document.getElementById("tel-speed");
    const gearDisplay = document.getElementById("telemetry-gear");
    
    let currentRpm = 11000;
    let currentSpeed = 280;
    const gearBox = ["6", "7", "8"];
    let activeGear = "7";

    setInterval(() => {
        if(!rpmDisplay) return;
        let noiseRpm = Math.floor((Math.random() - 0.5) * 600);
        let noiseSpeed = Math.floor((Math.random() - 0.5) * 8);

        let finalRpm = Math.max(9000, Math.min(13500, currentRpm + noiseRpm));
        let finalSpeed = Math.max(240, Math.min(360, currentSpeed + noiseSpeed));

        if (finalRpm > 13000) {
            currentRpm = 9800; 
            activeGear = gearBox[Math.floor(Math.random() * gearBox.length)];
        }

        rpmDisplay.textContent = finalRpm;
        speedDisplay.textContent = finalSpeed;
        gearDisplay.textContent = activeGear;
    }, 120);
}

// CONTROLADOR DE PESTAÑAS (INTERRUPTOR DE IMÁGENES HTML)
function initGarageSelectorEngine() {
    const tabs = document.querySelectorAll(".car-tab");
    const imageIds = ["media-f1", "media-f2", "media-f3"];

    tabs.forEach((tab) => {
        tab.addEventListener("click", function() {
            tabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            
            const carIndex = parseInt(this.getAttribute("data-car-index")) || 0;
            
            if(carIndex < APEX_GARAGE.length) {
                // 1. Actualizar los datos técnicos en el HUD
                updateApexShowroomUI(APEX_GARAGE[carIndex]);

                // 2. Apagar todas las fotos y prender solo la elegida
                imageIds.forEach((id, idx) => {
                    const img = document.getElementById(id);
                    if (img) {
                        if (idx === carIndex) {
                            img.classList.add("active-media");
                            img.style.display = "block";
                        } else {
                            img.classList.remove("active-media");
                            img.style.display = "none";
                        }
                    }
                });
            }
        });
    });
}

// ACTUALIZACIÓN DINÁMICA DE TEXTOS HUD
function updateApexShowroomUI(car) {
    if (!car) return;

    if(document.getElementById("lbl-car-name")) document.getElementById("lbl-car-name").textContent = car.name;
    if(document.getElementById("lbl-manufacturer")) document.getElementById("lbl-manufacturer").textContent = car.manufacturer;
    if(document.getElementById("lbl-category")) document.getElementById("lbl-category").textContent = car.category;
    if(document.getElementById("val-power")) document.getElementById("val-power").textContent = car.power;
    if(document.getElementById("val-weight")) document.getElementById("val-weight").textContent = car.weight;
    if(document.getElementById("val-engine")) document.getElementById("val-engine").textContent = car.engine;
    if(document.getElementById("val-pw-ratio")) document.getElementById("val-pw-ratio").textContent = car.ratio;
    if(document.getElementById("lbl-difficulty")) document.getElementById("lbl-difficulty").textContent = car.difficulty;

    if(document.getElementById("txt-top-speed")) document.getElementById("txt-top-speed").textContent = `${car.topSpeed} km/h`;
    if(document.getElementById("bar-top-speed")) document.getElementById("bar-top-speed").style.width = `${(car.topSpeed / 380) * 100}%`;
    if(document.getElementById("txt-grip")) document.getElementById("txt-grip").textContent = `${car.grip}%`;
    if(document.getElementById("bar-grip")) document.getElementById("bar-grip").style.width = `${car.grip}%`;
    if(document.getElementById("txt-aero")) document.getElementById("txt-aero").textContent = `${car.aero}%`;
    if(document.getElementById("bar-aero")) document.getElementById("bar-aero").style.width = `${car.aero}%`;

    const container = document.getElementById("tracks-container");
    if (container) {
        container.innerHTML = car.tracks.map(t => `<span class="track-pill">${t}</span>`).join('');
    }
}

// ==========================================================================
// ANIMACIÓN EXCLUSIVA DE FONDO (TECH GRID EN REJILLA DE TRES DIMENSIONES)
// ==========================================================================
let bgScene, bgCamera, bgRenderer, technicalGrid;

function initJsBackgroundEngine() {
    const bgContainer = document.querySelector(".hud-grid-background");
    if (!bgContainer) return;

    bgScene = new THREE.Scene();
    bgScene.fog = new THREE.FogExp2(0x050508, 0.15);

    bgCamera = new THREE.PerspectiveCamera(60, bgContainer.clientWidth / bgContainer.clientHeight, 0.1, 100);
    // Posicionamos la cámara para dar un ángulo dinámico al suelo de neón
    bgCamera.position.set(0, 2, 5);
    bgCamera.lookAt(0, 0, 0);

    bgRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    bgRenderer.setSize(bgContainer.clientWidth, bgContainer.clientHeight);
    bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    bgContainer.innerHTML = "";
    bgContainer.appendChild(bgRenderer.domElement);

    // Rejilla de vectores luminosos cibernéticos del fondo
    technicalGrid = new THREE.GridHelper(30, 40, 0x00f0ff, 0x111525);
    technicalGrid.position.y = -0.5;
    bgScene.add(technicalGrid);

    function animateBackground() {
        requestAnimationFrame(animateBackground);
        // Genera el efecto de velocidad infinita deslizando suavemente la grilla técnica
        technicalGrid.rotation.y += 0.0015;
        bgRenderer.render(bgScene, bgCamera);
    }
    animateBackground();

    window.addEventListener('resize', () => {
        if(!bgContainer || !bgRenderer) return;
        bgCamera.aspect = bgContainer.clientWidth / bgContainer.clientHeight;
        bgCamera.updateProjectionMatrix();
        bgRenderer.setSize(bgContainer.clientWidth, bgContainer.clientHeight);
    });
}
// Alias por si se llama por herencia de nombres
window.initThreeJsShowroomEngine = initJsBackgroundEngine;
// ==========================================================================
// NUEVO ENGINE: PARTÍCULAS TELEMÉTRICAS (Sin líneas de rejilla)
// ==========================================================================
function initJsBackgroundEngine() {
    const bgContainer = document.querySelector(".hud-grid-background");
    if (!bgContainer) return;

    bgScene = new THREE.Scene();
    bgCamera = new THREE.PerspectiveCamera(75, bgContainer.clientWidth / bgContainer.clientHeight, 0.1, 1000);
    bgCamera.position.z = 30;

    bgRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    bgRenderer.setSize(bgContainer.clientWidth, bgContainer.clientHeight);
    bgContainer.innerHTML = "";
    bgContainer.appendChild(bgRenderer.domElement);

    // Creamos partículas (puntos de datos)
    const geometry = new THREE.BufferGeometry();
    const count = 1500; // Cantidad de "datos" en pantalla
    const positions = new Float32Array(count * 3);

    for(let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 100;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Material sutil: pequeños puntos cian con transparencia
    const material = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    bgScene.add(particles);

    // Animación fluida: las partículas flotan como datos en red
    function animateBackground() {
        requestAnimationFrame(animateBackground);
        
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;
        
        // Efecto de "respiración" de los datos
        const time = Date.now() * 0.0001;
        particles.scale.setScalar(1 + Math.sin(time) * 0.1);
        
        bgRenderer.render(bgScene, bgCamera);
    }
    animateBackground();

    window.addEventListener('resize', () => {
        bgCamera.aspect = bgContainer.clientWidth / bgContainer.clientHeight;
        bgCamera.updateProjectionMatrix();
        bgRenderer.setSize(bgContainer.clientWidth, bgContainer.clientHeight);
    });
}
// REEMPLAZÁ TU FUNCIÓN DE FONDO POR ESTA VERSIÓN "NODO DE RED"
function initJsBackgroundEngine() {
    const bgContainer = document.querySelector("#telemetry-bg");
    if (!bgContainer) return;

    // Configuración escena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ canvas: bgContainer, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Crear puntos (nodos)
    const particlesCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 40;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({ color: 0x39A0DA, size: 0.2 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Animación de los nodos
    function animate() {
        requestAnimationFrame(animate);
        points.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    animate();
}
// Inicializar
initJsBackgroundEngine();
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('about-track');
    const next = document.getElementById('about-next');
    const prev = document.getElementById('about-prev');
    const slides = document.querySelectorAll('.carousel-slide');

    if (!track || slides.length === 0) {
        console.warn("El carrusel no encuentra sus elementos. Revisa los IDs.");
        return;
    }

    let currentIndex = 0;
    next.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    });

    prev.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    });
});
const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
  });
    const track = document.getElementById('about-track');
    const slides = Array.from(track.children);
    const nextButton = document.getElementById('about-next');
    const prevButton = document.getElementById('about-prev');
    
    let currentIndex = 0;

    function updateCarousel() {
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = 'translateX(-' + (currentIndex * slideWidth) + 'px)';
    }

    nextButton.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
  // ==========================================================================
// FUNCIONES GLOBALES DE GALERÍA APEX (EVITA CONFLICTOS DE RENDERIZADO)
// ==========================================================================
function openApexModal(element) {
    const modal = document.getElementById('apex-gallery-modal');
    const modalImg = document.getElementById('modal-target-img');
    const innerImg = element.querySelector('img');
    
    if (modal && modalImg && innerImg) {
        modalImg.src = innerImg.src;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Detiene el scroll para enfocar la visual
    }
}

function closeApexModal() {
    const modal = document.getElementById('apex-gallery-modal');
    const modalImg = document.getElementById('modal-target-img');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Habilita de nuevo el scroll vertical de la página
        if (modalImg) modalImg.src = '';   // Libera memoria gráfica
    }
}

// Cierra también si el usuario hace click afuera de la imagen (en el fondo oscuro)
function closeApexModalViaBg(event) {
    const modal = document.getElementById('apex-gallery-modal');
    if (event.target === modal) {
        closeApexModal();
    }
}
// CONTROLADOR DE MENÚ RESPONSIVE
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Cierre de menú al seleccionar un link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });
});
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav').classList.toggle('active');
});