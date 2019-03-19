import Vector from './Vector';

class Creature {

    constructor() {
        this.location = new Vector(100, 100);
    }

    tick() {
        this.location.add(new Vector().random().limit(10));
    }

    draw(graphics) {
        graphics.drawCircle(this.location, 10, {
            fillStyle: "#FFFFFF",
			globalAlpha: 1,
			lineWidth: 1
		});
    }
}

export default Creature;
