import Matter from 'matter-js';

const Bodies = Matter.Bodies;

class Creature {

    constructor(location, radius) {
        this.radius = radius;
        this.physicalBody = Bodies.circle(location.x, location.y, radius, {
            friction: 0,
            frictionAir: 0,
        });
        this.physicalBody.position.x += Math.random() * 10 - 5;
        this.physicalBody.position.y += Math.random() * 10 - 5;
    }

    tick() {
        // PhysicalObject tick should always be last
        // as it depends on modifications to acceleration, etc.
        super.tick();
    }

    render(graphics) {
        graphics.drawCircle(this.physicalBody.position, this.radius, {
            fillStyle: "#FFFFFF",
        });
    }
}

export default Creature;
