import _ from 'lodash'
import Matter from 'matter-js';

const Constraint = Matter.Constraint;

class Muscle {

    constructor(part, parentPart, maxLength) {
        this.part = part;
        this.parentPart = parentPart;
        this.minLength = part.radius + parentPart.radius;
        this.maxLength = maxLength;
        this.lengthChangeDistance = 1;
        this.lengthChangeDirection = 1;

        this.physics = Constraint.create({
            bodyA: part.physics,
            bodyB: parentPart.physics,
            length: maxLength / 2,
            stiffness: .3,
            damping: .8,
        });

        this.triggers = [
            this.setFriction.bind(this),
            this.changeLength.bind(this),
            this.toggleExtendContract.bind(this),
            this.setStiffness.bind(this),
        ];
    }

    setFriction(friction) {
        this.part.physics.friction = friction;
    }

    changeLength(delta) {
        let newLength = this.physics.length + (this.lengthChangeDistance * delta * this.lengthChangeDirection);
        newLength = Math.min(newLength, this.maxLength);
        newLength = Math.max(newLength, this.minLength);
        this.physics.length = newLength;
    }

    setStiffness(stiffness) {
        this.physics.stiffness = stiffness;
    }

    toggleExtendContract(value) {
        if (value > Math.random() / 2) {
            this.lengthChangeDirection *= -1;
        }
    }

    render(graphics) {
        graphics.drawLine(this.parentPart.physics.position, this.part.physics.position, {
            lineWidth: 1 + (this.physics.stiffness * 4),
            strokeStyle: '#AAAAFF'
        });
    }
}

export default Muscle;
