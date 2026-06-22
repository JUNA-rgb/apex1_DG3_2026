// Scripts interactivos para la interfaz de Apex
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    
    // Animación simple para el menú hamburguesa al hacer clic
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            // Acá podés desplegar un menú lateral si lo agregás en el futuro
            console.log('Menú de telemetría alternado');
        });
    }
});