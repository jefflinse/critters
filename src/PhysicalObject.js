import Vector from "./Vector";

class PhysicalObject {

    constructor(location) {
        this.mass = 1;
        this.location = location;
        this.velocity = new Vector(0, 0).random();
        this.forces = [];
    }

    get acceleration() {
        let totalForce = this.forces.reduce((total, force) => total.add(force), new Vector());
        return totalForce.setMagnitude(totalForce.magnitude() / this.mass);
    }

    applyForce(force) {
        this.forces.push(force);
    }

    tick() {
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.forces.length = 0;
    }
}

export default PhysicalObject;
