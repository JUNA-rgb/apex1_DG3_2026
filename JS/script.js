// Apex Sim-Racing - Base Interaction Scripts

document.addEventListener('DOMContentLoaded', () => {
    console.log('Apex Sim-Racing Hub inicializado correctamente.');

    // Smooth Scroll para los links de navegación
    const navLinks = document.querySelectorAll('.nav-links a, .scroll-indicator');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Efecto sutil de parallax o interactividad con el mouse (Opcional - Base)
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            const content = document.querySelector('.hero-content');
            if (content) {
                content.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
    }
});
