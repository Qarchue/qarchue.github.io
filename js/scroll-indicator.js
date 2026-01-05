document.addEventListener("DOMContentLoaded", () => {
    const config = {
        amp: 1.8,       // 變形幅度 (固定值)
        th: 2,          // 觸發閾值 (速度大於此值才變形)
        stopTh: 1.5,    // 歸零閾值 (速度小於此值回歸平滑)
        rev: true,      // 反轉方向
        idleDir: 1,     // 置頂閒置方向
        tension: 0.18,  // 物理張力
        damping: 0.70,  // 物理阻尼
        idleTime: 3000  // 閒置時間
    };

    const dom = { 
        el: document.querySelector('.scroll-indicator'), 
        path: document.getElementById('indicator-path')
    };

    if (!dom.path) return;

    // 物理狀態
    const state = { 
        target: 0,      // 目標形狀數值 (0 或 ±amp)
        current: 0,     // 目前形狀數值 (物理運算用)
        vel: 0,         // 彈簧速度
        prevScroll: window.scrollY, // 上一幀的 scrollY
        isIdling: false // 是否閒置中
    };

    let idleTimer = null;


    const resetIdle = () => {
        if (state.isIdling) {
            state.isIdling = false;
            dom.el.classList.remove('is-idling');
            checkBaseState();
        }

        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            state.isIdling = true;
            checkBaseState();
            
            dom.el.classList.add('is-idling');
        }, config.idleTime);
    };


    const checkBaseState = () => {
        if (window.scrollY < 5) {
            state.target = config.amp * config.idleDir;
        } else {
            state.target = 0;
        }
    };

    gsap.ticker.add(() => {
        const currentScroll = window.scrollY;
        
        const delta = currentScroll - state.prevScroll;
        state.prevScroll = currentScroll;
        const absDelta = Math.abs(delta);

        if (absDelta > config.th) {

            if (!dom.el.classList.contains('visible')) {
                dom.el.classList.add('visible');
            }

            resetIdle();
            const dir = (delta > 0 ? 1 : -1) * (config.rev ? -1 : 1);
            state.target = config.amp * dir;

        } else if (absDelta < config.stopTh) {

            if (!state.isIdling) {
                checkBaseState();
            }
        }

        const force = (state.target - state.current) * config.tension;
        state.vel = (state.vel + force) * config.damping;
        state.current += state.vel;

        if (Math.abs(state.current) > 0.001 || Math.abs(state.target) > 0.001 || Math.abs(state.vel) > 0.001) {
            const cy = 12 + state.current;
            const sy = 12 - state.current;
            const newPath = `M 2,${sy.toFixed(2)} L 12,${cy.toFixed(2)} L 22,${sy.toFixed(2)}`;
            dom.path.setAttribute('d', newPath);
        }
    });
    checkBaseState();
    resetIdle();
});