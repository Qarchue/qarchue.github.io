// js/script.js
document.addEventListener("DOMContentLoaded", () => {
    const { scroll, animate } = Motion;

    // 1. Hero 滾動淡出
    const hero = document.getElementById("hero");
    if (hero) {
        scroll(
            animate(hero, { opacity: [1, 0] }), 
            { offset: ["0px", "800px"] }
        );
    }

    // 2. 影片播放結束邏輯
    const video = document.getElementById('hero-video');
    const content = document.getElementById('hero-content');

    if (video) {
        // 嘗試自動播放
        video.play().catch(e => console.log("Autoplay blocked:", e));

        video.addEventListener('ended', () => {
            if (content) {
                content.classList.remove('hidden');
                animate(content, { opacity: 1, transform: "translateY(0px)" }, { duration: 0.8 });
            }
        });
    }

    // 3. 按鈕捲動功能
    window.scrollToProfile = () => {
        document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
    };
});