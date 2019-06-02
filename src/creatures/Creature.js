import _ from 'lodash';
import Matter from 'matter-js';
import Muscle from './Muscle';
import Network from '../neuralnetwork/Network';
import Part from './Part';
import Vector from '../Vector';

const Composite = Matter.Composite;

let nextCreatureId = 1;
class Creature {

    constructor(options) {
        options = options || {};
        this.id = options.id || nextCreatureId++;
        this.parts = [];
        this.muscles = [];
        this.physics = Composite.create();
        this.movement = 0;
        this.brain = options.brain;
        if (this.brain === undefined) {
            this.brain = new Network();
            Network.Populate(this.brain, [0, 0]);
        }
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
        return this.parts.reduce((partTriggers, part) => partTriggers.concat(part.triggers), [])
            .concat(this.muscles.reduce((muscleTriggers, muscle) => muscleTriggers.concat(muscle.triggers), []));
    }

    addMuscle(muscle) {
        this.muscles.push(muscle);
        Composite.add(this.physics, muscle.physics);
        while (this.brain.outputs.size < this.triggers.length) {
            this.brain.outputs.addNeuron();
        }
    }

    addPart(part) {
        this.parts.push(part);
        Composite.add(this.physics, part.physics);
        while (this.brain.inputs.size < this.sensors.length) {
            this.brain.inputs.addNeuron();
        }
        while (this.brain.outputs.size < this.triggers.length) {
            this.brain.outputs.addNeuron();
        }
    }

    clone() {
        let creature = Creature.FromJSON(JSON.stringify(this.toJSON()), true);
        creature.mutate();
        return creature;
    }

    mutate() {
        this.brain.mutate();

        if (_.random(true) < .2) {
            Creature.AddRandomPart(this);
        }

        if (_.random(true) < .2) {
            Creature.AddRandomMuscle(this);
        }
    }

    render(graphics, showNetwork = false) {
        this.parts.forEach(part => part.render(graphics));
        this.muscles.forEach(muscle => muscle.render(graphics));
        if (showNetwork) {
            this.brain.render(graphics, new Vector(25, 25), 10, 20, 20);
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
        this.movement += this.parts.reduce((movement, part) => movement + part.movement, 0);
    }

    toJSON() {
        return {
            id: this.id,
            parts: this.parts.map(part => part.toJSON()),
            muscles: this.muscles.map(muscle => muscle.toJSON()),
            brain: this.brain.toJSON(),
        };
    }

    _chooseRandomPart(exclusions = []) {
        let searchSpace = this.parts.map(part => part.id);
        searchSpace = _.difference(searchSpace, exclusions);

        let partId = _.sample(searchSpace);
        return this.parts.find(part => part.id === partId);
    }

    static AddRandomMuscle(creature) {
        let maxMuscles = creature.parts.length * (creature.parts.length - 1) / 2;
        if (creature.parts.length < 2 || creature.muscles.length === maxMuscles) {
            return undefined;
        }

        let from = creature._chooseRandomPart();
        let exclusions = [from.id];
        let to = creature._chooseRandomPart(exclusions);
        while (to === from || hasMuscle(from, to)) {
            addExclusion(to);
            if (exclusions.length === creature.parts.length) {
                exclusions = [from.id];
                from = creature._chooseRandomPart(exclusions);
            } else {
                to = creature._chooseRandomPart(exclusions);
            }
        }

        let muscle = new Muscle(from, to);
        creature.addMuscle(muscle);

        return muscle;

        function addExclusion(part) {
            if (part !== undefined) {
                exclusions.push(part.id);
            }
        }

        function hasMuscle(from, to) {
            return creature.muscles.reduce((exists, muscle) =>
                exists ||
                (muscle.from === from && muscle.to === to) ||
                (muscle.from === to && muscle.to === from), false);
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
        _.times(4, () => Creature.AddRandomPart(creature));
        _.times(_.random(1, creature.sensors.length * creature.triggers.length),
            () => creature.brain.addRandomConnection());

        return creature;
    }

    static FromJSON(json, useUniqueId = false) {
        let data = JSON.parse(json);
        let creature = new Creature({
            id: useUniqueId ? nextCreatureId++ : data.id,
            brain: Network.FromJSON(JSON.stringify(data.brain)),
        });

        let partsMap = data.parts.reduce((map, partData) => {
            map[partData.id] = Part.FromJSON(JSON.stringify(partData), true);
            creature.addPart(map[partData.id]);
            return map;
        }, {});

        data.muscles.forEach(muscleData => {
            let from = partsMap[muscleData.from];
            let to = partsMap[muscleData.to];
            creature.addMuscle(new Muscle(from, to, {
                id: muscleData.id,
                length: muscleData.length,
            }));
        });

        return creature;
    }
}

export default Creature;
