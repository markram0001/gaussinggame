console.log("script loaded");

const textA = document.getElementById("text-a");
const btnA = document.getElementById("btn-a");
const inputA = document.getElementById("input-a");
const textB = document.getElementById("text-b");

let data = null;

// Load today's data file
fetch("data/today.json")
  .then(r => r.json())
  .then(json => {
    data = json;

    // Show the interval and sample size
    textA.textContent = `Interval: [${json.interval[0]}, ${json.interval[1]}], n = ${json.sample_size}`;

    // Change the input to yes/no
    inputA.type = "text";
    inputA.placeholder = "yes or no";
  });

// Handle guess
btnA.addEventListener("click", () => {
  if (!data) return;

  const guess = inputA.value.trim().toLowerCase();

  if (guess !== "yes" && guess !== "no") {
    textB.textContent = "Please enter yes or no";
    return;
  }

  // Store the guess locally for tomorrow
  localStorage.setItem("guess_" + data.day, guess);

  textB.textContent = "Guess recorded";
});
