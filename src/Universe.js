import Creature from "./Creature";
import Matter from "matter-js";
import Vector from "./Vector";

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;

class Universe {

    constructor() {
        this.physicsEngine = Engine.create();
        this.reset();
    }

    setup(canvas, numCreatures) {
        this.canvas = canvas;

        // create a renderer
        this.renderer = Render.create({
            canvas: canvas,
            engine: this.physicsEngine,
        });

        // add come creatures
        for (let i = 0; i < numCreatures; i++) {
            this.addCreature();
        }

        // create the ground
        var ground = Bodies.rectangle(0, this.canvas.height, this.canvas.width, 60, {
            isStatic: true
        });

        let bodies = this.creatures.alive.map(creature => creature.physicalBody);
        bodies.unshift(ground);

        // add all of the bodies to the world
        World.add(this.physicsEngine.world, bodies);

        // run the renderer
        Render.run(this.renderer);
    }

    addCreature() {
        let location = new Vector(
            Math.random() * this.canvas.width,
            Math.random() * this.canvas.height);
        this.creatures.alive.push(new Creature(location, 10));
    }

    tick() {
        Engine.update(this.physicsEngine, 1000 / 60);
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
