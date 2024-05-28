const boardSize = 600;
const gridSize = 20;
const snakeSpeed = 150;

const gameContainer = document.getElementById("game-container");
const gameBoard = document.getElementById("game-board");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const scoreDisplay = document.getElementById("score");

let snake = [];
let food = { x: 0, y: 0 };
let direction = "right";
let score = 0;
let gameLoop;
let paused = false;

function getRandomCoordinate() {
  return Math.floor(Math.random() * (boardSize / gridSize)) * gridSize;
}

function createFood() {
  food.x = getRandomCoordinate();
  food.y = getRandomCoordinate();
}

function updateSnake() {
  const head = { ...snake[0] };

  if (direction === "right") head.x += gridSize;
  if (direction === "left") head.x -= gridSize;
  if (direction === "up") head.y -= gridSize;
  if (direction === "down") head.y += gridSize;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    createFood();
  } else {
    snake.pop();
  }
}

function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 ||
    head.x >= boardSize ||
    head.y < 0 ||
    head.y >= boardSize
  ) {
    clearInterval(gameLoop);
    alert("Game Over. Your score: " + score);
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      clearInterval(gameLoop);
      alert("Game Over. Your score: " + score);
    }
  }
}

function render() {
  gameBoard.innerHTML = "";

  snake.forEach(segment => {
    const snakeSegment = document.createElement("div");
    snakeSegment.className = "snake";
    snakeSegment.style.left = segment.x + "px";
    snakeSegment.style.top = segment.y + "px";
    gameBoard.appendChild(snakeSegment);
  });

  const foodElement = document.createElement("div");
  foodElement.className = "food";
  foodElement.style.left = food.x + "px";
  foodElement.style.top = food.y + "px";
  gameBoard.appendChild(foodElement);
}

function gameLoopFunc() {
  if (!paused) {
    updateSnake();
    checkCollision();
    render();
  }
}

function startGame() {
  startButton.innerText = 'Restart';
  createFood();
  snake = [
    { x: gridSize * 2, y: 0 },
    { x: gridSize, y: 0 },
    { x: 0, y: 0 }
  ];
  direction = "right";
  score = 0;
  scoreDisplay.textContent = score;
  clearInterval(gameLoop);
  gameLoop = setInterval(gameLoopFunc, snakeSpeed);
  paused = false;
  pauseButton.textContent = "Pause";
}

function togglePause() {
  if (paused) {
    resumeGame();
  } else {
    pauseGame();
  }
}

function pauseGame() {
  clearInterval(gameLoop);
  paused = true;
  pauseButton.textContent = "Resume";
}

function resumeGame() {
  clearInterval(gameLoop);
  gameLoop = setInterval(gameLoopFunc, snakeSpeed);
  paused = false;
  pauseButton.textContent = "Pause";
}

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);

document.addEventListener("keydown", event => {
  const keyPressed = event.key;
  if (keyPressed === "ArrowUp" && direction !== "down") direction = "up";
  if (keyPressed === "ArrowDown" && direction !== "up") direction = "down";
  if (keyPressed === "ArrowLeft" && direction !== "right") direction = "left";
  if (keyPressed === "ArrowRight" && direction !== "left") direction = "right";
});