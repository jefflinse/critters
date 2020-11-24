import _ from 'lodash';
import Matter from 'matter-js';
import Neataptic from 'neataptic';
import Muscle from './Muscle';
import Part from './Part';

const Composite = Matter.Composite;

class Creature {

    constructor() {
        this.color = 'black'
        this.physics = Composite.create()

        this.parts = []
        this.muscles = []
        this.brain = null
    }

    get fitness() {
        return _.random(0, 10, true)
    }

    get position() {
        return this.parts[0].position
    }

    set position(position) {
        let prior = this.position.copy()
        let delta = position.subtract(prior)
        this.parts.forEach(p => p.position = p.position.add(delta))
    }

    addPart(part) {
        this.parts.push(part)
        Composite.add(this.physics, part.physics)
    }

    addMuscle(muscle) {
        this.muscles.push(muscle)
        Composite.add(this.physics, muscle.physics)
    }

    clone() {
        return Creature.FromJSON(this.toJSON())
    }

    render(graphics) {
        this.muscles.forEach(m => m.render(graphics))
        this.parts.forEach(p => p.render(graphics))
    }

    tick() {
        this.muscles.forEach(m => m.tick())
        this.parts.forEach(p => p.tick())
    }

    toJSON() {
        let json = {
            color: this.color,
            brain: this.brain.toJSON(),
            parts: [],
            muscles: [],
        }

        for (let i = 0; i < this.parts.length; i++) {
            this.parts[i].index = i
            json.parts.push({
                radius: this.parts[i].radius,
                color: this.parts[i].color,
            })
        }

        for (let i = 0; i < this.muscles.length; i++) {
            json.muscles.push({
                length: this.muscles[i].length,
                from: this.muscles[i].from.index,
                to: this.muscles[i].to.index,
            })
        }

        return json
    }

    static CreateRandom(minParts = 3, maxParts = 3, muscleDensity = 0.0) {
        let creature = new Creature();
        creature.color = `hsla(${_.random(0, 360)}, 100%, 50%, 1)`
        creature.addPart(Part.CreateRandom(creature.color))
        _.times(_.random(minParts - 1, maxParts - 1), () => {
            let part = Part.CreateRandom(creature.color)
            let muscle = Muscle.CreateRandom()
            muscle.connect(_.sample(creature.parts), part)
            creature.addPart(part)
            creature.addMuscle(muscle)
        })

        // muscle density == 0 means P-1 muscles, the minimum required to keep everything connected
        // muscle density == 1 means all parts are fully connected to all other parts
        let currentMuscles = creature.muscles.length
        let maxMuscles = creature.parts.length * (creature.parts.length - 1) / 2
        let maxAdditionalMuscles = maxMuscles - currentMuscles
        let numMusclesToAdd = _.floor(maxAdditionalMuscles * muscleDensity)
        _.times(numMusclesToAdd, () => {
            // no self-connected parts
            let from, to = null
            do {
                from = _.sample(creature.parts)
                to = _.sample(creature.parts)
            } while (from === to);

            let muscle = Muscle.CreateRandom()
            muscle.connect(from, to)
            creature.addMuscle(muscle)
        })

        creature.brain = Neataptic.architect.Random(creature.parts.length, 0, creature.muscles.length)

        return creature
    }

    static FromJSON(json) {
        let creature = new Creature()
        creature.color = json.color
        creature.brain = Neataptic.Network.fromJSON(json.brain)
        json.parts.forEach(jp => {
            let part = new Part(jp.radius)
            part.color = creature.color
            creature.addPart(part)
        })
        json.muscles.forEach(jm => {
            let muscle = new Muscle(jm.length)
            muscle.connect(creature.parts[jm.from], creature.parts[jm.to])
            creature.addMuscle(muscle)
        })

        return creature
    }
}

export default Creature;
