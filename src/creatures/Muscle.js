class Muscle {

    constructor(part, constraint) {
        this.part = part;
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
}

export default Muscle;
