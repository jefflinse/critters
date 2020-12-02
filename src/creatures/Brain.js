import _ from 'lodash';
import Neataptic, { methods } from 'neataptic';

class Brain {

    constructor() {
        // inheritable
        this.network = Neataptic.architect.Random(1, 0, 1)
    }

    get numInputs() {
        return this.network.nodes.reduce((total, node) => {
            if (node.type === 'input') {
                return total + 1
            }
            return total
        }, 0)
    }

    get numOutputs() {
        return this.network.nodes.reduce((total, node) => {
            if (node.type === 'output') {
                return total + 1
            }
            return total
        }, 0)
    }

    addInputs(num) {
        let that = this
        let firstNonInputNodeIdx = 0
        while (firstNonInputNodeIdx < this.network.nodes.length && this.network.nodes[firstNonInputNodeIdx].type === 'input') {
            firstNonInputNodeIdx++
        }

        let newInputNodes = _.range(num).map(_ => {
            let node = new Neataptic.Node('input')
            node.mutate(methods.mutation.MOD_ACTIVATION) // random squash
            return node
        })

        newInputNodes.forEach(n => {
            that.network.nodes.splice(firstNonInputNodeIdx, 0, n)
            firstNonInputNodeIdx++
            that.network.connect(n, that.network.nodes[_.random(firstNonInputNodeIdx, that.network.nodes.length - 1)])
        })
    }

    addOutputs(num) {
        let that = this

        let newOutputNodes = _.range(num).map(_ => {
            let node = new Neataptic.Node('output')
            node.mutate(methods.mutation.MOD_ACTIVATION) // random squash
            return node
        })

        newOutputNodes.forEach(n => {
            that.network.nodes.push(n)
            that.network.connect(n, that.network.nodes[_.random(0, that.network.nodes.length - newOutputNodes.length - 1)])
        })
    }

    removeInputs(start, num) {
        let that = this
        let toRemove = this.network.nodes.slice(start, start + num)
        toRemove.forEach(n => that.network.remove(n))
    }

    removeOutputs(start, num) {
        let that = this
        let toRemove = this.network.nodes.slice(start, start + num)
        toRemove.forEach(n => that.network.remove(n))
    }

    clone() {
        return Brain.FromJSON(this.toJSON())
    }

    mutate() {
        this.network.mutate(_.sample(methods.mutation.FFW))
        return this
    }

    toJSON() {
        return {
            network: this.network.toJSON()
        }
    }

    static FromJSON(json) {
        let brain = new Brain()
        brain.network = Neataptic.Network.fromJSON(json.network)
        return brain
    }
}

export default Brain;
