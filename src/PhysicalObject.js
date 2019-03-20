import Vector from "./Vector";

class PhysicalObject {

    constructor(location) {
        this.location = location;
        this.velocity = new Vector().random();
        this.acceleration = new Vector();
    }

    tick() {
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.set(0, 0);
    }
}

export default PhysicalObject;
