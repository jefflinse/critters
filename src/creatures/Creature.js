import Matter from 'matter-js';
import Network from '../neuralnetwork/Network';
import Part from './Part';
import Vector from '../Vector';

const Composite = Matter.Composite;
const Composites = Matter.Composites;

class Creature {

    constructor(position, radius) {
        this.parts = [];
        this.physics = Composite.create();
        this.addPart(position, radius);
        this.addPart(chooseRandomPartLocation(position, radius), radius);
        this.addPart(chooseRandomPartLocation(position, radius), radius);
        this.addPart(chooseRandomPartLocation(position, radius), radius);

        let totalSensors = this.parts.reduce((total, part) => total + part.sensors.length, 0);
        let totalMuscles = this.parts.reduce((total, part) => total + part.muscles.length, 0);
        this.brain = new Network(totalSensors, totalMuscles).randomize();

        function chooseRandomPartLocation(parentPosition, radius) {
            return parentPosition.copy().add(new Vector().random().setMagnitude(radius * 5))
        }
    }

    addPart(position, radius) {
        let part = new Part(position, radius);

        // attach to an existing part using a muscle
        if (this.parts.length > 0) {
            let parent = this.parts.random();
            let constraint = parent.addPart(part);
            Composite.add(this.physics, constraint);
        }

        this.parts.push(part);
        Composite.add(this.physics, part.physics);
    }

    tick() {
        let sensors = this.parts.reduce((data, part) => data.concat(part.sensors), [])
        let neuralData = this.brain.activate(sensors.map(sensor => sensor()));

        let neuralDataIndex = 0;
        this.parts.forEach(part => {
            part.tick(neuralData.slice(neuralDataIndex, part.neuralDataNeeded));
        });
    }

    render(graphics) {
        // this.parts.forEach(part => part.render(graphics));
        this.brain.render(graphics, this.parts[0].physics.position, 10, 20, 20);
    }
}

export default Creature;
