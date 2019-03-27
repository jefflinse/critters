import Creature from './creatures/Creature';
import Graphics from './Graphics';
import Matter from 'matter-js';
import Vector from './Vector';

const Engine = Matter.Engine;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const World = Matter.World;

class Universe {

    constructor(canvas) {
        this.canvas = canvas;
        this.graphics = new Graphics(this.canvas);
        this.creatures = [];
        this.physics = this._createPhysicsEngine();
        this.reset();
    }

    get height() {
        return this.canvas.height;
    }

    get width() {
        return this.canvas.width;
    }

    onIndividualAdded(creature) {
        World.add(this.physics.world, creature.physics);
    }

    tick() {
        this.creatures.alive.forEach(creature => creature.tick());
        Engine.update(this.physics, 1000 / 60);
        this.render();
    }

    render() {
        this.graphics.drawBackground();
        this.creatures.alive.forEach(creature => creature.render(this.graphics));
    }

    reset() {
        this.creatures = {
            alive: [],
            dead: [],
        };

        this.food = [];
    }

    setup(creatures) {
        this.creatures = creatures;
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
        // render.mouse = mouse;

        return physics;
    }
}

export default Universe;
