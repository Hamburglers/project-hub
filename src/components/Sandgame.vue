<script setup>
import { reactive, onMounted, ref } from "vue";
import { Sand } from '../physics/sand';
import { Stone } from '../physics/stone';

const width = 100; // Width of the game world in cells
const height = 50; // Height of the game world in cells
const cellSize = 10; // Size of each cell in pixels
let gameWorld = Array.from({ length: height }, () => Array(width).fill(null));
const isMouseDown = ref(false);

const updateGameWorld = () => {
  let tempWorld = Array.from({ length: height }, () => Array(width).fill(null));
  for (let y = height - 2; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      if (gameWorld[y][x] !== null) {
        // Use the object's method to determine its new position
        const { newX, newY } = gameWorld[y][x].updatePosition(gameWorld, width, height, cellSize);

        // Move the object in the tempWorld array
        tempWorld[newY][newX] = gameWorld[y][x];
      }
    }
  }
  gameWorld = tempWorld;
};

const createSandAtMousePosition = () => {
  if (lastMousePosition.x === null || lastMousePosition.y === null) {
    return; // Do nothing if we don't have a valid position
  }

  // Assuming canvas size is fixed or properly scaled, you might not need to adjust for scaleX and scaleY here
  const cellX = Math.floor(lastMousePosition.x / cellSize);
  const cellY = Math.floor(lastMousePosition.y / cellSize);

  if (cellX >= 0 && cellX < width && cellY >= 0 && cellY < height) {
    if (currentElement.value === elements.sand) {
      gameWorld[cellY][cellX] = new Sand({ x: cellX, y: cellY });
    } else if (currentElement.value === elements.stone) {
      gameWorld[cellY][cellX] = new Stone({ x: cellX, y: cellY });
    }
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
    lastMousePosition.x =
      (event.clientX - rect.left) * (canvas.width / rect.width);
    lastMousePosition.y =
      (event.clientY - rect.top) * (canvas.height / rect.height);
    createSandAtMousePosition();
  };

  canvas.addEventListener("mousedown", (event) => {
    isMouseDown.value = true;
    event.preventDefault(); // Prevent default to avoid potential drag and drop behavior

    const rect = canvas.getBoundingClientRect();
    lastMousePosition.x =
      (event.clientX - rect.left) * (canvas.width / rect.width);
    lastMousePosition.y =
      (event.clientY - rect.top) * (canvas.height / rect.height);

    createSandAtMousePosition(); // Create sand at the initial mouse down position

    if (createSandInterval) clearInterval(createSandInterval);
    createSandInterval = setInterval(createSandAtMousePosition, 50);

    canvas.addEventListener("mousemove", handleMouseMove);
  });

  window.addEventListener("mouseup", () => {
    isMouseDown.value = false;
    canvas.removeEventListener("mousemove", handleMouseMove);
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
      if (gameWorld[y][x] !== null) {
        ctx.fillStyle = gameWorld[y][x].getColor();
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
};

// Reactive state to track available elements and their properties
const elements = reactive({
  sand: 1,
  stone: 2,
});

// Ref to track the currently selected element for placement
const currentElement = ref(elements["sand"]);

function selectElement(elementKey) {
  if (elements[elementKey]) {
    currentElement.value = elements[elementKey];
  }
}

function reset() {
  gameWorld = Array.from({ length: height }, () => Array(width).fill(null));
}
</script>

<template>
  <div>
    <h2>Falling Sand Game</h2>
    <canvas
      ref="canvasRef"
      width="600"
      height="500"
      style="border: 1px solid black"
    ></canvas>
    <div id="selection">
      <button @click="selectElement('stone')">Stone</button>
      <button @click="selectElement('sand')">Sand</button>
      <button @click="">Placeholder</button>
      <button @click="">Placeholder</button>
      <button @click="">Placeholder</button>
      <button @click="reset()">Reset</button>
    </div>
  </div>
</template>

<style scoped>
div {
  text-align: center;
}

#selection {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
