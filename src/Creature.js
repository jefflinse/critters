import Matter from 'matter-js';
import Vector from './Vector';

const Bodies = Matter.Bodies;

class Creature {

    constructor(location, radius) {
        this.physicalBody = Bodies.circle(location.x, location.y, radius);
    }

    tick() {
        // PhysicalObject tick should always be last
        // as it depends on modifications to acceleration, etc.
        super.tick();
    }
}

export default Creature;
