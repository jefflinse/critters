import _ from 'lodash';
import Matter from 'matter-js';
import Config from '../Config';
import PhysicalObject from './PhysicalObject';

const Bodies = Matter.Bodies;

class Part extends PhysicalObject {

    constructor(radius) {
        super();

        // inheritable
        this.radius = radius
        this.color = 'black'
        this.sensors = [
            () => this.physics.speed,
            () => this.physics.angularSpeed,
            () => this.physics.angle,
            () => this.physics.frictionAir,
        ]
        this.triggers = [
            (value) => {
                this.physics.frictionAir = _.clamp(this.physics.frictionAir + value, 0, 1)
                this.alpha = this.physics.frictionAir
            },
        ]

        // runtime-specific
        this.alpha = .5
        this.numMuscles = 0
        this.physics = Bodies.circle(0, 0, this.radius, {});
        this.initializePhysics()
    }

    render(graphics) {
        // shadow
        let shadowOffset = Config.Creature.Render.ShadowOffset;
        graphics.drawCircle(
            {
                x: this.position.x + shadowOffset,
                y: this.position.y + shadowOffset,
            },
            this.radius,
            {
                fillStyle: '#000000',
                globalAlpha: .2,
            },
        )

        graphics.drawCircle(
            this.position,
            this.radius,
            {
                fillStyle: this.color,
                globalAlpha: this.alpha,
            },
        )
    }

    sense() {
        return this.sensors.map(s => s())
    }

    act(values) {
        this.triggers.forEach((t, i) => t(values[i]))
    }

    static CreateRandom(color = `hsla(${_.random(0, 360)}, 100%, 50%, 1)`) {
        let part = new Part(_.random(3, 12))
        part.color = color
        
        return part
    }
}

export default Part;
