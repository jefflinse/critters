import _ from 'lodash';

class Config {

    constructor() {
        _.merge(this, Config.Defaults);
    }

    static get Defaults() {
        return {
            Creature: {
                MaxParts: 5,
                ChanceOf: {
                    BrainMutation: .2,
                    PartGain: .2,       // always spawn a part with exactly one connecting muscle
                    PartLoss: .2,           // also causes all connected muscles to be lost
                    MuscleGain: .2,     // no-op if the graph is already connected
                    MuscleLoss: .2,         // can also result in loss of part if only connection
                },
                Render: {
                    ShadowOffset: 2,
                },
            },
            Part: {
                MinRadius: 5,           // parts are always circles
                MaxRadius: 10,          //
                MinSensors: 0,
                MaxSensors: 3,
                MinTriggers: 0,
                MaxTriggers: 3,
            },
            Muscle: {
                MinLength: 10,          // muscles are always lines
                MaxLength: 20,          //
                MinSensors: 0,
                MaxSensors: 3,
                MinTriggers: 0,
                MaxTriggers: 3,
            },
            Runner: {
                TicksPerSecond: 60,
                SecondsPerGeneration: 2,
            },
            Simulation: {
                MaxPopulation: 12,
                ReproductionPercentile: .3,
            },
            Universe: {
                BackgroundColor: '#EEEEEE',
            },
        };
    }
}

export default new Config();
