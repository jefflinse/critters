import ActivationFunctions from 'activation-functions';
import Neuron from './Neuron';

class Layer {

    constructor() {
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
            neuron = new Neuron();
            neuron.assignRandomActivationFunction();
        }

        this.neurons.push(neuron);
        return neuron;
    }

    chooseRandomNeuron() {
        return this.size > 0 ? this.neuronAt(Math.floor(Math.random() * this.size)) : undefined;
    }

    neuronAt(index) {
        return this.neurons[index];
    }

    projectTo(layer) {
        this.neurons.forEach(neuron => {
            layer.neurons.forEach(otherNeuron => {
                neuron.projectTo(otherNeuron);
            });
        });
    }
}

export default Layer;
