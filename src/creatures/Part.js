import Matter from 'matter-js';
import Muscle from './Muscle';
import Vector from '../Vector';

const Body = Matter.Body;
const Bodies = Matter.Bodies;

class Part {

    constructor(position, radius) {
        this.radius = radius;
        this.muscles = [];
        this.sensors = [];
        this.physics = Bodies.circle(position.x, position.y, radius, {
            frictionAir: .1,
            friction: .5,
        });

        //this._applyRandomForce();
    }

    addMuscle(otherPart) {
        let muscle = new Muscle(this, otherPart, this.radius * 5);
        this.muscles.push(muscle);
        return muscle;
    }   

    get numSensors() {
        return 1; // TODO: Fix this, this is bad.
    }

    get numTriggers() {
        return this.muscles.reduce((total, muscle) => total + muscle.triggers.length, 0);
    }

    getSensoryData() {
        // let data = [
        //     this.physics.velocity.x,
        //     this.physics.velocity.y,
        //     this.physics.angle,
        //     this.physics.angularSpeed,
        // ];

        let data = [
            Math.random(),
        ]

        return data;
    }

    render(graphics) {
        this.muscles.forEach(muscle => muscle.render(graphics));
        graphics.drawCircle(this.physics.position, this.radius, {
            fillStyle: "#FFFFFF",
            globalAlpha: .1 + (.9 * this.physics.friction),
        });
    }

    tick(neuralData) {
        for (let i = 0; i < this.muscles.length; i++) {
            let muscle = this.muscles[i];
            for (let j = 0; j < muscle.triggers.length; j++) {
                let trigger = muscle.triggers[j];
                trigger(neuralData[i*j]);
            }
        }
    }

    _applyRandomForce() {
        let position = new Vector(this.physics.position.x, this.physics.position.y)
            .add(new Vector().random().setMagnitude(this.radius));
        let force = position.copy().invert().setMagnitude(.001);
        Body.applyForce(this.physics, position, force);
    }
}

export default Part;
