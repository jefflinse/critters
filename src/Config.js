import _ from 'lodash';

class Config {

    constructor() {
        _.merge(this, Config.Defaults);
    }

    static get Defaults() {
        return {
            Creature: {
                StartingParts: 1,
                Part: {
                    MaxSides: 12,
                    MinSides: 3,
                    Radius: 7,
                    FrictionAir: .45,
                    ShadowOffset: 2,
                },
            },
            Runner: {
                TicksPerSecond: 60,
                SecondsPerGeneration: 3,
            },
            Simulation: {
                MaxPopulation: 12,
                ReproductionPercentile: .3,
            },
            Universe: {
                BackgroundColor: '#C0C0C0',
            },
        };
    }
}

export default new Config();
