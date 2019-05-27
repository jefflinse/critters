import _ from 'lodash';
import Matter from 'matter-js';
import PhysicalObject from './PhysicalObject';
import Vector from '../Vector';

const Bodies = Matter.Bodies;

let nextPartId = 1;
class Part extends PhysicalObject {

    constructor(options) {
        super();
        options = options || {};
        this.id = options.id || nextPartId++;
        this.sides = options.sides || _.random(3, 6);
        this.radius = options.radius || 10;
        let position = options.position || new Vector(0, 0);
        
        this.sensors = [];
        this.triggers = [];

        // there's a better way to do this
        this.ticks = 0;
        this.dm = 0;
        this.da = 0;
        this.movement = 0;

        this.physics = Bodies.polygon(position.x, position.y, this.sides, this.radius, {
            frictionAir: .45,
        });
        this.initializePhysics();

        // give the part an random push on birth
        this.applyForceFromCenter(Vector.RandomUnit().setMagnitude(.01));
    }

    render(graphics) {
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
        this.movement += this.physics.speed;
    }

    toJSON() {
        return {
            id: this.id,
            sides: this.sides,
            radius: this.radius,
        }
    }

    static FromJSON(json, useUniqueId = false) {
        let data = JSON.parse(json);
        let part = new Part({
            id: useUniqueId ? nextPartId++ : data.id,
            sides: data.sides,
            radius: data.radius,
        });

        Part.SetDefaultSensors(part);
        Part.SetDefaultTriggers(part);

        return part;
    }

    static SetDefaultSensors(part) {
        part.sensors = [
            () => part.physics.speed,
            () => part.physics.angle,
            () => part.physics.angularSpeed,
            () => part.ticks,
        ];
    }

    static SetDefaultTriggers(part) {
        part.triggers = [
            (value) => part.physics.frictionAir = _.clamp(part.physics.frictionAir + (value * .01), 0, .9),
            (value) => part.dm = _.clamp(value, 0, 1),
            (value) => part.da = _.clamp(value, -1, 1),
            (value) => {
                part.ticks++;
                if (part.ticks % _.floor(value * 20) === 0) {
                    part.applyForceFromCenter(new Vector(1, 1)
                        .setAngle(Math.PI * 2 *  part.da)
                        .setMagnitude(.0005 * part.dm));
                    part.ticks = 0;
                }
            },
        ];
    }
}

export default Part;
