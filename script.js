// ======================
// THEME LOGIC (NEW)
// ======================
const themeBtn = document.getElementById("themeBtn");
const savedTheme = localStorage.getItem("theme") || "dark";

document.documentElement.setAttribute("data-theme", savedTheme);
themeBtn.textContent = savedTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";

themeBtn.onclick = () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeBtn.textContent = next === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
};

// ======================
// QUIZ CODE (UNCHANGED)
// ======================
const questions = [
  {
    text: "Who was the first Prime Minister of India?",
    options: [
      "Mahatma Gandhi",
      "Jawaharlal Nehru",
      "Subhas Chandra Bose",
      "Sardar Patel"
    ],
    correctIndex: 1
  },
  {
    text: "In which year did India gain independence?",
    options: ["1945", "1946", "1947", "1950"],
    correctIndex: 2
  }
];

let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;

let highScore = Number(localStorage.getItem("highScore")) || 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressEl = document.getElementById("progress");
const feedbackEl = document.getElementById("feedback");
const resultEl = document.getElementById("result");
const highScoreEl = document.getElementById("highScore");

const nextBtn = document.getElementById("nextBtn");
const skipBtn = document.getElementById("skipBtn");
const restartBtn = document.getElementById("restartBtn");

function loadQuestion() {
  const q = questions[currentQuestionIndex];

  hasAnswered = false;
  nextBtn.disabled = true;
  feedbackEl.textContent = "";

  questionEl.textContent = q.text;
  progressEl.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  highScoreEl.textContent = `High Score: ${highScore}`;

  optionsEl.innerHTML = "";

  q.options.forEach((optionText, index) => {
    const btn = document.createElement("button");
    btn.textContent = optionText;
    btn.onclick = () => checkAnswer(index);
    optionsEl.appendChild(btn);
  });
}

function checkAnswer(selectedIndex) {
  if (hasAnswered) return;

  hasAnswered = true;
  nextBtn.disabled = false;

  const q = questions[currentQuestionIndex];
  const buttons = optionsEl.querySelectorAll("button");

  buttons.forEach(btn => btn.disabled = true);

  if (selectedIndex === q.correctIndex) {
    score++;
    buttons[selectedIndex].textContent += " ✔️";
    feedbackEl.textContent = "Correct!";
  } else {
    buttons[selectedIndex].textContent += " ❌";
    feedbackEl.innerHTML = `
      ❌ Wrong<br>
      ✅ Correct answer: <strong>${q.options[q.correctIndex]}</strong>
    `;
  }
}

skipBtn.onclick = () => {
  if (hasAnswered) return;
  hasAnswered = true;
  nextQuestion();
};

nextBtn.onclick = nextQuestion;

function nextQuestion() {
  currentQuestionIndex++;
  currentQuestionIndex < questions.length ? loadQuestion() : endQuiz();
}

function endQuiz() {
  questionEl.textContent = "Quiz Finished 🎉";
  progressEl.textContent = "";
  feedbackEl.textContent = "";

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  resultEl.innerHTML = `
    Your score: ${score}/${questions.length}<br>
    🏆 High Score: ${highScore}
  `;

  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";
  skipBtn.style.display = "none";
  restartBtn.style.display = "block";
}

restartBtn.onclick = () => {
  currentQuestionIndex = 0;
  score = 0;
  hasAnswered = false;

  resultEl.textContent = "";
  nextBtn.style.display = "inline-block";
  skipBtn.style.display = "inline-block";
  restartBtn.style.display = "none";

  loadQuestion();
};

loadQuestion();
