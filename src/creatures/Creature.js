import _ from 'lodash';
import Matter from 'matter-js';
import Network from '../neuralnetwork/Network';
import Part from './Part';
import Vector from '../Vector';

const Composite = Matter.Composite;

class Creature {

    constructor(position, radius) {
        this.parts = [];
        this.physics = Composite.create();
        this.addPart(position, radius);
        this.addPart(chooseRandomPartLocation(position, radius), radius);
        this.addPart(chooseRandomPartLocation(position, radius), radius);

        let totalSensors = this.parts.reduce((total, part) => total + part.numSensors, 0);
        let totalTriggers = this.parts.reduce((total, part) => total + part.numTriggers, 0);
        //this.brain = new Network(totalSensors, totalTriggers).randomize();
        this.brain = new Network(totalSensors, totalTriggers).fullyConnect();

        function chooseRandomPartLocation(parentPosition, radius) {
            return parentPosition.copy().add(new Vector().random().setMagnitude(radius * 5))
        }
    }

    addPart(position, radius) {
        let part = new Part(position, radius);
        let muscle;

        // attach to an existing part using a muscle
        if (this.parts.length > 1) {
            let parent = _.sample(this.parts);
            muscle = part.addMuscle(parent);
        }

        this.parts.push(part);
        Composite.add(this.physics, part.physics);

        if (muscle) {
            Composite.add(this.physics, muscle.physics);
        }
    }

    tick() {
        let sensoryData = this.parts.reduce((data, part) => {
            let partSensoryData = part.getSensoryData();
            if (partSensoryData === undefined || !_.every(partSensoryData, (d) => !isNaN(d))) {
                throw new Error("Invalid input data from sensor(s)");
            }
            return data.concat(partSensoryData);
        }, []);
        console.log('inputs ' + sensoryData);
        let neuralData = this.brain.activate(sensoryData);
        console.log('outputs: ' + neuralData);

        let neuralDataIndex = 0;
        this.parts.forEach(part => {
            part.tick(neuralData.slice(neuralDataIndex, part.totalTriggers));
            neuralDataIndex += part.totalTriggers;
        });
    }

    render(graphics) {
        this.parts.forEach(part => part.render(graphics));
        // this.brain.render(graphics, this.parts[0].physics.position, 10, 20, 20, 3);
    }
}

export default Creature;
