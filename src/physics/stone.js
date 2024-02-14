import { GameObject } from './object';
export class Stone extends GameObject{
    constructor(position) {
        super(0, position, { x: 0, y: 0 }, "gray");
        this.permeable = false;
    }
    // Overrides object function
    updatePosition(gameWorld, width, height) {
        return this.position
    }
}