import _ from 'lodash'
import Matter from 'matter-js';
import Vector from '../Vector';

const Constraint = Matter.Constraint;

class Muscle {

    constructor(from, to) {
        this.from = from;
        this.to = to;

        let length = new Vector(this.from.physics.position.x, this.from.physics.position.y).distanceBetween(
            new Vector(this.to.physics.position.x, this.to.physics.position.y));
        this.physics = Constraint.create({
            bodyA: from.physics,
            bodyB: to.physics,
            length: length,
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
