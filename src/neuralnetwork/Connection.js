let nextConnectionId = 1;
class Connection {

    constructor(from, to, weight) {
        this.id = nextConnectionId++;
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
}

export default Connection;
