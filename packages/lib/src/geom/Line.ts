import { DisplayObject } from "DisplayObject";
import { Point } from "inks2d/math";

export class Line extends DisplayObject {
	public a: Point;
	public b: Point;
	public lineJoin: "round" | "bevel" | "miter" = "round";
	public lineCap: "butt" | "round" | "square" = "butt";

	constructor(
		a: Point = new Point(0, 0),
		b: Point = new Point(32, 32),
		strokeStyle: string = "gray",
		lineWidth: number = 0,
	) {
		super();

		this.strokeStyle = strokeStyle;
		this.lineWidth = lineWidth;
		this.a = a;
		this.b = b;
	}

	get slope(): number {
		const yDelta = this.b.y - this.a.y;
		const xDelta = this.b.x - this.a.x || 1;
		return yDelta / xDelta;
	}

	get yIntercepts(): number {
		return this.slope * this.b.x * -1 + this.b.y;
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = this.lineWidth;
		ctx.lineJoin = this.lineJoin;
		ctx.lineCap = this.lineCap;
		ctx.beginPath();
		ctx.moveTo(this.a.x, this.a.y);
		ctx.lineTo(this.b.x, this.b.y);
		if (this.strokeStyle !== "none") ctx.stroke();
	}
}
