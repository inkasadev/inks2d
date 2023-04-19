import { Point } from "inks2d/math";
import { type DisplayObject } from "DisplayObject";
import { randomInt, randomFloat } from "inks2d/math";
import { EC_PARTICLES } from "EngineConstants";
import { Sprite } from "inks2d/graphics";
import { remove } from "inks2d/utils";

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
export class ParticleSystem {
	private readonly _source: () => DisplayObject;
	private _angles: number[];

	private readonly _randomSpacing: boolean;
	private _minAngle: number;
	private _maxAngle: number;
	private _minSize: number;
	private _maxSize: number;
	private _minSpeed: number;
	private _maxSpeed: number;
	private _numParticles: number;

	private _minScaleSpeed: number;
	private _maxScaleSpeed: number;
	private _minAlphaSpeed: number;
	private _maxAlphaSpeed: number;
	private _minRotationSpeed: number;
	private _maxRotationSpeed: number;
	private readonly _maxInteractions: number;

	public position: Point = new Point();
	public gravity: Point = new Point();

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
		position: Point = new Point(),
		gravity: Point = new Point(),
		numParticles: number = 10,
		randomSpacing: boolean = true,
		minAngle: number = 0,
		maxAngle: number = 360,
		minSize: number = 4,
		maxSize: number = 16,
		minSpeed: number = 0.1,
		maxSpeed: number = 1,
		minScaleSpeed: number = 0.01,
		maxScaleSpeed: number = 0.05,
		minAlphaSpeed: number = 0.02,
		maxAlphaSpeed: number = 0.02,
		minRotationSpeed: number = 0.01,
		maxRotationSpeed: number = 0.03,
		maxInteractions: number = Infinity,
	) {
		this._source = source;

		this._angles = [];

		this.position = position;
		this.gravity = gravity;

		this._randomSpacing = randomSpacing;
		this._minAngle = minAngle;
		this._maxAngle = maxAngle;
		this._minSize = minSize;
		this._maxSize = maxSize;
		this._minSpeed = minSpeed;
		this._maxSpeed = maxSpeed;
		this._numParticles = numParticles;

		this._minScaleSpeed = minScaleSpeed;
		this._maxScaleSpeed = maxScaleSpeed;
		this._minAlphaSpeed = minAlphaSpeed;
		this._maxAlphaSpeed = maxAlphaSpeed;
		this._minRotationSpeed = minRotationSpeed;
		this._maxRotationSpeed = maxRotationSpeed;
		this._maxInteractions = maxInteractions;
	}

	public setNumParticles(value: number): ParticleSystem {
		this._numParticles = value;

		return this;
	}

	public setPosition(value: Point): ParticleSystem {
		this.position = value.clone();

		return this;
	}

	public setAngle(start: number, end: number): ParticleSystem {
		this._minAngle = start;
		this._maxAngle = end;

		return this;
	}

	public setSize(start: number, end: number): ParticleSystem {
		this._minSize = start;
		this._maxSize = end;

		return this;
	}

	public setSpeed(start: number, end: number): ParticleSystem {
		this._minSpeed = start;
		this._maxSpeed = end;

		return this;
	}

	public setScaleSpeed(start: number, end: number): ParticleSystem {
		this._minScaleSpeed = start;
		this._maxScaleSpeed = end;

		return this;
	}

	public setAlphaSpeed(start: number, end: number): ParticleSystem {
		this._minAlphaSpeed = start;
		this._maxAlphaSpeed = end;

		return this;
	}

	public setRotationSpeed(start: number, end: number): ParticleSystem {
		this._minRotationSpeed = start;
		this._maxRotationSpeed = end;

		return this;
	}

	public emit(): void {
		const spacing =
			(this._maxAngle - this._minAngle) / (this._numParticles - 1);
		this._angles = [];

		for (let i = 0; i < this._numParticles; i++) {
			let angle, radians;

			if (this._randomSpacing) {
				angle = randomFloat(this._minAngle, this._maxAngle);
				radians = (Math.PI * angle) / 180;
				this._angles.push(radians);
			} else {
				if (angle === undefined) angle = this._minAngle;
				this._angles.push(angle);
				angle += spacing;
			}
		}

		this._angles.forEach((angle) => {
			this.makeParticle(angle);
		});
	}

	private makeParticle(angle: number): void {
		const particle = this._source();

		if (particle instanceof Sprite && particle.frames.length > 0) {
			particle.gotoAndStop(randomInt(0, particle.frames.length - 1));
		}

		particle.position = this.position.clone();

		const size = randomInt(this._minSize, this._maxSize);
		particle.width = size;
		particle.height = size;

		particle.customProperties.scaleSpeed = randomFloat(
			this._minScaleSpeed,
			this._maxScaleSpeed,
		);
		particle.customProperties.alphaSpeed = randomFloat(
			this._minAlphaSpeed,
			this._maxAlphaSpeed,
		);
		particle.customProperties.rotationSpeed = randomFloat(
			this._minRotationSpeed,
			this._maxRotationSpeed,
		);
		particle.customProperties.lives = this._maxInteractions;

		const speed = randomFloat(this._minSpeed, this._maxSpeed);
		particle.velocity.x = speed * Math.cos(angle);
		particle.velocity.y = speed * Math.sin(angle);

		particle.customProperties._____updateParticle = () => {
			particle.velocity.x += this.gravity.x;
			particle.velocity.y += this.gravity.y;

			particle.position.x += particle.velocity.x;
			particle.position.y += particle.velocity.y;

			if (particle.scale.x - particle.customProperties.scaleSpeed > 0) {
				particle.scale.x -= particle.customProperties.scaleSpeed;
			}

			if (particle.scale.y - particle.customProperties.scaleSpeed > 0) {
				particle.scale.y -= particle.customProperties.scaleSpeed;
			}

			particle.rotation += particle.customProperties.rotationSpeed as number;
			particle.alpha -= particle.customProperties.alphaSpeed;

			if (particle.alpha <= 0 || --particle.customProperties.lives <= 0) {
				EC_PARTICLES.splice(EC_PARTICLES.indexOf(particle), 1);

				remove(particle);
			}
		};

		EC_PARTICLES.push(particle);
	}
}
