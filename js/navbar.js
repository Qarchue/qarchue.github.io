document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById('navbar');
    
    // 當捲動超過「視窗高度的 80%」時顯示
    const showThreshold = window.innerHeight * 0.8;

    window.addEventListener('scroll', () => {
        if (window.scrollY > showThreshold) {

            navbar.classList.remove('hidden-nav');
            navbar.classList.add('visible-nav');
        } else {

            navbar.classList.remove('visible-nav');
            navbar.classList.add('hidden-nav');
        }
    });

    window.scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
});