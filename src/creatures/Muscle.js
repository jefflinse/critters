import Matter from 'matter-js';

const Constraint = Matter.Constraint;

class Muscle {

    constructor(part, parentPart, length) {
        this.part = part;
        this.parentPart = parentPart;

        this.physics = Constraint.create({
            bodyA: part.physics,
            bodyB: parentPart.physics,
            length: length,
            stiffness: .3,
            damping: .5,
        });

        this.triggers = [
            this.setFriction.bind(this),
            this.setLength.bind(this),
            this.setStiffness.bind(this),
        ];
    }

    setFriction(friction) {
        this.part.physics.friction = friction;
    }

    setLength(length) {
        this.physics.length = length * 50;
    }

    setStiffness(stiffness) {
        this.physics.stiffness = stiffness;
    }

    render(graphics) {
        graphics.drawLine(this.parentPart.physics.position, this.part.physics.position, {
            lineWidth: 1 + (this.physics.stiffness * 4),
            strokeStyle: '#AAAAFF'
        });
    }
}

export default Muscle;
