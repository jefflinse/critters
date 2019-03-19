import Graphics from "./Graphics";
import Creature from "./Creature";
import Vector from "./Vector";

class Universe {

    constructor() {
        this.creatures = {
            alive: [],
            dead: [],
        };

        this.food = [];
    }

    assignCanvas(canvas) {
        this.canvas = canvas;
        this.graphics = new Graphics(
            this.canvas.getContext('2d'),
            this.canvas.width,
            this.canvas.height);
    }

    populateCreatures(numCreatures) {
        for (let i = 0; i < numCreatures; i++) {
            let location = new Vector(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            );
            this.creatures.alive.push(new Creature(location));
        }
    }

    tick() {
        this.graphics.drawBackground();
        this.creatures.alive.forEach(creature => {
            creature.tick();
            creature.draw(this.graphics);
        });
    }
}

export default Universe;
