import { GameObject } from './object';
export class Stone extends GameObject{
    constructor(position) {
        super(0, position, { x: 0, y: 0 }, "gray");
    }
    // Overrides object function
    updatePosition(gameWorld, width, height, cellSize) {
        // Apply gravity or other logic to update position
        this.velocity.y += 1;
        let newX = Math.floor((this.position.x + this.velocity.x) / cellSize);
        let newY = Math.floor((this.position.y + this.velocity.y) / cellSize);

        // Boundary checks and adjust position if needed
        newX = Math.max(0, Math.min(newX, width - 1));
        newY = Math.max(0, Math.min(newY, height - 1));

        if (!gameWorld[newY][newX]) {
            // Move to new position if it's empty
            return { newX, newY };
        } else {
            // Handle collision or stay in place
            return { newX: Math.floor(this.position.x / cellSize), newY: Math.floor(this.position.y / cellSize )};
        }
    }
}