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
    date: '2025-11-10',
    word: 'hazardous',
    hint: 'Dangerous',
    meaning: '有危險的'
  },
  {
    date: '2025-11-11',
    word: 'recurrence',
    hint: 'Something happening again or repeatedly, especially after a period time.',
    meaning: '重複事項'
  },
  {
    date: '2025-11-12',
    word: 'equivalent',
    hint: 'Has the same properties, functions, or values',
    meaning: '等同的、等值的'
  },
  {
    date: '2025-11-13',
    word: 'occupant',
    hint: 'Someone who is currently inside or using a space.',
    meaning: '佔有人'
  },
  {
    date: '2025-11-14',
    word: 'preliminary',
    hint: 'Initial',
    meaning: '初步的；開端的'
  },
   {
    date: '2025-11-15',
    word: 'advisory',
    hint: 'Advice, warning, or non-mandatory recommendation from a manufacturer or authority.',
    meaning: '公告；警告'
  },
  {
    date: '2025-11-15',
    word: 'hazardous',
    hint: 'Dangerous',
    meaning: '有危險的'
  },
  {
    date: '2025-11-16',
    word: 'subsequent',
    hint: 'Happening or coming after something else.',
    meaning: '後續的'
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

  // 取得今天日期（格式：YYYY-MM-DD）
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateKey = `${yyyy}-${mm}-${dd}`;

  // 找出今天的題目
  const current = questions.find(q => q.date === dateKey);

  if (!current) {
    // 沒有題目就顯示預設訊息
    puzzleDiv.innerHTML = '<div style="font-size:20px;color:#888;">今天沒有題目</div>';
    hintP.textContent = '';
    window.currentQuestion = null;
    return;
  }

  hintP.textContent = `Hint: ${current.hint}`;
  shuffleWord(current.word).forEach(char => {
    const letter = document.createElement('div');
    letter.className = 'letter';
    letter.textContent = char;
    letter.style.backgroundColor = getRandomColor();
    letter.addEventListener('click', handlePuzzleLetterClick);
    puzzleDiv.appendChild(letter);
  });

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
