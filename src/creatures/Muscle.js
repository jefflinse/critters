import _ from 'lodash'
import Matter from 'matter-js';

const Constraint = Matter.Constraint;

class Muscle {

    constructor(from, to) {
        this.from = from;
        this.to = to;

        this.physics = Constraint.create({
            bodyA: from.physics,
            bodyB: to.physics,
            length: this.from.radius + this.to.radius * 2,
            stiffness: .5,
            damping: .5,
        });

        this.triggers = [
            ((value) => this.physics.stiffness = value).bind(this),
        ];
    }

    render(graphics) {
        graphics.drawLine(this.from.physics.position, this.to.physics.position, {
            lineWidth: 1 + (this.physics.stiffness * 4),
            strokeStyle: '#AAAAFF'
        });
    }
}

export default Muscle;
