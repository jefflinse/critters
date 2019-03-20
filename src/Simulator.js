class Simulator {

    constructor(universe) {
        this.universe = universe;
        this.state = 'stopped';
    }

    start() {
        this.clock = setInterval(this._tick.bind(this), 100);
        this.state = 'running';
    }

    pause() {
        clearInterval(this.clock);
        this.state = 'paused';
    }

    reset() {
        this.pause();
        this.universe.reset();
        this.state = 'stopped';
    }

    toggle() {
        if (this.state === 'stopped' || this.state === 'paused') {
            this.start();
        } else {
            this.pause();
        }
    }

    _tick() {
        this.universe.tick();
    }
}

export default Simulator;
