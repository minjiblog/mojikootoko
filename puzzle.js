// Sliding Puzzle Game Script
// Author: Cascade AI

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("puzzle-image-select");
  const startBtn = document.getElementById("start-puzzle");
  const canvas = document.getElementById("puzzle-canvas");
  const messageEl = document.getElementById("puzzle-message");
  if (!select || !startBtn || !canvas) return; // Not on this page

  const ctx = canvas.getContext("2d");
  const size = 3; // 3x3 grid
  const tileSize = canvas.width / size;
  let board = []; // 0 represents the blank tile
  let img = new Image();
  let imgLoaded = false;

  // Populate image select options
  const totalImages = 40;
  for (let i = 1; i <= totalImages; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `Image ${i}`;
    select.appendChild(option);
  }

  function initBoard() {
    // Initialize board in solved order then shuffle
    board = [...Array(size * size).keys()]; // [0,1,2,...8]
    shuffleBoard();
    drawBoard();
  }

  function shuffleBoard() {
    do {
      board.sort(() => Math.random() - 0.5);
    } while (!isSolvable(board) || isSolved());
  }

  function isSolvable(b) {
    let inv = 0;
    for (let i = 0; i < b.length; i++) {
      for (let j = i + 1; j < b.length; j++) {
        if (b[i] && b[j] && b[i] > b[j]) inv++;
      }
    }
    return inv % 2 === 0;
  }

  function isSolved() {
    return board.every((val, idx) => val === idx);
  }

  function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((val, idx) => {
      const x = (idx % size) * tileSize;
      const y = Math.floor(idx / size) * tileSize;

      if (val === 0) {
        // Blank tile
        ctx.fillStyle = "#000";
        ctx.fillRect(x, y, tileSize, tileSize);
        return;
      }

      if (!imgLoaded) return;

      const sx = (val % size) * tileSize;
      const sy = Math.floor(val / size) * tileSize;
      ctx.drawImage(img, sx, sy, tileSize, tileSize, x, y, tileSize, tileSize);
    });
  }

  function swapTiles(index) {
    const blankIndex = board.indexOf(0);
    const adjacent = [];
    if (blankIndex - size >= 0) adjacent.push(blankIndex - size);
    if (blankIndex + size < size * size) adjacent.push(blankIndex + size);
    if (blankIndex % size !== 0) adjacent.push(blankIndex - 1);
    if (blankIndex % size !== size - 1) adjacent.push(blankIndex + 1);

    if (adjacent.includes(index)) {
      [board[blankIndex], board[index]] = [board[index], board[blankIndex]];
      drawBoard();
      if (isSolved()) {
        messageEl.textContent = "🎉 Puzzle solved!";
      }
    }
  }

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / tileSize);
    const row = Math.floor(y / tileSize);
    const index = row * size + col;
    swapTiles(index);
  });

  startBtn.addEventListener("click", () => {
    const imgNum = select.value || 1;
    img.src = `images/${imgNum}.jpg`;
    img.onload = () => {
      imgLoaded = true;
      messageEl.textContent = "";
      initBoard();
    };
  });

  // Auto-select first image on load
  select.value = 1;
});
