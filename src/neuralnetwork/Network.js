import _ from 'lodash';
import ActivationFunctions from 'activation-functions';
import Layer from './Layer'
import Neuron from './Neuron';
import Vector from '../Vector';

class Network {

    constructor(numInputs, numOutputs) {
        this.inputs = new Layer(0)
        this.hidden = new Layer(1);
        this.outputs = new Layer(2);
        this.layers = [this.inputs, this.hidden, this.outputs];
        this.connections = [];
        // this.bias = this._createBiasNeuron();

        for (let i = 0; i < numInputs; i++) {
            this.addInputNeuron();
        };

        let numHidden = 2;
        for (let i = 0; i < numHidden; i++) {
            this.addHiddenNeuron();
        };

        for (let i = 0; i < numOutputs; i++) {
            this.addOutputNeuron();
        };
    }

    get size() {
        return this.inputs.size + this.hidden.size + this.outputs.size;
    }

    activate(inputValues) {
        if (inputValues.length !== this.inputs.size) {
            throw new Error('mismatched number of NN input values (expected ' + 
                this.inputs.size + ', got ' + inputValues.length + ')');
        }
        
        for (let i = 0; i < inputValues.length; i++) {
            this.inputs.neurons[i].value = inputValues[i];
        }

        this.layers.forEach(layer => {
            layer.activate();
        });

        return this.outputs.neurons.map(outputNeuron => outputNeuron.value);
    }

    addInputNeuron() {
        let neuron = this.inputs.addNeuron();
        // this.bias.projectTo(neuron, 1);
        // this.updateConnectionsCache();
        return neuron;
    }

    addHiddenNeuron() {
        let neuron = this.hidden.addNeuron();
        // this.bias.projectTo(neuron, 1);
        // this.updateConnectionsCache();
        return neuron;
    }

    addOutputNeuron() {
        let neuron = this.outputs.addNeuron();
        // this.bias.projectTo(neuron, 1);
        // this.updateConnectionsCache();
        return neuron;
    }

    fullyConnect() {
        for (let i = 0; i < this.layers.length - 1; i++) {
            this.layers[i].projectTo(this.layers[i+1]);
        }

        this.updateConnectionsCache();
        return this;
    }

    addRandomConnection(chanceOfNewNeuron = 0) {

        let connection;
        let from;
        let to;
        if (Math.random() < chanceOfNewNeuron) {
            // add a new hidden neuron and connect it to either
            // a random input neuron or a random output neuron
            let hidden = this.addHiddenNeuron();
            if (Math.random() < .5) {
                from = this.inputs.chooseRandomNeuron();
                to = hidden;
            } else {
                from = hidden;
                to = this.outputs.chooseRandomNeuron();
            }
        } else {
            // choose any neuron at random, then choose a neuron from any other layer and connect them
            let layer = this.chooseRandomLayer(true);
            let otherLayer = this.chooseRandomLayer(true, [layer.ordinal]);
            let neuron = layer.chooseRandomNeuron();
            let otherNeuron = otherLayer.chooseRandomNeuron();

            if (otherLayer.ordinal > layer.ordinal) {
                from = neuron;
                to = otherNeuron;
            } else {
                from = otherNeuron;
                to = neuron;
            }
        }

        connection = from.projectTo(to);
        this.updateConnectionsCache();

        return connection;
    }

    chooseRandomLayer(mustNotBeEmpty, exclusions = []) {
        let searchSpace = this.layers;

        if (mustNotBeEmpty) {
            searchSpace = searchSpace.filter(layer => layer.size > 0);
        }

        if (exclusions !== undefined) {
            searchSpace = searchSpace.filter(layer => exclusions.indexOf(layer.ordinal) < 0);
        }

        return _.sample(searchSpace);
    }

    randomize(numConnections) {
        for (let i = 0; i < numConnections; i++) {
            this.addRandomConnection(.5);
        }

        return this;
    }

    updateConnectionsCache() {
        this.connections = this.layers.reduce(
            (layerConnections, layer) => layerConnections.concat(layer.neurons.reduce(
            (neuronConnections, neuron) => neuronConnections.concat(neuron.outputs), [])), []);
        console.log('updated connections cache (' + this.connections.length + ')');
    }

    render(graphics, position, nodeRadius, nodeDistance, layerDistance, connectionLineWeight) {
        let currentPosition = new Vector(position.x + nodeRadius, position.y + nodeRadius);

        for (let l = 0; l < this.layers.length; l++) {
            for (let n = 0; n < this.layers[l].size; n++) {
                graphics.drawCircle(currentPosition, nodeRadius, {
                    lineWidth: 2,
                    strokeStyle: "#FFFFFF",
                });
                graphics.writeText(currentPosition.x - 5, currentPosition.y + 5,
                    Math.floor(this.layers[l].neuronAt(n).value));
                currentPosition.y += 2 * nodeRadius + nodeDistance;
            }
            currentPosition.y = position.y + nodeRadius;
            currentPosition.x += 2 * nodeRadius + layerDistance;
        }

        for (let c = 0; c < this.connections.length; c++) {
            let fromX = this.connections[c].from.layer.ordinal;
            let fromY = this.connections[c].from.ordinal;
            let toX = this.connections[c].to.layer.ordinal;
            let toY = this.connections[c].to.ordinal;

            let pos = new Vector(position.x, position.y);
            pos.add(new Vector(1, 1).setMagnitude(nodeRadius));
            let from = pos.copy().add(new Vector(
                (2 * nodeRadius + layerDistance) * fromX,
                (2 * nodeRadius + nodeDistance) * fromY));
            let to = pos.copy().add(new Vector(
                (2 * nodeRadius + layerDistance) * toX,
                (2 * nodeRadius + nodeDistance) * toY));
            graphics.drawLine(from, to, {
                lineWidth: this.connections[c].weight * connectionLineWeight,
                strokeStyle: '#FFFFFF',
            });
        }
    }

    _createBiasNeuron() {
        let neuron = new Neuron();
        neuron.activationFunction = ActivationFunctions.Sigmoid;
        return neuron;
    }
}

export default Network;
