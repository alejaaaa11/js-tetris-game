import "./styles.css";

import { createRamdomBlock } from "./blocks";

const appDiv = document.getElementById("app");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width;
canvas.height = height;

window.addEventListener("resize", invalidate);
window.addEventListener("load", invalidate);

function invalidate() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  blockSide = height / ROWS;
}

appDiv.appendChild(canvas);

const BG_COLOR = "#222";
const GRID_COLOR = "#00ffff80";
const GRID_BORDER_COLOR = "red";

const [COLS, ROWS] = [10, 20];
let blockSide = height / ROWS;
const grid = Array(ROWS)
  .fill()
  .map(_ => Array(COLS).fill(0));
let y = 8;
let x = 4;
let score = 0;
let currentBlock = createRamdomBlock();
let nextBlock = createRamdomBlock();

function draw() {
  context.fillStyle = BG_COLOR;
  context.fillRect(0, 0, width, height);

  context.save();
  context.translate(Math.round(width / 2 - ((COLS + 5) * blockSide) / 2), 0);

  context.strokeStyle = GRID_BORDER_COLOR;
  context.strokeRect(0, 0, COLS * blockSide, ROWS * blockSide);

  context.font = `${blockSide / 2}px "Courier New", Courier, monospace`;
  context.fillStyle = "white";
  context.fillText(`Key Bindings`, (COLS + 1) * blockSide, 6 * blockSide);
  context.fillText(`← move left`, (COLS + 1) * blockSide, 8 * blockSide);
  context.fillText(`→ move right`, (COLS + 1) * blockSide, 9 * blockSide);
  context.fillText(`↓ move down`, (COLS + 1) * blockSide, 10 * blockSide);
  context.fillText(`␣ rotate`, (COLS + 1) * blockSide, 11 * blockSide);
  context.fillText(`SCORE`, (COLS + 1) * blockSide, (ROWS - 2) * blockSide);
  context.fillText(`${score}`, (COLS + 1) * blockSide, (ROWS - 1) * blockSide);

  drawBlock(nextBlock, (COLS + 1) * blockSide, blockSide);

  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      if (grid[j][i] !== 0) {
        context.fillStyle = grid[j][i];
        context.fillRect(i * blockSide, j * blockSide, blockSide, blockSide);
      }

      context.strokeStyle = GRID_COLOR;
      context.strokeRect(i * blockSide, j * blockSide, blockSide, blockSide);
    }
  }

  drawBlock(currentBlock, x * blockSide, y * blockSide);

  context.restore();
}

function drawBlock(block, x, y) {
  for (let j = 0; j < block.matrix.length; j++) {
    for (let i = 0; i < block.matrix[j].length; i++) {
      if (block.matrix[j][i] === 1) {
        const dx = x + i * blockSide;
        const dy = y + j * blockSide;

        context.strokeStyle = GRID_COLOR;
        context.fillStyle = block.color;
        context.fillRect(dx, dy, blockSide, blockSide);
        context.strokeRect(dx, dy, blockSide, blockSide);
      }
    }
  }
}

function step() {
  if (isBlockSettled(currentBlock.matrix)) {
    lockCurrentBlock();
    cleanRows();
    currentBlock = nextBlock;
    nextBlock = createRamdomBlock();
    x = Math.round(COLS / 2 - currentBlock.matrix.length / 2);
    y = 0;
  } else {
    moveBlockDown();
  }

  draw();
}

function cleanRows() {
  for (let i = grid.length - 1; i >= 0; i--) {
    const row = grid[i];
    if (row.every(col => col !== 0)) {
      score++;
      for (let j = i; j > 0; j--) {
        grid[i].forEach((col, jj) => (grid[j][jj] = grid[j - 1][jj]));
      }
      i++;
    }
  }
}

function lockCurrentBlock() {
  for (let j = 0; j < currentBlock.matrix.length; j++) {
    for (let i = 0; i < currentBlock.matrix[j].length; i++) {
      if (currentBlock.matrix[j][i] === 1) {
        grid[y + j][x + i] = currentBlock.color;
      }
    }
  }
}

function isBlockSettled(matrix) {
  return matrix.some((row, j) =>
    row.some((col, i) => {
      if (col === 1) {
        if (j + y === ROWS - 1) {
          return true;
        }

        if (grid[j + y + 1][x + i] !== 0) {
          return true;
        }
      }

      return false;
    })
  );
}

function moveBlockDown() {
  y++;
}

function outbounds(matrix, x) {
  return matrix.some((row, j) =>
    row.some((col, i) => {
      if (col === 1) {
        // overlaps walls
        if (i + x >= COLS || x + i < 0) {
          return true;
        }

        // hit other pieces
        if (grid[j + y][i + x] !== 0) {
          return true;
        }
      }
      return false;
    })
  );
}

window.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
      break;
    case "ArrowDown":
      !isBlockSettled(currentBlock.matrix) && moveBlockDown();
      break;
    case "ArrowLeft":
      !outbounds(currentBlock.matrix, x - 1) && x--;
      break;
    case "ArrowRight":
      !outbounds(currentBlock.matrix, x + 1) && x++;
      break;
    case " ":
      const nextRotation = currentBlock.nextRotation;
      if (!isBlockSettled(nextRotation) && !outbounds(nextRotation, x))
        currentBlock.rotate();
      break;
    default:
      console.log(e.key);
      break;
  }
  draw();
});

const stepIntervalId = setInterval(() => step(), 500);

window.addEventListener("beforeunload", () => {
  clearInterval(stepIntervalId);
});
