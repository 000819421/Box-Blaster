
// Game Elements
let startButton = document.getElementById("startGame");
let pauseButton = document.getElementById("pauseGame");
let resetButton = document.getElementById("resetGame");
let instructionsButton = document.getElementById("instructions");
let difficultySelect = document.getElementById("difficulty");
let gameBoard = document.getElementById("gameBoard");
let scoreDisplay = document.getElementById("score");
let timerDisplay = document.getElementById("time-left");
let highScoreDisplay = document.getElementById("high-score");
let instructionsModal = document.getElementById("instructionsModal");
let closeInstructions = document.getElementById("closeInstructions");
let gameOverModal = document.getElementById("gameOverModal");
let gameOverMessage = document.getElementById("gameOverMessage");
let finalScoreDisplay = document.getElementById("finalScore");
let playAgainButton = document.getElementById("playAgain");

let score = 0;
let highScore = 0;
let timeLeft = 30;
let gameTimer, boxSpawnInterval;
let boxes = [];
let targetScore = 50; // Default win condition
let isPaused = false;

// Event Listeners
startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);
resetButton.addEventListener("click", resetGame);
instructionsButton.addEventListener("click", () => instructionsModal.style.display = "block");
closeInstructions.addEventListener("click", () => instructionsModal.style.display = "none");
playAgainButton.addEventListener("click", resetGame);
difficultySelect.addEventListener("change", setDifficulty);

// Initialize Game
function startGame() {
    resetGame();
    setDifficulty();  // Set game parameters based on difficulty
    gameTimer = setInterval(countdown, 1000);
    boxSpawnInterval = setInterval(generateBoxes, getBoxSpawnTime());
}

// Set difficulty parameters
function setDifficulty() {
    const difficulty = difficultySelect.value;
    if (difficulty === "easy") {
        targetScore = 30;
        timeLeft = 25;   // Reduced time for more challenge
    } else if (difficulty === "medium") {
        targetScore = 60;
        timeLeft = 25;
    } else if (difficulty === "hard") {
        targetScore = 100;
        timeLeft = 15;
    }
}

// Get box spawn time based on difficulty
function getBoxSpawnTime() {
    const difficulty = difficultySelect.value;
    if (difficulty === "easy") return 1500;  // Slightly faster for Easy level
    if (difficulty === "medium") return 1200;
    return 750; // Fastest spawn rate for Hard level
}

// Countdown timer
function countdown() {
    if (!isPaused && timeLeft > 0) {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
    } else if (timeLeft === 0) {
        endGame(false); // Trigger game over if time runs out
    }
}

// Generate boxes randomly with adjusted visibility time for each level
function generateBoxes() {
    if (isPaused) return;

    gameBoard.innerHTML = '';
    let numBoxes = Math.floor(Math.random() * 10) + 5;  // Random number of boxes
    for (let i = 0; i < numBoxes; i++) {
        let box = document.createElement("div");
        box.classList.add("box");
        
        // Randomize box properties
        let isSpecial = Math.random() > 0.8;
        box.style.left = Math.floor(Math.random() * 80) + '%';
        box.style.top = Math.floor(Math.random() * 80) + '%';
        box.style.backgroundColor = isSpecial ? "orange" : "lightblue";
        
        // Event listener for box click
        box.addEventListener("click", () => hitBox(box, isSpecial));
        
        gameBoard.appendChild(box);
        boxes.push(box);

        // Set visibility time based on difficulty
        let visibilityDuration;
        if (difficultySelect.value === "hard") {
            visibilityDuration = 500; // Shortest for Hard level
        } else if (difficultySelect.value === "medium") {
            visibilityDuration = 800; // Medium visibility duration
        } else {
            visibilityDuration = 1200; // Longest visibility for Easy level
        }
        setTimeout(() => {
            if (box.parentNode) box.remove();
        }, visibilityDuration);
    }
}

// Box hit logic
function hitBox(box, isSpecial) {
    if (isPaused) return;

    if (isSpecial) {
        score += 10;
        timeLeft += 3;  // Extra time for hitting a special box
    } else {
        score += 1;
    }
    scoreDisplay.textContent = score;
    box.remove();

    // Check for win condition
    if (score >= targetScore) {
        endGame(true); // Win the game if target score is reached
    }
}

// Toggle pause and resume
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameTimer);
        clearInterval(boxSpawnInterval);
        pauseButton.textContent = "Resume";
    } else {
        gameTimer = setInterval(countdown, 1000);
        boxSpawnInterval = setInterval(generateBoxes, getBoxSpawnTime());
        pauseButton.textContent = "Pause";
    }
}

// End game logic (win or lose)
function endGame(win) {
    clearInterval(gameTimer);
    clearInterval(boxSpawnInterval);
    gameBoard.innerHTML = '';  // Clear boxes

    gameOverMessage.textContent = win ? "You Win!" : "Game Over!";
    finalScoreDisplay.textContent = score;
    gameOverModal.style.display = "block";  // Show game over modal

    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
    }
}

// Reset game
function resetGame() {
    score = 0;
    isPaused = false;
    timeLeft = difficultySelect.value === "easy" ? 25 : (difficultySelect.value === "medium" ? 25 : 15);
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    gameBoard.innerHTML = '';
    clearInterval(gameTimer);
    clearInterval(boxSpawnInterval);
    gameOverModal.style.display = "none";
    pauseButton.textContent = "Pause";
}
