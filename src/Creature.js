import Matter from 'matter-js';
import Network from './neuralnetwork/Network';

const Bodies = Matter.Bodies;

class Creature {

    constructor(location, radius) {
        this.radius = radius;
        this.physicalBody = Bodies.circle(location.x, location.y, radius, {
            frictionAir: 1,
        });

        this.brain = new Network(2, 2).randomize(5);
    }

    tick() {
        this.brain.activate([
            this.physicalBody.velocity.x,
            this.physicalBody.velocity.y,
        ]);

        this.physicalBody.position.x += this.brain.outputs[0].outputs[0].value * 2 - 1;
        this.physicalBody.position.y += this.brain.outputs[1].outputs[0].value * 2 - 1;
    }

    render(graphics) {
        graphics.drawCircle(this.physicalBody.position, this.radius, {
            fillStyle: "#FFFFFF",
        });
    }
}

export default Creature;
