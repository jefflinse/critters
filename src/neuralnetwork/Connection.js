class Connection {

    constructor(from, to, weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }

    get value() {
        return this.from.value;
    }

    toString() {
        return 'NN-Connection{' + this.from.toString() + '->' + this.to.toString() + 
            ',w:' + this.weight + ',v:' + this.value + '}';
    }
}

export default Connection;
