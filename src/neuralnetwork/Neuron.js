import _ from 'lodash';
import ActivationFunctions from 'activation-functions';
import Connection from './Connection';

const ACTIVATION_FUNCTIONS = [
    //ActivationFunctions.Identity,
    ActivationFunctions.Sigmoid,
    ActivationFunctions.Logistic,
    //Math.tanh,
    //ActivationFunctions.BinaryStep,
];

class Neuron {

    constructor(layer) {
        this.ordinal = undefined;
        this.layer = layer;
        this.inputs = [];
        this.outputs = [];
        this.activationFunction = ActivationFunctions.Identity;
        this.value = 0;
    }

    projectTo(other, value = 0, weight = Math.random()) {
        if (this.isConnectedTo(other)) {
            return undefined;
        }

        let connection = new Connection(this, other, value, weight);
        this.outputs.push(connection);
        other.inputs.push(connection);
        return connection;
    }

    isConnectedTo(other) {
        return (this.inputs.length > 0 && this.inputs.reduce((found, input) => found = found || input.from === other))
            || (this.outputs.length > 0 && this.outputs.reduce((found, output) => found = found || output.to === other));
    }

    assignRandomActivationFunction() {
        return _.sample(ACTIVATION_FUNCTIONS);
    }

    activate() {
        if (this.inputs.length > 0) {
            this.value = this.inputs.reduce((total, connection) => total + (connection.value * connection.weight), 0);
        }
        
        this.value = this.activationFunction(this.value);
        this.outputs.forEach(connection => connection.value = this.value);
    }

    get ActivationFunctions() { return ActivationFunctions; }
}

export default Neuron;
