import { Pointer } from "./inputs/Pointer";
import { Loader } from "./Loader";
import { type DisplayObject } from "./DisplayObject";
import { type Stage } from "./Stage";
import { Scene } from "./Scene";
import { Point, Vector2D } from "./math";
import { Detect } from "./utils";
import {
	EC_BUTTONS,
	EC_DRAGGABLE_SPRITES,
	EC_EMITTERS,
	EC_PARTICLES,
	EC_SHAKING_SPRITES,
	EC_TWEENS,
} from "./EngineConstants";
import { Line } from "./geom";
import { Spritemap } from "./graphics";

interface Viewport {
	scale: Point;
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 *
 * Main game engine class. Manages the game loop.
 *
 * ```ts
 * import { Engine } from "inks2d";
 *
 * const g = new Engine(500, 500);
 * g.start();
 * ```
 *
 * @category inks2d
 */
export class Engine {
	/**
	 * Returns the HTML5 canvas element where the game is rendered.
	 */
	public canvas: HTMLCanvasElement;
	/**
	 * Enable/Disable the debug mode.
	 */
	public debug: boolean = false;
	/**
	 * Returns the Pointer object.
	 */
	public pointer: Pointer;
	/**
	 * Returns the Loader object.
	 *
	 * @see {@link Loader}
	 */
	public loader: Loader;
	/**
	 * Prints a text on screen when `debug` is enable.
	 */
	public print: string = "";

	private _scene: Scene = new Scene();
	private _paused: boolean = false;
	private readonly _viewport: Viewport = {
		scale: new Point(1, 1),
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	};

	private readonly _interval: number;
	private _screenmode: string = "normal";
	private _then: number = 0;
	private _lag: number = 0;
	private _counter: number = 0;
	private _elapsed: number = 0;
	private _delta: number = 0;
	private readonly _fixed: boolean;
	// private readonly _framerate: number;
	private _fps: number;

	/**
	 * Constructor. Defines startup information about your game.
	 *
	 * @param width The width of your game.
	 * @param height The height of your game.
	 * @param framerate The game framerate, in frames per second.
	 * @param fixed If a fixed-framerate should be used.
	 * @param border Set a border in the canvas.
	 * @param backgroundColor Canvas background color.
	 *
	 */
	constructor(
		width: number = 256,
		height: number = 256,
		framerate: number = 60,
		fixed: boolean = true,
		border: string = "1px dashed black",
		backgroundColor: string = "white",
	) {
		this._interval = 1000 / framerate;
		this._fixed = fixed;
		// this._framerate = framerate;
		this._fps = framerate;

		// self.onReward = undefined;
		// self.onBackButton = undefined;

		const canvas: HTMLCanvasElement = document.querySelector(
			"#game",
		) as HTMLCanvasElement;
		canvas.width = width;
		canvas.height = height;
		canvas.style.border = border;
		canvas.style.backgroundColor = backgroundColor;

		this.canvas = canvas;

		canvas.addEventListener(
			"blur",
			(e) => {
				e.preventDefault();
			},
			false,
		);

		this.pointer = new Pointer(this);
		this.loader = new Loader();
		this._scene = new Scene();
		this._scene.start(this);

		this._viewport.width = this.canvas.width;
		this._viewport.height = this.canvas.height;
	}

	/**
	 * The currently active Stage object.
	 */
	get stage(): Stage {
		return this._scene.stage;
	}

	/**
	 * Time elapsed since the last frame (in miliseconds).
	 */
	get elapsed(): number {
		return this._delta;
	}

	/***/
	get fullscreen(): boolean {
		return this._screenmode === "full";
	}

	/**
	 * Enable/Disable fullscren mode.
	 * @defaultValue false
	 */
	set fullscreen(value: boolean) {
		this._screenmode = value ? "full" : "normal";
		this.resize();
	}

	/***/
	get centerscreen(): boolean {
		return this._screenmode === "center";
	}

	/**
	 * Centers the game in the page.
	 * @defaultValue false
	 */
	set centerscreen(value: boolean) {
		this._screenmode = value ? "center" : "normal";
		this.resize();
	}

	/**
	 * Returns if the game engine is playing (not paused).
	 */
	get playing(): boolean {
		return !this._paused;
	}

	/***/
	get scene(): Scene {
		return this._scene;
	}

	/**
	 * The currently active Scene.
	 */
	set scene(value: Scene) {
		if (this._scene) this._scene.destroy();
		this._scene = value;
		this._scene.start(this);
	}

	/**
	 * The current fps.
	 */
	get fps(): number {
		return this._fps;
	}

	/**
	 * Pause the game engine.
	 */
	pause(): void {
		this._paused = true;
	}

	/**
	 * Resume the game engine.
	 */
	resume(): void {
		this._paused = false;
	}

	/**
	 * Starts the game engine.
	 */
	start(): void {
		if (!this.stage) throw new Error("Game Scene not Found!");

		this._then = Date.now();

		if (this._fixed) {
			window.setInterval(this.update.bind(this), 1000 / this._fps);
			return;
		}

		this.update();
	}

	/**
	 * Updates the game, updating the Stage and display objects
	 */
	public update(): void {
		if (!this.stage) throw new Error("Game Scene not Found!");

		if (!this._fixed) requestAnimationFrame(this.update.bind(this));

		const canvas: HTMLCanvasElement = this.canvas;
		const ctx: CanvasRenderingContext2D = this.stage.graphics;

		canvas.style.cursor = "auto";

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const now = Date.now();

		this._delta = now - this._then;
		this._elapsed += this._delta;
		this._lag += this._delta;
		this._counter++;

		if (this._elapsed > 1000) {
			this._fps = this._counter;
			this._elapsed = 0;
			this._counter = 0;
		}

		while (this._lag >= this._interval) {
			// if (this._fixed && this._counter >= this._framerate) break;

			this._lag -= this._interval;
			this.gameloop();
		}

		this.render();
		// this.gameloop();

		this._then = now;
	}

	/**
	 * Renders the game, rendering the Stage and display objects.
	 */
	public render(): void {
		const self = this;
		const stage: Stage = this.stage;
		const ctx: CanvasRenderingContext2D = this.stage?.graphics;
		let totalDraws = 0;
		let totalObjects = 0;

		ctx.save(); // #1
		ctx.scale(this._viewport.scale.x, this._viewport.scale.y);

		ctx.save(); // #2
		ctx.translate(-this._viewport.x, -this._viewport.y);

		stage.children.forEach((sprite) => {
			display(sprite);
		});

		ctx.restore(); // #2

		if (this.debug) {
			ctx.save();
			ctx.beginPath();
			ctx.rect(0, 0, stage.width, stage.height);
			ctx.fillStyle = "gray";
			ctx.globalAlpha = 0.5;
			ctx.fill();
			ctx.restore();

			ctx.save();
			ctx.font = "normal normal 14px sans-serif";
			ctx.fillStyle = "white";
			ctx.textBaseline = "top";
			ctx.textAlign = "left";
			ctx.fillText("FPS: ", 15, 15);
			ctx.fillText("Objects: ", 15, 32);
			ctx.fillText("Drawing: ", 15, 49);
			ctx.fillText("Debug: ", 15, 66); // 83

			ctx.fillText(this._fps.toString(), 80, 15);
			ctx.fillText(totalObjects.toString(), 80, 32);
			ctx.fillText(totalDraws.toString(), 80, 49);
			ctx.fillText(this.print.toString(), 80, 67);
			ctx.restore();
		}

		ctx.restore(); // #1

		function round(num: number): number {
			return (0.5 + num) | 0;
		}

		function display(sprite: DisplayObject): void {
			const parentAlpha = sprite.parent === undefined ? 1 : sprite.parent.alpha;
			totalObjects++;

			if (
				(sprite.visible && self.isOnViewport(sprite)) ||
				sprite.renderOutside
			) {
				totalDraws++;

				ctx.save();
				ctx.translate(round(sprite.position.x), round(sprite.position.y));

				ctx.rotate(sprite.rotation);
				ctx.globalAlpha = sprite.alpha * parentAlpha;
				ctx.scale(sprite.scale.x, sprite.scale.y);

				if (sprite.shadow) {
					ctx.shadowColor = sprite.shadowColor;
					ctx.shadowOffsetX = sprite.shadowOffsetX;
					ctx.shadowOffsetY = sprite.shadowOffsetY;
					ctx.shadowBlur = sprite.shadowBlur;
				}

				if (sprite.blendMode) ctx.globalCompositeOperation = sprite.blendMode;

				ctx.filter = sprite.filter;

				if (sprite instanceof Spritemap)
					sprite.customProperties.elapsed = self.elapsed;

				// @ts-expect-error DisplayObject don't have a render method;
				if (sprite.render) sprite.render(ctx);

				ctx.filter = "none";

				if (self.debug) {
					ctx.rotate(-sprite.rotation);
					ctx.beginPath();

					if (!(sprite instanceof Text)) {
						ctx.rect(
							sprite.bounds.x - sprite.width * sprite.pivot.x,
							sprite.bounds.y - sprite.height * sprite.pivot.y,
							sprite.bounds.width,
							sprite.bounds.height,
						);
						ctx.lineWidth = 3;
						ctx.strokeStyle = "red";
						ctx.stroke();
						ctx.closePath();
					}

					ctx.beginPath();
					ctx.rect(-2.5, -2.5, 5, 5);
					ctx.lineWidth = 3;
					ctx.strokeStyle = "black";
					ctx.stroke();
					ctx.closePath();
				}

				if (sprite.children && sprite.children.length > 0) {
					ctx.translate(0, 0);

					sprite.children.forEach((child) => {
						display(child);
					});
				}

				ctx.restore();
			}
		}
	}

	/**
	 * Returns the viewport scale.
	 */
	public getViewportScale(): Point {
		return this._viewport.scale.clone();
	}

	/**
	 * Returns the viewport size.
	 */
	public getViewportSize(): { width: number; height: number } {
		return { width: this._viewport.width, height: this._viewport.height };
	}

	private isOnViewport(sprite: DisplayObject): boolean {
		if (sprite instanceof Line) {
			sprite.isOnViewport = true;
			return sprite.isOnViewport;
		}

		const vpHalfWidth = this._viewport.width / 2;
		const vpHalfHeight = this._viewport.height / 2;

		const vec = new Vector2D(
			new Point(
				sprite.gx - sprite.width * sprite.pivot.x + sprite.halfWidth,
				sprite.gy - sprite.height * sprite.pivot.y + sprite.halfHeight,
			),
			new Point(
				this._viewport.x + vpHalfWidth,
				this._viewport.y + vpHalfHeight,
			),
		);

		const combinedHalfWidths = sprite.halfWidth + vpHalfWidth;
		const combinedHalfHeights = sprite.halfHeight + vpHalfHeight;

		if (Math.abs(vec.vx) < combinedHalfWidths) {
			if (Math.abs(vec.vy) < combinedHalfHeights) {
				sprite.isOnViewport = true;
				return sprite.isOnViewport;
			}
		}

		sprite.isOnViewport = false;
		return sprite.isOnViewport;
	}

	private gameloop(): void {
		if (EC_DRAGGABLE_SPRITES.length > 0) {
			this.pointer._____updateDragAndDrop();
		}

		if (EC_BUTTONS.length > 0) {
			EC_BUTTONS.forEach((button) => {
				button.customProperties.buttonProps._____updateButton(this.pointer);
				if (
					button.customProperties.buttonProps.state === "over" ||
					button.customProperties.buttonProps.state === "down"
				) {
					if (button.parent !== undefined) {
						this.canvas.style.cursor = "pointer";
					}
				}
			});
		}

		if (EC_EMITTERS.length > 0) {
			EC_EMITTERS.forEach((emitter) => {
				emitter._____updateEmitter(this.elapsed);
			});
		}

		if (EC_PARTICLES.length > 0) {
			EC_PARTICLES.forEach((particle) => {
				particle.customProperties._____updateParticle();
			});
		}

		if (EC_TWEENS.length > 0) {
			EC_TWEENS.forEach((tween) => {
				tween.update(this.elapsed);
			});
		}

		if (EC_SHAKING_SPRITES.length > 0) {
			EC_SHAKING_SPRITES.forEach((sprite) => {
				sprite.customProperties._____updateShake();
			});
		}

		if (this._scene && !this._paused) {
			if (this._scene) this._scene.update();
		}

		this.pointer.clearCache();
	}

	private resize(): void {
		if (!this.stage) throw new Error("Game Scene not Found!");

		const auto = "auto";
		const canvas = this.canvas;
		const stage = this.stage;

		canvas.style.top = auto;
		canvas.style.left = auto;
		canvas.style.marginTop = auto;
		canvas.style.marginLeft = auto;
		canvas.style.position = "static";
		canvas.style.transform = "scale(1, 1)";
		canvas.width = stage.width;
		canvas.height = stage.height;

		this._viewport.scale.x = 1;
		this._viewport.scale.y = 1;

		const wWidth = Detect.Android() ? window.outerWidth : window.innerWidth;
		const wHeight = Detect.Android() ? window.outerHeight : window.innerHeight;

		switch (this._screenmode) {
			case "full":
				this._viewport.scale.x = wWidth / stage.width;
				this._viewport.scale.y = wHeight / stage.height;

				canvas.style.transformOrigin = "0 0";
				canvas.style.transform = "scale(1)";

				canvas.width = wWidth;
				canvas.height = wHeight;
				break;
			case "center":
				canvas.style.top = "50%";
				canvas.style.left = "50%";
				canvas.style.marginTop = `${-stage.height / 2}px`;
				canvas.style.marginLeft = `${-stage.width / 2}px`;
				canvas.style.position = "absolute";
				break;
		}
	}
}
