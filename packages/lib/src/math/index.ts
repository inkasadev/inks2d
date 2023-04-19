import { DisplayObject } from "DisplayObject";

export { Point } from "./Point";
export { Vector2D } from "./Vector2D";

export const randomInt = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloat = (min: number, max: number): number => {
	return min + Math.random() * (max - min);
};

export const randomOption = (arr: any[]): any => {
	const i = randomInt(0, arr.length - 1);
	return arr[i];
};

export const shuffleArray = (arr: any[]): any[] => {
	arr = arr.concat([]);

	for (let i = arr.length - 1; i > 0; i--) {
		const id = Math.floor(Math.random() * i);
		const a = arr[i];
		const b = arr[id];

		arr[id] = a;
		arr[i] = b;
	}

	return arr;
};

export const toRadians = (angle: number): number => {
	return (angle * Math.PI) / 180;
};

export const toAngle = (radians: number): number => {
	return (radians * 180) / Math.PI;
};

export const round = (num: number): number => {
	return (0.5 + num) | 0;
};

export const angle = (s1: DisplayObject, s2: DisplayObject): number => {
	return Math.atan2(
		s2.localCenterY - s1.localCenterY,
		s2.localCenterX - s1.localCenterX,
	);
};

export const distance = (s1: DisplayObject, s2: DisplayObject): number => {
	const vx = s2.localCenterX - s1.localCenterX;
	const vy = s2.localCenterY - s1.localCenterY;

	return Math.sqrt(vx * vx + vy * vy);
};

export const valueWrap = (value: number, min: number, max: number): number => {
	if (value < min) return min;
	else if (value > max) return max;
	return value;
};
