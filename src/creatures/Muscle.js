import _ from 'lodash'
import Matter from 'matter-js';
import Vector from '../Vector';

const Constraint = Matter.Constraint;

let nextMuscleId = 1;
class Muscle {

    constructor(from, to, options) {
        options = options || {};
        this.id = options.id || nextMuscleId++;
        this.from = from;
        this.to = to;
        this.length = options.length || 20;

        // heuristic: positions are always random
        to.setRelativePositionFrom(from, Vector.RandomUnit().setMagnitude(this.length));

        this.physics = Constraint.create({
            bodyA: from.physics,
            bodyB: to.physics,
            length: this.length,
            stiffness: .2,
            damping: .05,
        });

        this.triggers = [
            (value) => this.physics.stiffness =  _.clamp(this.physics.stiffness + (value * .01), .01, .5)
        ];
    }

    render(graphics) {
        graphics.drawLine(this.from.position, this.to.position, {
            lineWidth: 1 + (this.physics.stiffness * 4),
            strokeStyle: '#AAAAFF'
        });
    }

    toJSON() {
        return {
            id: this.id,
            from: this.from.id,
            to: this.to.id,
            length: this.physics.length,
        }
    }
}

export default Muscle;
