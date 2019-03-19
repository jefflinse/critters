class Universe {

    constructor() {
        this.creatures = {
            alive: [],
            dead: [],
        };

        this.food = [];

        this.num = 0;
    }

    assignCanvas(canvas) {
        this.canvas = canvas;
    }

    tick() {
        this.num = (this.num + 1) % 1000000;
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.font = "20px Courier"
        ctx.fillText("whaddup: " + this.num, 100, 100);
    }
}

export default Universe;
