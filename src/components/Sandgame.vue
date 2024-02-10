<script setup>
import { onMounted, ref } from "vue";

const width = 100; // Width of the game world in cells
const height = 50; // Height of the game world in cells
const cellSize = 10; // Size of each cell in pixels
const gameWorld = Array.from({ length: height }, () => Array(width).fill(0));
const isMouseDown = ref(false);

// Initialize some cells with sand for demonstration purposes
for (let x = 20; x < 80; x++) {
  gameWorld[20][x] = 1; // Example row filled with "sand"
}

const updateGameWorld = () => {
  // Correct the loop to avoid accessing out-of-bounds indices
  for (let y = height - 2; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      if (gameWorld[y][x] === 1 && gameWorld[y + 1][x] === 0) {
        gameWorld[y][x] = 0;
        gameWorld[y + 1][x] = 1;
      }
    }
  }
};

const createSandAtMousePosition = () => {
  if (lastMousePosition.x === null || lastMousePosition.y === null) {
    return; // Do nothing if we don't have a valid position
  }

  // Assuming canvas size is fixed or properly scaled, you might not need to adjust for scaleX and scaleY here
  const cellX = Math.floor(lastMousePosition.x / cellSize);
  const cellY = Math.floor(lastMousePosition.y / cellSize);

  if (cellX >= 0 && cellX < width && cellY >= 0 && cellY < height) {
    gameWorld[cellY][cellX] = 1; // Set the cell to sand
  }
};



const canvasRef = ref(null);
let lastMousePosition = { x: null, y: null };

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }
  
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    alert("Failed to get 2D context.");
    return;
  }

  const handleMouseMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    lastMousePosition.x = (event.clientX - rect.left) * (canvas.width / rect.width);
    lastMousePosition.y = (event.clientY - rect.top) * (canvas.height / rect.height);
    createSandAtMousePosition();
  };

  canvas.addEventListener('mousedown', (event) => {
    isMouseDown.value = true;
    event.preventDefault(); // Prevent default to avoid potential drag and drop behavior
    canvas.addEventListener('mousemove', handleMouseMove);
  });

  window.addEventListener('mouseup', () => {
    isMouseDown.value = false;
    canvas.removeEventListener('mousemove', handleMouseMove);
    lastMousePosition = { x: null, y: null };
  });

  const gameLoop = () => {
    updateGameWorld();
    renderGameWorld(ctx);
    requestAnimationFrame(gameLoop);
  };

  gameLoop();
});

const renderGameWorld = (ctx) => {
  ctx.clearRect(0, 0, width * cellSize, height * cellSize);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (gameWorld[y][x] === 1) {
        ctx.fillStyle = 'sandybrown'; // Set sand color
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
};
</script>

<template>
  <div>
    <h2>Falling Sand Game</h2>
    <canvas ref="canvasRef" width="600" height="500" style="border: 1px solid black"></canvas>
  </div>
</template>

<style scoped>
div {
  text-align: center;
}

canvas {
  width: 80vw; /* Make the canvas width responsive */
  height: auto; /* Maintain the aspect ratio */
  max-width: 600px; /* Maximum canvas width */
  max-height: 500px; /* Maximum canvas height to maintain aspect ratio */
  display: block; /* Block display to enable margin auto */
  margin: 0 auto; /* Center the canvas horizontally */
  border: 1px solid black;
}
</style>
