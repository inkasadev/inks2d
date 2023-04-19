import { EC_TWEENS } from "EngineConstants";
import { Easing } from "./Easing";
import { Interpolation } from "./Interpolation";
import { wait } from "inks2d/utils";

export class Tween {
	private _from: Record<string, any> = {};
	private _to: Record<string, any> = {};
	private _playing = false;
	private _duration: number = 0;
	private _delay: number = 0;
	private _easingType: (k: number) => number = Easing.Linear.None;
	private _interpolationType: (v: number[], k: number) => number =
		Interpolation.Linear;

	private _props: Record<string, any> = {};
	private _properties: string[] = [];
	private _elapsed: number = 0;
	// private _last: number = 0;
	private _chainedTweens: Tween[] = [];
	private _yoyo: boolean = false;
	private _repeat: number = 0;
	private _repeatCount: number = 1;
	private _repeatYoyo: boolean = false;

	public onComplete?: (props: Record<string, any>) => void;
	public onStart?: (props: Record<string, any>) => void;
	public onUpdate?: (props: Record<string, any>) => void;
	public onStop?: (props: Record<string, any>) => void;

	constructor() {
		EC_TWEENS.push(this);
	}

	private end(): void {
		const temp = this._from;
		this._playing = false;

		EC_TWEENS.splice(EC_TWEENS.indexOf(this), 1);

		if (this._yoyo) {
			this.from(this._to).to(temp).start();
			return;
		}

		if (this._repeatCount < this._repeat) {
			if (this._repeatYoyo) this.from(this._to).to(temp).start();
			else this.start();

			this._repeatCount++;
			return;
		}

		if (this.onUpdate) this.onUpdate(this._props);

		if (this.onComplete) this.onComplete(this._props);

		this._chainedTweens.forEach((tween) => {
			tween.start();
		});
	}

	get playing(): boolean {
		return this._playing;
	}

	public from(value: Record<string, any>): Tween {
		this._from = value;
		this._properties = Object.keys(this._from);

		this._properties.forEach((prop: string) => {
			this._props[prop] = this._from[prop];
		});

		return this;
	}

	public to(value: Record<string, any>): Tween {
		this._to = value;

		return this;
	}

	public start(): void {
		if (this._playing) EC_TWEENS.splice(EC_TWEENS.indexOf(this), 1);

		this._elapsed = 0;
		// this._last = 0;

		wait(this._delay).then(() => {
			this._playing = true;
			this._properties.forEach((prop) => {
				this._props[prop] = this._from[prop];
			});

			EC_TWEENS.push(this);

			if (this.onStart != null) this.onStart(this._props);
		});
	}

	public update(elapsed: number): void {
		if (!this._playing) return;

		/*
		const now = Date.now();

		if (now - this._last >= 1000) {
			this._last = now;
		}
		*/

		// this._elapsed += now - this._last;
		this._elapsed += elapsed;
		// this._last = now;

		if (this._elapsed > this._duration) {
			this._elapsed = 0;
			this._properties.forEach((prop) => {
				if (this._to[prop] instanceof Array) {
					this._props[prop] = this._to[prop][this._to[prop].length - 1];
					return;
				}

				this._props[prop] = this._to[prop];
			});

			this.end();
			return;
		}

		// this._last = now;
		const normalizedTime = this._elapsed / this._duration;
		const curvedTime = this._easingType(normalizedTime);

		this._properties.forEach((prop) => {
			if (this._to[prop] instanceof Array) {
				const interpolatedTime = this._interpolationType(
					this._to[prop],
					curvedTime,
				);

				this._props[prop] = interpolatedTime;
				return;
			}

			this._props[prop] =
				this._to[prop] * curvedTime + this._from[prop] * (1 - curvedTime);
		});

		if (this.onUpdate) this.onUpdate(this._props);
	}

	public easing(type: (k: number) => number): Tween {
		this._easingType = type;

		return this;
	}

	public interpolation(type: (v: number[], k: number) => number): Tween {
		this._interpolationType = type;

		return this;
	}

	public play(): void {
		this._playing = true;
	}

	public pause(): void {
		this._playing = false;
	}

	public chain(...twenToChain: Tween[]): Tween {
		this._chainedTweens = twenToChain;

		return this;
	}

	public yoyo(value: boolean): Tween {
		this._yoyo = value;

		return this;
	}

	public repeat(value: number, repeatYoyo: boolean): Tween {
		this._repeat = value;
		this._repeatYoyo = repeatYoyo;

		return this;
	}

	public delay(value: number): Tween {
		this._delay = value;

		return this;
	}

	public duration(value: number): Tween {
		this._duration = value;

		return this;
	}
}
