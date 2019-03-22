import Matter from 'matter-js';
import Network from './neuralnetwork/Network';
import Vector from './Vector';

const Body = Matter.Body;
const Bodies = Matter.Bodies;

class Creature {

    constructor(location, radius) {
        this.radius = radius;
        this.physicalBody = Bodies.circle(location.x, location.y, radius, {
            frictionAir: 0,
        });

        this.brain = new Network(2, 2).randomize(2);
        this.outputs = [];
        this.name = Math.floor(Math.random() * 1000);
    }

    tick() {
        this.outputs = this.brain.activate([
            this.physicalBody.velocity.x,
            this.physicalBody.velocity.y,
        ]);
    }

    render(graphics) {
        // graphics.drawCircle(this.physicalBody.position, this.radius, {
        //     fillStyle: "#FFFFFF",
        // });

        // graphics.writeText(this.physicalBody.position.x + 10, this.physicalBody.position.y,
        //     this.name + ': ' + this.outputs.join(', '));

        this.brain.render(graphics, this.physicalBody.position, 5, 5, 10, 1);
    }
}

export default Creature;
