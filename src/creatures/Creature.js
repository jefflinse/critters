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

    clone() {
        let creature = Creature.CreateRandom();
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

    static CreateRandom(options) {
        options = options || { numParts: 5 };
        let creature = new Creature();

        _.times(options.numParts, () => Creature.AddRandomPart(creature));

        let mindSize = _.random(creature.sensors.length, creature.triggers.length);
        Network.RandomlyPopulate(creature.brain, [creature.sensors.length, mindSize, mindSize, creature.triggers.length])
        Network.FullyConnect(creature.brain);

        // maintain JSON serialization capabilities until UTs are in place
        creature.brain = Network.FromJSON(JSON.stringify(creature.brain.toJSON()));

        return creature;
    }
}

export default Creature;
