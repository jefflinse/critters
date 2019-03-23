import Matter from 'matter-js';
import Network from '../neuralnetwork/Network';
import Vector from '../Vector';
import Part from './Part';

const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;

class Creature {

    constructor(position, radius) {
        this.parts = [new Part(position, radius)];
        this.brain = new Network(2, 2).randomize(2);
    }

    get physics() {
        return this.parts[0].physics;
    }

    tick() {
        let sensors = this.parts.reduce((data, part) => data.concat(part.sensors), [])
        let outputs = this.brain.activate(sensors);

        let muscleDataIndex = 0;
        this.parts.forEach(part => {
            muscleDataIndex = part.tick(outputs, muscleDataIndex);
        });
    }

    render(graphics) {
        this.parts.forEach(part => part.render(graphics));
    }
}

export default Creature;
