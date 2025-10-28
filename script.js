document.addEventListener('DOMContentLoaded', () => {
  let rewardShown = false;
  const puzzleDiv = document.querySelector('.puzzle');
  const answerDiv = document.querySelector('.answer');
  const checkBtn = document.getElementById('checkBtn');
  const hintBtn = document.getElementById('hintBtn');
  const resultDiv = document.getElementById('result');
  const hintP = document.querySelector('.hint p');
  const rewardBtn = document.getElementById('reward');
  const submissionDiv = document.getElementById('submission');
  const submitBtn = document.getElementById('submit');
  const submitFeedback = document.getElementById('submitFeedback');

const questions = [
  {
    word: 'hazardous',
    hint: 'Dangerous',
    meaning: '有危險的'
  },
  {
    word: 'inspection',
    hint: 'The procedure which compares an object with its standard or specification.',
    meaning: '檢查'
  },
  {
    word: 'equivalent',
    hint: 'Has the same properties, functions, or values',
    meaning: '等同的、等值的'
  },
];

  let currentQuestionIndex = 0;

  function shuffleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5);
  }

  function getRandomColor() {
    const colors = ['#f7b7b7', '#b7d7f7', '#d7f7b7'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function moveLetter(letter, targetDiv) {
    if (!letter || letter.classList.contains('locked')) return;
    targetDiv.appendChild(letter);
    updateClickHandler(letter);
  }

  function updateClickHandler(letter) {
    letter.removeEventListener('click', handlePuzzleLetterClick);
    letter.removeEventListener('click', handleAnswerLetterClick);
    if (letter.parentElement === puzzleDiv) {
      letter.addEventListener('click', handlePuzzleLetterClick);
    } else {
      letter.addEventListener('click', handleAnswerLetterClick);
    }
  }

  function handlePuzzleLetterClick(e) {
    moveLetter(e.target, answerDiv);
  }

  function handleAnswerLetterClick(e) {
    moveLetter(e.target, puzzleDiv);
  }

function checkAnswer() {
  const current = window.currentQuestion; // 從 loadQuestion 記錄的題目
  const currentWord = current.word;
  const answer = Array.from(answerDiv.children).map(l => l.textContent).join('');

  if (answer === currentWord) {
    resultDiv.textContent = 'Correct!';
    resultDiv.style.color = 'green';
    showRewardButton();

    const meaningDiv = document.createElement('div');
    meaningDiv.innerHTML = `<strong>${currentWord}：${current.meaning}</strong>`;
    meaningDiv.style.marginTop = '8px';
    meaningDiv.style.marginBottom = '4px';
    meaningDiv.style.fontSize = '18px';
    meaningDiv.style.color = '#333';

    puzzleDiv.innerHTML = '';
    puzzleDiv.appendChild(meaningDiv);
  } else {
    resultDiv.textContent = 'Try Again!';
    resultDiv.style.color = 'red';
    setTimeout(loadQuestion, 1200);
  }
}

function loadQuestion() {
  puzzleDiv.innerHTML = '';
  answerDiv.innerHTML = '';
  resultDiv.textContent = '';
  hintBtn.disabled = false;
  rewardBtn.style.display = 'none';
  submissionDiv.style.display = 'none';
  rewardShown = false;

  // 隨機抽一題
  const current = questions[Math.floor(Math.random() * questions.length)];

  hintP.textContent = `Hint: ${current.hint}`;
  shuffleWord(current.word).forEach(char => {
    const letter = document.createElement('div');
    letter.className = 'letter';
    letter.textContent = char;
    letter.style.backgroundColor = getRandomColor();
    letter.addEventListener('click', handlePuzzleLetterClick);
    puzzleDiv.appendChild(letter);
  });

  // 記錄當前題目（方便 checkAnswer 使用）
  window.currentQuestion = current;
}

  function showRewardButton() {
    if (rewardShown) return;
    rewardShown = true;
    rewardBtn.style.display = 'block';
  }

  // 綁定事件
  checkBtn.addEventListener('click', checkAnswer);
  hintBtn.addEventListener('click', () => {
    if (answerDiv.children.length > 0) {
      hintBtn.disabled = true;
      return;
    }
    const correctWord = questions[currentQuestionIndex].word;
    const firstLetter = Array.from(puzzleDiv.children).find(l => l.textContent === correctWord[0]);
    if (firstLetter) {
      moveLetter(firstLetter, answerDiv);
      firstLetter.classList.add('locked');
      hintBtn.disabled = true;
    }
  });

  rewardBtn.addEventListener('click', () => {
    submissionDiv.style.display = 'block';
  });

  // ✅ 提交到 Google Sheet
  submitBtn.addEventListener('click', () => {
    const id = document.getElementById('idNumber').value.trim();
    const word = document.getElementById('wordOfDay').value.trim();
    const status = document.getElementById("submitFeedback");

  // 驗證 ID 是否為數字
  if (!/^\d+$/.test(id)) {
    status.textContent = "❗ 請輸入正確的數字員工號";
    return;
  }

  // 驗證 word 是否為英文字母
  if (!/^[a-zA-Z]+$/.test(word)) {
    status.textContent = "❗ 請輸入正確的英文單字";
    return;
  }

    submitFeedback.textContent = "⏳ Submitting...";
    submitFeedback.style.color = "black";
    submitBtn.disabled = true;

    fetch("https://script.google.com/macros/s/AKfycbxN_QRhW6F7ogSh_twhLlfMZNbSyGlzip3AmhiWHt1wJ0It4fReU53RJ5Ub5w_nWTLE/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${encodeURIComponent(id)}&word=${encodeURIComponent(word)}`
    })
    .then(response => response.json())
    .then(data => {
      submitFeedback.textContent = data.message || "✅ Submitted!";
      submitFeedback.style.color = data.status === "success" ? "green" : "red";

      if (data.status === "success") {
        submitBtn.disabled = true;
      } else {
        submitBtn.disabled = false;
      }
    })
    .catch((error) => {
      console.error("Submission error:", error);
      submitFeedback.textContent = "❌ 提交失敗，請再試一次!";
      submitFeedback.style.color = "red";
      submitBtn.disabled = false;
    });
  });

  // 初始化
  loadQuestion();
});
