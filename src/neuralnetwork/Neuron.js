import ActivationFunctions from 'activation-functions';

const ACTIVATION_FUNCTIONS = [
    ActivationFunctions.Identity,
    ActivationFunctions.Sigmoid,
    Math.tanh,
    ActivationFunctions.BinaryStep,
];

class Neuron {

    constructor() {
        this.inputs = [];
        this.outputs = [];
        this.activationFunction = ActivationFunctions.Identity;
    }

    attachInput(input) {
        this.inputs.push(input);
    }

    attachOutput(output) {
        this.outputs.push(output);
    }

    projectTo(other, value = 0, weight = Math.random()) {
        let connection = { value: value, weight: weight };
        this.attachOutput(connection);
        other.attachInput(connection);
        return connection;
    }

    assignRandomActivationFunction() {
        return ACTIVATION_FUNCTIONS[Math.floor(Math.random() * ACTIVATION_FUNCTIONS.length)];
    }

    activate() {
        let weightedSum = this.inputs.reduce((total, connection) =>
            total + (connection.value * connection.weight), 0);
        this.value = this.activationFunction(weightedSum);
        console.log("WS: " + weightedSum + " -> " + this.value);
        this.outputs.forEach(connection => connection.value = this.value);
    }

    get ActivationFunctions() { return ActivationFunctions; }
}

export default Neuron;
