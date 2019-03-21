import Creature from "./Creature";
import Matter from "matter-js";

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;

class Universe {

    constructor() {
        this.physicsEngine = Engine.create();
    }

    setup(canvas, numCreatures) {
        this.canvas = canvas;

        // create a renderer
        this.renderer = Render.create({
            canvas: canvas,
            engine: this.physicsEngine,
        });

        // create two boxes and a ground
        var boxA = Bodies.rectangle(400, 200, 80, 80);
        var boxB = Bodies.rectangle(450, 50, 80, 80);
        var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

        // add all of the bodies to the world
        World.add(this.physicsEngine.world, [boxA, boxB, ground]);

        // run the engine
        //Engine.run(this.physicsEngine);

        // run the renderer
        Render.run(this.renderer);
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
