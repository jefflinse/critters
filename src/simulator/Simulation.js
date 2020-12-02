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
        this.population.sort((a, b) => b.fitness - a.fitness);
        let best = this.population[0];

        // create next population
        let nextPopulation = [];
        nextPopulation.push(best.clone().scatter(this.universe.width, this.universe.height));
        nextPopulation.push(best.clone().mutate().scatter(this.universe.width, this.universe.height));
        for (let i = 2; i < this.population.length; i++) {
            nextPopulation.push(this.population[i].clone().mutate().scatter(this.universe.width, this.universe.height));
        }

        // remove all old
        while (this.population.length > 0) {
            this.universe.onIndividualRemoved(this.population.pop())
        }

        // add all new
        nextPopulation.forEach(i => {
            this._addIndividual(i)
        })

        this.reset();
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
