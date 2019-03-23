class Vector {

	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	set(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	subtract(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	multiply(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}

	divide(s) {
		!s && console.log("Division by zero!");

		this.x /= s;
		this.y /= s;
		return this;
	}

	magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	setMagnitude(m) {
		var angle = this.angle();
		this.x = m * Math.cos(angle);
		this.y = m * Math.sin(angle);
		return this;
	}

	normalize() {
		var magnitude = this.magnitude();
		magnitude && this.divide(magnitude);
		return this;
	}

	angle() {
		return Math.atan2(this.y, this.x);
	}

	setAngle(a) {
		var magnitude = this.magnitude();
		this.x = magnitude * Math.cos(a);
		this.y = magnitude * Math.sin(a);
		return this;
	}

	rotate(a) {
		this.setAngle(this.angle() + a);
		return this;
	}

	limit(limit) {
		var magnitude = this.magnitude();
		if (magnitude > limit) {
			this.setMagnitude(limit);
		}

		return this;
	}

	angleBetween(v) {
		return this.angle() - v.angle();
	}

	dot(v) {
		return this.x * v.x + this.y * v.y;
	}

	lerp(v, amt) {
		this.x += (v.x - this.x) * amt;
		this.y += (v.y - this.y) * amt;
		return this;
	}

	distanceBetween(v) {
		var dx = this.x - v.x;
		var dy = this.y - v.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	invert() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}

	copy() {
		return new Vector(this.x, this.y);
	}

	random() {
		this.set(1, 1);
		this.setAngle(Math.random() * Math.PI * 2);
		return this;
	}

	toString() {
		return '(' + this.x + ', ' + this.y + ')';
	}
}

export default Vector;
