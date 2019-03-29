class Connection {

    constructor(from, to, weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }

    get value() {
        return this.from.value;
    }

    toJSON() {
        return {
            from: this.from.id,
            to: this.to.id,
            weight: this.weight,
        };
    }

    static FromJSON(json, neuronMap) {
        let from = neuronMap[json.from];
        let to = neuronMap[json.to];
        let connection = new Connection(from, to, json.weight);
        from.outputs.push(connection);
        to.inputs.push(connection);

        return connection;
    }
}

export default Connection;
