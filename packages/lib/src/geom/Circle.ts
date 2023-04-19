import { DisplayObject } from "DisplayObject";

export class Circle extends DisplayObject {
	public startAngle: number = 0;
	public endAngle: number = 2 * Math.PI;
	public isPie: boolean = false;

	constructor(
		width: number = 32,
		height: number = 32,
		fillStyle: string = "gray",
		strokeStyle: string = "none",
		lineWidth: number = 0,
	) {
		super();

		this.width = width;
		this.height = height;

		this.fillStyle = fillStyle;
		this.strokeStyle = strokeStyle;
		this.lineWidth = lineWidth;

		this.name = "Circle";
	}

	get diameter(): number {
		return this.width;
	}

	set diameter(value: number) {
		this.width = value;
		this.height = value;
	}

	get radius(): number {
		return this.halfWidth;
	}

	set radius(value: number) {
		this.width = value * 2;
		this.height = value * 2;
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillStyle;
		ctx.beginPath();

		if (this.isPie) {
			ctx.moveTo(
				this.radius + -this.diameter * this.pivot.x,
				this.radius + -this.diameter * this.pivot.y,
			);
		}

		ctx.arc(
			this.radius + -this.diameter * this.pivot.x,
			this.radius + -this.diameter * this.pivot.y,
			this.radius,
			this.startAngle,
			this.endAngle,
			false,
		);

		if (this.strokeStyle !== "none") ctx.stroke();
		if (this.fillStyle !== "none") ctx.fill();
		if (this.mask && this.mask) ctx.clip();
	}
}
