
//Global variables
let randomNumber;
let maxAttempts = 7;
let attempts = 0;
let games = 0;
let wins = 0;

document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);
document.querySelector("#playerGuess").addEventListener("keypress", (event) => {
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");
    if (event.key == "Enter") {
        if (guessBtn.style.display != "none") {
            guessBtn.click();
        } else {
            resetBtn.click();
        }
    }
});

updateRecord();

document.addEventListener("DOMContentLoaded", (event) => {
    initializeGame();
});


function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log("randomNumber: " + randomNumber);
    attempts = 0;

    //hiding elements
    document.querySelector("#lost").style.display = "none";
    document.querySelector("#won").style.display = "none";
    document.querySelector("#resetBtn").style.display = "none";

    document.querySelector("#guessBtn").style.display = "inline";

    let playerGuess = document.querySelector("#playerGuess");
    playerGuess.focus();
    playerGuess.value = "";

    let remainingGuesses = document.querySelector("#remainingGuesses");
    remainingGuesses.focus();
    remainingGuesses.textContent = maxAttempts;

    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";

    document.querySelector("#guesses").textContent = "";
    playerGuess.focus();
}

function checkGuess() {
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";
    let guess = document.querySelector("#playerGuess").value;
    console.log("Player guess: " + guess);
    if (guess < 1 || guess > 99) {
        feedback.textContent = "Enter a number between 1 and 99";
        feedback.style.color = "red";
        document.querySelector("#guesses").select();
        return;
    }

    attempts++;
    console.log("Attempts:" + attempts);
    document.querySelector("#remainingGuesses").textContent = maxAttempts - attempts;
    if (guess == randomNumber) {
        feedback.textContent = "";
        document.querySelector("#won").style.display = "inline";
        wins++;
        gameOver();
    } else {
        document.querySelector("#guesses").textContent += guess + " ";
        if (attempts == maxAttempts) {
            feedback.textContent = "";
            document.querySelector("#randomNumber").textContent = randomNumber;
            document.querySelector("#lost").style.display = "inline";
            gameOver();
        } else if (guess > randomNumber) {
            feedback.style.color = "orange";
            feedback.textContent = "Too high";
            feedback.style.fontSize = "1.2rem";
        } else {
            feedback.style.color = "blue";
            feedback.textContent = "Too low";
            feedback.style.fontSize = "1.2rem";
        }
    }
    document.querySelector("#playerGuess").select();
}

function gameOver() {
    games++
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");
    guessBtn.style.display = "none";
    resetBtn.style.display = "inline";

    updateRecord();
}

function updateRecord() {
    document.querySelector("#record").textContent = wins + " wins, " + (games-wins) + " losses"
}
