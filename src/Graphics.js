class Graphics {

    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    _preDraw(props) {
        this.ctx.save();
        Object.assign(this.ctx, props);
    }

    _postDraw() {
        this.ctx.restore();
    }

    drawBackground() {
        this.drawRectangle(0, 0, this.width, this.height, {
            fillStyle: '#000000',
        });
    }

    drawLine(from, to, props) {
        this._preDraw(props);
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
        this._postDraw();
    }

    drawCircle(origin, radius, props) {
        this._preDraw(props);
        this.ctx.beginPath();
        this.ctx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this._postDraw();
    }

    drawRectangle(x, y, width, height, props) {
        this._preDraw(props);
        this.ctx.beginPath();
        this.ctx.fillRect(x, y, width, height);
        this._postDraw();
    }

    drawOverlay(text, props) {
        this._preDraw(props);

        // transparent background for overlay
        this.drawRectangle(0, 0, this.width, 30, {
            fillStyle: 'rgba(100, 150, 255, .2)',
        });

        // print some info
        this.ctx.font = '16px sans-serif';
        this.ctx.fillStyle = 'black';

        this.ctx.fillText(text, 10, 20);

        this._postDraw();
    }
}

export default Graphics;
