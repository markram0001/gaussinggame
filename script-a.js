// Confirm the script is running
console.log("script loaded");

// Grab elements
const textA = document.getElementById("text-a");
const inputA = document.getElementById("input-a");
const btnA = document.getElementById("btn-a");
const textB = document.getElementById("text-b");

// Replace the loading text
textA.textContent = "Ready";

// Add a simple button handler
btnA.addEventListener("click", () => {
  const value = inputA.value;
  textB.textContent = "You entered: " + value;
});
