import _ from 'lodash';
import Matter from 'matter-js';
import Muscle from './Muscle';
import PhysicalObject from './PhysicalObject';
import Vector from '../Vector';

const Bodies = Matter.Bodies;

let nextPartId = 1;
class Part extends PhysicalObject {

    constructor(position) {
        position = position || new Vector(0, 0);
        let radius = 7;
        super(Bodies.circle(position.x, position.y, radius, {
            frictionAir: .45,
        }));

        this.id = nextPartId++;
        this.radius = radius;

        // each part only "owns" the muscles it created when adding child parts
        this.muscles = [];
        
        this.sensors = [
            (() => this.physics.speed).bind(this),
            (() => this.physics.angle).bind(this),
            (() => this.physics.angularSpeed).bind(this),
            (() => this.ticks).bind(this),
        ];

        this.triggers = [
            ((value) => this.physics.frictionAir = Math.min(Math.max(
                this.physics.frictionAir + (value * .01), 0), .9)).bind(this),
            ((value) => this.dm = Math.min(Math.max(value, 0), 1)).bind(this),
            ((value) => this.da = Math.min(Math.max(value, -1), 1)).bind(this),
            ((value) => {
                this.ticks++;
                if (this.ticks % _.floor(value * 20) === 0) {
                    this.applyForceFromCenter(new Vector(1, 1)
                        .setAngle(Math.PI * 2 *  this.da)
                        .setMagnitude(.0005 * this.dm));
                    this.ticks = 0;
                }
            }).bind(this),
        ];

        // there's a better way to do this
        this.ticks = 0;
        this.dm = 0;
        this.da = 0;
        this.movement = 0;
    }

    addPart() {
        let position = this.position.copy().add(new Vector().random().setMagnitude(this.radius * 2));
        let part = new Part(position);
        let muscle = new Muscle(this, part);
        this.muscles.push(muscle);
        return [part, muscle];
    }

    render(graphics) {
        this.muscles.forEach(muscle => muscle.render(graphics));
        let color = 'hsla(' +
            0 + ', ' +
            100 + '%, ' +
            (100 - (this.dm * 50)) + '%)';
        graphics.drawCircle(this.position, this.radius, {
            fillStyle: color,
            globalAlpha: .25 + (.75 * this.physics.frictionAir),
        });
    }

    tick() {
        this.movement += this.physics.movement;
    }

    toJSON() {
        return {
            id: this.id,
            radius: this.radius,
            muscles: this.muscles.map(muscle => muscle.id),
        }
    }
}

export default Part;
