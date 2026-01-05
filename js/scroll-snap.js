gsap.registerPlugin(ScrollToPlugin);

document.addEventListener("DOMContentLoaded", () => {
    const config = {
        threshold: 300,      // 蓄力總能量
        visualFactor: 0.15,  // 🛑 這是最大位移百分比 (0.45 = 45vh)
        duration: 0.9,
        ease: "expo.out",
        resetDelay: 250
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

        // 🔥 核心重寫：非線性百分比位移
        renderOffset: (targetZone) => {
            const baseY = targetZone === 1 ? 0 : state.aboutTop;
            
            // 1. 計算目前的能量進度 (0 到 1)
            // 我們容許進度稍微超過 1 (到 1.1)，產生一點點過度拉伸的張力感
            const progress = Math.abs(state.energy) / config.threshold;
            
            // 2. 🛑 非線性轉換 (核心)
            // 使用 Math.log1p(x) 或 Math.pow(x, 0.5)
            // 這裡推薦使用 Power 函數，0.4 次方會產生「起步極快、後段極慢」的效果
            const curve = Math.pow(Math.min(progress, 1.1), 0.4); 
            
            // 3. 將曲線映射到目標百分比
            // 位移量 = 螢幕高度 * 預設百分比 * 非線性曲線
            const maxDisplacement = window.innerHeight * config.visualFactor;
            const direction = state.energy > 0 ? 1 : -1;
            const visualMove = direction * curve * maxDisplacement;
            
            window.scrollTo(0, baseY + visualMove);
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