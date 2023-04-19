import { DisplayObject } from "DisplayObject";

type Animation = Record<
	string,
	{
		frames: number[];
		speed: number;
		loop: boolean;
	}
>;

export class Spritemap extends DisplayObject {
	private readonly _framesPerRow: number;
	private _frames: number[] = [];
	private _loop: boolean = true;
	private _speed: number = 0;
	private _currentFrame: number = 0;
	private _currentAnim: string = "";
	private _frameInAnim: number = 0;
	private _complete: boolean = false;
	private _playing: boolean = false;

	private _animations: Animation = {};
	private readonly _source: any;
	private _sourceX: number = 0;
	private _sourceY: number = 0;
	private readonly _sourceWidth: number;
	private readonly _sourceHeight: number;

	private _elapsed: number = 0;

	public onAnimStart?: (currentAnim: string, currentFrame: number) => void;
	public onAnimUpdate?: (currentAnim: string, currentFrame: number) => void;
	public onAnimComplete?: (currentAnim: string, currentFrame: number) => void;

	constructor(source: any, frameWidth: number, frameHeight: number) {
		super();

		this._source = source;
		this._framesPerRow = this._source.width / frameWidth;
		this._sourceWidth = frameWidth;
		this._sourceHeight = frameHeight;

		this.width = frameWidth;
		this.height = frameHeight;

		this.bounds.width = this.width;
		this.bounds.height = this.height;
	}

	get complete(): boolean {
		return this._complete;
	}

	get animationName(): string {
		return this._currentAnim;
	}

	get frame(): number {
		return this._currentFrame;
	}

	set frame(value: number) {
		this._sourceX = Math.floor(value % this._framesPerRow) * this._sourceWidth;
		this._sourceY = Math.floor(value / this._framesPerRow) * this._sourceHeight;
		this._currentFrame = value;
	}

	addAnimation(
		name: string,
		frames: string | number | number[],
		speed: number,
		loop: boolean,
	): void {
		let frameList: number[] = [];
		const framesType = typeof frames;

		if (framesType === "string") {
			const beginEndFrames = (frames as string).split("-");
			const begin = parseInt(beginEndFrames[0]);
			const end = parseInt(beginEndFrames[1]);

			for (let i = begin; i <= end; i++) frameList.push(i);
		} else if (framesType === "object") {
			frameList = frames as number[];
		} else if (framesType === "number") {
			frameList = [frames as number];
		}

		this._animations[name] = {
			frames: frameList,
			speed,
			loop,
		};
	}

	play(name: string): void {
		if (!this._animations[name]) return;

		this._frames = this._animations[name].frames;
		this._speed = this._animations[name].speed;
		this._loop = this._animations[name].loop;
		this._currentFrame = this._frames[0];
		this._currentAnim = name;
		this._frameInAnim = 0;
		this._complete = false;
		this._playing = true;

		if (this.onAnimStart != null)
			this.onAnimStart(this._currentAnim, this._currentFrame);
	}

	pause(): void {
		this._playing = false;
	}

	resume(): void {
		this._playing = true;
	}

	render(ctx: CanvasRenderingContext2D): void {
		this.updtFrame(this.customProperties.elapsed);

		ctx.drawImage(
			this._source,
			this._sourceX,
			this._sourceY,
			this._sourceWidth,
			this._sourceHeight,
			-this.width * this.pivot.x,
			-this.height * this.pivot.y,
			this.width,
			this.height,
		);
	}

	private updtFrame(elapsed: number): void {
		if (this._frames.length === 0 || this._complete || !this._playing) return;

		this._elapsed += elapsed;

		if (this._elapsed >= this._speed) {
			this.frame = this._frames[this._frameInAnim++];

			if (this.onAnimUpdate != null)
				this.onAnimUpdate(this._currentAnim, this._currentFrame);

			if (this._frameInAnim >= this._frames.length) {
				if (this._loop) {
					this._frameInAnim = 0;
				} else {
					this._complete = true;
					this._playing = false;

					if (this.onAnimComplete != null)
						this.onAnimComplete(this._currentAnim, this._currentFrame);
				}
			}

			this._elapsed = 0;
		}
	}
}
