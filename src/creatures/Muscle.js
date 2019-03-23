class Muscle {

    constructor(part, parentPart, constraint) {
        this.part = part;
        this.parentPart = parentPart;
        this.constraint = constraint;
        this.triggers = [
            this.setFriction.bind(this),
            this.setLength.bind(this),
            this.setStiffness.bind(this),
        ];
    }

    setFriction(friction) {
        this.part.friction = friction;
    }

    setLength(length) {
        this.constraint.length = length * 50;
    }

    setStiffness(stiffness) {
        this.constraint.stiffness = stiffness;
    }

    render(graphics) {
        graphics.drawLine(this.parentPart.physics.position, this.part.physics.position, {
            lineWidth: this.constraint.stiffness * 5,
            strokeStyle: '#AAAAFF'
        });
    }
}

export default Muscle;
