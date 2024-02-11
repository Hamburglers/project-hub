import { GameObject } from "./object";
export class Sand extends GameObject {
  constructor(position) {
    super(1, position, { x: 0, y: 0 }, "sandybrown");
  }

  updatePosition(gameWorld, width, height) {
    if (
      this.position.y === height - 1 ||
      (this.position.y + 1 < height &&
        gameWorld[this.position.y + 1][this.position.x] !== null)
    ) {
      // If at the bottom or the cell below is occupied, do not move
      return { newX: this.position.x, newY: this.position.y };
    }

    // Apply gravity to y velocity
    this.velocity.y += 1;

    // Calculate potential new position
    let newX = this.position.x;
    let newY = this.position.y;
    // Incrementally check each cell below the current position
    for (let i = 1; i <= this.velocity.y && newY + i < height; i++) {
        if (gameWorld[newY + i][newX] !== null) {
            // If the cell directly below is occupied, try to move sideways
            newY += i - 1; // Adjust newY to the last unoccupied position above the obstacle
            let canMoveLeft = newX > 0 && gameWorld[newY][newX - 1] === null;
            let canMoveRight = newX < width - 1 && gameWorld[newY][newX + 1] === null;
            if (canMoveLeft && canMoveRight) {
                // If both sides are available, choose randomly
                newX += Math.random() < 0.5 ? -1 : 1;
            } else if (canMoveLeft) {
                // Move left if only left side is available
                newX -= 1;
            } else if (canMoveRight) {
                // Move right if only right side is available
                newX += 1;
            }
            // If neither side is available, the loop will break, and newY won't change
            break;
        } else {
            // If the cell directly below is unoccupied, update newY
            newY += i;
        }
    }

    // Attempt to move down if the next position is within bounds and not occupied
    if (newY < height && gameWorld[newY][newX] === null) {
      // Update the object's position property
      this.position.x = newX;
      this.position.y = newY;
    } else {
      // Reset velocity if movement is not possible
      this.velocity.y = 0;
    }

    return { newX: this.position.x, newY: this.position.y };
  }
}
