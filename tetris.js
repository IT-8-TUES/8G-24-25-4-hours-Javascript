const gridWidth = 10;
const gridHeight = 20;
const cellSize = 25; // Matches CSS cell width/height
const fallingSpeed = 500; // Milliseconds per step

let grid = []; // Represents the fixed blocks on the grid
let currentPiece = null;
let currentPieceX = 0;
let currentPieceY = 0;
let gameInterval = null;
let score = 0;

const shapes = {
    I: { color: 'I', matrix: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]] },
    J: { color: 'J', matrix: [[1,0,0], [1,1,1], [0,0,0]] },
    L: { color: 'L', matrix: [[0,0,1], [1,1,1], [0,0,0]] },
    O: { color: 'O', matrix: [[1,1], [1,1]] },
    S: { color: 'S', matrix: [[0,1,1], [1,1,0], [0,0,0]] },
    T: { color: 'T', matrix: [[0,1,0], [1,1,1], [0,0,0]] },
    Z: { color: 'Z', matrix: [[1,1,0], [0,1,1], [0,0,0]] }
};

const colors = {
    I: '#00ffff', // Cyan
    J: '#0000ff', // Blue
    L: '#ff7f00', // Orange
    O: '#ffff00', // Yellow
    S: '#00ff00', // Green
    T: '#800080', // Purple
    Z: '#ff0000'  // Red
};

// --- Initialization and Grid Drawing ---
function createGrid() {
    const gridArea = document.getElementById('grid-area');
    gridArea.innerHTML = ''; // Clear previous grid
    gridArea.style.width = `${gridWidth * cellSize}px`;
    gridArea.style.height = `${gridHeight * cellSize}px`;

    grid = Array(gridHeight).fill(0).map(() => Array(gridWidth).fill(null));

    // Draw static grid cells for styling
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.position = 'absolute';
            cell.style.left = `${x * cellSize}px`;
            cell.style.top = `${y * cellSize}px`;
            cell.dataset.x = x;
            cell.dataset.y = y;
            gridArea.appendChild(cell);
        }
    }
}

function drawGrid() {
    // Update the visual representation of the grid (fixed blocks)
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
            cell.className = 'cell'; // Reset classes
            if (grid[y][x]) {
                cell.classList.add(grid[y][x]); // Add color class
                cell.style.backgroundColor = colors[grid[y][x]]; // Apply actual color
            } else {
                cell.style.backgroundColor = ''; // Reset to default CSS background
            }
        }
    }
}

function updateScore(linesCleared) {
    score += linesCleared * 100; // Simple scoring
    document.getElementById('score-display').textContent = `Score: ${score}`;
}

// --- Piece Generation and Movement ---
function getRandomPiece() {
    const pieceNames = Object.keys(shapes);
    const randomName = pieceNames[Math.floor(Math.random() * pieceNames.length)];
    return { ...shapes[randomName] }; // Create a copy to avoid modifying original matrix
}

function spawnPiece() {
    currentPiece = getRandomPiece();
    currentPieceX = Math.floor((gridWidth - currentPiece.matrix[0].length) / 2); // Center horizontally
    currentPieceY = 0; // Start at the top

    if (checkCollision(currentPieceX, currentPieceY, currentPiece.matrix)) {
        // Game over if new piece spawns on existing blocks
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
        return false;
    }
    drawPiece();
    return true;
}

function drawPiece() {
    // Remove previous piece drawing
    document.querySelectorAll('.falling').forEach(cell => cell.remove());

    const gridArea = document.getElementById('grid-area');
    for (let y = 0; y < currentPiece.matrix.length; y++) {
        for (let x = 0; x < currentPiece.matrix[y].length; x++) {
            if (currentPiece.matrix[y][x] === 1) {
                const cell = document.createElement('div');
                cell.className = `cell falling ${currentPiece.color}`;
                cell.style.position = 'absolute';
                cell.style.left = `${(currentPieceX + x) * cellSize}px`;
                cell.style.top = `${(currentPieceY + y) * cellSize}px`;
                cell.style.backgroundColor = colors[currentPiece.color];
                gridArea.appendChild(cell);
            }
        }
    }
}

function undrawPiece() {
    // This function is implicitly handled by redrawing the piece at new position
    // and removing old 'falling' cells before drawing new ones in drawPiece().
}


function checkCollision(nextX, nextY, pieceMatrix) {
    for (let y = 0; y < pieceMatrix.length; y++) {
        for (let x = 0; x < pieceMatrix[y].length; x++) {
            if (pieceMatrix[y][x] === 1) {
                const boardX = nextX + x;
                const boardY = nextY + y;

                // Check horizontal boundaries
                if (boardX < 0 || boardX >= gridWidth) {
                    return true;
                }
                // Check vertical boundaries (bottom of grid)
                if (boardY >= gridHeight) {
                    return true;
                }
                // Check collision with existing blocks
                if (boardY >= 0 && grid[boardY][boardX] !== null) {
                    return true;
                }
            }
        }
    }
    return false;
}

function lockPiece() {
    for (let y = 0; y < currentPiece.matrix.length; y++) {
        for (let x = 0; x < currentPiece.matrix[y].length; x++) {
            if (currentPiece.matrix[y][x] === 1) {
                const boardX = currentPieceX + x;
                const boardY = currentPieceY + y;
                if (boardY >= 0 && boardY < gridHeight && boardX >= 0 && boardX < gridWidth) {
                     grid[boardY][boardX] = currentPiece.color; // Lock piece color into the grid
                }
            }
        }
    }
    drawGrid(); // Update the static grid with the locked piece
    clearLines();
}

function clearLines() {
    let linesCleared = 0;
    for (let y = gridHeight - 1; y >= 0; y--) {
        if (grid[y].every(cell => cell !== null)) { // Check if row is full
            // Remove the full row
            grid.splice(y, 1);
            // Add a new empty row at the top
            grid.unshift(Array(gridWidth).fill(null));
            linesCleared++;
            y++; // Check the new row that shifted down
        }
    }
    if (linesCleared > 0) {
        drawGrid();
        updateScore(linesCleared);
    }
}

function rotatePiece(pieceMatrix) {
    // Transpose (rows become columns)
    const newMatrix = pieceMatrix[0].map((_, i) => pieceMatrix.map(row => row[i]));
    // Reverse each row for 90-degree clockwise rotation
    return newMatrix.map(row => row.reverse());
}

// --- Game Loop and Input Handling ---
function gameLoop() {
    if (!currentPiece) {
        if (!spawnPiece()) {
            return; // Game over
        }
    }

    if (!checkCollision(currentPieceX, currentPieceY + 1, currentPiece.matrix)) {
        currentPieceY++; // Move down
        drawPiece();
    } else {
        lockPiece();
        currentPiece = null; // Prepare for next piece
    }
}

document.addEventListener('keydown', (e) => {
    if (!currentPiece) return; // Don't allow moves if no active piece

    let newX = currentPieceX;
    let newY = currentPieceY;
    let newMatrix = currentPiece.matrix;

    switch (e.key) {
        case 'ArrowLeft':
            newX--;
            break;
        case 'ArrowRight':
            newX++;
            break;
        case 'ArrowUp':
            newMatrix = rotatePiece(currentPiece.matrix);
            break;
        case 'ArrowDown':
            newY++; // Soft drop
            break;
        case ' ': // Spacebar for hard drop
            e.preventDefault(); // Prevent page scrolling
            while (!checkCollision(currentPieceX, currentPieceY + 1, currentPiece.matrix)) {
                currentPieceY++;
            }
            lockPiece();
            currentPiece = null;
            if (gameInterval) {
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, fallingSpeed); // Restart interval after hard drop
            }
            return; // Exit as piece is already locked
    }

    if (!checkCollision(newX, newY, newMatrix)) {
        currentPieceX = newX;
        currentPieceY = newY;
        currentPiece.matrix = newMatrix;
        drawPiece();
    }

    if (e.key === 'ArrowDown' && currentPiece) { // If soft drop and piece is still active
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, fallingSpeed); // Reset interval to prevent rapid drops
        }
    }
});


function startGame() {
    createGrid();
    score = 0;
    updateScore(0);
    currentPiece = null; // Ensure no piece from previous game
    if (gameInterval) clearInterval(gameInterval); // Clear any existing interval
    gameInterval = setInterval(gameLoop, fallingSpeed);
    document.getElementById('score-display').textContent = 'Score: 0';
}

// Initial grid setup
createGrid();