import _ from 'lodash';
import AF from 'activation-functions';
import Connection from './Connection';

const ACTIVATION_FUNCTIONS = [
    AF.Sigmoid,
    AF.Logistic,
    AF.SoftSign,
    // Math.tanh,
    // ActivationFunctions.BinaryStep,
];

let nextNeuronId = 1;
class Neuron {

    constructor() {
        this.id = nextNeuronId++;
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
        if (this.layer === undefined || this.layer.ordinal > 0) {
            this.value = this.inputs.reduce((total, connection) => total + (connection.value * connection.weight), 0);
        }
        
        this.value = this.activationFunction(this.value);
    }

    isProjectedTo(other) {
        return this.outputs.reduce((projected, output) => projected || output.to === other, false);
    }

    projectTo(other, weight = _.random(-1, 1, true)) {
        let connection = new Connection(this, other, weight);
        this.outputs.push(connection);
        other.inputs.push(connection);
        return connection;
    }

    toJSON(preserveValues = false) {
        return {
            id: this.id,
            inputs: this.inputs.map(input => input.id),
            outputs: this.outputs.map(output => output.id),
            value: preserveValues ? this.value : 0,
            layer: this.layer !== undefined ? this.layer.ordinal : -1,
            ordinal: this.ordinal,
        }
    }
}

export default Neuron;
