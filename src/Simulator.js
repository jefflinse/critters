class Simulator {
    constructor(universe) {
        this.universe = universe;
        this.state = 'stopped';
    }

    start() {
        this.clock = setInterval(this._tick.bind(this), 10);
        this.state = 'running';
    }

    pause() {
        clearInterval(this.clock);
        this.state = 'paused';
    }

    toggle() {
        if (this.state === 'stopped' || this.state === 'paused') {
            this.start();
        } else {
            this.pause();
        }
    }

    reset() {
        this.pause();
        this.universe.reset();
        this.state = 'stopped';
    }

    _tick() {
        this.universe.tick();
    }
}

export default Simulator;
