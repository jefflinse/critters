import _ from 'lodash';
import Matter from 'matter-js';
import Brain from './Brain';
import Config from '../Config';
import Muscle from './Muscle';
import Part from './Part';
import Vector from '../Vector';

const Composite = Matter.Composite;

class Creature {

    constructor() {
        // inheritable
        this.color = 'black'
        this.parts = []
        this.muscles = []
        this.brain = new Brain()

        // runtime-specific
        this.physics = Composite.create()
    }

    get fitness() {
        return _.random(10)
    }

    get minMuscles() {
        return this.parts.length - 1
    }

    get maxMuscles() {
        return this.parts.length * (this.parts.length - 1) / 2
    }

    get position() {
        return this.parts[0].position
    }

    set position(position) {
        this.lastPosition = this.position.copy()
        let delta = position.subtract(this.lastPosition)
        this.parts.forEach(p => p.position = p.position.add(delta))
    }

    scatter(maxX, maxY) {
        this.position = new Vector(_.random(0, maxX), _.random(0, maxY))
        return this
    }

    addPart(part) {
        if (this.parts.length === Config.Creature.MaxParts) {
            console.warn("max parts reached, ignoring new part")
            return
        }

        this.parts.push(part)
        Composite.add(this.physics, part.physics)
        this.brain.addInputs(part.sensors.length)
        this.brain.addOutputs(part.triggers.length)
    }

    removePart(part) {
        let partIdx = this.parts.indexOf(part)
        if (partIdx === -1) {
            console.warn("attempted to remove non-existent part from creature")
            return
        }

        // remove the brain inputs and outputs corresponding to the part's sensors and triggers
        // to do this, we need to count all the inputs and outputs from the parts before this part
        let firstSensorIdx = 0
        let firstTriggerIdx = 0
        for (let i = 0; i < partIdx; i++) {
            firstSensorIdx += this.parts[i].sensors.length
            firstTriggerIdx += this.parts[i].triggers.length
        }

        this.brain.removeInputs(firstSensorIdx, part.sensors.length)
        this.brain.removeOutputs(firstTriggerIdx, part.triggers.length)

        // remove the part from the creature
        this.parts.splice(partIdx, 1)
    }

    addMuscle(muscle) {
        if (this.muscles.length === this.maxMuscles) {
            console.warn("max muscles reached, ignoring new muscle")
            return
        }

        this.muscles.push(muscle)
        Composite.add(this.physics, muscle.physics)
        this.brain.addInputs(muscle.sensors.length)
        this.brain.addOutputs(muscle.triggers.length)
    }

    removeMuscle(muscle) {
        let muscleIdx = this.muscles.indexOf(muscle)
        if (muscleIdx === -1) {
            console.warn("attempted to remove non-existent muscle from creature")
            return
        }

        // remove the brain inputs and outputs corresponding to the muscle's sensors and triggers
        // to do this, we need to count all the inputs and outputs from the muscles before this muscle
        let firstInputIdx = 0
        let firstOutputIdx = 0
        for (let i = 0; i < muscleIdx; i++) {
            firstInputIdx += this.muscles[i].sensors.length
            firstOutputIdx += this.muscles[i].triggers.length
        }

        this.brain.removeInputs(firstInputIdx, muscle.sensors.length)
        this.brain.removeOutputs(firstOutputIdx, muscle.triggers.length)

        this.muscles[muscleIdx].from.numMuscles--
        this.muscles[muscleIdx].to.numMuscles--

        // remove the muscle from the creature
        this.muscles.splice(muscleIdx, 1)
    }

    clone() {
        return Creature.FromJSON(this.toJSON())
    }

    connectTwoRandomParts() {
        // no self-connected parts
        let from, to = null
        do {
            from = _.sample(this.parts)
            to = _.sample(this.parts)
        } while (from === to);

        this.addMuscle(Muscle.CreateRandom().connect(from, to))
    }

    mutate() {
        if (_.random(true) < Config.Creature.ChanceOf.PartGain) {
            if (this.parts.length < Config.Creature.MaxParts) {
                let part = Part.CreateRandom(this.color)
                let muscle = Muscle.CreateRandom().connect(_.sample(this.parts), part)
                this.addPart(part)
                this.addMuscle(muscle)
            }
        }

        // if (_.random(true) < Config.Creature.ChanceOf.PartLoss) {
        //     if (this.parts.length > 1) {
        //         this.removePart(_.sample(this.parts))
        //     }
        // }

        if (_.random(true) < Config.Creature.ChanceOf.MuscleGain) {
            if (this.muscles.length < this.maxMuscles) {
                this.connectTwoRandomParts()
            }
        }

        if (_.random(true) < Config.Creature.ChanceOf.MuscleLoss) {
            if (this.muscles.length > this.minMuscles) {
                let toRemove = _.sample(this.muscles)
                this.removeMuscle(toRemove)
                if (toRemove.from.numMuscles === 0) {
                    this.removePart(toRemove.from)
                }
                if (toRemove.to.numMuscles === 0) {
                    this.removePart(toRemove.to)
                }
            }
        }

        if (_.random(true) < Config.Creature.ChanceOf.BrainMutation) {
            this.brain.mutate()
        }
        
        return this
    }

    render(graphics) {
        this.muscles.forEach(m => m.render(graphics))
        this.parts.forEach(p => p.render(graphics))
    }

    tick() {
        // collect sensor inputs from parts and muscles and activate neural network
        let inputs = this.parts.reduce((pInputs, p) => pInputs.concat(p.sense()), [])
            .concat(this.muscles.reduce((mInputs, m) => mInputs.concat(m.sense()), []))
        let outputs = this.brain.network.activate(inputs)

        console.log(`inputs: ${inputs.length}, outputs: ${outputs.length}`)

        // trigger the muscles and parts using outputs
        let outputIdx = 0
        this.muscles.forEach(m => {
            m.act(outputs.slice(outputIdx, outputIdx + m.triggers.length))
            outputIdx += m.triggers.length
        })
        this.parts.forEach(p => {
            p.act(outputs.slice(outputIdx, outputIdx + p.triggers.length))
            outputIdx += p.triggers.length
        })
    }

    toJSON() {
        let json = {
            color: this.color,
            parts: [],
            muscles: [],
            brain: this.brain.toJSON(),
        }

        for (let i = 0; i < this.parts.length; i++) {
            this.parts[i].index = i
            json.parts.push({
                color: this.parts[i].color,
                radius: this.parts[i].radius,
            })
        }

        for (let i = 0; i < this.muscles.length; i++) {
            json.muscles.push({
                from: this.muscles[i].from.index,
                to: this.muscles[i].to.index,
                length: this.muscles[i].length,
            })
        }

        return json
    }

    static CreateRandom() {
        let creature = new Creature();
        creature.color = `hsla(${_.random(0, 360)}, 100%, 50%, 1)`
        creature.addPart(Part.CreateRandom(creature.color))

        _.times(_.random(Config.Creature.MinStartingParts - 1, Config.Creature.MaxStartingParts - 1), () => {
            let part = Part.CreateRandom(creature.color)
            let muscle = Muscle.CreateRandom().connect(_.sample(creature.parts), part)
            creature.addPart(part)
            creature.addMuscle(muscle)
        })

        let maxNewMuscles = creature.maxMuscles - creature.muscles.length
        let numMusclesToAdd = _.floor(maxNewMuscles * _.random(true))
        _.times(numMusclesToAdd, () => {
            creature.connectTwoRandomParts()
        })

        // Hack: Neataptic can't create a random network with zero inputs or outputs,
        // so every brain starts with one input and one output. However, they aren't needed
        // and throw off the input/output counts, so we explicitly remove them here.
        creature.brain.removeInputs(0, 1)
        creature.brain.removeOutputs(0, 1)

        return creature
    }

    static FromJSON(json) {
        let creature = new Creature()
        creature.color = json.color
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
