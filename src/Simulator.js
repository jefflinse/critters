class Simulator {

    constructor(universe) {
        this.universe = universe;
        this.state = 'stopped';
        this.ticks = 0;
        this.generation = 0;
        this.ticksPerGeneration = 1000;
    }

    start() {
        this.clock = setInterval(this._tick.bind(this), 100);
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
        this.ticks++;

        if (this.ticks > this.ticksPerGeneration) {
            this._newGeneration();
            this.ticks = 0;
            this.generation++;
        }
    }

    _newGeneration() {
        let newCreatures = [];
        this.creatures.alive.forEach(livingCreature => {
            newCreatures.push(livingCreature.clone());
        });
        this.creatures.alive.length = 0;
        this.creatures.dead.length = 0;
        this.creatures.alive = newCreatures;
    }
}

export default Simulator;
