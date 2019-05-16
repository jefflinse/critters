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
        this.movement = 0;
        this.brain = new Network();
    }

    get fitness() {
        return this.parts.reduce((movement, part) => movement + part.movement);
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

    addPart(part) {
        this.parts.push(part);
        Composite.add(this.physics, part.physics);
    }

    clone() {
        // return Creature.FromJSON(JSON.stringify(this.toJSON()));
        return Creature.CreateRandom();
    }

    render(graphics) {
        this.parts.forEach(part => part.render(graphics));
        if (this.id === 1) {
            // this.brain.render(graphics, new Vector(100, 100), 15, 30, 30, 4);
        }
    }

    setPosition(position) {
        // instantly set the position of the creature, without affecting physics

        // heuristic: if there are no parts, just use (0, 0)
        let currentPosition = this.parts.length > 0 ? this.position : new Vector(0, 0);

        let relativePosition = position.copy().subtract(currentPosition);
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

    static AddRandomPart(creature) {
        let part;
        let muscle;
        if (creature.parts.length === 0) {
            part = new Part();
        } else {
            [part, muscle] = Part.AddRandomPart(_.sample(creature.parts));
        }

        creature.parts.push(part);
        Composite.add(creature.physics, part.physics);

        if (muscle) {
            Composite.add(creature.physics, muscle.physics);
        }
    }

    static CreateRandom() {
        let creature = new Creature();
        _.times(3, () => {
            let parentPart = creature.parts.length > 0 ? _.sample(creature.parts) : undefined;
            let part = Part.CreateRandom();
            creature.addPart(part);
            if (parentPart !== undefined) {
                let muscle = parentPart.connectTo(part);
                Composite.add(creature.physics, muscle.physics);
            }
        });

        let numSensors = creature.sensors.length;
        let numTriggers = creature.triggers.length;
        let mindSize = _.random(numSensors, numTriggers);
        creature.brain = new Network();
        Network.RandomlyPopulate(creature.brain, [numSensors, mindSize, numTriggers]);
        Network.FullyConnect(creature.brain);

        // maintain JSON serialization capabilities until UTs are in place
        creature.brain = Network.FromJSON(JSON.stringify(creature.brain.toJSON()));

        return creature;
    }
}

export default Creature;
