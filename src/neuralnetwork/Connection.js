class Connection {

    constructor(from, to, weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }

    get value() {
        return this.from.value;
    }
}

export default Connection;
