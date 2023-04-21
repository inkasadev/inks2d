declare class Tween {
	private _from;
	private _to;
	private _playing;
	private _duration;
	private _delay;
	private _easingType;
	private _interpolationType;
	private _props;
	private _properties;
	private _elapsed;
	private _chainedTweens;
	private _yoyo;
	private _repeat;
	private _repeatCount;
	private _repeatYoyo;
	onComplete?: (props: Record<string, any>) => void;
	onStart?: (props: Record<string, any>) => void;
	onUpdate?: (props: Record<string, any>) => void;
	onStop?: (props: Record<string, any>) => void;
	constructor();
	private end;
	get playing(): boolean;
	from(value: Record<string, any>): Tween;
	to(value: Record<string, any>): Tween;
	start(): void;
	update(elapsed: number): void;
	easing(type: (k: number) => number): Tween;
	interpolation(type: (v: number[], k: number) => number): Tween;
	play(): void;
	pause(): void;
	chain(...twenToChain: Tween[]): Tween;
	yoyo(value: boolean): Tween;
	repeat(value: number, repeatYoyo: boolean): Tween;
	delay(value: number): Tween;
	duration(value: number): Tween;
}

export { Tween as T };
