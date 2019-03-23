import Matter from 'matter-js';
import Vector from '../Vector';
import Muscle from './Muscle';

const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

class Part {

    constructor(position, radius) {
        this.radius = radius;
        this.physics = Bodies.circle(position.x, position.y, radius, {
            frictionAir: .5,
            friction: .5,
        });
        this.parts = [];
        this.sensors = [
            () => this.physics.velocity.x,
            () => this.physics.velocity.y,
            () => this.physics.angularSpeed,
            () => this.physics.angle,
        ];
        this.muscles = [];
    }

    addPart(part) {
        let constraint = Constraint.create({
            bodyA: part.physics,
            bodyB: this.physics,
            length: this.radius * 10,
            stiffness: .3,
            damping: .5,
        });

        part.addMuscle(constraint);

        return constraint;
    }

    addMuscle(constraint) {
        this.muscles.push(new Muscle(this, constraint));
    }

    get muscleDataNeeded() {
        return this.muscles.reduce((total, muscle) => total + muscle.triggers.length, 0);
    }

    render(graphics) {
        graphics.drawCircle(this.physics.position, this.radius, {
            fillStyle: "#FFFFFF",
        });
    }

    tick(neuralData) {
        for (let i = 0; i < this.muscles.length; i++) {
            let muscle = this.muscles[i];
            for (let j = 0; j < muscle.triggers.length; j++) {
                muscle.triggers[j](neuralData[i*j]);
            }
        }
    }
}

export default Part;
