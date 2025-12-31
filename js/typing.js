document.addEventListener("DOMContentLoaded", function() {
    
    if (document.getElementById('typed-output')) {
        
        var typed = new Typed('#typed-output', {

            strings: [
                '一位大學生', 
                '熱愛程式設計的開發者', 
                '邱楷宸'
            ],
            
            typeSpeed: 100,  // 打字速度
            backSpeed: 50,   // 刪除速度
            backDelay: 2000, // 打完後停留多久才開始刪
            startDelay: 500, // 進入頁面後多久開始打
            
            loop: true,      // 是否無限循環
            showCursor: true, // 顯示閃爍游標
            cursorChar: '│',  // 游標樣式
        });
    }
});