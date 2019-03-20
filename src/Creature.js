import PhysicalObject from "./PhysicalObject";

class Creature extends PhysicalObject {

    constructor(location) {
        super(location);
    }

    tick() {
        // PhysicalObject tick should always be last
        // as it depends on modifications to acceleration, etc.
        super.tick();
    }

    draw(graphics) {
        graphics.drawCircle(this.location, 20, {
            fillStyle: "#0000FF",
			globalAlpha: 1,
			lineWidth: 1
		});
    }
}

export default Creature;
