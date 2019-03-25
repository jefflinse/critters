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
            frictionAir: 0,
        });

        this.sensors = [
            // () => _.random(-1, 1, true),
            // () => _.random(-1, 1, true),
            () => _.random(-1, 1, true),
            (() => this.physics.speed).bind(this),
            (() => this.physics.angularSpeed).bind(this),
        ];

        this.triggers = [
            ((value) => this.physics.frictionAir = Math.min(Math.max(
                this.physics.frictionAir + (value * .01), 0), 1)).bind(this),
        ];
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
            globalAlpha: .1 + (.9 * this.physics.frictionAir),
        });
    }

    tick() {
        
    }
}

export default Part;
