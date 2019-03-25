import _ from 'lodash'
import Matter from 'matter-js';
import Vector from '../Vector';

const Constraint = Matter.Constraint;

class Muscle {

    constructor(from, to) {
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
}

export default Muscle;
