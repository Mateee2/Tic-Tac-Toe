// Constants for players
const PLAYER_X = 'x';
const PLAYER_O = 'o';

// Game state
let gameBoard = Array(9).fill(null);
let currentPlayer = PLAYER_X; // X starts the game

const statusDiv = document.getElementById("status");
const cells = document.querySelectorAll(".cell");
const restartButton = document.getElementById("restart-button");

// Function to update the status
function updateStatus() {
    if (currentPlayer === PLAYER_X) {
        statusDiv.textContent = "Your Turn"; // Player's turn
    } else {
        statusDiv.textContent = "AI's Turn"; // AI's turn
    }
}

// Function to render the board
function renderBoard() {
    gameBoard.forEach((cell, index) => {
        const cellDiv = cells[index];
        cellDiv.textContent = cell ? cell.toUpperCase() : '';
        cellDiv.className = `cell ${cell ? cell : ''}`;
    });
}

// Handle player's click
function handleClick(event) {
    const index = event.target.dataset.index;
    if (gameBoard[index] || currentPlayer === PLAYER_O) return; // Block if already taken or AI's turn

    gameBoard[index] = PLAYER_X;
    renderBoard();

    if (checkWinner()) {
        setTimeout(() => {
            statusDiv.textContent = "You Win!";
            gameOver("You Win");
        }, 500);
        return;
    }

    currentPlayer = PLAYER_O;
    updateStatus();
    setTimeout(aiMove, 500); // AI move with delay
}

// AI's move function
function aiMove() {
    const bestMove = minimax(gameBoard, PLAYER_O, 0, -Infinity, Infinity); // Always use Hard difficulty
    gameBoard[bestMove.index] = PLAYER_O;
    renderBoard();

    if (checkWinner()) {
        setTimeout(() => {
            statusDiv.textContent = "AI Wins!";
            gameOver("AI Wins");
        }, 500);
        return;
    }

    if (gameBoard.every(cell => cell !== null)) {
        setTimeout(() => {
            statusDiv.textContent = "Tie!";
            gameOver("Tie");
        }, 500);
        return;
    }

    currentPlayer = PLAYER_X;
    updateStatus();
}

// Minimax Algorithm with Alpha-Beta Pruning
function minimax(board, player, depth, alpha, beta) {
    const availableSpots = board.map((val, index) => val === null ? index : null).filter(val => val !== null);

    // If we reach the maximum depth or the game is over, evaluate the board
    if (depth === 6 || checkWinner(board) || availableSpots.length === 0) {
        return { score: evaluateBoard(board, player), index: -1 };
    }

    let bestMove = null;

    if (player === PLAYER_O) {
        let maxEval = -Infinity;
        for (let i = 0; i < availableSpots.length; i++) {
            const move = availableSpots[i];
            board[move] = PLAYER_O;
            const evalResult = minimax(board, PLAYER_X, depth + 1, alpha, beta);
            board[move] = null;

            if (evalResult.score > maxEval) {
                maxEval = evalResult.score;
                bestMove = { score: maxEval, index: move };
            }

            alpha = Math.max(alpha, evalResult.score);
            if (beta <= alpha) break; // Beta pruning
        }
    } else {
        let minEval = Infinity;
        for (let i = 0; i < availableSpots.length; i++) {
            const move = availableSpots[i];
            board[move] = PLAYER_X;
            const evalResult = minimax(board, PLAYER_O, depth + 1, alpha, beta);
            board[move] = null;

            if (evalResult.score < minEval) {
                minEval = evalResult.score;
                bestMove = { score: minEval, index: move };
            }

            beta = Math.min(beta, evalResult.score);
            if (beta <= alpha) break; // Alpha pruning
        }
    }

    return bestMove;
}

// Improved Evaluation Function for Minimax
function evaluateBoard(board, player) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Check for a win or loss for the AI (O) or player (X)
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] === board[b] && board[b] === board[c]) {
            if (board[a] === PLAYER_O) return 10;
            if (board[a] === PLAYER_X) return -10;
        }
    }

    // Evaluate center control for AI and player
    const center = board[4];
    if (center === PLAYER_O) return 5; // AI prefers center
    if (center === PLAYER_X) return -5; // Player prefers center

    // Evaluate edges for better strategic placement
    const edges = [1, 3, 5, 7];
    let score = 0;
    for (let i of edges) {
        if (board[i] === PLAYER_O) score += 1; // AI prefers edges
        if (board[i] === PLAYER_X) score -= 1; // Player prefers edges
    }

    return score;
}

// Check if there's a winner
function checkWinner(board = gameBoard, player = currentPlayer) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] === player && board[b] === player && board[c] === player;
    });
}

// Handle game over
function gameOver(result) {
    setTimeout(() => {
        gameBoard = Array(9).fill(null);
        renderBoard();
        statusDiv.textContent = result;
    }, 2000);
}

// Restart game
function restartGame() {
    gameBoard = Array(9).fill(null);
    currentPlayer = PLAYER_X;
    renderBoard();
    updateStatus();
}

// Attach event listeners
cells.forEach(cell => cell.addEventListener("click", handleClick));
restartButton.addEventListener("click", restartGame);

// Initialize the game
renderBoard();
updateStatus();
