import _ from 'lodash';

class Config {

    constructor() {
        _.merge(this, Config.Defaults);
    }

    static get Defaults() {
        return {
            Brain: {
                Type: 'dynamic', // or static
            },
            ChanceOf: {
                ActivationFunctionChange: .5,
                ConnectionWeightChange: .5,
                ConnectionGeneration: .5,
                MuscleGeneration: .5,
                NeuronGeneration: .5,
                PartGeneration: .5,
            },
            Creature: {
                AngularMaxSpeed: Math.PI / 3,
                LinearMaxSpeed: 5,
                StartingParts: 1,
                Part: {
                    MaxSides: 12,
                    Radius: 7,
                },
            },
            Fluxuation: {
                RandomConnectionWeightChange: () => Config.PlusOrMinusMax(.5),
            },
            Runner: {
                TicksPerSecond: 60,
                SecondsPerGeneration: 5,
            },
            Simulation: {
                MaxPopulation: 12,
                ReproductionPercentile: .3,
            },
            Universe: {
                BackgroundColor: '#444444',
            },
        };
    }

    static PlusOrMinusMax(value) {
        return (Math.random() * value * 2) - value;
    }
}

export default new Config();
