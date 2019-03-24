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

    toString() {
        return 'NN-Connection{' + this.from.toString() + '->' + this.to.toString() + 
            ',w:' + this.weight + ',v:' + this.value + '}';
    }
}

export default Connection;
