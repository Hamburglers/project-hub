import { GameObject } from "./object";

export class Water extends GameObject {
  constructor(position) {
    super(1, position, { x: 0, y: 1 }, "lightblue");
    this.permeable = true;
  }

  // first down, then down and horizontal, lastly horizontal
  updatePosition(gameWorld, width, height) {
    if (!this.velocity.y && !this.velocity.x) {
      return { newX: this.position.x, newY: this.position.y };
    }

    // Apply gravity to y velocity
    this.velocity.y += 2;

    // Calculate potential new position
    let newX = this.position.x;
    let newY = this.position.y;

    let found = false;
    // Incrementally check each cell below the current position
    for (let i = 1; i <= this.velocity.y && newY + i < height; i++) {
      if (gameWorld[newY + i][newX] !== null) {
        // If the cell directly below is occupied, try to move sideways
        newY += i - 1; // Adjust newY to the last unoccupied position above the obstacle
        // If it isnt already moving in x direction
        let canMoveLeft = newX > 0 && gameWorld[newY][newX - 1] === null;
        let canMoveRight =
          newX < width - 1 && gameWorld[newY][newX + 1] === null;

        let allRowsMeetCriteria = true;

        for (let y = newY; y < gameWorld.height; y++) {
          if (!gameWorld[y].some(element => element === null)) {
            allRowsMeetCriteria = false;
            break; // Exit the loop early if any row does not meet the criteria
          }
        }
        
        if (!allRowsMeetCriteria) {
          return { newX: this.position.x, newY: this.position.y };
        }

        if (!this.velocity.x) {
          // Randomly choose a direction if not already moving sideways
          let dir = Math.random() < 0.5 ? -1 : 1;
          // Attempt to move in the chosen direction if possible
          if ((dir === -1 && canMoveLeft) || (dir === 1 && canMoveRight)) {
            this.velocity.x = dir;
            newX += this.velocity.x;
          }
        } else {
          // Apply existing horizontal velocity if possible
          if (
            (this.velocity.x > 0 && canMoveRight) ||
            (this.velocity.x < 0 && canMoveLeft)
          ) {
            newX += this.velocity.x;
          } else {
            // Reset velocity if movement in the current direction is not possible
            this.find = false;
          }
        }
        this.velocity.y = 1;
        found = true;
        break;
      }
    }

    if (!found) {
      newY += Math.min(this.velocity.y, height - 1 - newY);
    }

    // Attempt to move down if the next position is within bounds and not occupied
    if (newY < height && newX >= 0 && newX < width) {
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
