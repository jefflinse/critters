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
        this.layer = layer || 'bias';
        this.inputs = [];
        this.outputs = [];
        this.activationFunction = ActivationFunctions.Identity;
        this.value = 0;
    }

    projectTo(other, weight = Math.random()) {
        console.log('P(N->N)');
        let connection = new Connection(this, other, weight);
        this.outputs.push(connection);
        other.inputs.push(connection);
        return connection;
    }

    assignRandomActivationFunction() {
        return _.sample(ACTIVATION_FUNCTIONS);
    }

    activate() {
        if (this.inputs.length > 0) {
            this.value = this.inputs.reduce((total, connection) => total + (connection.value * connection.weight), 0);
        }
        
        this.value = this.activationFunction(this.value);
    }

    toString() {
        let layerOrdinal = 'b';
        let ordinal = 'b';
        if (this.layer !== 'bias') {
            layerOrdinal = this.layer.ordinal;
            ordinal = this.ordinal;
        }
        return 'Neuron(L'+ layerOrdinal + 'N' + ordinal +
            ', ' + this.value + ' (' + this.inputs.length + '|' + this.outputs.length + ')';
    }

    get ActivationFunctions() { return ActivationFunctions; }
}

export default Neuron;
