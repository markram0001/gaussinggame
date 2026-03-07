console.log("script loaded");

// Grab elements
const textA = document.getElementById("text-a");
const inputA = document.getElementById("input-a");
const btnA = document.getElementById("btn-a");
const textB = document.getElementById("text-b");

// Load today's data file
fetch("data/today.json")
  .then(response => response.json())
  .then(data => {
    textA.textContent = data.prompt; // show the prompt
  })
  .catch(err => {
    textA.textContent = "Error loading data";
    console.error(err);
  });

// Button handler
btnA.addEventListener("click", () => {
  const value = inputA.value;
  textB.textContent = "You entered: " + value;
});
