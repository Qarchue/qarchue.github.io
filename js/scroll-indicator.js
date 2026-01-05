document.addEventListener("DOMContentLoaded", () => {
    const config = {
        amp: 1.8,
        th: 2,
        stopTh: 1.5,
        rev: true,
        idleDir: 1,
        tension: 0.18,  
        damping: 0.70,  
        idleTime: 3000,
        
        morphInterval: 2000 
    };

    const dom = { 
        el: document.querySelector('.scroll-indicator'), 
        path: document.getElementById('indicator-path')
    };

    if (!dom.path) return;

    const state = { 
        target: 0,      
        current: 0,     
        vel: 0,         
        prevScroll: window.scrollY, 
        isIdling: false, 
        formDir: 0 
    };

    let idleTimer = null;
    let morphIntervalTimer = null;

    const resetIdle = () => {
        if (state.isIdling) {
            state.isIdling = false;
            dom.el.classList.remove('is-idling');
            clearInterval(morphIntervalTimer);
            checkBaseState();
        }

        clearTimeout(idleTimer);

        idleTimer = setTimeout(() => {
            state.isIdling = true;

            if (state.formDir === 0) {
                startMorphIdle();
            } else {
                dom.el.classList.add('is-idling');
            }
            
        }, config.idleTime);
    };

    const startMorphIdle = () => {
        const doBounce = () => {
            if (!state.isIdling) return;

            state.target = config.amp * 1.2;
            
            setTimeout(() => {
                if (state.isIdling) state.target = 0;
            }, 300);
        };

        doBounce();
        morphIntervalTimer = setInterval(doBounce, config.morphInterval);
    };

    const checkBaseState = () => {
        if (window.scrollY < 5) {
            state.target = config.amp * config.idleDir;
            state.formDir = 1;
        } else {
            state.target = 0;
            state.formDir = 0;
        }
    };

    gsap.ticker.add(() => {
        const currentScroll = window.scrollY;
        const delta = currentScroll - state.prevScroll;
        state.prevScroll = currentScroll;
        const absDelta = Math.abs(delta);

        if (absDelta > config.th) {

            if (!dom.el.classList.contains('visible')) dom.el.classList.add('visible');
            resetIdle();

            const dir = (delta > 0 ? 1 : -1) * (config.rev ? -1 : 1);
            state.target = config.amp * dir;
            
            state.formDir = dir; 

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