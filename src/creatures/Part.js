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
        let radius = 10;
        super(Bodies.polygon(position.x, position.y, _.random(3, 6), radius, {
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

        // give the part an random push on birth
        this.applyForceFromCenter(Vector.RandomUnit().setMagnitude(.01));
    }

    connectTo(part) {
        part.position = this.position.copy().add(Vector.RandomUnit().setMagnitude(this.radius * 2));
        let muscle = new Muscle(this, part);
        this.muscles.push(muscle);
        return muscle;
    }

    render(graphics) {
        this.muscles.forEach(muscle => muscle.render(graphics));
        let color = 'hsla(' +
            0 + ', ' +
            100 + '%, ' +
            (100 - (this.dm * 50)) + '%)';
        
        graphics.drawPolygon(this.physics.vertices, {
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

    static CreateRandom() {
        return new Part(new Vector(0, 0), 7);
    }
    
    static AddRandomPart(part) {
        let position = part.position.copy().add(Vector.RandomUnit().setMagnitude(part.radius * 2));
        let newPart = new Part(position);
        let muscle = new Muscle(part, newPart);
        part.muscles.push(muscle);
        return [newPart, muscle];
    }
}

export default Part;
