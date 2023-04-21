import { D as DisplayObject } from "../DisplayObject-023e134d.js";

declare class Text extends DisplayObject {
	private _size;
	family: string;
	weight: string;
	style: string;
	align: {
		v: "top" | "bottom" | "center";
		h: "left" | "right" | "center";
	};
	content: string;
	color: string;
	leading: number;
	constructor(content?: string, size?: number, color?: string);
	private getProperties;
	get size(): number;
	set size(value: number);
	render(ctx: CanvasRenderingContext2D): void;
}

export { Text };
