import { DisplayObject } from "DisplayObject";

export class Text extends DisplayObject {
	private _size: string;

	public family: string = "verdana";
	public weight: string = "normal";
	public style: string = "normal";
	public align: {
		v: "top" | "bottom" | "center";
		h: "left" | "right" | "center";
	} = { v: "center", h: "center" };

	public content: string;
	public color: string;
	public leading: number = 0;

	constructor(
		content: string = "Inks2D!",
		size: number = 16,
		color: string = "red",
	) {
		super();

		this._size = `${size}px`;
		this.content = content;
		this.color = color;
	}

	private getProperties(): string {
		return `${this.style} ${this.weight} ${this._size} ${this.family}`;
	}

	get size(): number {
		return parseInt(this._size);
	}

	set size(value: number) {
		this._size = `${value}px`;
	}

	render(ctx: CanvasRenderingContext2D): void {
		const vAlign = this.align.v === "center" ? "middle" : this.align.v;

		ctx.font = this.getProperties();
		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.color;
		ctx.textBaseline = vAlign;
		ctx.textAlign = this.align.h;

		this.content = `${this.content}`;
		const content = this.content.split("\n");
		const h = Math.floor(ctx.measureText("M").width);

		this.height += this.leading * (content.length - 1);

		ctx.save();
		ctx.translate(
			-this.width * this.pivot.x + this.width / 2,
			-this.height * this.pivot.y + h / 2,
		);

		this.height = 0;
		for (let i = 0; i < content.length; i++) {
			const lText = content[i];
			const newWidth = Math.floor(ctx.measureText(lText).width);

			if (newWidth > this.width) {
				this.width = newWidth;
			}

			this.height += h + this.leading;

			ctx.fillText(lText, 0, i * (h + this.leading));

			if (this.lineWidth !== 0)
				ctx.strokeText(lText, 0, i * (h + this.leading));
		}
		this.height -= this.leading;

		ctx.restore();
	}
}
