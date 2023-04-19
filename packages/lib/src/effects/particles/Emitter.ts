import { EC_EMITTERS } from "EngineConstants";
import { type ParticleSystem } from "./ParticleSystem";

interface ParticleData {
	particle: ParticleSystem;
	delay: number;
	elapsed: number;
	last: number;
	playing: boolean;
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
export class Emitter {
	private _particles: Record<string, ParticleData> = {};
	private readonly _playing: string[] = [];
	private _particleNames: string[] = [];

	/**
	 * Constructor.
	 */
	constructor() {
		EC_EMITTERS.push(this);
	}

	public _____updateEmitter(gameElapsed: number): void {
		for (let i = 0; i < this._playing.length; i++) {
			const name = this._playing[i];
			const particleData = this._particles[name];

			if (!particleData.playing) continue;

			const particle = particleData.particle;
			const delay = particleData.delay;

			let elapsed = particleData.elapsed;
			const last = particleData.last;

			elapsed += gameElapsed;

			if (elapsed >= delay) {
				particle.emit();
				elapsed = 0;
			}

			this._particles[name].elapsed = elapsed;
			this._particles[name].last = last;
		}
	}

	/**
	 * Adds a Particle System in the emitter.
	 *
	 * @param name Name of the particle system.
	 * @param particle ParticleSystem object.
	 * @param delay Delay between emits.
	 */
	public addParticle(
		name: string,
		particle: ParticleSystem,
		delay: number,
	): void {
		this._particles[name] = {
			particle,
			delay,
			elapsed: 0,
			last: 0,
			playing: false,
		};

		this._particleNames = Object.keys(this._particles);
	}

	/**
	 * Play a specific Particle System.
	 *
	 * @param name Name of the particle system (defined in {@link Emitter.addParticle | addParticle}).
	 */
	public play(name: string): void {
		if (!this._particles[name] || this._particles[name].playing) return;

		this._particles[name].playing = true;
		this._playing.push(name);
	}

	/**
	 * Stop a specific Particle System.
	 *
	 * @param name Name of the particle system (defined in {@link Emitter.addParticle | addParticle}).
	 */
	public stop(name: string): void {
		if (!this._particles[name] || this._particles[name].playing) return;

		this._particles[name].playing = false;
		this._playing.splice(this._playing.indexOf(name), 1);
	}

	/**
	 * Play all Particle Systems.
	 */
	public playAll(): void {
		for (let i = 0; i < this._particleNames.length; i++) {
			const name = this._particleNames[i];
			this._particles[name].playing = true;
			this._playing.push(name);
		}
	}

	/**
	 * Stop all Particle Systems.
	 */
	public stopAll(): void {
		for (let i = 0; i < this._particleNames.length; i++) {
			const name = this._particleNames[i];
			this._particles[name].playing = false;
			this._playing.splice(this._playing.indexOf(name), 1);
		}
	}
}
