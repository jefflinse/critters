import _ from 'lodash'
import Matter from 'matter-js';

const Constraint = Matter.Constraint;

let nextMuscleId = 1;
class Muscle {

    constructor(from, to) {
        this.id = nextMuscleId++;
        this.from = from;
        this.to = to;

        let length = this.from.position.distanceBetween(this.to.position);
        this.physics = Constraint.create({
            bodyA: from.physics,
            bodyB: to.physics,
            length: length,
            stiffness: .2,
            damping: .05,
        });

        this.triggers = [
            ((value) => this.physics.stiffness = 
                Math.min(Math.max(this.physics.stiffness + (value * .01), .01), .5)).bind(this),
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
