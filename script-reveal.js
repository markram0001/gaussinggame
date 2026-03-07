console.log("reveal script loaded");

const revealA = document.getElementById("reveal-a");
const revealB = document.getElementById("reveal-b");
const revealC = document.getElementById("reveal-c");
const scoreLine = document.getElementById("score-line");

fetch("data/reveal.json")
  .then(r => r.json())
  .then(json => {
    const storedGuess = localStorage.getItem("guess_" + json.day);

    revealA.textContent = `Parameter: ${json.parameter_name}`;
    revealB.textContent =
      `True value: ${json.true_value} (source: ${json.source})`;

    if (storedGuess === null) {
      revealC.textContent = "You did not guess yesterday.";
    } else {
      const correct =
        (storedGuess === "yes" && json.contained) ||
        (storedGuess === "no" && !json.contained);

      revealC.textContent = correct
        ? "You were correct! +1 point"
        : "Your guess was incorrect.";

      if (correct) {
        const score = Number(localStorage.getItem("score") || 0);
        localStorage.setItem("score", score + 1);
      }
    }

    const finalScore = Number(localStorage.getItem("score") || 0);
    scoreLine.textContent = `Total score: ${finalScore}`;
  })
  .catch(err => {
    revealA.textContent = "Error loading reveal.";
    console.error(err);
  });
