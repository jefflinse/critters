import Matter from 'matter-js';
import Vector from '../Vector';

class PhysicalObject {

    constructor() {
        this.physics = undefined;
    }

    initializePhysics() {
        // upgrade Matter's vector implementation to use our Vector class
        this.physics.position = new Vector(this.physics.position.x, this.physics.position.y);;
    }

    get position() {
        return this.physics.position;
    }

    set position(position) {
        this.physics.position = position.copy();
    }

    applyForceFromCenter(force) {
        Matter.Body.applyForce(this.physics, this.position, force);
    }

    getRelativePositionFrom(otherObject) {
        return this.position.subtract(otherObject.position);
    }

    setRelativePositionFrom(otherObject, relativePosition) {
        this.position = otherObject.position.add(relativePosition);
    }
}

export default PhysicalObject;
