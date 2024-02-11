import { GameObject } from './object';
export class Sand extends GameObject {
    constructor(position) {
        super(1, position, { x: 0, y: 0 }, "sandybrown");
    }

    updatePosition(gameWorld, width, height) {
        if (this.position.y === height - 1 || (this.position.y + 1 < height && gameWorld[this.position.y + 1][this.position.x] !== null)) {
            // If at the bottom or the cell below is occupied, do not move
            return { newX: this.position.x, newY: this.position.y };
        }
    
        // Apply gravity to y velocity
        this.velocity.y += 1;
    
        // Calculate potential new position
        let newX = this.position.x;
        let newY = Math.min(height - 1, this.position.y + this.velocity.y); // Ensure newY is within bounds
    
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