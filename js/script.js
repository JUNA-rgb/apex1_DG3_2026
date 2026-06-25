document.addEventListener('DOMContentLoaded', () => {
    
    // 1. FONDO DE CANVAS DINÁMICO
    const canvas = document.getElementById('telemetry-bg');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    const particles = [];
    const particleCount = 40;
    
    for(let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 1,
            size: Math.random() * 2
        });
    }
    
    function drawGridBackground() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(57, 160, 218, 0.3)';
        
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.speedX;
            p.y += p.speedY;
            
            if(p.x < 0 || p.x > width) p.speedX *= -1;
            if(p.y < 0 || p.y > height) p.speedY *= -1;
        });
        
        requestAnimationFrame(drawGridBackground);
    }
    drawGridBackground();

    // 2. SCROLL REVEAL (INTERSECTION OBSERVER)
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                if(entry.target.querySelector('.stat-num')) {
                    triggerCounters(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
    
    // Observador exclusivo para activar el Podio de F1
    const podiumSection = document.getElementById('podium');
    if(podiumSection) {
        const podiumObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                document.querySelectorAll('.podium-place').forEach(el => el.classList.add('animated'));
            }
        }, { threshold: 0.1 });
        podiumObserver.observe(podiumSection);
    }

    // 3. CONTADORES INCREMENTALES
    function triggerCounters(container) {
        const counters = container.querySelectorAll('.stat-num');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const speed = target / 50;
            
            const updateCount = () => {
                const value = +counter.innerText;
                if(value < target) {
                    counter.innerText = Math.ceil(value + speed);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target + (target === 45 ? 'K' : '+');
                }
            };
            updateCount();
        });
    }

    // 4. HERO PARALLAX
    const heroBg = document.querySelector('.hero-parallax-bg');
    window.addEventListener('scroll', () => {
        let offset = window.pageYOffset;
        if(heroBg) {
            heroBg.style.transform = `translateY(${offset * 0.4}px)`;
        }
    });

    // 5. CARDS HOVER 3D
    const cards = document.querySelectorAll('.course-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const rotateX = (yc - y) / 15;
            const rotateY = (x - xc) / 15;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // 6. INTERACCIÓN HARDWARE SIMULADORES
    const dots = document.querySelectorAll('.sim-dot');
    const simTitle = document.getElementById('sim-feature-title');
    const simDesc = document.getElementById('sim-feature-desc');
    const simDisplay = document.querySelector('.sim-visual-display');
    
    const simImages = [
        './assets/foto 7.png',
        './assets/foto 3.png',
        './assets/foto 5.png',
        './assets/foto 6.png',
        './assets/foto 4.png'
    ];

    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            dots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
            
            const index = this.getAttribute('data-index');
            simTitle.textContent = this.getAttribute('data-title');
            simDesc.textContent = this.getAttribute('data-desc');
            simDisplay.style.backgroundImage = `linear-gradient(45deg, rgba(15, 20, 37, 0.9), rgba(0,0,0,0.5)), url('${simImages[index]}')`;
        });
    });

    // 7. SLIDER TESTIMONIOS
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    let slideIndex = 0;
    
    function nextSlide() {
        slideIndex++;
        if(slideIndex >= slides.length) { slideIndex = 0; }
        if(track) { track.style.transform = `translateX(-${slideIndex * 100}%)`; }
    }
    setInterval(nextSlide, 5000);

    // 8. FORMULARIO SUBMIT
    const form = document.getElementById('race-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span>PROCESANDO LICENCIA...</span>';
            setTimeout(() => {
                submitBtn.innerHTML = '<span>¡LICENCIA APROBADA!</span>';
                form.reset();
            }, 2000);
        });
    }
});