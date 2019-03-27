import _ from 'lodash';
import Matter from 'matter-js';
import Muscle from './Muscle';
import PhysicalObject from './PhysicalObject';
import Vector from '../Vector';

const Bodies = Matter.Bodies;

class Part extends PhysicalObject {

    constructor(position) {
        position = position || new Vector(0, 0);
        let radius = 10;
        super(Bodies.circle(position.x, position.y, radius, {
            frictionAir: .45,
        }));

        this.radius = radius;

        // each part only "owns" the muscles it created when adding child parts
        this.muscles = [];
        
        this.sensors = [
            (() => this.physics.speed).bind(this),
            (() => this.physics.angle).bind(this),
            (() => this.physics.angularSpeed).bind(this),
        ];

        this.triggers = [
            ((value) => this.physics.frictionAir = Math.min(Math.max(
                this.physics.frictionAir + (value * .05), 0), .9)).bind(this),
        ];

        this.movement = 0;

        // give the part an random push on birth
        this.applyForceFromCenter(new Vector().random().setMagnitude(.0005));
    }

    addPart() {
        let position = this.position.copy().add(new Vector().random().setMagnitude(this.radius * 3));
        let part = new Part(position);
        let muscle = new Muscle(this, part);
        this.muscles.push(muscle);
        return [part, muscle];
    }

    render(graphics) {
        this.muscles.forEach(muscle => muscle.render(graphics));
        graphics.drawCircle(this.position, this.radius, {
            fillStyle: "#FFFFFF",
            globalAlpha: .1 + (.9 * this.physics.frictionAir),
        });
    }

    tick() {
        this.movement += this.physics.movement;
    }
}

export default Part;
