import _ from 'lodash';
import AF from 'activation-functions';
import Connection from './Connection';

const ActivationFuntionMap = {
    // 'binarystep': AF.BinaryStep,
    'logistic': AF.Logistic,
    'sigmoid': AF.Sigmoid,
    'softsign': AF.SoftSign,
    // 'tanh': Math.tanh,
};

let nextNeuronId = 1;
class Neuron {

    constructor(options) {
        options = options || {};
        this.id = options.id || nextNeuronId++;
        this.inputs = [];
        this.outputs = [];
        this.activationFunction = options.activationFunction || this.getRandomActivationFunction();
        this.value = 0;
        this.layer = options.layer || undefined;
        this.ordinal = undefined;
    }

    getRandomActivationFunction() {
        const keys = Object.keys(ActivationFuntionMap);
        return ActivationFuntionMap[_.sample(keys)];
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
            value: preserveValues ? this.value : 0,
            af: stringFromActivationFunction(this.activationFunction),
        };

        function stringFromActivationFunction(af) {
            for (let key in ActivationFuntionMap) {
                if (ActivationFuntionMap[key] === af) {
                    return key;
                }
            }

            return 'identity';
        }
    }

    static ActivationFunctionFromString(afString) {
        return ActivationFuntionMap[afString];
    }

    static FromJSON(json) {
        return new Neuron({
            id: json.id,
            activationFunction: this.ActivationFunctionFromString(json.af),
        });
    }
}

export default Neuron;
