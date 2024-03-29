export class GameObject {
    constructor(mass, position, velocity, color="white") {
        this.mass = mass;
        this.position = { x: position.x, y: position.y }; // Ensure position is an object with x and y
        this.velocity = { x: velocity.x, y: velocity.y }; // Ensure velocity is an object with x and y
        this.color = color;
    }

    get getColor() {
        return this.color;
    }

    get getPosition() {
        return this.position;
    }

    get getVelocity() {
        return this.velocity;
    }

    updateAll() {
        this.velocity.y += 1;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        return this.position
    }
}
