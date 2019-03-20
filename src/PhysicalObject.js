import Vector from "./Vector";

class PhysicalObject {

    constructor(location) {
        this.location = location;
        this.mass = 0;
        this.velocity = new Vector(0, 0).random();
        this.acceleration = new Vector(0, 0);
    }

    tick() {
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.set(0, 0);
    }
}

export default PhysicalObject;
