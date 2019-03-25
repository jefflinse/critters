import _ from 'lodash';
import ActivationFunctions from 'activation-functions';
import Connection from './Connection';

const ACTIVATION_FUNCTIONS = [
    ActivationFunctions.Sigmoid,
    ActivationFunctions.Logistic,
    Math.tanh,
    ActivationFunctions.BinaryStep,
];

class Neuron {

    constructor() {
        this.inputs = [];
        this.outputs = [];
        this.activationFunction = this.assignRandomActivationFunction();
        this.value = 0;
        this.layer = undefined;
        this.ordinal = undefined;
    }

    assignRandomActivationFunction() {
        return _.sample(ACTIVATION_FUNCTIONS);
    }

    activate() {
        if (this.ordinal > 0) {
            this.value = this.inputs.reduce((total, connection) => total + (connection.value * connection.weight), 0);
        }
        
        this.value = this.activationFunction(this.value);
    }

    isProjectedTo(other) {
        return this.outputs.reduce((projected, output) => projected || output.to === other, false);
    }

    projectTo(other, weight = Math.random()) {
        let connection = new Connection(this, other, weight);
        this.outputs.push(connection);
        other.inputs.push(connection);
        return connection;
    }
}

export default Neuron;
