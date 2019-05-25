import _ from 'lodash';
import Matter from 'matter-js';
import Muscle from './Muscle';
import PhysicalObject from './PhysicalObject';
import Vector from '../Vector';

const Bodies = Matter.Bodies;

let nextPartId = 1;
class Part extends PhysicalObject {

    constructor() {
        super();
        this.id = nextPartId++;
        let position = new Vector(0, 0);
        this.radius = 10;

        // TODO: this makes cloning inaccurate
        this.physics = Bodies.polygon(position.x, position.y, _.random(3, 6), this.radius, {
            frictionAir: .45,
        });

        // each part only "owns" the muscles it created when adding child parts
        this.muscles = [];
        
        this.sensors = [
            () => this.physics.speed,
            () => this.physics.angle,
            () => this.physics.angularSpeed,
            () => this.ticks,
        ];

        this.triggers = [
            (value) => this.physics.frictionAir = _.clamp(this.physics.frictionAir + (value * .01), 0, .9),
            (value) => this.dm = _.clamp(value, 0, 1),
            (value) => this.da = _.clamp(value, -1, 1),
            (value) => {
                this.ticks++;
                if (this.ticks % _.floor(value * 20) === 0) {
                    this.applyForceFromCenter(new Vector(1, 1)
                        .setAngle(Math.PI * 2 *  this.da)
                        .setMagnitude(.0005 * this.dm));
                    this.ticks = 0;
                }
            },
        ];

        // there's a better way to do this
        this.ticks = 0;
        this.dm = 0;
        this.da = 0;
        this.movement = 0;

        this.initializePhysics();

        // give the part an random push on birth
        this.applyForceFromCenter(Vector.RandomUnit().setMagnitude(.01));
    }

    connectTo(part, relativePosition) {
        relativePosition = relativePosition || Vector.RandomUnit().setMagnitude(this.radius * 2);
        part.setRelativePositionFrom(this, relativePosition);
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
            relativePosition: this.getRelativePositionFrom().toString(),
            muscles: this.muscles.map(muscle => muscle.id),
        }
    }

    static CreateRandom() {
        return new Part();
    }
    
    static AddRandomPart() {
        let part = new Part();
        let muscle = this.connectTo(part);
        return [part, muscle];
    }
}

export default Part;
