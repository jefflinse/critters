import _ from 'lodash';
import Config from '../Config';
import Creature from '../creatures/Creature';
import Vector from '../Vector';

class Simulation {

    constructor(universe) {
        this.universe = universe;
        
        this.population = [];

        this._refreshConfiguration();
        this.reset();
        this._generateRandomPopulation(this.maxPopulation);
    }

    nextGeneration() {
        let best = this.population.sort((a, b) => b.fitness - a.fitness);
        let numAllowedToLive = Math.floor(this.maxPopulation * this.reproductionPercentile);
        while (best.length > numAllowedToLive) {
            this.universe.onIndividualRemoved(best.pop());
        }

        this.reset();
        this.population = best;
        let numSurvivors = best.length, i = 0;
        while (best.length < this.maxPopulation) {
            let newIndividual = best[i % numSurvivors].clone()
            newIndividual.position = new Vector(_.random(0, this.universe.width), _.random(0, this.universe.height));
            this._addIndividual(newIndividual);
            i++;
        }
    }

    reset() {
        this.universe.setup(this.population);
    }

    tick(ticksPerSecond) {
        this.population.forEach(individual => individual.tick());
        this.universe.tick(ticksPerSecond);
    }

    _addIndividual(individual) {
        this.population.push(individual);
        this.universe.onIndividualAdded(individual);
    }

    _generateRandomPopulation(size) {
        this.reset();
        for (let i = 0; i < size; i++) {
            let creature = Creature.CreateRandom();
            creature.position = new Vector(_.random(0, this.universe.width), _.random(0, this.universe.height));
            this._addIndividual(creature);
        }
    }

    _refreshConfiguration() {
        this.maxPopulation = Config.Simulation.MaxPopulation;
        this.reproductionPercentile = Config.Simulation.ReproductionPercentile;
    }
}

export default Simulation;
