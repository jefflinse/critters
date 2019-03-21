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
        this.graphics = new Graphics(canvas);

        // create an engine
        this.physicsEngine = Engine.create({
            world: World.create({
                gravity: { x: 0, y: 0, scale: .001 },
            }),
        })

        // add some creatures
        for (let i = 0; i < numCreatures; i++) {
            this.addCreature();
        }

        // add all of the bodies to the world
        World.add(this.physicsEngine.world,
            this.creatures.alive.map(creature => creature.physicalBody));
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
}

export default Universe;
