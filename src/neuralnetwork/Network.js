import ActivationFunctions from 'activation-functions';
import Layer from './Layer'
import Neuron from "./Neuron";

class Network {

    constructor(numInputs, numOutputs) {
        this.inputs = new Layer()
        this.hidden = new Layer();
        this.outputs = new Layer();
        this.layers = [this.inputs, this.hidden, this.outputs]
        this.layers.forEach((layer, index) => layer.ordinal = index);
        this.bias = this._createBiasNeuron();

        for (let i = 0; i < numInputs; i++) {
            this.addInputNeuron();
        };

        for (let i = 0; i < numOutputs; i++) {
            this.addOutputNeuron();
        };
    }

    get size() {
        return this.inputs.size + this.hidden.size + this.outputs.size;
    }

    activate(inputValues) {
        for (let i = 0; i < inputValues.length; i++) {
            this.inputs.neurons[i].inputs[0].value = inputValues[i];
        }

        this.layers.forEach(layer => {
            layer.activate();
        });

        return this.outputs.neurons.map(outputNeuron => outputNeuron.outputs[0].value);
    }

    addInputNeuron() {
        let neuron = this.inputs.addNeuron();
        this.bias.projectTo(neuron, 1);
        neuron.attachInput({ value: 0, weight: 1 });
        return neuron;
    }

    addHiddenNeuron() {
        let neuron = this.hidden.addNeuron();
        this.bias.projectTo(neuron, 1);
        return neuron;
    }

    addOutputNeuron() {
        let neuron = this.outputs.addNeuron();
        this.bias.projectTo(neuron, 1);
        neuron.attachOutput({ value: 0, weight: 1 });
        return neuron;
    }

    addRandomConnection(chanceOfNewNeuron = 0) {

        let connection;
        if (Math.random() < chanceOfNewNeuron) {
            // add a new hidden neuron and connect it to either
            // a random input neuron or a random output neuron
            let hidden = this.addHiddenNeuron();
            if (Math.random() < .5) {
                let input = this.inputs.chooseRandomNeuron();
                input.projectTo(hidden);
            } else {
                let output = this.outputs.chooseRandomNeuron();
                hidden.projectTo(output);
            }
        } else {
            // choose any neuron at random, then choose a neuron from any other layer and connect them
            let layer = this.chooseRandomLayer(true);
            let otherLayer = this.chooseRandomLayer(true, layer.ordinal);
            let neuron = layer.chooseRandomNeuron();
            let otherNeuron = otherLayer.chooseRandomNeuron();

            if (otherLayer.ordinal > layer.ordinal) {
                neuron.projectTo(otherNeuron);
            } else {
                otherNeuron.projectTo(neuron);
            }
        }

        return connection;
    }

    chooseRandomLayer(mustNotBeEmpty, exclude) {
        let layer = this.layers[Math.floor(Math.random() * this.layers.length)];

        if ((mustNotBeEmpty === true && layer.size === 0) ||
            (exclude !== undefined && layer.ordinal === exclude)) {

            return this.chooseRandomLayer(mustNotBeEmpty, exclude);
        }

        return layer;
    }

    randomize(numConnections) {
        for (let i = 0; i < numConnections; i++) {
            this.addRandomConnection(.5);
        }

        return this;
    }

    _createBiasNeuron() {
        let neuron = new Neuron();
        neuron.activationFunction = ActivationFunctions.Sigmoid;
        return neuron;
    }
}

export default Network;
