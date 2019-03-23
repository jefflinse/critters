import Matter from 'matter-js';
import Vector from '../Vector';

const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

class Part {

    constructor(position, radius) {
        this.radius = radius;
        this.physics = Bodies.circle(position.x, position.y, radius, {
            frictionAir: 0,
        });
        this.numMuscles = 2;
    }

    get sensors() {
        return [
            this.physics.velocity.x,
            this.physics.velocity.y,
        ];
    }

    triggerMuscles(muscleData) {
        let i = 0;
        let force = new Vector(muscleData[i++] * .0001 - .00005, muscleData[i++] * .0001 - .00005);
        let origin = force.copy().invert().setMagnitude(this.radius);
        Body.applyForce(this.physics, origin, force);
    }

    render(graphics) {
        graphics.drawCircle(this.physics.position, this.radius, {
            fillStyle: "#FFFFFF",
        });
    }

    tick(muscleData) {
        this.triggerMuscles(muscleData);
    }
}

export default Part;
