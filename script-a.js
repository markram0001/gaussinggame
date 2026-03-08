console.log("script-a.js loaded");

// === Global Stats API ===
const WORKER_BASE_URL = "https://gaussing-global-stats.markram0001.workers.dev";

async function sendGuessToGlobalStats(guess) {
  try {
    await fetch(`${WORKER_BASE_URL}/guess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess })
    });
  } catch (err) {
    console.error("Error sending guess to global stats:", err);
  }
}

async function loadGlobalStats() {
  try {
    const res = await fetch(`${WORKER_BASE_URL}/stats`);
    return await res.json(); // { yes: X, no: Y }
  } catch (err) {
    console.error("Error loading global stats:", err);
    return { yes: 0, no: 0 };
  }
}

async function loadAllTimeStats() {
  try {
    const res = await fetch(`${WORKER_BASE_URL}/all-stats`);
    return await res.json(); // { yes: X, no: Y }
  } catch (err) {
    console.error("Error loading all-time stats:", err);
    return { yes: 0, no: 0 };
  }
}

// Elements from your HTML
const intervalText = document.getElementById("interval-text");
const rawDataText = document.getElementById("raw-data");
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");

const resultBox = document.getElementById("result");
const correctnessText = document.getElementById("correctness");
const trueValueText = document.getElementById("true-value");

const globalStatsBox = document.getElementById("global-stats");

// NEW: Today + All-Time stats elements
const todayYesText = document.getElementById("today-yes");
const todayNoText = document.getElementById("today-no");
const allYesText = document.getElementById("all-yes");
const allNoText = document.getElementById("all-no");

// Your Stats elements
const yourStatsBox = document.getElementById("your-stats");
const yourYesText = document.getElementById("your-yes");
const yourNoText = document.getElementById("your-no");

let data = null;
let hasGuessed = false;

// Helper: update Your Stats
function updateYourStats() {
  const yesGuesses = Number(localStorage.getItem("yes_guesses") || 0);
  const yesCorrect = Number(localStorage.getItem("yes_correct") || 0);

  const noGuesses = Number(localStorage.getItem("no_guesses") || 0);
  const noCorrect = Number(localStorage.getItem("no_correct") || 0);

  yourYesText.textContent =
    `YES guesses: ${yesGuesses} (${yesCorrect} correct)`;

  yourNoText.textContent =
    `NO guesses: ${noGuesses} (${noCorrect} correct)`;

  yourStatsBox.style.display = "block";
}

// Load today's puzzle
fetch("data/today.json")
  .then(r => r.json())
  .then(json => {
    data = json;

    // Build the Option A sentence
    intervalText.textContent =
      `Today's Claim: Using a 95% confidence interval, Fred claims that the ${json.parameter_name} ` +
      `is between ${json.interval[0]} and ${json.interval[1]} (n = ${json.sample_size}).`;
    rawDataText.textContent = `Raw data: ${json.raw_data.join(", ")}`;

    // --------------------------------------------
    // Check if user already guessed today
    // --------------------------------------------
    const key = "guess_" + json.day;
    const previousGuess = localStorage.getItem(key);

    if (previousGuess !== null) {
      hasGuessed = true;

      const wasCorrect = (previousGuess === "yes" && json.contained) ||
                         (previousGuess === "no" && !json.contained);

      correctnessText.textContent = wasCorrect ? "Correct!" : "Incorrect";
      trueValueText.textContent = `The true value is ${json.true_value}.`;

      resultBox.style.display = "block";

      // Show personal stats
      updateYourStats();

      // Load today's + all-time stats
      loadGlobalStats().then(stats => {
        todayYesText.textContent = `Yes: ${stats.yes}`;
        todayNoText.textContent = `No: ${stats.no}`;
      });

      loadAllTimeStats().then(stats => {
        allYesText.textContent = `Yes: ${stats.yes}`;
        allNoText.textContent = `No: ${stats.no}`;
      });

      globalStatsBox.style.display = "block";

      // Disable buttons
      btnYes.disabled = true;
      btnNo.disabled = true;
    }
  });

// Handle a guess
function handleGuess(guess) {
  if (!data || hasGuessed) return;
  hasGuessed = true;

  // Send guess to global stats backend
  sendGuessToGlobalStats(guess);

  const correct = (guess === "yes" && data.contained) ||
                  (guess === "no" && !data.contained);

  // Save today's guess so refresh doesn't allow another
  const key = "guess_" + data.day;
  localStorage.setItem(key, guess);

  // Update YES/NO tallies
  if (guess === "yes") {
    const yg = Number(localStorage.getItem("yes_guesses") || 0) + 1;
    localStorage.setItem("yes_guesses", yg);

    if (correct) {
      const yc = Number(localStorage.getItem("yes_correct") || 0) + 1;
      localStorage.setItem("yes_correct", yc);
    }
  }

  if (guess === "no") {
    const ng = Number(localStorage.getItem("no_guesses") || 0) + 1;
    localStorage.setItem("no_guesses", ng);

    if (correct) {
      const nc = Number(localStorage.getItem("no_correct") || 0) + 1;
      localStorage.setItem("no_correct", nc);
    }
  }

  // Show updated personal stats
  updateYourStats();

  // Show correctness
  correctnessText.textContent = correct ? "Correct!" : "Incorrect";

  // Reveal true value
  trueValueText.textContent = `The true value is ${data.true_value}.`;

  // Show result box
  resultBox.style.display = "block";

  // Update local score (overall)
  const total = Number(localStorage.getItem("total_guesses") || 0) + 1;
  const correctCount = Number(localStorage.getItem("correct_guesses") || 0) + (correct ? 1 : 0);

  localStorage.setItem("total_guesses", total);
  localStorage.setItem("correct_guesses", correctCount);

  // Load today's + all-time stats
  loadGlobalStats().then(stats => {
    todayYesText.textContent = `Yes: ${stats.yes}`;
    todayNoText.textContent = `No: ${stats.no}`;
  });

  loadAllTimeStats().then(stats => {
    allYesText.textContent = `Yes: ${stats.yes}`;
    allNoText.textContent = `No: ${stats.no}`;
  });

  globalStatsBox.style.display = "block";

  // Disable buttons
  btnYes.disabled = true;
  btnNo.disabled = true;
}

// Button events
btnYes.addEventListener("click", () => handleGuess("yes"));
btnNo.addEventListener("click", () => handleGuess("no"));
