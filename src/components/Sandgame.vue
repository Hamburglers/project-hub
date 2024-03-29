<script setup>
import { reactive, onMounted, ref } from "vue";
import { Sand } from "../physics/sand";
import { Stone } from "../physics/stone";
import { Water } from "../physics/water";
import "@polymer/paper-button/paper-button.js";

const width = 120; // Width of the game world in cells
const height = 100; // Height of the game world in cells
const cellSize = 5; // Size of each cell in pixels
let gameWorld = Array.from({ length: height }, () => Array(width).fill(null));
const isMouseDown = ref(false);

// sand piling, brush size, sand phasing
const updateGameWorld = () => {
  let tempWorld = Array.from({ length: height }, () => Array(width).fill(null));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (gameWorld[y][x] !== null) {
        // Check if the current particle is a Stone or if it's on the bottom row
        if (gameWorld[y][x] instanceof Stone) {
          tempWorld[y][x] = gameWorld[y][x];
        } else {
          // Use the object's method to determine its new position
          const { newX, newY } = gameWorld[y][x].updatePosition(
            gameWorld,
            width,
            height
          );
          // Ensure the new position is within bounds and not occupied
          if (newY < height && newX < width) {
            if (tempWorld[newY][newX] === null) {
              tempWorld[newY][newX] = gameWorld[y][x];
            }
          }
        }
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

  const brushSize = parseInt(document.getElementById("brushSize").value, 10);
  // Correcting the brush size calculation
  const brushSizeOffset = brushSize - 1; // Assuming brushSize 1 means a single cell
  const startX = cellX - brushSizeOffset;
  const startY = cellY - brushSizeOffset;
  const endX = cellX + brushSizeOffset;
  const endY = cellY + brushSizeOffset;

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      // Check if the current cell is within the bounds of the game world
      if (x >= 0 && x < width && y >= 0 && y < height) {
        if (currentElement.value === elements.sand) {
          // add Randomness
          if ((Math.random(1) < 0.7 && brushSize !== 1) || brushSize === 1) {
            gameWorld[y][x] = new Sand({ x, y });
          }
        } else if (currentElement.value === elements.stone) {
          gameWorld[y][x] = new Stone({ x, y });
        } else if (currentElement.value === elements.water) {
          gameWorld[y][x] = new Water({ x, y });
        } else if (currentElement.value === elements.delete) {
          gameWorld[y][x] = null;
        } 
      }
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
  let lastUpdateTime = 0;
  const updateInterval = 30; //30

  // Modify the gameLoop function
  const gameLoop = (timestamp) => {
    if (!lastUpdateTime) lastUpdateTime = timestamp; // Initialize lastUpdateTime
    const deltaTime = timestamp - lastUpdateTime;

    if (deltaTime > updateInterval) {
      updateGameWorld();
      lastUpdateTime = timestamp;
    }

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
        ctx.fillStyle = gameWorld[y][x].getColor;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
};

// Reactive state to track available elements and their properties
const elements = reactive({
  sand: 1,
  stone: 2,
  water: 3,
  delete: 99,
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
      <paper-button raised @click="selectElement('sand')" style="background-color: sandybrown;">Sand</paper-button>
      <paper-button raised @click="selectElement('stone')" style="background-color: gray;">Stone</paper-button>
      <paper-button raised @click="selectElement('delete')">Deleter</paper-button>
      <paper-button raised @click="reset()" style="background-color: lightcoral;">Reset</paper-button>
      <div id="brush">
        <label for="brushSize">Brush Size:</label>
        <input
          type="range"
          id="brushSize"
          name="brushSize"
          min="1"
          max="5"
          value="1"
        />
      </div>
      <paper-button raised @click="selectElement('water')" style="background-color: lightblue;">Water</paper-button>
      <paper-button raised @click="">P2</paper-button>
      <paper-button raised @click="">P3</paper-button>
      <paper-button raised @click="">P4</paper-button>
      <paper-button raised @click="">P5</paper-button>
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
  padding: 10px 0px 10px 0;
  max-width: 600px;
  gap: 2px;
  justify-content: space-between;
}

#brush {
  display: flex;
  flex-direction: column;
  max-width: 100px;
}

paper-button {
  margin: 5px 0px;
  transition: transform 0.3s ease-in-out;
}

paper-button:hover {
  transform: scale(1.1);
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
