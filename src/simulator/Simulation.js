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

        // create next population
        let nextPopulation = [];

        // elitism (individuals who get to advance on as-is)
        let numElites = Math.floor(Config.Simulation.ElitismPercentile * this.population.length)
        for (let i = 0; i < numElites; i++) {
            nextPopulation.push(this.population[i].clone())
        }

        // reproduction (individuals who get to produce mutated offspring)
        let numReproducing = Math.floor(Config.Simulation.ReproductionPercentile * this.population.length)
        for (let i = 0; i < numReproducing; i++) {
            nextPopulation.push(this.population[i].clone().mutate());
        }

        // provenance (randomly generated individuals)
        let numRandom = this.population.length - numElites - numReproducing
        for (let i = 0; i < numRandom; i++) {
            nextPopulation.push(Creature.CreateRandom())
        }

        // remove all old
        while (this.population.length > 0) {
            this.universe.onIndividualRemoved(this.population.pop())
        }

        // add all new
        nextPopulation.forEach(i => {
            i.scatter(this.universe.width, this.universe.height)
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
