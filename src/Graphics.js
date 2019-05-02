class Graphics {

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
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
        this.ctx.stroke();
        this.ctx.fill();
        this._postDraw();
    }

    drawPolygon(vertices, props) {
        this._preDraw(props);
        this.ctx.beginPath();

        let vertex = vertices[0];
        this.ctx.moveTo(vertex.x, vertex.y);
        for (let i = 1; i < vertices.length; i++) {
            vertex = vertices[i];
            this.ctx.lineTo(vertex.x, vertex.y);
        }

        this.ctx.closePath();
        this.ctx.fill();
        this._postDraw();
    }

    drawRectangle(x, y, width, height, props) {
        this._preDraw(props);
        this.ctx.beginPath();
        this.ctx.fillRect(x, y, width, height);
        this._postDraw();
    }

    writeText(x, y, text, props) {
        this._preDraw(props);
        this.ctx.fillText(text, x, y);
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
