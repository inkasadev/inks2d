export { T as Tween } from "../../Tween-2c97587c.js";

declare const Easing: {
	Linear: {
		None: (k: number) => number;
	};
	Quadratic: {
		In: (k: number) => number;
		Out: (k: number) => number;
		InOut: (k: number) => number;
	};
	Cubic: {
		In: (k: number) => number;
		Out: (k: number) => number;
		InOut: (k: number) => number;
	};
	Quartic: {
		In: (k: number) => number;
		Out: (k: number) => number;
		InOut: (k: number) => number;
	};
	Quintic: {
		In: (k: number) => number;
		Out: (k: number) => number;
		InOut: (k: number) => number;
	};
	Sinusoidal: {
		In: (k: number) => number;
		Out: (k: number) => number;
		InOut: (k: number) => number;
	};
	Exponential: {
		In: (k: number) => number;
		Out: (k: number) => number;
		InOut: (k: number) => number;
	};
	Circular: {
		In: (k: number) => number;
		Out: (k: number) => number;
		InOut: (k: number) => number;
	};
	Elastic: {
		In: (k: number) => number;
		Out: (k: number) => number;
		InOut: (k: number) => number;
	};
	Back: {
		In: (k: number) => number;
		Out: (k: number) => number;
		InOut: (k: number) => number;
	};
	Bounce: {
		In: (k: number) => number;
		Out: (k: number) => number;
		InOut: (k: number) => number;
	};
};

declare const Interpolation: {
	Linear: (v: number[], k: number) => number;
	Bezier: (v: number[], k: number) => number;
	CatmullRom: (v: number[], k: number) => number;
	Utils: {
		Linear: (p0: number, p1: number, t: number) => number;
		Bernstein: (n: number, i: number) => number;
		Factorial: (n: number) => number;
		CatmullRom: (
			p0: number,
			p1: number,
			p2: number,
			p3: number,
			t: number,
		) => number;
	};
};

export { Easing, Interpolation };
