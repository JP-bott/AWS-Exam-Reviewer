// Fetch questions JSON and run the quiz
let questions = [];
let currentIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let answered = [];

// Fisher-Yates shuffle for arrays
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffle options for a single question and fix the answerIndex
function shuffleQuestionOptions(q) {
  // create pairs of [option, originalIndex]
  const pairs = q.options.map((opt, idx) => ({ opt, idx }));
  const shuffled = shuffleArray(pairs);
  const newOptions = shuffled.map(p => p.opt);
  // find where the original correct index moved to
  const newAnswerIndex = shuffled.findIndex(p => p.idx === q.answerIndex);
  return Object.assign({}, q, { options: newOptions, answerIndex: newAnswerIndex });
}

// Randomize question order and option order for each question
function randomizeQuestions(srcQuestions) {
  const shuffledQuestions = shuffleArray(srcQuestions).map(q => shuffleQuestionOptions(q));
  return shuffledQuestions;
}

const questionText = document.getElementById('questionText');
const optionsDiv = document.getElementById('options');
const progressText = document.getElementById('progressText');
const feedbackDiv = document.getElementById('feedback');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const resultsDiv = document.getElementById('results');
const resultTitle = document.getElementById('resultTitle');
const resultSummary = document.getElementById('resultSummary');
const totalCount = document.getElementById('totalCount');
const correctCountEl = document.getElementById('correctCount');
const incorrectCountEl = document.getElementById('incorrectCount');
const restartBtn = document.getElementById('restartBtn');
const restartTop = document.getElementById('restartTop');
const reviewAnswersBtn = document.getElementById('reviewAnswers');
const reviewPanel = document.getElementById('reviewPanel');
const sideProgress = document.getElementById('sideProgress');

async function loadQuestions() {
  try {
    const res = await fetch('/questions');
    questions = await res.json();
    // randomize questions and options for a different quiz each run
    questions = randomizeQuestions(questions);
    resetQuizState();
    renderCurrent();
  } catch (err) {
    questionText.textContent = 'Failed to load questions.';
    console.error(err);
  }
}

function resetQuizState() {
  currentIndex = 0;
  correctCount = 0;
  incorrectCount = 0;
  answered = Array(questions.length).fill(null);
  resultsDiv.classList.add('hidden');
  reviewPanel.classList.add('hidden');
  document.getElementById('questionCard').classList.remove('opacity-50');
}

function renderCurrent() {
  const q = questions[currentIndex];
  progressText.textContent = `Question ${currentIndex + 1} / ${questions.length}`;
  questionText.textContent = q.question;

  // update side progress and counts live
  sideProgress.textContent = `${currentIndex+1} / ${questions.length}`;
  totalCount.textContent = questions.length;
  correctCountEl.textContent = correctCount;
  incorrectCountEl.textContent = incorrectCount;

  // render options
  optionsDiv.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn w-full text-left border border-gray-100 rounded-md hover:bg-gray-50 transition flex items-center gap-3 bg-white px-3 py-2 text-sm';
    btn.innerHTML = `
      <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sm font-semibold text-gray-700">${String.fromCharCode(65+i)}</div>
      <div class="flex-1 text-gray-700 text-sm">${opt}</div>
      <div class="flex-shrink-0 text-lg hidden option-icon"></div>
    `;
    btn.onclick = () => onSelect(i, btn);

    // disable if already answered
    if (answered[currentIndex] !== null) {
      btn.disabled = true;
      btn.classList.add('opacity-80', 'cursor-not-allowed');
      // highlight selected & correct
      if (q.answerIndex === i) {
        btn.classList.add('bg-green-50', 'border-green-200', 'text-green-700');
        btn.querySelector('.option-icon').classList.remove('hidden');
        btn.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-check text-green-600"></i>';
      }
      if (answered[currentIndex] === i && answered[currentIndex] !== q.answerIndex) {
        btn.classList.add('bg-red-50', 'border-red-200', 'text-red-700');
        btn.querySelector('.option-icon').classList.remove('hidden');
        btn.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-xmark text-red-600"></i>';
      }
      if (answered[currentIndex] === i && answered[currentIndex] === q.answerIndex) {
        btn.classList.add('border-green-300');
      }
    }
    optionsDiv.appendChild(btn);
  });

  // feedback area
  feedbackDiv.innerHTML = '';

  prevBtn.disabled = currentIndex === 0;
  if (currentIndex === questions.length -1) {
    nextBtn.textContent = 'Finish';
  } else {
    nextBtn.textContent = 'Next';
  }
}

function onSelect(optionIndex) {
  const q = questions[currentIndex];
  if (answered[currentIndex] !== null) return; // already answered

  answered[currentIndex] = optionIndex;
  const correct = optionIndex === q.answerIndex;
  if (correct) correctCount++;
  else incorrectCount++;

  // show immediate feedback with richer UI
  feedbackDiv.innerHTML = '';
  const fb = document.createElement('div');
  fb.className = 'flex items-center gap-4';
  if (correct) {
    fb.innerHTML = `
      <div class="icon-badge bg-green-100 text-green-700"><i class="fa-solid fa-check fa-lg"></i></div>
      <div>
        <div class="text-green-800 font-semibold">Correct</div>
        <div class="text-sm text-gray-600 explanation">${q.explanation || ''}</div>
      </div>
    `;
  } else {
    fb.innerHTML = `
      <div class="icon-badge bg-red-100 text-red-700"><i class="fa-solid fa-xmark fa-lg"></i></div>
      <div>
        <div class="text-red-800 font-semibold">Incorrect</div>
        <div class="text-sm text-gray-600 explanation">Correct answer: <strong class="text-gray-800">${q.options[q.answerIndex]}</strong>${q.explanation? ' — '+q.explanation : ''}</div>
      </div>
    `;
  }
  feedbackDiv.appendChild(fb);

  // re-render to apply disabled/highlight
  renderCurrent();
}

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderCurrent();
  }
});

nextBtn.addEventListener('click', () => {
  // if last question and answered, show results
  if (currentIndex === questions.length -1) {
    // ensure question answered before finishing
    if (answered[currentIndex] === null) {
      alert('Please select an answer before finishing the quiz.');
      return;
    }
    showResults();
    return;
  }

  // require answer before moving next
  if (answered[currentIndex] === null) {
    alert('Please select an answer before moving to the next question.');
    return;
  }
  currentIndex++;
  renderCurrent();
});

function showResults() {
  resultsDiv.classList.remove('hidden');
  const total = questions.length;
  totalCount.textContent = total;
  correctCountEl.textContent = correctCount;
  incorrectCountEl.textContent = incorrectCount;
  resultSummary.textContent = `You scored ${correctCount} out of ${total} (${Math.round((correctCount/total)*100)}%)`;

  // performance remark
  let remark = 'Needs Improvement';
  if (correctCount/total >= 0.85) remark = 'Excellent';
  else if (correctCount/total >= 0.6) remark = 'Good';
  resultTitle.textContent = remark;

  // enhance result panel visuals
  if (remark === 'Excellent') {
    resultsDiv.classList.remove('from-green-50');
    resultTitle.innerHTML = '<i class="fa-solid fa-trophy text-yellow-500 mr-2"></i>Excellent';
  } else if (remark === 'Good') {
    resultTitle.innerHTML = '<i class="fa-solid fa-medal text-indigo-500 mr-2"></i>Good';
  } else {
    resultTitle.innerHTML = '<i class="fa-solid fa-circle-exclamation text-red-500 mr-2"></i>Needs Improvement';
  }

  // soft highlight results in side panel
  document.getElementById('questionCard').classList.add('opacity-60');
}

function restartQuiz() {
  // reshuffle for a fresh randomized run
  questions = randomizeQuestions(questions);
  resetQuizState();
  renderCurrent();
}

restartBtn.addEventListener('click', () => restartQuiz());
restartTop.addEventListener('click', () => restartQuiz());

reviewAnswersBtn.addEventListener('click', () => {
  reviewPanel.classList.toggle('hidden');
  if (!reviewPanel.classList.contains('hidden')) {
    renderReview();
  }
});

function renderReview() {
  reviewPanel.innerHTML = '';
  questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'p-3 border-b';
    const header = document.createElement('div');
    header.className = 'flex items-start justify-between gap-2';
    header.innerHTML = `<div class="text-sm font-medium">${idx+1}. ${q.question}</div>`;
    const badge = document.createElement('div');
    badge.className = 'text-sm';
    badge.innerHTML = answered[idx]===q.answerIndex?'<span class="text-green-600">Correct</span>':'<span class="text-red-600">Incorrect</span>';
    header.appendChild(badge);
    card.appendChild(header);
    const list = document.createElement('ul');
    list.className = 'mt-2 space-y-1 text-sm';
    q.options.forEach((opt, i) => {
      const li = document.createElement('li');
      li.className = 'p-2 flex items-center gap-2';
      if (i === q.answerIndex) li.classList.add('text-green-700');
      if (answered[idx] === i && answered[idx] !== q.answerIndex) li.classList.add('text-red-700');
      li.innerHTML = `<span class="w-6 font-semibold">${String.fromCharCode(65+i)}</span><span>${opt}</span>`;
      list.appendChild(li);
    });
    card.appendChild(list);
    if (q.explanation) {
      const expl = document.createElement('div');
      expl.className = 'mt-2 text-xs text-gray-600';
      expl.textContent = `Explanation: ${q.explanation}`;
      card.appendChild(expl);
    }
    reviewPanel.appendChild(card);
  });
}

// initial load
loadQuestions();
