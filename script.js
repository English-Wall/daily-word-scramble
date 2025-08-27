const question = {
    correct: "transducer",
    options: ["transducer", "lock nut", "support", "key tab"]
};

function disableOptions() {
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
    });
}

function loadQuestion() {
    const nextButton = document.getElementById("next");
    const rewardButton = document.getElementById("reward");

    nextButton.style.display = "none";
    rewardButton.style.display = "none";
    document.getElementById("feedback").textContent = "";

    // 顯示題目圖片
    document.getElementById("question").innerHTML = `
        <img src="transducer_b.png" alt="Question Image" style="max-width: 100%; height: auto;">
    `;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    question.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.className = `option-btn option-btn-${index + 1}`;
        btn.onclick = () => {
            if (option === question.correct) {
                btn.classList.add("correct");
                document.getElementById("feedback").textContent = "✅ Correct!";
                disableOptions();
                rewardButton.style.display = "block";
                rewardButton.disabled = false;
                rewardButton.style.margin = "20px auto";
            } else {
                btn.classList.add("incorrect");
                document.getElementById("feedback").textContent = "❌ Wrong. Try again.";
                btn.disabled = true;
            }
        };
        optionsDiv.appendChild(btn);
    });
}

// 點擊「Enter ID number to get reward!」按鈕後導向 Google Script
document.getElementById("reward").onclick = () => {
    window.location.href = 'https://script.google.com/macros/s/AKfycbz0rGKd05Jp06lKRQnGDxKF-EQRlUvXVUE-MH3OeKkpKvlNT07SkfGQznTYw4UHBxxntg/exec';
};

