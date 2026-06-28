document.addEventListener('DOMContentLoaded', () => {

    // 1. CIRCUITO DE LUZ DINÁMICO (Scroll Tracker de Alto Rendimiento)
    const circuitLine = document.querySelector('.scroll-circuit-line');
    if (circuitLine) {
        let ticking = false;
        const updateLine = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
                const pct = scrollPos / totalHeight;
                // Mapear el recorrido del haz de luz de 0 a la altura de la ventana
                const moveY = pct * window.innerHeight;
                circuitLine.style.transform = `translateY(${moveY}px)`;
            }
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateLine);
                ticking = true;
            }
        });
    }

    // 2. CARRUSEL ¿QUÉ ES APEX? (5 fotos con flechas laterales)
    const track = document.getElementById('about-track');
    const prevBtn = document.getElementById('about-prev');
    const nextBtn = document.getElementById('about-next');
    
    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        const totalSlides = 5;

        const moveCarousel = (index) => {
            if(index < 0) currentIndex = totalSlides - 1;
            else if(index >= totalSlides) currentIndex = 0;
            else currentIndex = index;
            
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        prevBtn.addEventListener('click', () => moveCarousel(currentIndex - 1));
        nextBtn.addEventListener('click', () => moveCarousel(currentIndex + 1));
    }

    // 3. SELECTOR DE MONOPLAZAS INTERACTIVO (Estilo Videojuego)
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

            // Extraer Atributos de Datos
            const name = this.getAttribute('data-name');
            const img = this.getAttribute('data-img');
            const speed = parseFloat(this.getAttribute('data-speed'));
            const handling = parseFloat(this.getAttribute('data-handling'));
            const braking = parseFloat(this.getAttribute('data-braking'));

            // Animación flash de cambio
            if (mainCarImg) {
                mainCarImg.style.transform = 'scale(0.85)';
                mainCarImg.style.opacity = '0.3';
                
                setTimeout(() => {
                    carTitle.textContent = name;
                    mainCarImg.src = img;
                    mainCarImg.style.transform = 'scale(1)';
                    mainCarImg.style.opacity = '1';
                    
                    // Actualizar Barras de Progreso
                    speedBar.style.width = `${speed * 10}%`;
                    handlingBar.style.width = `${handling * 10}%`;
                    brakingBar.style.width = `${braking * 10}%`;

                    // Actualizar Textos Numéricos
                    speedVal.textContent = speed;
                    handlingVal.textContent = handling;
                    brakingVal.textContent = braking;
                }, 200);
            }
        });
    });

    // 4. PREPARACIÓN FLIP CARDS SUTILES (Soporte Móvil por click)
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });

    // 5. SUBMIT DEL FORMULARIO DE LICENCIA
    const raceForm = document.getElementById('race-form');
    if (raceForm) {
        raceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = raceForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<span>ENVIANDO TELEMETRÍA...</span>';
            setTimeout(() => {
                btn.innerHTML = '<span>¡SOLICITUD ENVIADA!</span>';
                raceForm.reset();
            }, 1800);
        });
    }
});