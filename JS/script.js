// APEX Sim Racing - Efectos Interactivos para Pilotos Experimentados

document.addEventListener('DOMContentLoaded', () => {
    console.log('Telemetry HUD Inicializado...');
    
    // Efecto de parpadeo realista/intermitente estilo carreras en los tiempos del podio
    const times = document.querySelectorAll('.time-display');
    
    setInterval(() => {
        times.forEach(time => {
            // Simula una fluctuación muy sutil de milisegundos de telemetría en vivo
            if (Math.random() > 0.85) {
                time.style.color = '#39a0da';
                setTimeout(() => {
                    time.style.color = '#ffffff';
                }, 150);
            }
        });
    }, 1000);

    // Scroll suave para los botones de CTA
    const ctaButtons = document.querySelectorAll('a[href^="#"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
