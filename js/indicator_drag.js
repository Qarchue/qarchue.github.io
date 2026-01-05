document.addEventListener("DOMContentLoaded", () => {
    const dom = { 
        el: document.querySelector('.scroll-indicator'), 
        about: document.getElementById('about')
    };

    if (!dom.el) return;


    let isDragging = false;
    let startY = 0;
    let startScrollY = 0;
    let hasMoved = false;

    window.isDraggingArrow = false;

    dom.el.addEventListener('mousedown', (e) => {
        isDragging = true;
        hasMoved = false;
        
        startY = e.clientY;
        startScrollY = window.scrollY;

        dom.el.style.cursor = 'grabbing';
        
        window.isDraggingArrow = true;

        gsap.killTweensOf(window);
        
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const currentY = e.clientY;
        const deltaY = currentY - startY;

        if (Math.abs(deltaY) > 5) hasMoved = true;

        window.scrollTo(0, startScrollY - deltaY);
    });


    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        isDragging = false;

        window.isDraggingArrow = false; 
        
        dom.el.style.cursor = 'grab';

        if (!hasMoved && dom.about) {
            gsap.to(window, { 
                scrollTo: "#about", 
                duration: 0.8, 
                ease: "power3.inOut" 
            });
        } else {
            if (window.forceSnap) {
                window.forceSnap();
            }
        }
    });
});