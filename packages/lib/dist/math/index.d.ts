import { D as DisplayObject } from "../DisplayObject-023e134d.js";
export { P as Point } from "../DisplayObject-023e134d.js";
export { V as Vector2D } from "../Vector2D-7326dc95.js";

declare const randomInt: (min: number, max: number) => number;
declare const randomFloat: (min: number, max: number) => number;
declare const randomOption: (arr: any[]) => any;
declare const shuffleArray: (arr: any[]) => any[];
declare const toRadians: (angle: number) => number;
declare const toAngle: (radians: number) => number;
declare const round: (num: number) => number;
declare const angle: (s1: DisplayObject, s2: DisplayObject) => number;
declare const distance: (s1: DisplayObject, s2: DisplayObject) => number;
declare const valueWrap: (value: number, min: number, max: number) => number;

export {
	angle,
	distance,
	randomFloat,
	randomInt,
	randomOption,
	round,
	shuffleArray,
	toAngle,
	toRadians,
	valueWrap,
};
