document.addEventListener("DOMContentLoaded", () => {
    const mottoList = [
        { text: "網站架設中", weight: 40 },  // 40%
        { text: "歡迎來到 Qarchue", weight: 30 },  // 30%
        { text: "i been goin' through somethin'.",   weight: 20 },  // 20%
        { text: "I deserve it all.", weight: 9 },   // 9%
        { text: "這段文字出現機率只有1%",    weight: 1 }    // 1%
    ];

    const mottoElement = document.querySelector('.motto');

    if (mottoElement) {
        let totalWeight = 0;
        mottoList.forEach(item => {
            totalWeight += item.weight;
        });

        let random = Math.random() * totalWeight;

        for (const item of mottoList) {
            if (random < item.weight) {
                mottoElement.textContent = item.text;
                break;
            }
            random -= item.weight;
        }
    }
});