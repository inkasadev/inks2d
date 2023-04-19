import { DisplayObject } from "DisplayObject";

export class Rectangle extends DisplayObject {
	constructor(
		width: number = 32,
		height: number = 32,
		fillStyle: string = "gray",
		strokeStyle: string = "none",
		lineWidth: number = 0,
		radius: number = 0,
	) {
		super();

		this.width = width;
		this.height = height;

		this.fillStyle = fillStyle;
		this.strokeStyle = strokeStyle;
		this.lineWidth = lineWidth;

		this.customProperties.corners = {
			topLeft: radius,
			topRight: radius,
			bottomLeft: radius,
			bottomRight: radius,
		};
	}

	render(ctx: CanvasRenderingContext2D): void {
		const x = -this.width * this.pivot.x;
		const y = -this.height * this.pivot.y;
		const r = x + this.width;
		const b = y + this.height;

		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillStyle;
		ctx.beginPath();
		ctx.moveTo(x, y);

		ctx.lineTo(r - this.customProperties.corners.topRight, y);
		ctx.quadraticCurveTo(
			r,
			y,
			r,
			y + (this.customProperties.corners.topRight as number),
		);

		ctx.lineTo(r, y + this.height - this.customProperties.corners.bottomRight);
		ctx.quadraticCurveTo(
			r,
			b,
			r - this.customProperties.corners.bottomRight,
			b,
		);

		ctx.lineTo(x + (this.customProperties.corners.bottomLeft as number), b);
		ctx.quadraticCurveTo(x, b, x, b - this.customProperties.corners.bottomLeft);

		ctx.lineTo(x, y + (this.customProperties.corners.topLeft as number));
		ctx.quadraticCurveTo(
			x,
			y,
			x + (this.customProperties.corners.topLeft as number),
			y,
		);

		if (this.strokeStyle !== "none") ctx.stroke();
		if (this.fillStyle !== "none") ctx.fill();
		if (this.mask && this.mask) ctx.clip();
	}
}
