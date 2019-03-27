class Simulator {

    constructor(simulation) {
        this.simulation = simulation;
        this.state = 'stopped';
        this.ticks = 1;
        this.ticksPerSecond = 60;
        this.secondsPerGeneration = 10;
        this.ticksPerGeneration = this.ticksPerSecond * this.secondsPerGeneration;
    }

    start() {
        this.clock = setInterval(this._tick.bind(this), 1000 / this.ticksPerSecond);
        this.state = 'running';
    }

    pause() {
        clearInterval(this.clock);
        this.state = 'paused';
    }

    reset() {
        this.pause();
        this.simulation.reset();
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
        this.simulation.tick(this.ticksPerSecond);
        this.ticks++;
        if (this.ticks > this.ticksPerGeneration) {
            this.simulation.nextGeneration();
            this.ticks = 1;
        }
    }
}

export default Simulator;
