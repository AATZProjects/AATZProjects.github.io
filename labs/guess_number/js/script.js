// alert("running external JS code!");

// Global Variables
let randomNumber;
let attempts = 0;

let totalWins = 0;
let totalLosses = 0;

// Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

initializeGame();

function initializeGame() {
    attempts = 0;

    // Update the totalWins/totalLosses, only if needed (the win and loss conditions will update this manually)
    if (totalWins == 0 && totalLosses == 0) {
        document.querySelector("#wins").textContent = "0";
        document.querySelector("#losses").textContent = "0";
    }

    randomNumber = Math.floor((Math.random() * 99)) + 1;
    console.log("randomNumber: " + randomNumber);

    // Hiding the Reset Button
    document.querySelector("#resetBtn").style.display = "none";

    // Showing the Guess button
    document.querySelector("#guessBtn").style.display = "inline";

    let playerGuess = document.querySelector("#playerGuess");
    playerGuess.focus();
    playerGuess.value = "";

    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";

    // Reset the previous guesses and # of guesses remaining
    document.querySelector("#guesses").textContent = "";
    document.querySelector("#guessesRemaining").textContent = "";
}

function checkGuess() {
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";
    
    let guess = document.querySelector("#playerGuess").value;
    
    console.log("Player guess: " + guess);
    if (guess < 1 || guess > 99) {
        feedback.textContent = "Enter a number between 1 and 99";
        feedback.style.color = "red";
        return;
    }

    // Valid guess was made
    attempts++;
    document.querySelector("#guessesRemaining").textContent = String(7 - attempts);
    
    console.log("Attempts: " + attempts);
    feedback.style.color = "orange";
    if (guess == randomNumber) {
        feedback.textContent = "You guessed it! You Won!";
        feedback.style.color = "darkgreen";
        document.querySelector("#wins").textContent = String(++totalWins);      // Iterate before accessing
        gameOver();
    } else {
        // Append previous guess
        document.querySelector("#guesses").textContent += guess + " ";
        
        if (attempts == 7) {
            feedback.textContent = "Sorry, you lost!";
            feedback.style.color = "red";
            document.querySelector("#losses").textContent = String(++totalLosses);      // Iterate before accessing
            gameOver();
        } else if (guess > randomNumber) {
            feedback.textContent = "Guess was high";
        } else {
            feedback.textContent = "Guess was low";
        }
    }
}

function gameOver() {
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");
    guessBtn.style.display = "none";        // Hides the guess button
    resetBtn.style.display = "inline";      // Shows the reset button
}


// document.querySelector("h1").style.color = "red";