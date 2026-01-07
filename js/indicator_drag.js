document.addEventListener("DOMContentLoaded", () => {
    const dom = { 
        el: document.querySelector('.scroll-indicator'), 
        about: document.getElementById('about')
    };

    if (!dom.el) return;

    // --- 狀態變數 ---
    let isDragging = false;
    let startY = 0;
    let startScrollY = 0;
    let hasMoved = false;
    
    // --- 慣性計算變數 ---
    let lastY = 0;
    let lastTime = 0;
    let velocity = 0;
    let inertiaTween = null; // 用來儲存動畫實例，方便殺死它

    window.isDraggingArrow = false;


    const killInertia = () => {
        // 如果有正在跑的慣性動畫 -> 殺掉
        if (inertiaTween) {
            inertiaTween.kill();
            inertiaTween = null;
        }
        // 解鎖狀態，讓其他程式 (或原生滾動) 接手
        window.isDraggingArrow = false;
    };


    // 只要使用者動了滾輪、碰了螢幕、或按了鍵盤，就視為「我有新指令了，慣性閉嘴」
    window.addEventListener('wheel', killInertia, { passive: true });
    window.addEventListener('touchstart', killInertia, { passive: true });
    window.addEventListener('keydown', killInertia, { passive: true });
    window.addEventListener('mousedown', killInertia, { passive: true }); // 點擊頁面其他地方也算


    dom.el.addEventListener('mousedown', (e) => {
        // 先殺掉任何可能還在跑的慣性
        killInertia();

        isDragging = true;
        hasMoved = false;
        
        startY = e.clientY;
        startScrollY = window.scrollY;
        
        lastY = e.clientY;
        lastTime = Date.now();
        velocity = 0;

        dom.el.style.cursor = 'grabbing';
        window.isDraggingArrow = true;
        
        // 奪取控制權 (殺掉其他可能存在的 GSAP 滾動)
        gsap.killTweensOf(window);
        
        e.preventDefault();
    });

    // ==========================================
    // 2. Mouse Move
    // ==========================================
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const currentY = e.clientY;
        const now = Date.now();
        const deltaY = currentY - startY;

        if (Math.abs(deltaY) > 5) hasMoved = true;

        window.scrollTo(0, startScrollY - deltaY);

        const dt = now - lastTime;
        if (dt > 0) {
            const newVel = (currentY - lastY) / dt;
            velocity = newVel * 0.8 + velocity * 0.2; 
        }

        lastY = currentY;
        lastTime = now;
    });


    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        isDragging = false;
        dom.el.style.cursor = 'grab';

        const now = Date.now();
        if (now - lastTime > 50) velocity = 0;

        if (!hasMoved && dom.about) {
            window.isDraggingArrow = false;
            gsap.to(window, { 
                scrollTo: "#about", 
                duration: 0.8, 
                ease: "power3.inOut" 
            });
            return;
        }

        const inertiaFactor = 400; 
        const targetScroll = window.scrollY - (velocity * inertiaFactor);
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const clampedTarget = Math.max(0, Math.min(targetScroll, maxScroll));

        inertiaTween = gsap.to(window, {
            scrollTo: clampedTarget,
            duration: 1.2,
            ease: "power4.out",
            onComplete: () => {
                window.isDraggingArrow = false;
                inertiaTween = null;
            }
        });
    });
});