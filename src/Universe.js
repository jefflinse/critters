import Graphics from "./Graphics";
import Creature from "./Creature";

class Universe {

    constructor() {
        this.creatures = {
            alive: [
                new Creature(),
            ],
            dead: [],
        };

        this.food = [];

        this.num = 0;
    }

    assignCanvas(canvas) {
        this.canvas = canvas;
        this.graphics = new Graphics(
            this.canvas.getContext('2d'),
            this.canvas.width,
            this.canvas.height);
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
