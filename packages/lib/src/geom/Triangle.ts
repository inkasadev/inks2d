import { DisplayObject } from "DisplayObject";
import { Point, Vector2D } from "inks2d/math";

export class Triangle extends DisplayObject {
	private readonly _inclination: "right" | "left" = "right";
	constructor(
		width: number = 30,
		height: number = 30,
		inclination: "right" | "left" = "right",
		fillStyle: string = "gray",
		strokeStyle: string = "none",
		lineWidth: number = 0,
		position: Point = new Point(0, 0),
	) {
		super();

		this._inclination = inclination;

		this.width = width;
		this.height = height;
		this.position = new Point(position.x, position.y);

		this.fillStyle = fillStyle;
		this.strokeStyle = strokeStyle;
		this.lineWidth = lineWidth;
	}

	get inclination(): "right" | "left" {
		return this._inclination;
	}

	get hypotenuse(): Vector2D {
		const vec = new Vector2D();

		vec.a.x = this.position.x - this.width * this.pivot.x;
		vec.a.y = this.position.y - this.height * this.pivot.y;

		vec.b.x = this.position.x - this.width * this.pivot.x + this.width;
		vec.b.y = this.position.y - this.height * this.pivot.y + this.height;

		if (this._inclination === "left") {
			vec.a.x = this.position.x - this.width * this.pivot.x;
			vec.a.y = this.position.y - this.height * this.pivot.y + this.height;

			vec.b.x = this.position.x - this.width * this.pivot.x + this.width;
			vec.b.y = this.position.y - this.height * this.pivot.y;
		}

		return vec;
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillStyle;

		const x = -(this.width * this.pivot.x);
		const y = -(this.height * this.pivot.y);

		ctx.beginPath();
		if (this._inclination === "right") {
			ctx.moveTo(x, y);
			ctx.lineTo(x, y + this.height);
			ctx.lineTo(x + this.width, y + this.height);
			ctx.lineTo(x, y);
		} else {
			ctx.moveTo(x + this.width, y);
			ctx.lineTo(x, y + this.height);
			ctx.lineTo(x + this.width, y + this.height);
			ctx.lineTo(x + this.width, y);
		}

		if (this.strokeStyle !== "none") ctx.stroke();
		if (this.fillStyle !== "none") ctx.fill();
		if (this.mask && this.mask) ctx.clip();
	}
}
