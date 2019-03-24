import _ from 'lodash';
import Neuron from './Neuron';

class Layer {

    constructor(ordinal) {
        this.ordinal = ordinal;
        this.neurons = [];
    }

    get size() {
        return this.neurons.length;
    }

    activate() {
        this.neurons.forEach(neuron => neuron.activate());
    }

    addNeuron(neuron) {
        if (neuron === undefined) {
            neuron = new Neuron(this);
            neuron.assignRandomActivationFunction();
        }

        this.neurons.push(neuron);
        this.neurons.forEach((neuron, index) => neuron.ordinal = index);
        return neuron;
    }

    chooseRandomNeuron() {
        return this.size > 0 ? _.sample(this.neurons) : undefined;
    }

    neuronAt(index) {
        return this.neurons[index];
    }

    projectTo(layer) {
        if (this.size === 0 || layer.size === 0) {
            return;
        }

        console.log('P{L' + this.ordinal + '(' + this.size + ')->L' + layer.ordinal + '(' + layer.size + ')}');
        this.neurons.forEach(neuron => {
            layer.neurons.forEach(otherNeuron => {
                neuron.projectTo(otherNeuron);
            });
        });
    }
}

export default Layer;
