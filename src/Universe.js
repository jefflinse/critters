import Creature from "./Creature";
import Graphics from "./Graphics";
import Matter from "matter-js";
import Vector from "./Vector";

const Engine = Matter.Engine;
const World = Matter.World;

class Universe {

    constructor() {
        this.reset();
    }

    setup(canvas, numCreatures) {
        this.canvas = canvas;

        // add some creatures
        for (let i = 0; i < numCreatures; i++) {
            this.addCreature();
        }

        this._initGraphics(canvas);
        this._initPhysics();
    }

    addCreature() {
        let location = new Vector(
            Math.random() * this.canvas.width,
            Math.random() * this.canvas.height);
        this.creatures.alive.push(new Creature(location, 10));
    }

    tick() {
        Engine.update(this.physicsEngine, 1000 / 60);
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

    _initGraphics(canvas) {
        this.graphics = new Graphics(canvas);
    }

    _initPhysics() {
        this.physicsEngine = Engine.create({
            world: World.create({
                gravity: { x: 0, y: 0, scale: .001 },
            }),
        });

        World.add(this.physicsEngine.world,
            this.creatures.alive.map(creature => creature.physicalBody));
    }
}

export default Universe;
