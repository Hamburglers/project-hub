<script setup>
import { reactive, onMounted, ref } from "vue";

const width = 100; // Width of the game world in cells
const height = 50; // Height of the game world in cells
const cellSize = 10; // Size of each cell in pixels
let gameWorld = Array.from({ length: height }, () => Array(width).fill(0));
const isMouseDown = ref(false);

const updateGameWorld = () => {
  for (let y = height - 2; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      // Check if the current cell has sand
      if (gameWorld[y][x] === 1) {
        // Check if the cell directly below is empty
        if (gameWorld[y + 1][x] === 0) {
          gameWorld[y + 1][x] = 1; // Move sand down
          gameWorld[y][x] = 0;
        } else if (x > 0 && x < width - 1) { // Ensure there's room to move sideways
          let randomSign = Math.random() < 0.5 ? -1 : 1;
          // Check if the adjacent cell in the direction of randomSign is empty
          // and also ensure the sand doesn't move out of bounds
          if (gameWorld[y][x + randomSign] === 0 && gameWorld[y + 1][x + randomSign] === 0) {
            // Only move sand sideways if the spot below the target sideways position is also blocked.
            // This prevents sand from preferring sideways movement when it could potentially fall further down.
            if (gameWorld[y + 1][x] !== 0) {
              gameWorld[y][x + randomSign] = 1;
              gameWorld[y][x] = 0;
            }
          }
        }
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
    gameWorld[cellY][cellX] = currentElement.value;
  }
};

const canvasRef = ref(null);
let lastMousePosition = { x: null, y: null };
let createSandInterval;

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

    // Update lastMousePosition directly here
    const rect = canvas.getBoundingClientRect();
    lastMousePosition.x = (event.clientX - rect.left) * (canvas.width / rect.width);
    lastMousePosition.y = (event.clientY - rect.top) * (canvas.height / rect.height);

    createSandAtMousePosition(); // Create sand at the initial mouse down position

    if (createSandInterval) clearInterval(createSandInterval);
    createSandInterval = setInterval(createSandAtMousePosition, 100);

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
      ctx.fillStyle = colours[gameWorld[y][x]]
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
};

// Reactive state to track available elements and their properties
const elements = reactive({
  sand: 1,
  stone: 2
});

// Update the colours mapping to reflect the new IDs
const colours = {
  0: "white", // Empty cell
  1: "sandybrown", // Sand
  2: "gray" // Stone
};

// Ref to track the currently selected element for placement
const currentElement = ref(elements['sand']);

function selectElement(elementKey) {
  if (elements[elementKey]) {
    currentElement.value = elements[elementKey];
  }
}

function reset() {
  gameWorld = Array.from({ length: height }, () => Array(width).fill(0));
}
</script>

<template>
  <div>
    <h2>Falling Sand Game</h2>
    <canvas ref="canvasRef" width="600" height="500" style="border: 1px solid black"></canvas>
    <div>
      <button @click="selectElement('stone')">Stone</button>
      <button @click="selectElement('sand')">Sand</button>
      <button @click="reset()">Reset</button>
    </div>
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
