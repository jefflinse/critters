import _ from 'lodash'
import Matter from 'matter-js'
import Vector from '../Vector'

const Constraint = Matter.Constraint

class Muscle {

    constructor() {
        // inheritable
        this.from = null
        this.to = null
        this.sensors = [
            () => _.random(true)
        ]
        this.triggers = [
            (value) => {
                this.physics.length = _.clamp(this.physics.length + value, this.minLength, this.maxLength)
            },
            (value) => {
                this.physics.stiffness = _.clamp(this.physics.stiffness + value, 0, 1)
            }
        ]
    }

    connect(from, to) {
        this.from = from
        this.to = to

        // make sure it's at least long enough
        this.minLength = this.from.radius + this.to.radius
        this.maxLength = this.minLength * 3

        this.to.position = this.from.position.copy().add(
            Vector.RandomUnit().setMagnitude(_.floor((this.minLength + this.maxLength) / 2))
        )
        this.physics = Constraint.create({
            bodyA: this.from.physics,
            bodyB: this.to.physics,
            stiffness: .5,
            damping: 0.05,
        });

        from.numMuscles++
        to.numMuscles++

        return this
    }

    render(graphics) {
        graphics.drawLine(this.from.position, this.to.position, {
            lineWidth: 1 + (this.physics.stiffness * 4),
            strokeStyle: this.from.color,
        });
    }
    
    sense() {
        return this.sensors.map(s => s())
    }

    act(values) {
        this.triggers.forEach((t, i) => t(values[i]))
    }

    static CreateRandom() {
        return new Muscle()
    }
}

export default Muscle;
