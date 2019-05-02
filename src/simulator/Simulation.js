import _ from 'lodash';
import Creature from '../creatures/Creature';
import Vector from '../Vector';

class Simulation {

    constructor(universe) {
        this.universe = universe;
        this.population = {
            alive: []
        };

        this.maxPopulation = 25;
        this.reproductionPercentile = .5;

        this.reset();
        this._generateRandomPopulation(this.maxPopulation);
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
        let individual = cloneFrom !== undefined ? cloneFrom.clone() : Creature.CreateRandom();
        let position = new Vector(_.random(0, this.universe.width), _.random(0, this.universe.height));
        individual.setPosition(position);

        this.population.alive.push(individual);
        this.universe.onIndividualAdded(individual);
    }

    _generateRandomPopulation(size) {
        this.reset();
        for (let i = 0; i < size; i++) {
            this._addIndividual();
        }
    }
}

export default Simulation;
