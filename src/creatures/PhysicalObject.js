import Matter from 'matter-js';
import Vector from '../Vector';

class PhysicalObject {

    constructor(physics) {
        this.physics = physics;

        // upgrade Matter's vector implementation to use our Vector class
        this.physics.position = new Vector(this.physics.position.x, this.physics.position.y);;
    }

    get position() {
        return this.physics.position;
    }
}

export default PhysicalObject;
