import Matter from 'matter-js';
import Muscle from './Muscle';
import Vector from '../Vector';

const Body = Matter.Body;
const Bodies = Matter.Bodies;

class Part {

    constructor(position, radius) {
        this.radius = radius;
        this.muscles = [];
        
        this.physics = Bodies.circle(position.x, position.y, radius, {
            frictionAir: .1,
            friction: .5,
        });

        this.sensors = [
            Math.random.bind(Math),
        ];

        this.triggers = [
            ((value) => this.physics.friction = value).bind(this),
        ];
    }

    addMuscle(otherPart) {
        let muscle = new Muscle(this, otherPart, this.radius * 5);
        this.muscles.push(muscle);
        return muscle;
    }

    render(graphics) {
        this.muscles.forEach(muscle => muscle.render(graphics));
        graphics.drawCircle(this.physics.position, this.radius, {
            fillStyle: "#FFFFFF",
            globalAlpha: .1 + (.9 * this.physics.friction),
        });
    }

    tick() {
        
    }

    _applyRandomForce() {
        let relativePosition = new Vector().random().setMagnitude(this.radius);
        let position = new Vector(this.physics.position.x, this.physics.position.y).add(relativePosition);
        let force = relativePosition.copy().invert().setMagnitude(.01);
        Body.applyForce(this.physics, position, force);
    }
}

export default Part;
