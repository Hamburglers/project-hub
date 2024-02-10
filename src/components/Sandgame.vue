<script setup>
import { onMounted, ref } from "vue";

const width = 100; // Width of the game world in cells
const height = 50; // Height of the game world in cells
const cellSize = 10; // Size of each cell in pixels
const gameWorld = Array.from({ length: height }, () => Array(width).fill(0));

// Initialize some cells with sand for demonstration purposes
for (let x = 20; x < 80; x++) {
  gameWorld[20][x] = 1; // Example row filled with "sand"
}

const updateGameWorld = () => {
  // Correct the loop to avoid accessing out-of-bounds indices
  for (let y = height - 1; y > 0; y--) {
    for (let x = 0; x < width; x++) {
      if (gameWorld[y][x] === 1 && gameWorld[y + 1][x] === 0) {
        gameWorld[y][x] = 0;
        gameWorld[y + 1][x] = 1;
      }
    }
  }
};

const canvasRef = ref(null);

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
