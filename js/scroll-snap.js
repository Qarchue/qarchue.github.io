gsap.registerPlugin(ScrollToPlugin);

document.addEventListener("DOMContentLoaded", () => {
    const config = {
        threshold: 250,
        visualFactor: 0.20,
        duration: 0.9,
        ease: "expo.out",
        resetDelay: 250,
        //控制曲線：越小則前段越快、後段越慢 (建議 0.3 ~ 0.5)
        curveExp: 0.25 
    };

    const state = {
        energy: 0,
        currentZone: window.scrollY < 100 ? 0 : 1, 
        isLocked: false,
        aboutTop: 0
    };

    const wrapper = document.querySelector('.wrapper');
    const updateCoords = () => { state.aboutTop = wrapper?.offsetTop || 0; };
    updateCoords();
    window.addEventListener('resize', updateCoords);

    const View = {
        renderOffset: (targetZone) => {
            const baseY = targetZone === 1 ? 0 : state.aboutTop;

            const progress = Math.min(Math.abs(state.energy) / config.threshold, 1.1);
            
            // 非線性公式：y = x ^ curveExp
            // 當 x=0.1, y=0.1^0.35 ≈ 0.44 (進度 10% 時畫面已出來 44%)
            // 當 x=0.9, y=0.9^0.35 ≈ 0.96 (進度 90% 時畫面出來 96%，後段極慢)
            const curve = Math.pow(progress, config.curveExp);
            
            const maxDisplacement = window.innerHeight * config.visualFactor;
            const direction = state.energy > 0 ? 1 : -1;
            
            window.scrollTo(0, baseY + (direction * curve * maxDisplacement));
        },

        jump: (targetZone) => {
            state.isLocked = true;
            state.energy = 0;
            const targetY = targetZone === 0 ? 0 : state.aboutTop;

            gsap.to(window, {
                scrollTo: { y: targetY, autoKill: false },
                duration: config.duration,
                ease: config.ease,
                onComplete: () => {
                    state.currentZone = targetZone;
                    setTimeout(() => state.isLocked = false, 50);
                }
            });
        },

        bounceBack: () => {
            if (state.isLocked) return;
            const baseY = state.currentZone === 0 ? 0 : state.aboutTop;
            state.energy = 0;
            gsap.to(window, { scrollTo: baseY, duration: 0.4, ease: "power2.out" });
        }
    };

    const Engine = {
        accumulate: (delta, targetZone) => {
            state.energy += delta;
            View.renderOffset(targetZone);

            if (Math.abs(state.energy) >= config.threshold) {
                View.jump(targetZone);
            } else {
                clearTimeout(Engine.timer);
                Engine.timer = setTimeout(View.bounceBack, config.resetDelay);
            }
        },
        timer: null
    };

    window.addEventListener('wheel', (e) => {
        if (state.isLocked || window.isDraggingArrow) {
            e.preventDefault();
            return;
        }

        const y = window.scrollY;
        const delta = e.deltaY;

        if (state.currentZone === 0 && delta > 0) {
            e.preventDefault();
            Engine.accumulate(delta, 1);
        } 
        else if (state.currentZone === 1 && delta < 0 && y <= state.aboutTop + 10) {
            e.preventDefault();
            Engine.accumulate(delta, 0);
        }
        else if (state.currentZone === 1 && delta > 0 && y > state.aboutTop + 20) {
            state.currentZone = 2;
        }
        else if (state.currentZone === 2 && delta < 0 && y <= state.aboutTop + 5) {
            state.currentZone = 1;
        }
    }, { passive: false });

    window.forceSnap = () => View.jump(window.scrollY < state.aboutTop / 2 ? 0 : 1);
});