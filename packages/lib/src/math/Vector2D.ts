import { Point } from "./Point";

export class Vector2D {
	private readonly _a: Point;
	private readonly _b: Point;
	private _vx: number = 0;
	private _vy: number = 0;
	private _scaleAmount: number = 0;

	constructor(
		a: Point = new Point(0, 0),
		b: Point = new Point(0, 0),
		scaleAmount: number = 1,
	) {
		this._a = a;
		this._b = b;
		this.scaleAmount = scaleAmount;
	}

	get a(): Point {
		return this._a;
	}

	get b(): Point {
		return this._b;
	}

	get vx(): number {
		if (this._vx === 0) return this._b.x - this._a.x;
		return this._vx;
	}

	set vx(value: number) {
		this._vx = value;
	}

	get vy(): number {
		if (this._vy === 0) return this._b.y - this._a.y;
		return this._vy;
	}

	set vy(value: number) {
		this._vy = value;
	}

	get angle(): number {
		return Math.atan2(this.vy, this.vx);
	}

	set angle(value: number) {
		this.b.x = this.a.x + Math.cos(value) * this.length;
		this.b.y = this.a.y + Math.sin(value) * this.length;
	}

	get length(): number {
		if (this.vx !== 0 || this.vy !== 0) {
			return Math.sqrt(this.lengthSquared);
		}

		return 0.001;
	}

	set length(value: number) {
		this._b.x = this._a.x + this.normalized.x * value;
		this._b.y = this._a.y + this.normalized.y * value;
	}

	get lengthSquared(): number {
		return this.vx * this.vx + this.vy * this.vy;
	}

	get leftNormal(): Vector2D {
		const vec = new Vector2D();
		const lx = this.vy;
		const ly = -this.vx;

		if (this._vx === 0 && this._vy === 0) {
			vec.a.x = this.a.x;
			vec.a.y = this.a.y;
			vec.b.x = this.a.x + lx;
			vec.b.y = this.a.y + ly;
		} else {
			vec.vx = this.vx;
			vec.vy = this.vy;
		}

		return vec;
	}

	get rightNormal(): Vector2D {
		const vec = new Vector2D();
		const rx = -this.vy;
		const ry = this.vx;

		if (this._vx === 0 && this._vy === 0) {
			vec.a.x = this.a.x;
			vec.a.y = this.a.y;
			vec.b.x = this.a.x + rx;
			vec.b.y = this.a.y + ry;
		} else {
			vec.vx = this.vx;
			vec.vy = this.vy;
		}

		return vec;
	}

	get normalized(): Point {
		const vec = new Point(0.001, 0.001);

		if (this.length !== 0) {
			vec.x = this.vx / this.length;
			vec.y = this.vy / this.length;
		}

		return vec;
	}

	get scaleAmount(): number {
		return this._scaleAmount;
	}

	set scaleAmount(value: number) {
		const newLength = this.length * value;
		this.length = newLength;
		this._scaleAmount = value;
	}

	/**
	 *
	 * @param v2 Another Point instance
	 * @returns Number The dot product of this vector and
	 * the one passed in as a parameter.
	 */
	dotProd(v2: Vector2D): number {
		return this.vx * v2.normalized.x + this.vy * v2.normalized.y;
	}

	projection(v2: Vector2D): Vector2D {
		const dotProd = this.dotProd(v2);
		const vec = new Point(v2.normalized.x * dotProd, v2.normalized.y * dotProd);

		return new Vector2D(v2.a.clone(), v2.a.add(vec));
	}

	reverse(): void {
		this.angle += Math.PI;
	}

	/**
	 *
	 * @param v2 Another Point instance
	 * @returns Number The dot product of this vector and
	 * the one passed in as a parameter.
	 */
	perpDotProd(v2: Vector2D): number {
		return (
			this.leftNormal.vx * v2.normalized.x +
			this.leftNormal.vy * v2.normalized.y
		);
	}

	/**
	 * Finds a vector that is perpendicular to this vector.
	 *
	 * @returns Point A vector perpendicular to this vector.
	 */
	get perp(): Vector2D {
		return new Vector2D(
			new Point(this.a.x, this.a.y),
			new Point(-this.vy, this.vx),
		);
	}

	/**
	 *
	 * @param v2 Another vector instance.
	 * @returns Number If to the left, returns -1.
	 * If to the right, +1;
	 */
	sign(v2: Vector2D): number {
		return this.perp.dotProd(v2) < 0 ? -1 : 1;
	}

	clone(): Vector2D {
		const vec = new Vector2D(this.a, this.b);
		vec.vx = this.vx;
		vec.vy = this.vy;

		return vec;
	}

	draw(graphics: CanvasRenderingContext2D, basicMode: boolean = true): void {
		graphics.strokeStyle = "red";
		graphics.lineWidth = 1;
		graphics.beginPath();
		graphics.moveTo(this.a.x, this.a.y);
		graphics.lineTo(this.b.x, this.b.y);
		graphics.stroke();

		if (!basicMode) {
			// Draw the x component
			graphics.strokeStyle = "black";
			graphics.beginPath();
			graphics.moveTo(this.a.x, this.a.y);
			graphics.lineTo(this.b.x, this.a.y);
			graphics.stroke();

			// Draw the y component
			graphics.strokeStyle = "black";
			graphics.beginPath();
			graphics.moveTo(this.b.x, this.a.y);
			graphics.lineTo(this.b.x, this.b.y);
			graphics.stroke();

			// Draw the right normal
			graphics.beginPath();
			graphics.moveTo(this.a.x, this.a.y);
			graphics.lineTo(this.rightNormal.b.x, this.rightNormal.b.y);
			graphics.stroke();

			// Draw the left normal
			graphics.beginPath();
			graphics.moveTo(this.a.x, this.a.y);
			graphics.lineTo(this.leftNormal.b.x, this.leftNormal.b.y);
			graphics.stroke();

			if (this.length > 20) {
				// Position the x component text
				let vxPos = this.a.x + this.vx + 20;
				if (this.vx > 10) {
					vxPos -= Math.floor(graphics.measureText("vx").width) + 20;
				}
				graphics.textBaseline = "bottom";
				graphics.textAlign = "right";
				graphics.fillText("vx", vxPos, this.a.y);

				// Position the y component text
				graphics.save();
				const vyPosX = this.a.x + this.vx;
				let vyPosY = this.a.y - 20;
				let vyRotate = (270 * Math.PI) / 180;
				if (this.vy > 10) {
					vyPosY = this.a.y + 20;
					vyRotate = Math.PI / 2;
				}
				graphics.translate(vyPosX, vyPosY);
				graphics.rotate(vyRotate);
				graphics.textBaseline = "bottom";
				graphics.textAlign = "right";
				graphics.fillText("vy", 0, 0);
				graphics.restore();

				// Position the right normal text
				graphics.save();
				graphics.translate(this.rightNormal.b.x, this.rightNormal.b.y);
				graphics.rotate(this.rightNormal.angle);
				graphics.fillText("rn", 0, 0);
				graphics.restore();

				// Position the left normal text
				graphics.save();
				graphics.translate(this.leftNormal.b.x, this.leftNormal.b.y);
				graphics.rotate(this.leftNormal.angle);
				graphics.fillText("ln", 0, 0);
				graphics.restore();
			}
		}
	}
}
