document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. 抓取元素
    // ==========================================
    const dom = { 
        el: document.querySelector('.scroll-indicator'), 
        about: document.getElementById('about')
    };

    if (!dom.el) return;

    // ==========================================
    // 2. 狀態變數
    // ==========================================
    let isDragging = false;
    let startY = 0;        // 滑鼠按下的 Y
    let startScrollY = 0;  // 按下當下的 網頁 Scroll Y
    let hasMoved = false;  // 判斷是「點擊」還是「拖曳」

    // 初始化全域變數 (給 scroll-snap.js 用)
    window.isDraggingArrow = false;

    // ==========================================
    // 3. 事件監聽
    // ==========================================

    // --- A. 按下 (MouseDown) ---
    dom.el.addEventListener('mousedown', (e) => {
        isDragging = true;
        hasMoved = false;
        
        // 記錄起始狀態
        startY = e.clientY;
        startScrollY = window.scrollY;

        // 視覺回饋
        dom.el.style.cursor = 'grabbing';
        
        // 🔒 告訴 scroll-snap.js：「我正在忙，你先不要自動吸附」
        window.isDraggingArrow = true;

        // 🛑 殺死目前任何正在跑的 GSAP 自動滾動 (奪取控制權)
        // 這很重要，不然你往下拉，GSAP 往上拉，畫面會抖動
        gsap.killTweensOf(window);
        
        e.preventDefault(); // 防止選取文字
    });

    // --- B. 移動 (MouseMove - 全域) ---
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const currentY = e.clientY;
        const deltaY = currentY - startY; // 滑鼠移動了多少距離

        // 判斷是否真的在拖曳 (超過 5px 容錯值)
        if (Math.abs(deltaY) > 5) hasMoved = true;

        // ✅ 核心魔法：直接改變網頁捲動位置
        // 我們不需要手動呼叫 arrow 的變形函式
        // 因為我們改變了 window.scrollY，elastic-arrow.js 的 Ticker 就會偵測到速度變化
        // 然後箭頭就會自動根據你拖曳的快慢來變形！
        window.scrollTo(0, startScrollY - deltaY);
    });

    // --- C. 放開 (MouseUp - 全域) ---
    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        isDragging = false;
        
        // 🔓 解鎖，允許 scroll-snap.js 接手
        window.isDraggingArrow = false; 
        
        dom.el.style.cursor = 'grab';

        // 判斷行為
        if (!hasMoved && dom.about) {
            // [情況 1] 只是單純點擊 (Click) -> 平滑滾動到 About
            gsap.to(window, { 
                scrollTo: "#about", 
                duration: 0.8, 
                ease: "power3.inOut" 
            });
        } else {
            // [情況 2] 拖曳結束 (Drag End) -> 呼叫強制吸附
            // 讓 scroll-snap.js 決定現在要滑去 Hero 還是 About
            if (window.forceSnap) {
                window.forceSnap();
            }
        }
    });
});