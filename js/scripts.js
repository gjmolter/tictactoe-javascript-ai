/* ----- Set global variables ----- */
const boardEl = document.getElementById('board');
const gameStatus = document.getElementById('gameStatus');
const squareEls = document.querySelectorAll('.square');
const resetBtn = document.getElementById('resetButton');

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const person = "X";
const computer = "O";
let currentPlayer = person;

let board = ["", "", "", "", "", "", "", "", ""];

/* ----- Event Listeners ----- */

for (let i = 0; i < squareEls.length; i++) {
  const square = squareEls[i];
  square.addEventListener('click', playerClicksSquare);
}

resetBtn.addEventListener('click', resetGame);

/* ----- Game Functions ----- */

function playerClicksSquare(event) {
  if (currentPlayer === person) {
    let index = Number(event.target.id.replace('square', '')) - 1;
    playSquare(index);
  } else {
    alert("Wait a sec, it's not your turn yet...");
  }
}

function playSquare(index) {
  if (board[index] === "") {
    board[index] = currentPlayer;
    updateBoard(index, currentPlayer);

    let gameFinalResult = checkGameResult(board, true);
    if (gameFinalResult) return gameOver(gameFinalResult);

    currentPlayer = currentPlayer === person ? computer : person;
    gameStatus.innerText = `${currentPlayer}'s Turn`;

    if (currentPlayer === computer) computerPlay();
  }
}

function gameOver(result) {
  if (result === "tie") {
    gameStatus.innerText = "It's a tie!";
  } else {
    gameStatus.innerText = `${result} wins!`;
  }

  for (let i = 0; i < squareEls.length; i++) {
    const square = squareEls[i];
    square.classList.remove('empty');
  }
  resetBtn.classList.add('pulse');
}

function updateBoard(index, player) {
  let square = document.getElementById('square' + (index + 1));
  square.classList.remove('empty');
  square.innerText = player;
}

function checkGameResult(board) {
  let gameFinalResult = false;
  winningCombos.forEach(([a, b, c]) => {
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      gameFinalResult = board[a];
    }
  });

  if (!board.includes("") && !gameFinalResult) gameFinalResult = "tie";

  return gameFinalResult;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  for (let i = 0; i < squareEls.length; i++) {
    const square = squareEls[i];
    square.innerText = "";
    square.classList.add('empty');
  }
  resetBtn.classList.remove('pulse');
  currentPlayer = person;
  gameStatus.innerText = `${currentPlayer}'s Turn`;
}

/* ----- AI Functions ----- */

function computerPlay() {
  let
    probabilities = [];

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      probabilities.push({
        index: i,
        score: minimaxScore([...board], i)
      });
    }
  }
  let bestMove = probabilities.reduce((a, b) => (a.score > b.score ? a : b));
  playSquare(bestMove.index);
}

function minimaxScore(board, i, depth = 0, isMaximizing = true) {
  board[i] = isMaximizing ? computer : person;
  let gameResult = checkGameResult(board);

  if (gameResult === computer) return 10 - depth;
  else if (gameResult === person) return -10 + depth;
  else if (gameResult === "tie") return 0;
  else {
    let scores = []
    for (let j = 0; j < board.length; j++) {
      if (board[j] === "") {
        let moveScore = minimaxScore([...board], j, depth + 1, !isMaximizing);
        scores.push(moveScore);
      }
    }
    return scores.reduce((a, b) => (isMaximizing ? Math.min(a, b) : Math.max(a, b)));
  }
}