import Matter from 'matter-js';
import Muscle from './Muscle';

const Bodies = Matter.Bodies;

class Part {

    constructor(position, radius) {
        this.radius = radius;
        this.muscles = [];
        this.sensors = [];
        this.physics = Bodies.circle(position.x, position.y, radius, {
            frictionAir: .5,
            friction: .5,
        });
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
}

export default Part;
