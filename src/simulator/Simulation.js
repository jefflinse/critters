import _ from 'lodash';
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
    }

    nextGeneration() {
        let best = this.population.alive.sort((a, b) => a.fitness - b.fitness);
        let numAllowedToLive = Math.floor(this.maxPopulation * this.reproductionPercentile);
        while (best.length > numAllowedToLive) {
            let removed = best.pop();
            this.universe.onIndividualRemoved(removed);
        }

        this.reset();
        this.population.alive = best;
        let numSurvivors = best.length, i = 0;
        while (best.length < this.maxPopulation) {
            this._addIndividual(best[i % numSurvivors]);
            i++;
        }
    }

    reset() {
        this.population = {
            alive: [],
        };

        this.universe.setup(this.population);
    }

    tick(ticksPerSecond) {
        this.population.alive.forEach(individual => individual.tick());
        this.universe.tick(ticksPerSecond);
    }

    _addIndividual(cloneFrom) {
        let position = new Vector(_.random(0, this.universe.width), _.random(0, this.universe.height));
        let creature = cloneFrom !== undefined ? cloneFrom.clone() : new Creature(position, 10);
        this.population.alive.push(creature);
        this.universe.onIndividualAdded(creature);
    }

    _generateRandomPopulation(size) {
        this.reset();
        for (let i = 0; i < size; i++) {
            this._addIndividual();
        }
    }
}

export default Simulation;
