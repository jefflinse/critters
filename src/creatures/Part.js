import _ from 'lodash';
import Matter from 'matter-js';
import Config from '../Config';
import PhysicalObject from './PhysicalObject';

const Bodies = Matter.Bodies;

class Part extends PhysicalObject {

    constructor(radius) {
        super();

        this.radius = radius
        this.color = 'black'

        this.physics = Bodies.circle(0, 0, this.radius, {
            frictionAir: Config.Creature.Part.FrictionAir,
        });

        this.initializePhysics()
    }

    render(graphics) {
        // shadow
        let shadowOffset = Config.Creature.Part.ShadowOffset;
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
                globalAlpha: .25 + (.75 * this.physics.frictionAir),
            },
        )
    }

    tick() {
        
    }

    static CreateRandom(color = `hsla(${_.random(0, 360)}, 100%, 50%, 1)`) {
        let part = new Part(_.random(5, 25))
        part.color = color
        
        return part
    }
}

export default Part;
