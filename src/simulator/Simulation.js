import Creature from '../creatures/Creature';
import Vector from '../Vector';

class Simulation {

    constructor(universe) {
        this.universe = universe;
        this.population = {
            alive: []
        };

        this.maxPopulation = 10;
        this.reproductionPercentile = .5;

        this.reset();
        this._generateRandomPopulation(10);
        this.universe.setup(this.population);
    }

    nextGeneration() {
        let best = this.population.alive.sort((a, b) => a.fitness - b.fitness);
        let numAllowedToLive = Math.floor(this.maxPopulation * this.reproductionPercentile);
        while (best.length > numAllowedToLive) {
            best.pop();
        }

        this.reset();
        this.population.alive = best;
        while (best.length < this.maxPopulation) {
            this._addIndividual();
        }
    }

    reset() {
        this.population = {
            alive: [],
        };
    }

    tick(ticksPerSecond) {
        this.population.alive.forEach(individual => individual.tick());
        this.universe.tick(ticksPerSecond);
    }

    _addIndividual() {
        let position = new Vector(
            this.universe.width * 2 / 3,
            this.universe.height / 2);
        this.population.alive.push(new Creature(position, 10));
    }

    _generateRandomPopulation(size) {
        this.reset();
        for (let i = 0; i < size; i++) {
            this._addIndividual();
        }
    }
}

export default Simulation;
