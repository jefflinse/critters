import ActivationFunctions from 'activation-functions';
import Neuron from "./Neuron";

class Network {

    constructor(numInputs, numOutputs) {
        this.layers = [[], [], []];
        this.inputs = this.layers[0];
        this.hidden = this.layers[1];
        this.outputs = this.layers[2];
        this.bias = _createBiasNeuron();

        for (let i = 0; i < numInputs; i++) {
            this.addInputNeuron();
        };

        for (let i = 0; i < numOutputs; i++) {
            this.addOutputNeuron();
        };
    }

    activate(inputValues) {
        for (let i = 0; i < inputValues.length; i++) {
            this.inputs[i].inputs[0].value = inputValues[i];
        }

        this.layers.forEach(layer => {
            layer.forEach(neuron => {
                neuron.activate();
            });
        });
    }

    addInputNeuron() {
        let neuron = new Neuron();
        neuron.activationFunction = ActivationFunctions.TanH;
        this.bias.projectTo(neuron, 1);
        neuron.attachInput({ value: 0, weight: 1 });
        this.inputs.push(neuron);
        return neuron;
    }

    addHiddenNeuron() {
        let neuron = new Neuron();
        neuron.activationFunction = ActivationFunctions.TanH;
        this.bias.projectTo(neuron, 1);
        this.hidden.push(neuron);
        return neuron;
    }

    addOutputNeuron() {
        let neuron = new Neuron();
        neuron.activationFunction = ActivationFunctions.TanH;
        this.bias.projectTo(neuron, 1);
        neuron.attachOutput({ value: 0, weight: 1 });
        this.outputs.push(neuron);
        return neuron;
    }

    addRandomConnection(chanceOfNewNeuron = 0) {

        let connection;
        if (Math.random() < chanceOfNewNeuron) {
            // add a new hidden neuron and connect it to either
            // a random input neuron or a random output neuron
            let hidden = addHiddenNeuron();
            if (Math.random() < .5) {
                let input = this.inputs[Math.floor(Math.random() * this.inputs.length)];
                input.projectTo(hidden);
            } else {
                let output = this.outputs[Math.floor(Math.random() * this.outputs.length)];
                hidden.projectTo(output);
            }
        } else {
            // choose a random neuron and projecet to a random neuron in the next layer;
            // if the first neuron is an output neuron, project to it from the previous layer
            let totalNeurons = this.inputs.length + this.hidden.length + this.outputs.length;
            let randomNeuronIndex = Math.floor(Math.random() * totalNeurons);
            let randomNeuron;
            if (randomNeuronIndex < this.inputs.length) {
                randomNeuron = this.inputs[randomNeuronIndex];
                let randomHiddenIndex = Math.floor(Math.random() * this.hidden.length);
                connection = randomNeuron.projectTo(this.hidden[randomHiddenIndex]);
            } else if (randomNeuronIndex < this.inputs.length + this.hidden.length) {
                randomNeuron = this.hidden[randomNeuronIndex - this.inputs.length];
                let randomOutputIndex = Math.floor(Math.random() * this.output.length);
                connection = randomNeuron.projectTo(this.output[randomOutputIndex]);
            } else {
                randomNeuron = this.output[randomNeuronIndex = this.inputs.length - this.hidden.length];
                let randomHiddenIndex = Math.floor(Math.random() * this.hidden.length);
                connection = this.hidden[randomHiddenIndex].projectTo(randomNeuron);
            }
        }

        return connection;
    }

    _createBiasNeuron() {
        let neuron = new Neuron();
        neuron.activationFunction = ActivationFunctions.Identity;
    }
}