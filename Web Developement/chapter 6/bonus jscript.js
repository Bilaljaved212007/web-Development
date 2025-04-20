// Game state variables
let score = 0;
let lives = 3;
let currentRGB;
let correctOptionIndex;
let canClick = true;
let difficulty = "medium"; // Default difficulty

// DOM element references
const rgbDisplay = document.getElementById("rgbDisplay");
const colorGrid = document.getElementById("colorGrid");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const message = document.getElementById("message");
const nextBtn = document.getElementById("nextBtn");
const endGameModal = document.getElementById("endGameModal");
const finalScoreDisplay = document.getElementById("finalScore");
const playAgainBtn = document.getElementById("playAgainBtn");
const difficultySelect = document.getElementById("difficulty");
const progressBar = document.getElementById("progressBar");

// Initialize the game when the window loads
window.onload = function() {
    // Set up event listeners
    nextBtn.addEventListener("click", startNewRound);
    playAgainBtn.addEventListener("click", resetGame);
    difficultySelect.addEventListener("change", function() {
        difficulty = this.value;
        resetGame();
    });
    
    // Start the game
    resetGame();
};

/**
 * Generate a random RGB color
 * @returns {Object} An object with r, g, b values
 */
function generateRandomRGB() {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256)
    };
}

/**
 * Convert RGB object to CSS RGB string format
 * @param {Object} rgb - RGB object with r, g, b properties
 * @returns {String} CSS RGB string format
 */
function rgbToString(rgb) {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * Create a slightly different color based on the input color
 * @param {Object} baseColor - Base RGB color object
 * @returns {Object} Modified RGB color object
 */
function createSimilarColor(baseColor) {
    // Determine difficulty level and adjust variance accordingly
    let variance;
    switch(difficulty) {
        case "easy":
            variance = 100; // Large difference for easy mode
            break;
        case "medium":
            variance = 50; // Medium difference
            break;
        case "hard":
            variance = 25; // Small difference for hard mode
            break;
        default:
            variance = 50;
    }
    
    // Create a new color with slight variations from the base color
    const newColor = {
        r: Math.max(0, Math.min(255, baseColor.r + Math.floor(Math.random() * variance * 2) - variance)),
        g: Math.max(0, Math.min(255, baseColor.g + Math.floor(Math.random() * variance * 2) - variance)),
        b: Math.max(0, Math.min(255, baseColor.b + Math.floor(Math.random() * variance * 2) - variance))
    };
    
    return newColor;
}

/**
 * Set up a new round with new colors
 */
function startNewRound() {
    // Reset UI state
    message.textContent = "";
    message.className = "message";
    canClick = true;
    progressBar.style.width = "0%";
    
    // Generate the correct color
    currentRGB = generateRandomRGB();
    rgbDisplay.textContent = `RGB(${currentRGB.r}, ${currentRGB.g}, ${currentRGB.b})`;
    
    // Determine number of options based on difficulty
    let numOptions;
    switch(difficulty) {
        case "easy":
            numOptions = 3;
            break;
        case "medium":
            numOptions = 6;
            break;
        case "hard":
            numOptions = 9;
            break;
        default:
            numOptions = 6;
    }
    
    // Adjust grid layout based on number of options
    if (numOptions <= 3) {
        colorGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
    } else if (numOptions <= 6) {
        colorGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
    } else {
        colorGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
    }
    
    // Clear previous options
    colorGrid.innerHTML = "";
    
    // Generate color options
    correctOptionIndex = Math.floor(Math.random() * numOptions);
    
    for (let i = 0; i < numOptions; i++) {
        const colorOption = document.createElement("div");
        colorOption.className = "color-option";
        
        // Assign the correct color or a similar color
        if (i === correctOptionIndex) {
            colorOption.style.backgroundColor = rgbToString(currentRGB);
        } else {
            colorOption.style.backgroundColor = rgbToString(createSimilarColor(currentRGB));
        }
        
        // Add click event handler
        colorOption.addEventListener("click", function() {
            handleColorSelection(i);
        });
        
        colorGrid.appendChild(colorOption);
    }
    
    // Animate progress bar
    setTimeout(() => {
        progressBar.style.width = "100%";
    }, 50);
}

/**
 * Handle color selection when a user clicks on a color option
 * @param {Number} index - Selected color option index
 */
function handleColorSelection(index) {
    // Prevent multiple clicks
    if (!canClick) return;
    canClick = false;
    
    // Check if selection is correct
    if (index === correctOptionIndex) {
        // Correct selection
        score++;
        scoreDisplay.textContent = score;
        message.textContent = "Correct!";
        message.className = "message correct";
        
        // Highlight all options and show correct one
        highlightOptions(true);
    } else {
        // Incorrect selection
        lives--;
        updateLivesDisplay();
        message.textContent = "Incorrect!";
        message.className = "message incorrect";
        
        // Highlight all options and show correct one
        highlightOptions(false);
        
        // Check if game over
        if (lives <= 0) {
            setTimeout(endGame, 1500);
        }
    }
}

/**
 * Highlight all color options after selection
 * @param {Boolean} isCorrect - Whether the selection was correct
 */
function highlightOptions(isCorrect) {
    const options = colorGrid.children;
    
    for (let i = 0; i < options.length; i++) {
        if (i === correctOptionIndex) {
            // Always highlight the correct answer
            options[i].style.border = "3px solid #0f8";
            options[i].style.boxShadow = "0 0 20px rgba(0, 255, 136, 0.8)";
        } else if (!isCorrect) {
            // Fade incorrect options
            options[i].style.opacity = "0.6";
        }
    }
}

/**
 * Update the hearts display for remaining lives
 */
function updateLivesDisplay() {
    livesDisplay.innerHTML = "";
    
    // Add heart emojis based on remaining lives
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement("span");
        heart.className = "heart";
        heart.textContent = "❤️";
        livesDisplay.appendChild(heart);
    }
    
    // Add empty hearts for lost lives
    for (let i = 0; i < 3 - lives; i++) {
        const heart = document.createElement("span");
        heart.className = "heart";
        heart.textContent = "🖤";
        heart.style.opacity = "0.5";
        livesDisplay.appendChild(heart);
    }
}

/**
 * End the game and show final score
 */
function endGame() {
    finalScoreDisplay.textContent = score;
    endGameModal.classList.add("active");
}

/**
 * Reset the game to initial state
 */
function resetGame() {
    // Reset game state
    score = 0;
    lives = 3;
    
    // Reset UI
    scoreDisplay.textContent = score;
    updateLivesDisplay();
    message.textContent = "";
    message.className = "message";
    endGameModal.classList.remove("active");
    
    // Start a new round
    startNewRound();
}