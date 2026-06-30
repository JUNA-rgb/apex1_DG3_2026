document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. MOTOR DE FONDO: LÍNEAS DE LUZ Y DEGRADADOS REACTIVOS AL SCROLL
    // ==========================================================================
    const canvas = document.getElementById('telemetry-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
        
        // Configuración de las líneas de luz (estelas de velocidad)
        const lightLines = [];
        const lineCount = 35;
        
        for (let i = 0; i < lineCount; i++) {
            lightLines.push({
                x: Math.random() * width,
                y: Math.random() * height,
                length: Math.random() * 80 + 40, // Largo de la estela de luz
                baseSpeed: Math.random() * 0.8 + 0.2, // Velocidad pasiva cuando no te movés
                scrollFactor: Math.random() * 2 + 1, // Qué tanto se acelera al hacer scroll
                opacity: Math.random() * 0.4 + 0.1,
                thickness: Math.random() * 1.5 + 0.5
            });
        }
        
        let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollVelocity = 0;
        let scrollDelta = 0;

        function animateTelemetry() {
            ctx.clearRect(0, 0, width, height);
            
            // --- EFECTO 1: DEGRADADOS DINÁMICOS DE FONDO (Destellos de Velocidad) ---
            let intensity = Math.min(Math.abs(scrollVelocity) * 0.05, 0.25); // Capamos la intensidad máxima
            
            let gradient = ctx.createRadialGradient(
                width / 2, height / 2 + (scrollDelta * 0.2), 
                width * 0.2, 
                width / 2, height / 2, 
                width * 0.8
            );
            gradient.addColorStop(0, `rgba(57, 160, 218, ${0.02 + intensity})`);
            gradient.addColorStop(0.5, 'rgba(15, 20, 37, 0.05)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // --- EFECTO 2: LÍNEAS DE LUZ HORIZONTALES (Flujo de Datos/Carrera) ---
            lightLines.forEach(line => {
                ctx.beginPath();
                let lineGrad = ctx.createLinearGradient(line.x, line.y, line.x + line.length, line.y);
                lineGrad.addColorStop(0, 'rgba(57, 160, 218, 0)');
                lineGrad.addColorStop(0.5, `rgba(57, 160, 218, ${line.opacity + (intensity * 1.5)})`);
                lineGrad.addColorStop(1, 'rgba(57, 160, 218, 0)');
                
                ctx.strokeStyle = lineGrad;
                ctx.lineWidth = line.thickness + (intensity * 2);
                
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(line.x + line.length, line.y);
                ctx.stroke();
                
                line.x -= line.baseSpeed + (Math.abs(scrollVelocity) * line.scrollFactor);
                
                if (line.x + line.length < 0) {
                    line.x = width;
                    line.y = Math.random() * height;
                }
            });
            
            scrollVelocity *= 0.92; 
            
            requestAnimationFrame(animateTelemetry);
        }
        
        window.addEventListener('scroll', () => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            scrollDelta = currentScrollTop - lastScrollTop;
            scrollVelocity = scrollDelta;
            lastScrollTop = currentScrollTop;
        }, { passive: true });
        
        animateTelemetry();
    }

    // ==========================================================================
    // 2. LOGICA DEL SELECTOR INTERACTIVO HUD DE MONOPLAZAS
    // ==========================================================================
    const thumbs = document.querySelectorAll('.ui-thumb');
    const mainCarImg = document.getElementById('ui-main-car');
    const carTitle = document.getElementById('ui-car-name');
    const speedBar = document.getElementById('bar-speed');
    const handlingBar = document.getElementById('bar-handling');
    const brakingBar = document.getElementById('bar-braking');
    const speedVal = document.getElementById('val-speed');
    const handlingVal = document.getElementById('val-handling');
    const brakingVal = document.getElementById('val-braking');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const name = this.getAttribute('data-name');
            const img = this.getAttribute('data-img');
            const speed = parseFloat(this.getAttribute('data-speed'));
            const handling = parseFloat(this.getAttribute('data-handling'));
            const braking = parseFloat(this.getAttribute('data-braking'));

            if (mainCarImg) {
                mainCarImg.style.transform = 'scale(0.95) rotate(-1deg)';
                mainCarImg.style.opacity = '0.3';
                
                setTimeout(() => {
                    carTitle.textContent = name;
                    mainCarImg.src = img;
                    mainCarImg.style.transform = 'scale(1) rotate(0deg)';
                    mainCarImg.style.opacity = '1';
                    
                    speedBar.style.width = `${speed * 10}%`;
                    handlingBar.style.width = `${handling * 10}%`;
                    brakingBar.style.width = `${braking * 10}%`;

                    speedVal.textContent = speed;
                    handlingVal.textContent = handling;
                    brakingVal.textContent = braking;
                }, 200);
            }
        });
    });

    // ==========================================================================
    // 3. ENVIAR FORMULARIO
    // ==========================================================================
    const raceForm = document.getElementById('race-form');
    if (raceForm) {
        raceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = raceForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span><i class="fas fa-spinner fa-spin"></i> REGISTRANDO TELEMETRÍA...</span>';
            setTimeout(() => {
                submitBtn.innerHTML = '<span>¡BIENVENIDO A BOXES!</span>';
                raceForm.reset();
            }, 1500);
        });
    }
});

// ==========================================================================
// CONTROL TELEMÉTRICO DEL VISOR SUPERIOR (SECTOR 1)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const topTrack = document.getElementById('about-track');
    const btnPrev = document.getElementById('about-prev');
    const btnNext = document.getElementById('about-next');

    if (topTrack && btnPrev && btnNext) {
        const totalSlides = topTrack.children.length;
        let currentIndex = 0;

        function updateTopSlider() {
            topTrack.style.setProperty('--current-slide', currentIndex);
        }

        btnNext.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateTopSlider();
        });

        btnPrev.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalSlides - 1;
            }
            updateTopSlider();
        });

        updateTopSlider();
    }
});

// ==========================================================================
// MOTOR INTERACTIVO GARAJE EXPERIENCIA APEX
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const garageButtons = document.querySelectorAll(".car-selector-btn");
    const mainCarView = document.getElementById("main-car-view");
    const hudCarName = document.getElementById("hud-car-name");
    const hudBestTime = document.getElementById("hud-best-time");
    
    const statVelNum = document.getElementById("stat-vel-num");
    const statFrenNum = document.getElementById("stat-fren-num");
    const statNeuNum = document.getElementById("stat-neu-num");
    
    const barVel = document.getElementById("bar-vel");
    const barFren = document.getElementById("bar-fren");
    const barNeu = document.getElementById("bar-neu");

    const stageWrapper = document.querySelector(".car-3d-wrapper");
    const stageArea = document.querySelector(".interactive-3d-stage");

    garageButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelector(".car-selector-btn.active")?.classList.remove("active");
            btn.classList.add("active");

            mainCarView.style.opacity = "0";
            mainCarView.style.transform = "scale(0.9) rotateY(20deg)";
            
            setTimeout(() => {
                mainCarView.src = btn.getAttribute("data-img");
                hudCarName.textContent = btn.getAttribute("data-car");
                hudBestTime.textContent = btn.getAttribute("data-time");
                
                const vel = btn.getAttribute("data-vel");
                const fren = btn.getAttribute("data-fren");
                const neu = btn.getAttribute("data-neu");

                statVelNum.textContent = vel;
                statFrenNum.textContent = fren;
                statNeuNum.textContent = neu;

                barVel.style.width = vel;
                barFren.style.width = fren;
                barNeu.style.width = neu;

                mainCarView.style.opacity = "1";
                mainCarView.style.transform = "scale(1) rotateY(0deg)";
            }, 250);
        });
    });

    if (stageArea && stageWrapper) {
        stageArea.addEventListener("mousemove", (e) => {
            const rect = stageArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 20;
            
            stageWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });

        stageArea.addEventListener("mouseleave", () => {
            stageWrapper.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
            stageWrapper.style.transition = "transform 0.5s ease";
        });

        stageArea.addEventListener("mouseenter", () => {
            stageWrapper.style.transition = "transform 0.1s ease-out";
        });
    }
});

// ==========================================================================
// CONTROL INTERACTIVO DE FONDO EN SCROLL (OPTIMIZADO SIN ERROR DE MOIRÉ)
// ==========================================================================
let ticking = false;
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Pasamos de forma fluida el scroll a CSS sin romper la posición nativa del background
            document.documentElement.style.setProperty('--scroll-y', scrollTop);
            document.documentElement.style.setProperty('--scroll-px', `${scrollTop}`);
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });