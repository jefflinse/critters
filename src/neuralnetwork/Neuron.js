import ActivationFunctions from 'activation-functions';

class Neuron {

    constructor() {
        this.inputs = [];
        this.outputs = [];
        this.availableActivationFunctions = [
            ActivationFunctions.Identity,
            ActivationFunctions.Sigmoid,
            ActivationFunctions.TanH,
            ActivationFunctions.BinaryStep,
        ];
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
        this.outputs.push(connection);
        other.inputs.push(connection);
        return connection;
    }

    activate() {
        let weightedSum = this.activationFunction(
            this.inputs.reduce((total, connection) =>
                total + connection.valueFn() * connection.weight, 0));
        
        this.outputs.forEach(connection => connection.value = weightedSum);
    }

    clone() {
        let neuron = new Neuron();
        neuron.inputs = this.inputs.map(input => {
            return { value: input.value, weight: input.weight }
        })
        neuron.activationFunction = this.activationFunction;
    }

    get ActivationFunctions() { return ActivationFunctions; }
}

export default Neuron;
