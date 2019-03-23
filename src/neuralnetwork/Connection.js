class Connection {

    constructor(from, to, weight, value) {
        this.from = from;
        this.to = to;
        this.weight = weight;
        this._value = value;
    }

    get value() {
        return this._value || this.from.value;
    }
}

export default Connection;
