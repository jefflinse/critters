import _ from 'lodash'
import Matter from 'matter-js';

const Constraint = Matter.Constraint;

class Muscle {

    constructor(part, parentPart) {
        this.part = part;
        this.parentPart = parentPart;

        this.physics = Constraint.create({
            bodyA: part.physics,
            bodyB: parentPart.physics,
            length: this.part.radius + this.parentPart.radius * 2,
            stiffness: .5,
            damping: .5,
        });

        this.triggers = [
            ((value) => this.physics.stiffness = value).bind(this),
        ];
    }

    render(graphics) {
        graphics.drawLine(this.parentPart.physics.position, this.part.physics.position, {
            lineWidth: 1 + (this.physics.stiffness * 4),
            strokeStyle: '#AAAAFF'
        });
    }
}

export default Muscle;
