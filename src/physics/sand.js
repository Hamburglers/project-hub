import { GameObject } from './object';
export class Sand extends GameObject {
    constructor(position) {
        super(1, position, { x: 0, y: 0 }, "sandybrown");
    }

    updatePosition(gameWorld, width, height, cellSize) {
        // Apply gravity to y velocity
        this.velocity.y += 1; // Assuming gravity affects y velocity
    
        // Calculate potential new position
        let newX = Math.floor(this.position.x / cellSize);
        let newY = Math.floor((this.position.y + this.velocity.y) / cellSize);
    
        // Boundary check for the bottom of the game world
        if (newY >= height) {
            newY = height - 1; // Keep within bounds
            this.velocity.y = 0; // Stop moving down
        }
    
        // Check if the cell directly below is occupied
        if (newY + 1 < height && gameWorld[newY + 1][newX] !== null) {
            // Attempt to move left or right if the below cell is occupied
            const leftFree = newX > 0 && gameWorld[newY][newX - 1] === null;
            const rightFree = newX < width - 1 && gameWorld[newY][newX + 1] === null;
    
            if (leftFree && (!rightFree || Math.random() < 0.5)) {
                newX -= 1; // Move left
            } else if (rightFree) {
                newX += 1; // Move right
            } else {
                // Unable to move left or right, stay in place
                this.velocity.y = 0; // Stop moving down
                return { newX, newY: Math.floor(this.position.y / cellSize) }; // Return current position
            }
        }
    
        // Update the object's position property
        this.position.x = Math.floor(newX * cellSize);
        this.position.y =  Math.floor(newY * cellSize);
    
        return { newX, newY };
    }

}