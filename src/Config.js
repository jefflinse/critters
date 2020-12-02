import _ from 'lodash';

class Config {

    constructor() {
        _.merge(this, Config.Defaults);
    }

    static get Defaults() {
        return {
            Creature: {
                MinStartingParts: 2,
                MaxStartingParts: 5,
                MaxParts: 5,
                ChanceOf: {
                    BrainMutation: .25,
                    PartGain: .05,           // always spawn a part with exactly one connecting muscle
                    PartLoss: .05,           // also causes all connected muscles to be lost
                    MuscleGain: .05,         // no-op if the graph is already connected
                    MuscleLoss: .05,         // can also result in loss of part if only connection
                },
            },
            Part: {
                MinRadius: 5,           // parts are always circles
                MaxRadius: 10,          //
                MinSensors: 0,
                MaxSensors: 3,
                MinTriggers: 0,
                MaxTriggers: 3,
                Render: {
                    ShadowOffset: 2,
                },
            },
            Muscle: {
                MinSensors: 0,
                MaxSensors: 3,
                MinTriggers: 0,
                MaxTriggers: 3,
            },
            Runner: {
                TicksPerSecond: 60,
                SecondsPerGeneration: 3,
            },
            Simulation: {
                MaxPopulation: 16,
                ElitismPercentile: .25,
                ReproductionPercentile: .5,
            },
            Universe: {
                BackgroundColor: '#EEEEEE',
            },
        };
    }
}

export default new Config();
