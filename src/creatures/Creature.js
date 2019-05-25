import _ from 'lodash';
import Matter from 'matter-js';
import Muscle from './Muscle';
import Network from '../neuralnetwork/Network';
import Part from './Part';
import Vector from '../Vector';

const Composite = Matter.Composite;

let nextCreatureId = 1;
class Creature {

    constructor() {
        this.id = nextCreatureId++;
        this.parts = [];
        this.muscles = [];
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
        return this.parts.reduce((partTriggers, part) => partTriggers.concat(part.triggers), [])
            .concat(this.muscles.reduce((muscleTriggers, muscle) => muscleTriggers.concat(muscle.triggers), []));
    }

    addMuscle(muscle) {
        this.muscles.push(muscle);
        Composite.add(this.physics, muscle.physics);
    }

    addPart(part) {
        this.parts.push(part);
        Composite.add(this.physics, part.physics);
    }

    clone() {
        // return Creature.FromJSON(JSON.stringify(this.toJSON()));
        return Creature.CreateRandom();
    }

    initializeBrain() {
        let numSensors = this.sensors.length;
        let numTriggers = this.triggers.length;
        let mindSize = _.random(numSensors, numTriggers);

        // TODO: make network topology dynamic
        Network.RandomlyPopulate(this.brain, [numSensors, mindSize, numTriggers]);
        Network.FullyConnect(this.brain);

        // maintain JSON serialization capabilities until UTs are in place
        this.brain = Network.FromJSON(JSON.stringify(this.brain.toJSON()));
    }

    render(graphics) {
        this.parts.forEach(part => part.render(graphics));
        this.muscles.forEach(muscle => muscle.render(graphics));
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
            muscles: this.muscles.map(muscle => muscle.toJSON()),
            brain: this.brain.toJSON(),
        }
    }

    static AddRandomPart(creature) {
        let part = new Part();
        Part.SetDefaultSensors(part);
        Part.SetDefaultTriggers(part);
        
        if (creature.parts.length > 0) {
            let muscle = new Muscle(_.sample(creature.parts), part);
            creature.addMuscle(muscle);
        }

        creature.addPart(part);

        return part;
    }

    static CreateRandom() {
        let creature = new Creature();
        _.times(3, () => Creature.AddRandomPart(creature));
        creature.initializeBrain();

        return creature;
    }
}

export default Creature;
