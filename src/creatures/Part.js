import Matter from 'matter-js';
import Vector from '../Vector';

const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

class Part {

    constructor(position, radius) {
        this.radius = radius;
        this.physics = Bodies.circle(position.x, position.y, radius, {
            frictionAir: .01,
        });
    }

    get sensors() {
        return [
            this.physics.velocity.x,
            this.physics.velocity.y,
        ];
    }

    triggerMuscles() {
        let force = new Vector(Math.random() * .0001 - .00005, Math.random() * .0001 - .00005);
        let origin = force.copy().invert().setMagnitude(this.radius);
        Body.applyForce(this.physics, origin, force);
    }

    attachTo(other, muscleLength, muscleStiffness) {
        let constraint = new Constraint();
        constraint.bodyA = this;
        constraint.bodyB = other;
        constraint.length = muscleLength;
        constraint.stiffness = muscleStiffness;
        return constraint;
    }

    render(graphics) {
        graphics.drawCircle(this.physics.position, this.radius, {
            fillStyle: "#FFFFFF",
        });
    }

    tick(muscleData, startingIndex) {
        this.triggerMuscles();
    }
}

export default Part;
