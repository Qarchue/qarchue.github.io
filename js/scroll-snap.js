// 註冊 GSAP 插件
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener("DOMContentLoaded", () => {

    const config = {
        snapDelay: 150,      // 滾動停止後等待多久才吸附 (毫秒)
        duration: 0.8,       // 吸附動畫時間
        ease: "power3.out",  // 緩動曲線
        ignoreBelow: 100,    // 超過 About 下方 100px 就不吸附 (閱讀模式)
        snapThreshold: 10,   // 誤差容許值 (小於此距離視為已到位)
        debug: true          // 開發模式
    };

    const wrapper = document.querySelector('.wrapper');
    if (!wrapper) return;

    let isAutoScrolling = false;
    let scrollTimer = null;

    const getTargetTop = () => wrapper.getBoundingClientRect().top + window.scrollY;


    const preventDefault = (e) => e.preventDefault();
    const preventKeys = (e) => {
        // 屏蔽 上下左右, 空白鍵, PageUp/Down, Home/End
        const keys = {37:1, 38:1, 39:1, 40:1, 32:1, 33:1, 34:1, 35:1, 36:1};
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    };

    const disableInput = () => {
        window.addEventListener('wheel', preventDefault, { passive: false });
        window.addEventListener('touchmove', preventDefault, { passive: false });
        window.addEventListener('keydown', preventKeys, false);
    };

    const enableInput = () => {
        window.removeEventListener('wheel', preventDefault, { passive: false });
        window.removeEventListener('touchmove', preventDefault, { passive: false });
        window.removeEventListener('keydown', preventKeys, false);
    };


    const performSnap = () => {
        if (window.isDraggingArrow) return;

        const currentY = window.scrollY;
        const aboutTop = getTargetTop();

        if (currentY > aboutTop + config.ignoreBelow) return;

        const midPoint = aboutTop / 2;
        const isGoingToAbout = currentY > midPoint;
        
        const targetY = isGoingToAbout ? aboutTop : 0;
        const targetName = isGoingToAbout ? "About" : "Hero";

        if (Math.abs(currentY - targetY) < config.snapThreshold) return;

        isAutoScrolling = true;

        disableInput();

        gsap.to(window, {
            scrollTo: targetY,
            duration: config.duration,
            ease: config.ease,
            overwrite: true,
            
            onComplete: () => {
                isAutoScrolling = false;
                enableInput();
            },
            onInterrupt: () => {
                isAutoScrolling = false;
                enableInput();
            }
        });
    };

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);

        if (isAutoScrolling) return;
        if (window.isDraggingArrow) return;
        scrollTimer = setTimeout(() => {
            performSnap();
        }, config.snapDelay);

    }, { passive: true });


    window.forceSnap = () => {
        clearTimeout(scrollTimer);
        performSnap();
    };
});