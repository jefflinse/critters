import Config from './Config';
import Graphics from './Graphics';
import Matter from 'matter-js';

const Engine = Matter.Engine;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const World = Matter.World;

class Universe {

    constructor(canvas) {
        this.canvas = canvas;
        this.graphics = new Graphics(this.canvas);
        this.individuals = [];
        this.physics = this._createPhysicsEngine();
        this.reset();
    }

    get height() {
        return this.canvas.height;
    }

    get width() {
        return this.canvas.width;
    }

    onIndividualAdded(individual) {
        World.add(this.physics.world, individual.physics);
    }

    onIndividualRemoved(individual) {
        World.remove(this.physics.world, individual.physics);
    }

    tick() {
        this.individuals.forEach(individual => individual.tick());
        Engine.update(this.physics, 1000 / 60);
        this.render();
    }

    render() {
        this.graphics.drawBackground({
            fillStyle: Config.Universe.BackgroundColor,
        });
        this.individuals.forEach((individual, i) => individual.render(this.graphics, !i));
    }

    reset() {
        this.individuals = [];
        this.food = [];
    }

    setup(individuals) {
        this.individuals = individuals;
    }

    _createPhysicsEngine() {
        let physics = Engine.create({
            world: World.create({
                gravity: { x: 0, y: 0, scale: .001 },
            }),
        });

        // add mouse control
        let mouse = Mouse.create(this.graphics.canvas);
        let mouseConstraint = MouseConstraint.create(physics, {
            mouse: mouse,
            constraint: {
                // allow bodies on mouse to rotate
                angularStiffness: 0,
            }
        });

        World.add(physics.world, mouseConstraint);

        // keep the mouse in sync with rendering
        physics.mouse = mouse;

        return physics;
    }
}

export default Universe;
