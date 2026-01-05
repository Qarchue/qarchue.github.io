document.addEventListener("DOMContentLoaded", () => {   
    const video = document.getElementById('hero-video');
    const content = document.getElementById('hero-content');
    const indicator = document.getElementById('scroll-handle');

    if (video && content) {
        
        video.play().catch(error => {
            console.log("自動播放失敗:", error);
            video.remove();
            content.classList.add('visible');
        });


        video.addEventListener('ended', () => {
            video.remove();
            content.classList.remove('hidden');
            content.classList.add('visible');
            
            indicator.classList.add('visible');
        });
    }
});