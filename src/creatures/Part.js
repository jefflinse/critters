import _ from 'lodash';
import Matter from 'matter-js';
import Muscle from './Muscle';
import Vector from '../Vector';

const Body = Matter.Body;
const Bodies = Matter.Bodies;

class Part {

    constructor(position, radius) {
        this.radius = radius;

        // each part only "owns" the muscles it created when adding child parts
        this.muscles = [];
        
        this.physics = Bodies.circle(position.x, position.y, radius, {
            frictionAir: .1,
            friction: .5,
        });

        this.sensors = [
            () => _.random(-1, 1, true),
        ];

        this.triggers = [
            ((value) => this.physics.friction = value).bind(this),
            ((value) => this.thrust.setMagnitude(value * .0001)).bind(this),
            ((value) => this.thrust.setAngle(value * 2 * Math.PI)).bind(this),
        ];

        this.thrust = new Vector();
    }

    addPart() {
        let position = new Vector(this.physics.position.x, this.physics.position.y)
            .add(new Vector().random().setMagnitude(this.radius * 4));
        let part = new Part(position, this.radius);
        let muscle = new Muscle(this, part);
        this.muscles.push(muscle);
        return [part, muscle];
    }

    render(graphics) {
        this.muscles.forEach(muscle => muscle.render(graphics));
        graphics.drawCircle(this.physics.position, this.radius, {
            fillStyle: "#FFFFFF",
            globalAlpha: .1 + (.9 * this.physics.friction),
        });
    }

    tick() {
        this._applyForce(this.thrust);
    }

    _applyForce(force) {
        // let relativePosition = new Vector().random().setMagnitude(this.radius);
        // let position = new Vector(this.physics.position.x, this.physics.position.y).add(relativePosition);
        Body.applyForce(this.physics, this.physics.position, force);
    }
}

export default Part;
