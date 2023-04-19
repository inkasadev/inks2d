import {
	P as Point,
	D as DisplayObject,
} from "../../DisplayObject-023e134d.js";

/**
 *
 * Defines a particle system.
 *
 * ```ts
 * import { Engine, Scene } from "inks2d";
 * import { ParticleSystem } from "inks2d/effects/particles";
 * import { Spritemap } from "inks2d/graphics";
 * import { Point } from "inks2d/math";
 *
 * const g = new Engine(512, 512, 60, false, "none", "black");
 *
 * class Main extends Scene {
 *   private _flames: ParticleSystem = new ParticleSystem(() => {
 *     const sprite = new Spritemap(g.loader.store["assets/flames.png"], 256, 256);
 *     sprite.blendMode = "lighter";
 *     g.stage.addChild(sprite);
 *
 *     return sprite;
 *   });
 *
 *   constructor() {
 *     super();
 *   }
 *
 *   async start(engine: Engine) {
 *     super.start(engine);
 *     this._flames.setPosition(new Point(g.stage.halfWidth, g.stage.halfHeight));
 *   }
 *
 *   update() {
 *     this._flames.emit();
 *   }
 * }
 *
 * g.loader.onComplete = () => {
 *   g.scene = new Main();
 *   g.start();
 * };
 *
 * g.loader.load(["assets/flames.png"]);
 * ```
 */
declare class ParticleSystem {
	private readonly _source;
	private _angles;
	private readonly _randomSpacing;
	private _minAngle;
	private _maxAngle;
	private _minSize;
	private _maxSize;
	private _minSpeed;
	private _maxSpeed;
	private _numParticles;
	private _minScaleSpeed;
	private _maxScaleSpeed;
	private _minAlphaSpeed;
	private _maxAlphaSpeed;
	private _minRotationSpeed;
	private _maxRotationSpeed;
	private readonly _maxInteractions;
	position: Point;
	gravity: Point;
	/**
	 * Constructor. Defines startup information about your game.
	 *
	 * @param source The width of your game.
	 * @param position The height of your game.
	 * @param gravity The game framerate, in frames per second.
	 * @param numParticles If a fixed-framerate should be used.
	 * @param randomSpacing Set a border in the canvas.
	 * @param minAngle Canvas background color.
	 * @param maxAngle The width of your game.
	 * @param minSize The height of your game.
	 * @param maxSize The game framerate, in frames per second.
	 * @param minSpeed If a fixed-framerate should be used.
	 * @param maxSpeed Set a border in the canvas.
	 * @param minScaleSpeed Canvas background color.
	 * @param maxScaleSpeed Canvas background color.
	 * @param minAlphaSpeed Canvas background color.
	 * @param maxAlphaSpeed Canvas background color.
	 * @param minRotationSpeed Canvas background color.
	 * @param maxRotationSpeed Canvas background color.
	 * @param maxInteractions Canvas background color.
	 *
	 */
	constructor(
		source: () => DisplayObject,
		position?: Point,
		gravity?: Point,
		numParticles?: number,
		randomSpacing?: boolean,
		minAngle?: number,
		maxAngle?: number,
		minSize?: number,
		maxSize?: number,
		minSpeed?: number,
		maxSpeed?: number,
		minScaleSpeed?: number,
		maxScaleSpeed?: number,
		minAlphaSpeed?: number,
		maxAlphaSpeed?: number,
		minRotationSpeed?: number,
		maxRotationSpeed?: number,
		maxInteractions?: number,
	);
	setNumParticles(value: number): ParticleSystem;
	setPosition(value: Point): ParticleSystem;
	setAngle(start: number, end: number): ParticleSystem;
	setSize(start: number, end: number): ParticleSystem;
	setSpeed(start: number, end: number): ParticleSystem;
	setScaleSpeed(start: number, end: number): ParticleSystem;
	setAlphaSpeed(start: number, end: number): ParticleSystem;
	setRotationSpeed(start: number, end: number): ParticleSystem;
	emit(): void;
	private makeParticle;
}

/**
 *
 * Particle emitter used for emitting and rendering particle sprites.
 *
 * ```ts
 * import { Engine, Scene } from "inks2d";
 * import { Emitter, ParticleSystem } from "inks2d/effects/particles";
 * import { Spritemap } from "inks2d/graphics";
 * import { Point } from "inks2d/math";
 *
 * const g = new Engine(512, 512, 60, false, "none", "black");
 *
 * class Main extends Scene {
 *   constructor() {
 *     super();
 *   }
 *
 *   async start(engine: Engine) {
 *     super.start(engine);
 *
 *     const emitter = new Emitter();
 *     const flames = new ParticleSystem(() => {
 *       const sprite = new Spritemap(
 *         g.loader.store["assets/flames.png"],
 *         256,
 *         256
 *       );
 *       sprite.blendMode = "lighter";
 *       g.stage.addChild(sprite);
 *
 *       return sprite;
 *     });
 *
 *     flames.setPosition(new Point(g.stage.halfWidth, g.stage.halfHeight));
 *     emitter.addParticle("flames", flames, 0.05);
 *     emitter.play("flames");
 *   }
 * }
 *
 * g.loader.onComplete = () => {
 *   g.scene = new Main();
 *   g.start();
 * };
 *
 * g.loader.load(["assets/flames.png"]);
 * ```
 */
declare class Emitter {
	private _particles;
	private readonly _playing;
	private _particleNames;
	/**
	 * Constructor.
	 */
	constructor();
	_____updateEmitter(gameElapsed: number): void;
	/**
	 * Adds a Particle System in the emitter.
	 *
	 * @param name Name of the particle system.
	 * @param particle ParticleSystem object.
	 * @param delay Delay between emits.
	 */
	addParticle(name: string, particle: ParticleSystem, delay: number): void;
	/**
	 * Play a specific Particle System.
	 *
	 * @param name Name of the particle system (defined in {@link Emitter.addParticle | addParticle}).
	 */
	play(name: string): void;
	/**
	 * Stop a specific Particle System.
	 *
	 * @param name Name of the particle system (defined in {@link Emitter.addParticle | addParticle}).
	 */
	stop(name: string): void;
	/**
	 * Play all Particle Systems.
	 */
	playAll(): void;
	/**
	 * Stop all Particle Systems.
	 */
	stopAll(): void;
}

export { Emitter, ParticleSystem };
