console.log("script loaded");

// Grab elements
const textA = document.getElementById("text-a");
const inputA = document.getElementById("input-a");
const btnA = document.getElementById("btn-a");
const textB = document.getElementById("text-b");

let data = null;

// Load today's data file
fetch("data/today.json")
  .then(response => response.json())
  .then(json => {
    data = json;
    textA.textContent = data.prompt;
  })
  .catch(err => {
    textA.textContent = "Error loading data";
    console.error(err);
  });

// Button handler
btnA.addEventListener("click", () => {
  if (!data) {
    textB.textContent = "Data not loaded";
    return;
  }

  const guess = Number(inputA.value);

  if (isNaN(guess)) {
    textB.textContent = "Enter a number";
    return;
  }

  if (guess >= data.lower_bound && guess <= data.upper_bound) {
    textB.textContent = "Inside the range";
  } else {
    textB.textContent = "Outside the range";
  }
});
