import ActivationFunctions from 'activation-functions';
import Neuron from "./Neuron";

class Network {

    constructor(numInputs, numOutputs, random = false) {
        this.layers = [[], [], []];
        this.inputs = this.layers[0];
        this.hidden = this.layers[1];
        this.outputs = this.layers[2];
        this.bias = this._createBiasNeuron();

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

        return this.outputs.map(output => output.outputs[0].value);
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
            let hidden = this.addHiddenNeuron();
            if (Math.random() < .5) {
                let input = this.inputs[Math.floor(Math.random() * this.inputs.length)];
                input.projectTo(hidden);
            } else {
                let output = this.outputs[Math.floor(Math.random() * this.outputs.length)];
                hidden.projectTo(output);
            }
        } else {
            // choose any neuron at random, then choose a neuron from any other layer and connect them
            let totalNeurons = this.inputs.length + this.hidden.length + this.outputs.length;
            let randomNeuronIndex = Math.floor(Math.random() * totalNeurons);
            let randomNeuron;
            let otherNeuron;
            if (randomNeuronIndex < this.inputs.length) {
                randomNeuron = this.inputs[randomNeuronIndex];
                if (this.hidden.length > 0 && Math.random() < .5) {
                    otherNeuron = this.hidden[Math.floor(Math.random() * this.hidden.length)];
                } else {
                    otherNeuron = this.outputs[Math.floor(Math.random() * this.outputs.length)];
                }
                connection = randomNeuron.projectTo(otherNeuron);
            } else if (this.hidden.length > 0 && randomNeuronIndex < this.inputs.length + this.hidden.length) {
                randomNeuron = this.hidden[randomNeuronIndex - this.inputs.length];
                if (Math.random() < .5) {
                    otherNeuron = this.inputs[Math.floor(Math.random() * this.inputs.length)];
                    connection = otherNeuron.projectTo(randomNeuron);
                } else {
                    otherNeuron = this.outputs[Math.floor(Math.random() * this.outputs.length)];
                    connection = randomNeuron.projectTo(otherNeuron);
                }
            } else {
                randomNeuron = this.outputs[randomNeuronIndex - this.inputs.length - this.hidden.length];
                if (this.hidden.length > 0 && Math.random() < .5) {
                    otherNeuron = this.hidden[Math.floor(Math.random() * this.hidden.length)];
                } else {
                    otherNeuron = this.inputs[Math.floor(Math.random() * this.inputs.length)];
                }
                connection = otherNeuron.projectTo(randomNeuron);
            }
        }

        return connection;
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
