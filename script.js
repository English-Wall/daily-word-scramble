// Word Scramble Game - Final Version with Reward Button

document.addEventListener('DOMContentLoaded', () => {
  let rewardShown = false;
  const gameContainer = document.querySelector('.game-container');
  const puzzleDiv = document.querySelector('.puzzle');
  const answerDiv = document.querySelector('.answer');
  const checkBtn = document.getElementById('checkBtn');
  const hintBtn = document.getElementById('hintBtn');
  const resultDiv = document.getElementById('result');
  const hintP = document.querySelector('.hint p');
  const rewardContainer = document.getElementById('rewardContainer');

  const questions = [
    {
      word: 'abrade',
      hint: 'To scrape or wear away a surface or a part by mechanical or chemical action.'
    }
  ];

  let currentQuestionIndex = 0;
  let draggedLetter = null;

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

  function handleDragStart(e) {
    draggedLetter = e.target;
    e.dataTransfer.setData('text/plain', draggedLetter.textContent);
  }

  function lockLetter(letter) {
    letter.classList.add('locked');
    letter.setAttribute('draggable', 'false');
    letter.removeEventListener('click', handlePuzzleLetterClick);
    letter.removeEventListener('click', handleAnswerLetterClick);
    letter.removeEventListener('dragstart', handleDragStart);
  }

  function giveHint() {
    if (answerDiv.children.length > 0) {
      hintBtn.disabled = true;
      return;
    }
    const correctWord = questions[currentQuestionIndex].word;
    const firstLetter = Array.from(puzzleDiv.children).find(l => l.textContent === correctWord[0]);
    if (firstLetter) {
      moveLetter(firstLetter, answerDiv);
      lockLetter(firstLetter);
      hintBtn.disabled = true;
    }
  }

  function checkAnswer() {
    const currentWord = questions[currentQuestionIndex].word;
    const answer = Array.from(answerDiv.children).map(l => l.textContent).join('');
    if (answer === currentWord) {
      resultDiv.textContent = 'Correct!';
      resultDiv.style.color = 'green';
      showRewardButton();
    } else {
      resultDiv.textContent = 'Try Again!';
      resultDiv.style.color = 'red';
      setTimeout(loadQuestion, 1200);
    }
  }

  
function checkAnswer() {
  const currentWord = questions[currentQuestionIndex].word;
  const answer = Array.from(answerDiv.children).map(l => l.textContent).join('');
  if (answer === currentWord) {
    resultDiv.textContent = 'Correct!';
    resultDiv.style.color = 'green';
    showRewardButton();

    // 顯示中文意思
    const meaningDiv = document.createElement('div');
    meaningDiv.textContent = '磨損、刮除';
    meaningDiv.style.marginTop = '10px';
    meaningDiv.style.fontSize = '16px';
    meaningDiv.style.color = '#333';
    puzzleDiv.innerHTML = ''; // 清空原本的字母
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
    rewardContainer.innerHTML = '';
    const current = questions[currentQuestionIndex];
    hintP.textContent = `Hint: ${current.hint}`;
    shuffleWord(current.word).forEach(char => {
      const letter = document.createElement('div');
      letter.className = 'letter';
      letter.textContent = char;
      letter.style.backgroundColor = getRandomColor();
      letter.addEventListener('dragstart', handleDragStart);
      letter.addEventListener('click', handlePuzzleLetterClick);
      puzzleDiv.appendChild(letter);
    });
  }

  function showRewardButton() {
    if (rewardShown) return;
    rewardShown = true;
    const rewardBtn = document.createElement('button');
    rewardBtn.textContent = 'Enter ID number to get reward!';
    rewardBtn.style.backgroundColor = 'black';
    rewardBtn.style.color = 'white';
    rewardBtn.style.padding = '10px 20px';
    rewardBtn.style.marginTop = '20px';
    rewardBtn.style.border = 'none';
    rewardBtn.style.cursor = 'pointer';
    rewardBtn.style.fontSize = '16px';
    rewardBtn.onclick = () => {
      window.open('https://script.google.com/macros/s/AKfycbz0rGKd05Jp06lKRQnGDxKF-EQRlUvXVUE-MH3OeKkpKvlNT07SkfGQznTYw4UHBxxntg/exec', '_blank');
    };
    rewardContainer.appendChild(rewardBtn);
  }

  answerDiv.addEventListener('dragover', e => e.preventDefault());
  answerDiv.addEventListener('drop', e => {
    e.preventDefault();
    if (draggedLetter && draggedLetter.parentElement !== answerDiv) {
      moveLetter(draggedLetter, answerDiv);
      draggedLetter = null;
    }
  });

  puzzleDiv.addEventListener('dragover', e => e.preventDefault());
  puzzleDiv.addEventListener('drop', e => {
    e.preventDefault();
    if (draggedLetter && draggedLetter.parentElement !== puzzleDiv) {
      moveLetter(draggedLetter, puzzleDiv);
      draggedLetter = null;
    }
  });

  checkBtn.addEventListener('click', checkAnswer);
  hintBtn.addEventListener('click', giveHint);

  loadQuestion();
});
