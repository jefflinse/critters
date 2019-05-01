import _ from 'lodash';
import Matter from 'matter-js';
import Network from '../neuralnetwork/Network';
import Part from './Part';
import Vector from '../Vector';

const Composite = Matter.Composite;

let nextCreatureId = 1;
class Creature {

    constructor() {
        this.id = nextCreatureId++;
        this.parts = [];
        this.physics = Composite.create();

        // ensure at least one part
        this.addPart();

        let numParts = 5;
        _.times(numParts - 1, () => this.addPart());

        let mindSize = _.random(this.sensors.length, this.triggers.length);
        this.brain = new Network();
        Network.RandomlyPopulate(this.brain, [this.sensors.length, mindSize, mindSize, this.triggers.length])
        Network.FullyConnect(this.brain);

        // maintain JSON serialization capabilities until UTs are in place
        this.brain = Network.FromJSON(JSON.stringify(this.brain.toJSON()));

        this.movement = 0;
    }

    get fitness() {
        return this.movement;
    }

    get position() {
        return this.parts[0].position;
    }

    get sensors() {
        return this.parts.reduce((s, part) => s.concat(part.sensors), []);
    }

    get triggers() {
        return this.parts.reduce((partTriggers, part) => {
            return partTriggers
                .concat(part.triggers)
                .concat(part.muscles.reduce((muscleTriggers, muscle) => muscleTriggers.concat(muscle.triggers), []));
        }, []);
    }

    addPart(position) {
        let part;
        let muscle;
        if (this.parts.length === 0) {
            part = new Part(position);
        } else {
            [part, muscle] = _.sample(this.parts).addPart();
        }

        this.parts.push(part);
        Composite.add(this.physics, part.physics);

        if (muscle) {
            Composite.add(this.physics, muscle.physics);
        }
    }

    clone() {
        let creature = new Creature();
        // TODO: cloning logic
        return creature;
    }

    render(graphics) {
        this.parts.forEach(part => part.render(graphics));
        if (this.id === 1) {
            // this.brain.render(graphics, new Vector(100, 100), 15, 30, 30, 4);
        }
    }

    setPosition(position) {
        // instantly set the position of the creature, without affecting physics
        let relativePosition = position.copy().subtract(this.position);
        Matter.Composite.translate(this.physics, relativePosition);
    }

    tick() {
        let neuralData = this.brain.activate(this.sensors.map(sensor => sensor()));
        _.times(neuralData.length, i => {
            this.triggers[i](neuralData[i]);
        });

        this.parts.forEach(part => part.tick());
        this.movement += this.parts.reduce((movement, part) => movement + part.movement);
    }

    toJSON() {
        return {
            id: this.id,
            parts: this.parts.map(part => part.toJSON()),
            brain: this.brain.toJSON(),
        }
    }
}

export default Creature;
