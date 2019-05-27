import _ from 'lodash';
import ActivationFunctions from 'activation-functions';
import Neuron from './Neuron';

class Layer {

    constructor(bias) {
        this.neurons = [];
        this.bias = bias;
        this.ordinal = undefined;
    }

    get inputs() {
        return this.neurons.reduce((allInputs, neuron) => allInputs.concat(neuron.inputs), []);
    }

    get size() {
        return this.neurons.length;
    }

    activate() {
        this.neurons.forEach(neuron => neuron.activate());
    }

    addNeuron() {
        let neuron = new Neuron({
            layer: this,
        });

        if (this.ordinal === 0) {
            neuron.activationFunction = ActivationFunctions.SoftSign;
        }
        else if (this.bias !== undefined) {
            this.bias.projectTo(neuron);
        }
        
        this.neurons.push(neuron);
        this._refreshNeuronOrdinals();
        return neuron;
    }

    chooseRandomNeuron() {
        return this.size > 0 ? _.sample(this.neurons) : undefined;
    }

    projectTo(layer) {
        if (this.size === 0 || layer.size === 0) {
            return;
        }

        this.neurons.forEach(neuron => {
            layer.neurons.forEach(otherNeuron => {
                neuron.projectTo(otherNeuron);
            });
        });
    }

    toJSON() {
        return {
            neurons: this.neurons.map(neuron => neuron.id),
        }
    }

    _refreshNeuronOrdinals() {
        this.neurons.forEach((neuron, index) => neuron.ordinal = index);
    }

    static FromJSON(json, ordinal, neuronMap) {
        // heuristic: we assume the bias is Neuron with id 1
        let layer = new Layer(neuronMap[1]);
        layer.ordinal = ordinal;
        json.neurons.forEach(neuronId => {
            let neuron = neuronMap[neuronId];
            neuron.layer = layer;
            layer.neurons.push(neuronMap[neuronId]);
        });

        layer._refreshNeuronOrdinals();

        return layer;
    }
}

export default Layer;
