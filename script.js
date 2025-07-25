// script.js
const boardSize = 10;
const mineCount = 10;
const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');

let board = [];
let mines = [];
let flags = [];

function init() {
    board = [];
    mines = [];
    flags = [];
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = { mine: false, revealed: false, flagged: false };
        }
    }
    placeMines();
    renderBoard();
}

function placeMines() {
    let placed = 0;
    while (placed < mineCount) {
        const x = Math.floor(Math.random() * boardSize);
        const y = Math.floor(Math.random() * boardSize);
        if (!board[x][y].mine) {
            board[x][y].mine = true;
            mines.push({ x, y });
            placed++;
        }
    }
}

function renderBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[i][j].revealed) {
                cell.classList.add('revealed');
                if (board[i][j].mine) {
                    cell.classList.add('mine');
                } else {
                    const count = getAdjacentMines(i, j);
                    if (count > 0) {
                        cell.textContent = count;
                    }
                }
            } else if (board[i][j].flagged) {
                cell.classList.add('flagged');
            }
            cell.addEventListener('click', () => revealCell(i, j));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagCell(i, j);
            });
            gameBoard.appendChild(cell);
        }
    }
}

function getAdjacentMines(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const nx = x + i;
            const ny = y + j;
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[nx][ny].mine) {
                count++;
            }
        }
    }
    return count;
}

function revealCell(x, y) {
    if (board[x][y].revealed || board[x][y].flagged) return;
    board[x][y].revealed = true;
    if (board[x][y].mine) {
        alert('Game Over!');
        showAllMines();
    } else {
        const count = getAdjacentMines(x, y);
        if (count === 0) {
            revealAdjacentCells(x, y);
        }
        checkWin();
    }
    renderBoard();
}

function revealAdjacentCells(x, y) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const nx = x + i;
            const ny = y + j;
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && !board[nx][ny].revealed) {
                revealCell(nx, ny);
            }
        }
    }
}

function flagCell(x, y) {
    if (board[x][y].revealed) return;
    board[x][y].flagged = !board[x][y].flagged;
    flags.push({ x, y });
    renderBoard();
}

function showAllMines() {
    for (const mine of mines) {
        board[mine.x][mine.y].revealed = true;
    }
    renderBoard();
}

function checkWin() {
    let revealedCells = 0;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j].revealed && !board[i][j].mine) {
                revealedCells++;
            }
        }
    }
    if (revealedCells === boardSize * boardSize - mineCount) {
        alert('You Win!');
    }
}

restartBtn.addEventListener('click', init);

init();
