document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            
            if (targetId === "#" || !document.querySelector(targetId)) return;

            e.preventDefault();

            gsap.to(window, {
                scrollTo: {
                    y: targetId,
                    autoKill: false
                },
                duration: 1,
                ease: "power3.inOut"
            });
        });
    });
});