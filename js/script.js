// js/script.js
const { scroll, animate } = Motion;

// 1. 滑動淡出效果 (一行搞定！)
// 綁定 #hero 的 opacity：從 1 變到 0
// offset: ["0px", "800px"] 代表從頂端滑到 800px 的距離內完成動畫
scroll(
  animate("#hero", { opacity: [1, 0] }), 
  { offset: ["0px", "800px"] }
);

// 2. 影片播放結束顯示文字 (這部分維持簡單邏輯)
const video = document.getElementById('hero-video');
const content = document.getElementById('hero-content');

if (video) {
    // 確保影片會播 (處理瀏覽器阻擋策略)
    video.play().catch(() => console.log("需互動才能播放"));

    video.addEventListener('ended', () => {
        if (content) {
            // 使用 Motion 的 animate 來顯示文字，比 classList 更順
            animate(content, { opacity: 1, transform: "translateY(0px)" }, { duration: 0.8 });
            content.classList.remove('hidden'); // 確保移除隱藏屬性
        }
    });
}

// 3. 按鈕功能
window.scrollToProfile = () => {
    document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
};