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
            stiffness: .2,
            damping: .05,
        });

        this.triggers = [
            ((value) => this.physics.stiffness = 
                Math.min(Math.max(this.physics.stiffness + (value * .01), .01), .5)).bind(this),
            // ((value) => this.physics.damping = 
            //     Math.min(Math.max(this.physics.damping + (value * .001), 0), .1)).bind(this),
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
