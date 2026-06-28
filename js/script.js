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
            // El degradado se mueve verticalmente de acuerdo a la velocidad del scroll
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
                // Definimos el degradado de la propia línea (difuminada en las puntas)
                let lineGrad = ctx.createLinearGradient(line.x, line.y, line.x + line.length, line.y);
                lineGrad.addColorStop(0, 'rgba(57, 160, 218, 0)');
                lineGrad.addColorStop(0.5, `rgba(57, 160, 218, ${line.opacity + (intensity * 1.5)})`);
                lineGrad.addColorStop(1, 'rgba(57, 160, 218, 0)');
                
                ctx.strokeStyle = lineGrad;
                ctx.lineWidth = line.thickness + (intensity * 2); // Se vuelven más gruesas al acelerar
                
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(line.x + line.length, line.y);
                ctx.stroke();
                
                // Movimiento horizontal continuo + empuje del scroll
                // El scroll horizontal simula que vas "atravesando" los datos
                line.x -= line.baseSpeed + (Math.abs(scrollVelocity) * line.scrollFactor);
                
                // Si la línea sale de la pantalla por la izquierda, reaparece por la derecha en Y aleatoria
                if (line.x + line.length < 0) {
                    line.x = width;
                    line.y = Math.random() * height;
                }
            });
            
            // Desaceleración suave y progresiva de la velocidad del scroll (Fricción física)
            scrollVelocity *= 0.92; 
            
            requestAnimationFrame(animateTelemetry);
        }
        
        // Escuchamos el scroll para calcular la fuerza del movimiento del usuario
        window.addEventListener('scroll', () => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            scrollDelta = currentScrollTop - lastScrollTop;
            scrollVelocity = scrollDelta; // Almacenamos el pico de velocidad
            lastScrollTop = currentScrollTop;
        }, { passive: true });
        
        // Arrancamos el bucle de renderizado
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
    // 4. LÓGICA DEL CARRUSEL (FLECHAS PREV Y NEXT)
    // ==========================================================================
    const track = document.getElementById('about-track');
    const prevBtn = document.getElementById('about-prev');
    const nextBtn = document.getElementById('about-next');
    const slides = document.querySelectorAll('.carousel-slide');
    
    if (track && prevBtn && nextBtn && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;

        function updateCarousel() {
            // Desplaza el track horizontalmente multiplicando por el índice actual
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Vuelve al principio si llega al final
            }
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalSlides - 1; // Vuelve al final si está en la primera
            }
            updateCarousel();
        });
    }