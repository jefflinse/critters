import Graphics from "./Graphics";
import Creature from "./Creature";
import Vector from "./Vector";

class Universe {

    constructor() {
        this.reset();
    }

    setup(canvas, numCreatures) {
        this.canvas = canvas;
        this.graphics = new Graphics(this.canvas);
        
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

    reset() {
        this.creatures = {
            alive: [],
            dead: [],
        };

        this.food = [];
    }
}

export default Universe;
