import _ from 'lodash'
import Matter from 'matter-js'
import Vector from '../Vector'

const Constraint = Matter.Constraint

class Muscle {

    constructor(length) {
        this.length = length
        this.from = null
        this.to = null
    }

    connect(from, to) {
        this.from = from
        this.to = to

        // make sure it's at least long enough
        this.length = Math.max(this.length, this.from.radius + this.to.radius)

        this.to.position = this.from.position.copy().add(
            Vector.RandomUnit().setMagnitude(this.length)
        )
        this.physics = Constraint.create({
            bodyA: this.from.physics,
            bodyB: this.to.physics,
            length: this.length,
            stiffness: .2,
            damping: .05,
        });
    }

    render(graphics) {
        graphics.drawLine(this.from.position, this.to.position, {
            lineWidth: 1 + (this.physics.stiffness * 4),
            strokeStyle: '#AAAAFF'
        });
    }
    
    tick() {
        
    }

    static CreateRandom() {
        return new Muscle(_.random(5, 10))
    }
}

export default Muscle;
