import { D as DisplayObject, P as Point } from "./DisplayObject-023e134d.js";
import { V as Vector2D } from "./Vector2D-7326dc95.js";

declare class Circle extends DisplayObject {
	startAngle: number;
	endAngle: number;
	isPie: boolean;
	constructor(
		width?: number,
		height?: number,
		fillStyle?: string,
		strokeStyle?: string,
		lineWidth?: number,
	);
	get diameter(): number;
	set diameter(value: number);
	get radius(): number;
	set radius(value: number);
	render(ctx: CanvasRenderingContext2D): void;
}

declare class Line extends DisplayObject {
	a: Point;
	b: Point;
	lineJoin: "round" | "bevel" | "miter";
	lineCap: "butt" | "round" | "square";
	constructor(a?: Point, b?: Point, strokeStyle?: string, lineWidth?: number);
	get slope(): number;
	get yIntercepts(): number;
	render(ctx: CanvasRenderingContext2D): void;
}

declare class Triangle extends DisplayObject {
	private readonly _inclination;
	constructor(
		width?: number,
		height?: number,
		inclination?: "right" | "left",
		fillStyle?: string,
		strokeStyle?: string,
		lineWidth?: number,
		position?: Point,
	);
	get inclination(): "right" | "left";
	get hypotenuse(): Vector2D;
	render(ctx: CanvasRenderingContext2D): void;
}

export { Circle as C, Line as L, Triangle as T };
