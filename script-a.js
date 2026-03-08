console.log("script-a.js loaded");

// Elements from your HTML
const intervalText = document.getElementById("interval-text");
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");

const resultBox = document.getElementById("result");
const correctnessText = document.getElementById("correctness");
const trueValueText = document.getElementById("true-value");

const globalStatsBox = document.getElementById("global-stats");
const yesCountText = document.getElementById("yes-count");
const noCountText = document.getElementById("no-count");

// NEW: Your Stats elements
const yourStatsBox = document.getElementById("your-stats");
const yourYesText = document.getElementById("your-yes");
const yourNoText = document.getElementById("your-no");

let data = null;
let hasGuessed = false;

// ----------------------------------------------------
// NEW: Helper function to update "Your Stats" section
// ----------------------------------------------------
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
      `Using a 95% confidence interval, we claim that ${json.parameter_name} ` +
      `is between ${json.interval[0]} and ${json.interval[1]} (n = ${json.sample_size}).`;
  });

// Handle a guess
function handleGuess(guess) {
  if (!data || hasGuessed) return;
  hasGuessed = true;

  const correct = (guess === "yes" && data.contained) ||
                  (guess === "no" && !data.contained);

  // ----------------------------------------------------
  // NEW: Update YES/NO tallies and correctness tallies
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // NEW: Show updated personal stats
  // ----------------------------------------------------
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

  // Placeholder global stats (until backend is chosen)
  yesCountText.textContent = "Yes: (global count unavailable)";
  noCountText.textContent = "No: (global count unavailable)";
  globalStatsBox.style.display = "block";

  // Disable buttons
  btnYes.disabled = true;
  btnNo.disabled = true;
}

// Button events
btnYes.addEventListener("click", () => handleGuess("yes"));
btnNo.addEventListener("click", () => handleGuess("no"));
