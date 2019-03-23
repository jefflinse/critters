import Matter from 'matter-js';
import Vector from '../Vector';

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
        let muscle = Constraint.create({
            bodyA: part.physics,
            bodyB: this.physics,
            length: this.radius * 1000,
            stiffness: .3,
            damping: .5,
            render: {
                lineWidth: 3,
                strokeStyle: "#AAAAFF",
                visible: true,
            }
        });

        part.addMuscle(muscle);

        return muscle;
    }

    addMuscle(muscle) {
        this.muscles.push({
            muscle: muscle,
            attributes: ['length', 'stiffness'],
        });
    }

    render(graphics) {
        graphics.drawCircle(this.physics.position, this.radius, {
            fillStyle: "#FFFFFF",
        });
    }

    tick(neuralData) {
        for (let i = 0; i < this.muscles.length; i++) {
            let muscle = this.muscles[i];
            for (let j = 0; j < muscle.attributes.length; j++) {
                muscle.muscle[muscle.attributes[j]] = neuralData[i*j];
            }
        }
    }
}

export default Part;
