const navbar = document.getElementById("navbar");
const scrollTopBtn = document.getElementById("scrollTop");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
  scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
});

const mobileMenu = document.getElementById("mobileMenu");
document
  .getElementById("hamburger")
  .addEventListener("click", () => mobileMenu.classList.add("open"));
document
  .getElementById("mobileClose")
  .addEventListener("click", () => mobileMenu.classList.remove("open"));
function closeMobile() {
  mobileMenu.classList.remove("open");
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector(".skill-bar-fill");
        if (fill) fill.style.width = fill.dataset.width + "%";
      }
    });
  },
  { threshold: 0.3 },
);
document
  .querySelectorAll(".skill-card")
  .forEach((el) => skillObserver.observe(el));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = "true";
        const target = parseInt(e.target.dataset.target);
        const suffix = e.target.dataset.suffix || "";
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          e.target.textContent = Math.floor(start) + suffix;
          if (start >= target) clearInterval(timer);
        }, 24);
      }
    });
  },
  { threshold: 0.5 },
);
document
  .querySelectorAll(".counter")
  .forEach((el) => counterObserver.observe(el));

const symbols = [
  "∑",
  "∞",
  "π",
  "÷",
  "×",
  "?",
  "!",
  "IQ",
  "AI",
  "%",
  "√",
  "≠",
  "∆",
  "Ω",
  "❌",
  "○",
];
const fsContainer = document.getElementById("floatingSymbols");
for (let i = 0; i < 14; i++) {
  const el = document.createElement("div");
  el.className = "fsym";
  el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  el.style.left = Math.random() * 100 + "%";
  el.style.fontSize = Math.random() * 26 + 12 + "px";
  el.style.animationDuration = Math.random() * 20 + 14 + "s";
  el.style.animationDelay = Math.random() * -22 + "s";
  fsContainer.appendChild(el);
}

// Tic Tac Toe
let tttBoard,
  tttTurn,
  tttLocked,
  scoreX = 0,
  scoreO = 0,
  scoreD = 0;
const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
function checkWinner(b) {
  for (const [a, c, d] of wins)
    if (b[a] && b[a] === b[c] && b[a] === b[d])
      return { winner: b[a], combo: [a, c, d] };
  if (b.every(Boolean)) return { winner: "draw", combo: [] };
  return null;
}
function minimax(b, isMax) {
  const res = checkWinner(b);
  if (res) {
    if (res.winner === "O") return 10;
    if (res.winner === "X") return -10;
    return 0;
  }
  const scores = [];
  b.forEach((cell, i) => {
    if (!cell) {
      b[i] = isMax ? "O" : "X";
      scores.push(minimax(b, !isMax));
      b[i] = null;
    }
  });
  return isMax ? Math.max(...scores) : Math.min(...scores);
}
function bestMove(b) {
  let best = -Infinity,
    move = -1;
  b.forEach((cell, i) => {
    if (!cell) {
      b[i] = "O";
      const score = minimax(b, false);
      b[i] = null;
      if (score > best) {
        best = score;
        move = i;
      }
    }
  });
  return move;
}
function renderTTT() {
  document.querySelectorAll(".ttt-cell").forEach((cell, i) => {
    cell.textContent = tttBoard[i] || "";
    cell.className =
      "ttt-cell" +
      (tttBoard[i] === "X"
        ? " x-mark"
        : tttBoard[i] === "O"
          ? " o-mark"
          : "") +
      (tttBoard[i] ? " taken" : "");
  });
}
function tttClick(i) {
  if (tttLocked || tttBoard[i] || tttTurn !== "X") return;
  tttBoard[i] = "X";
  renderTTT();
  const res = checkWinner(tttBoard);
  if (res) {
    endGame(res);
    return;
  }
  tttTurn = "O";
  document.getElementById("tttStatus").textContent =
    "AI is thinking... 🤖";
  tttLocked = true;
  setTimeout(() => {
    const move = bestMove(tttBoard);
    if (move !== -1) tttBoard[move] = "O";
    renderTTT();
    const res2 = checkWinner(tttBoard);
    if (res2) {
      endGame(res2);
      return;
    }
    tttTurn = "X";
    tttLocked = false;
    document.getElementById("tttStatus").textContent = "Your turn! (X)";
  }, 500);
}
function endGame(res) {
  tttLocked = true;
  if (res.winner === "X") {
    scoreX++;
    document.getElementById("tttStatus").textContent = "🎉 You win!";
  } else if (res.winner === "O") {
    scoreO++;
    document.getElementById("tttStatus").textContent = "🤖 AI wins!";
  } else {
    scoreD++;
    document.getElementById("tttStatus").textContent = "🤝 It's a draw!";
  }
  res.combo.forEach((i) =>
    document
      .querySelectorAll(".ttt-cell")
      [i].classList.add("winner-cell"),
  );
  document.getElementById("scoreX").textContent = scoreX;
  document.getElementById("scoreO").textContent = scoreO;
  document.getElementById("scoreD").textContent = scoreD;
  setTimeout(resetTTT, 2200);
}
function resetTTT() {
  tttBoard = Array(9).fill(null);
  tttTurn = "X";
  tttLocked = false;
  renderTTT();
  document.getElementById("tttStatus").textContent =
    "Your turn! Click a cell.";
}
document.getElementById("tttBoard").innerHTML = Array.from(
  { length: 9 },
  (_, i) => `<div class="ttt-cell" data-i="${i}"></div>`,
).join("");
document
  .querySelectorAll(".ttt-cell")
  .forEach((cell) =>
    cell.addEventListener("click", () =>
      tttClick(parseInt(cell.dataset.i)),
    ),
  );
resetTTT();

// Math Quiz
let quizScore = 0,
  quizStreak = 0,
  quizLevel = 1,
  quizTimer,
  quizCorrect,
  quizActive = false;
function generateQ() {
  const ops = ["+", "-", "*"];
  const op = ops[Math.floor(Math.random() * (quizLevel < 3 ? 2 : 3))];
  const maxNum = quizLevel < 3 ? 20 : quizLevel < 5 ? 50 : 99;
  let a = Math.floor(Math.random() * maxNum) + 1,
    b = Math.floor(Math.random() * maxNum) + 1;
  if (op === "-" && b > a) [a, b] = [b, a];
  let ans;
  if (op === "+") ans = a + b;
  else if (op === "-") ans = a - b;
  else {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
    ans = a * b;
  }
  return { q: `${a} ${op} ${b} = ?`, answer: ans };
}
function startQuiz() {
  const { q, answer } = generateQ();
  quizCorrect = answer;
  document.getElementById("quizQ").textContent = q;
  document.getElementById("quizFeedback").textContent = "";
  const opts = document.getElementById("quizOpts");
  opts.innerHTML = "";
  const choices = new Set([answer]);
  while (choices.size < 4) {
    const wrong = answer + (Math.floor(Math.random() * 20) - 10);
    if (wrong !== answer && wrong >= 0) choices.add(wrong);
  }
  [...choices]
    .sort(() => Math.random() - 0.5)
    .forEach((val) => {
      const btn = document.createElement("button");
      btn.className = "quiz-opt";
      btn.textContent = val;
      btn.addEventListener("click", () => answerQuiz(val));
      opts.appendChild(btn);
    });
  quizActive = true;
  const totalTime = Math.max(3000, 7000 - quizLevel * 500);
  const bar = document.getElementById("quizTimerBar");
  bar.style.width = "100%";
  clearInterval(quizTimer);
  const start = Date.now();
  quizTimer = setInterval(() => {
    const elapsed = Date.now() - start;
    const pct = Math.max(0, 100 * (1 - elapsed / totalTime));
    bar.style.width = pct + "%";
    if (pct <= 0) {
      clearInterval(quizTimer);
      quizActive = false;
      quizStreak = 0;
      document.getElementById("quizStreak").textContent = quizStreak;
      document.getElementById("quizFeedback").textContent =
        `⏱ Time's up! Answer: ${quizCorrect}`;
      document.getElementById("quizFeedback").style.color =
        "var(--accent-red)";
      document
        .querySelectorAll(".quiz-opt")
        .forEach((b) => b.classList.add("answered"));
      setTimeout(startQuiz, 1800);
    }
  }, 50);
}
function answerQuiz(val) {
  if (!quizActive) return;
  clearInterval(quizTimer);
  quizActive = false;
  document.getElementById("quizTimerBar").style.width = "0%";
  document.querySelectorAll(".quiz-opt").forEach((btn) => {
    btn.classList.add("answered");
    if (parseInt(btn.textContent) === quizCorrect)
      btn.classList.add("correct");
    if (parseInt(btn.textContent) === val && val !== quizCorrect)
      btn.classList.add("wrong");
  });
  const fb = document.getElementById("quizFeedback");
  if (val === quizCorrect) {
    quizScore += 10 * quizLevel;
    quizStreak++;
    if (quizStreak % 3 === 0) quizLevel = Math.min(quizLevel + 1, 8);
    fb.textContent = `✅ Correct! +${10 * quizLevel} pts 🔥 Streak: ${quizStreak}`;
    fb.style.color = "var(--accent-mint)";
  } else {
    quizStreak = 0;
    fb.textContent = `❌ Wrong! Answer: ${quizCorrect}`;
    fb.style.color = "var(--accent-red)";
  }
  document.getElementById("quizScore").textContent = quizScore;
  document.getElementById("quizStreak").textContent = quizStreak;
  document.getElementById("quizLevel").textContent = quizLevel;
  setTimeout(startQuiz, 1400);
}
startQuiz();

// Memory Game
const memEmojis = ["🧠", "⚡", "🔮", "🎯", "🚀", "🌟", "🎮", "🏆"];
let memCards = [],
  memFlipped = [],
  memMatched = 0,
  memLocked = true,
  memPreviewTimer = null;
function initMemory() {
  if (memPreviewTimer) clearInterval(memPreviewTimer);
  const deck = [...memEmojis, ...memEmojis].sort(
    () => Math.random() - 0.5,
  );
  memFlipped = [];
  memMatched = 0;
  memLocked = true;
  const statusEl = document.getElementById("memStatus");
  statusEl.textContent = "Memorize the cards! 5...";
  statusEl.style.color = "var(--accent-coral)";
  const grid = document.getElementById("memGrid");
  grid.innerHTML = "";
  memCards = [];
  deck.forEach((emoji, i) => {
    const card = document.createElement("div");
    card.className = "mem-card flipped";
    card.innerHTML = `<div class="mem-card-front"><div style="font-size:1.6rem">❓</div></div><div class="mem-card-back">${emoji}</div>`;
    card.dataset.emoji = emoji;
    card.dataset.index = i;
    card.addEventListener("click", () => flipCard(card));
    grid.appendChild(card);
    memCards.push(card);
  });
  let countdown = 5;
  memPreviewTimer = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      statusEl.textContent = `Memorize the cards! ${countdown}...`;
    } else {
      clearInterval(memPreviewTimer);
      memPreviewTimer = null;
      memCards.forEach((card) => card.classList.remove("flipped"));
      statusEl.textContent = "Find all matching pairs!";
      statusEl.style.color = "var(--text-muted)";
      memLocked = false;
    }
  }, 1000);
}
function flipCard(card) {
  if (
    memLocked ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  )
    return;
  card.classList.add("flipped");
  memFlipped.push(card);
  if (memFlipped.length === 2) {
    memLocked = true;
    setTimeout(checkMemMatch, 700);
  }
}
function checkMemMatch() {
  const [a, b] = memFlipped;
  if (a.dataset.emoji === b.dataset.emoji) {
    a.classList.add("matched");
    b.classList.add("matched");
    memMatched++;
    if (memMatched === memEmojis.length) {
      document.getElementById("memStatus").textContent =
        "🎉 You matched them all!";
      document.getElementById("memStatus").style.color =
        "var(--accent-mint)";
    }
  } else {
    a.classList.remove("flipped");
    b.classList.remove("flipped");
  }
  memFlipped = [];
  memLocked = false;
}
initMemory();

// Number Logic
let nlogicSolution,
  nlogicGridData,
  nlogicSelected = null;
function generateNumberLogicPuzzle() {
  const solved = [
    [1, 2, 3],
    [2, 3, 1],
    [3, 1, 2],
  ];
  nlogicSolution = solved.map((row) => [...row]);
  nlogicGridData = solved.map((row) => [...row]);
  const cellsToClear = [
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 1],
  ];
  cellsToClear.sort(() => Math.random() - 0.5);
  const clearCount = 4 + Math.floor(Math.random() * 2);
  for (let i = 0; i < clearCount; i++) {
    const [r, c] = cellsToClear[i];
    nlogicGridData[r][c] = 0;
  }
}
function renderNumberLogic() {
  const grid = document.getElementById("nlogicGrid");
  grid.innerHTML = "";
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = document.createElement("div");
      cell.className = "nlogic-cell";
      if (nlogicGridData[r][c] !== 0) {
        cell.textContent = nlogicGridData[r][c];
        cell.classList.add("prefilled");
      } else {
        cell.addEventListener("click", () => selectNlogicCell(r, c));
      }
      if (
        nlogicSelected &&
        nlogicSelected[0] === r &&
        nlogicSelected[1] === c
      )
        cell.classList.add("selected");
      grid.appendChild(cell);
    }
  }
  checkNlogicWin();
}
function selectNlogicCell(r, c) {
  if (nlogicGridData[r][c] !== 0) return;
  nlogicSelected = [r, c];
  renderNumberLogic();
}
function placeNumber(num) {
  if (!nlogicSelected) return;
  const [r, c] = nlogicSelected;
  if (nlogicGridData[r][c] !== 0) return;
  nlogicGridData[r][c] = num;
  nlogicSelected = null;
  renderNumberLogic();
}
function checkNlogicWin() {
  const status = document.getElementById("nlogicStatus");
  if (
    nlogicGridData.every((row, r) =>
      row.every((val, c) => val === nlogicSolution[r][c]),
    )
  ) {
    status.textContent = "🎉 Puzzle solved! Great logic.";
    status.style.color = "var(--accent-mint)";
  } else {
    status.textContent = "Click a cell, then pick a number.";
    status.style.color = "var(--text-muted)";
  }
}
function resetNumberLogic() {
  generateNumberLogicPuzzle();
  nlogicSelected = null;
  renderNumberLogic();
  document.getElementById("nlogicStatus").textContent =
    "Click a cell, then pick a number.";
  document.getElementById("nlogicStatus").style.color =
    "var(--text-muted)";
}
document.getElementById("nlogicPad").innerHTML = [1, 2, 3]
  .map(
    (n) =>
      `<button class="nlogic-num" onclick="placeNumber(${n})">${n}</button>`,
  )
  .join("");
resetNumberLogic();

// Reflex Training
let reflexTimeout,
  reflexStart,
  reflexWaiting = false;
const reflexBox = document.getElementById("reflexBox"),
  reflexResult = document.getElementById("reflexResult");
function startReflexRound() {
  if (reflexWaiting) return;
  reflexBox.classList.remove("ready");
  reflexBox.classList.add("waiting");
  reflexBox.textContent = "Wait for green...";
  reflexResult.textContent = "";
  reflexWaiting = true;
  const delay = 1500 + Math.random() * 3000;
  reflexTimeout = setTimeout(() => {
    reflexBox.classList.remove("waiting");
    reflexBox.classList.add("ready");
    reflexBox.textContent = "CLICK NOW!";
    reflexStart = Date.now();
  }, delay);
}
function reflexClick() {
  if (!reflexWaiting) return;
  if (reflexBox.classList.contains("ready")) {
    const reaction = Date.now() - reflexStart;
    reflexResult.textContent = `⚡ Your reaction time: ${reaction} ms`;
    reflexBox.classList.remove("ready");
    reflexBox.textContent = "Click to try again";
    reflexWaiting = false;
    clearTimeout(reflexTimeout);
  } else {
    clearTimeout(reflexTimeout);
    reflexBox.classList.remove("waiting");
    reflexBox.textContent = "Too soon! Click to retry.";
    reflexResult.textContent = "⏳ Wait for green before clicking.";
    reflexWaiting = false;
  }
  setTimeout(() => {
    if (!reflexWaiting) startReflexRound();
  }, 1500);
}
startReflexRound();

// Pattern Recon
const shapes = ["🔵", "🟥", "🟩", "🟨"];
let patternAnswer,
  patternActive = true;
function generatePattern() {
  const patterns = [
    { seq: ["🔵", "🟥", "🔵", "🟥"], answer: "🔵" },
    { seq: ["🟩", "🟨", "🟩", "🟨"], answer: "🟩" },
    { seq: ["🔵", "🔵", "🟥", "🔵"], answer: "🔵" },
    { seq: ["🟥", "🟩", "🟥", "🟩"], answer: "🟥" },
    { seq: ["🟨", "🔵", "🟨", "🔵"], answer: "🟨" },
    { seq: ["🟩", "🟩", "🟨", "🟩"], answer: "🟩" },
  ];
  const chosen = patterns[Math.floor(Math.random() * patterns.length)];
  document.getElementById("patternSeq").innerHTML =
    chosen.seq.map((s) => `<span>${s}</span>`).join("") +
    '<span style="font-size:2.5rem;opacity:0.5;">❓</span>';
  patternAnswer = chosen.answer;
  const optsDiv = document.getElementById("patternOpts");
  optsDiv.innerHTML = "";
  const options = [chosen.answer];
  while (options.length < 4) {
    const randShape = shapes[Math.floor(Math.random() * shapes.length)];
    if (!options.includes(randShape)) options.push(randShape);
  }
  options
    .sort(() => Math.random() - 0.5)
    .forEach((shape) => {
      const btn = document.createElement("div");
      btn.className = "pattern-opt";
      btn.textContent = shape;
      btn.addEventListener("click", () => checkPattern(shape));
      optsDiv.appendChild(btn);
    });
  document.getElementById("patternFeedback").textContent = "";
  patternActive = true;
}
function checkPattern(shape) {
  if (!patternActive) return;
  patternActive = false;
  const fb = document.getElementById("patternFeedback");
  if (shape === patternAnswer) {
    fb.textContent = "✅ Correct! Great pattern recognition.";
    fb.style.color = "var(--accent-mint)";
  } else {
    fb.textContent = `❌ Not quite. The answer was ${patternAnswer}.`;
    fb.style.color = "var(--accent-red)";
  }
}
function newPattern() {
  generatePattern();
}
generatePattern();

// Showcase Gallery
(function buildShowcase() {
  const screenImages = [
    "images/img (1).jpeg",
    "images/img (2).jpeg",
    "images/img (3).jpeg",
    "images/img (4).jpeg",
    "images/img (5).jpeg",
    "images/img (6).jpeg",
    "images/img (7).jpeg",
    "images/img (8).jpeg",
    "images/img (9).jpeg",
    "images/img (10).jpeg",
  ];
  const track = document.getElementById("showcaseTrack");
  if (!track || screenImages.length === 0) return;
  const createImageCard = (src) =>
    `<div class="showcase-screen"><img src="${src}" alt="App screenshot" /></div>`;
  const originalCards = screenImages.map(createImageCard).join("");
  track.innerHTML = originalCards + originalCards;
  const newSpeed = Math.max(10, screenImages.length * 2);
  track.style.animationDuration = newSpeed + "s";
})();

// Contact Form (Multi-Fallback with Gmail Redirect)
async function handleContactSubmit(e) {
  e.preventDefault();
  const form = document.getElementById("contactForm");
  const statusDiv = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const formData = new FormData(form);
  const name = formData.get("name");
  const email = formData.get("email");
  const role = formData.get("role");
  const subject = formData.get("subject");
  const message = formData.get("message");

  statusDiv.textContent = "Sending...";
  statusDiv.className = "form-message";
  submitBtn.disabled = true;

  const payload = { name, email, role, subject, message };

  const attempts = [
    {
      name: "Web3Forms",
      url: "https://api.web3forms.com/submit",
      body: {
        access_key: "edc2f605-10a5-4e84-81d1-314bdaf3634a",
        ...payload,
      },
    },
    {
      name: "Formspree",
      url: "https://formspree.io/f/mjgdqyey",
      body: payload,
    },
    {
      name: "Getform",
      url: "https://getform.io/f/YOUR_GETFORM_FORM_ID",
      body: payload,
    },
    {
      name: "Formspark",
      url: "https://submit-form.com/YOUR_FORMSPARK_FORM_ID",
      body: payload,
    },
    {
      name: "StaticForms",
      url: "https://api.staticforms.dev/submit",
      body: { accessKey: "sf_2b01f58fb5861f1b68986c32", ...payload },
    },
  ];

  let success = false;
  for (const attempt of attempts) {
    try {
      const response = await fetch(attempt.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attempt.body),
      });
      if (response.ok) {
        success = true;
        statusDiv.textContent = `✅ Message sent successfully! (via ${attempt.name})`;
        statusDiv.className = "form-message success";
        form.reset();
        break;
      }
    } catch (error) {
      console.warn(`${attempt.name} failed:`, error);
    }
  }

  if (!success) {
    const mailSubject = encodeURIComponent(
      subject || "Contact from LearnIQ",
    );
    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nRole: ${role}\n\nMessage:\n${message}`,
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=learniqtech@gmail.com&su=${mailSubject}&body=${mailBody}`;
    window.open(gmailUrl, "_blank");
    statusDiv.textContent =
      "All services failed. Opening Gmail for you...";
    statusDiv.className = "form-message error";
  }
  submitBtn.disabled = false;
}

// Trial Form Handler (new)
async function handleTrialSubmit(e) {
  e.preventDefault();
  const statusDiv = document.getElementById("trialStatus");
  const submitBtn = document.getElementById("trialBtn");
  const form = document.getElementById("trialForm");
  const formData = new FormData(form);

  statusDiv.textContent = "Submitting...";
  statusDiv.className = "form-message";
  submitBtn.disabled = true;

  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    school: formData.get("school"),
    students: formData.get("students"),
    type: "free_trial",
  };

  const attempts = [
    {
      name: "Web3Forms",
      url: "https://api.web3forms.com/submit",
      body: { access_key: "edc2f605-10a5-4e84-81d1-314bdaf3634a", ...payload },
    },
    {
      name: "Formspree",
      url: "https://formspree.io/f/mjgdqyey",
      body: payload,
    },
    {
      name: "StaticForms",
      url: "https://api.staticforms.dev/submit",
      body: { accessKey: "sf_2b01f58fb5861f1b68986c32", ...payload },
    },
  ];

  let success = false;
  for (const attempt of attempts) {
    try {
      const response = await fetch(attempt.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attempt.body),
      });
      if (response.ok) {
        success = true;
        statusDiv.textContent = "✅ Trial activated! We'll reach out within 2 hours.";
        statusDiv.className = "form-message success";
        form.reset();
        break;
      }
    } catch (error) {
      console.warn(`${attempt.name} failed:`, error);
    }
  }

  if (!success) {
    statusDiv.textContent = "⚠️ Please try again or email learniqtech@gmail.com";
    statusDiv.className = "form-message error";
  }
  submitBtn.disabled = false;
}