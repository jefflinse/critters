class Connection {

    constructor(from, to, weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }

    setTopology(fromLayer, toLayer, fromNeuron, toNeuron) {
        this.topology = {
            from: {
                layer: fromLayer,
                neuron: fromNeuron,
            },
            to : {
                layer: toLayer,
                neuron: toNeuron,
            }
        }
    }
}

export default Connection;
