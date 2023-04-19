import {
	EC_BUTTONS,
	EC_DRAGGABLE_SPRITES,
	EC_PARTICLES,
	EC_SHAKING_SPRITES,
} from "./EngineConstants";
import { type Engine } from "./Engine";
import { Stage } from "./Stage";

/**
 *
 * The game scene that holds the main active DisplayObject, the {@link Stage | game stage}. Useful for organization, eg. "Menu", "Level1", "Start Screen", etc.
 *
 * ```ts
 * import { Engine, Scene } from "inks2d";
 *
 * const g = new Engine(500, 500);
 *
 * class Main extends Scene {
 * 	constructor(){
 * 		super();
 * 	}
 *
 * 	start(e: Engine) {
 * 		super.start(e);
 * 	}
 * }
 *
 * g.scene = new Main();
 * g.start();
 * ```
 *
 * @category inks2d
 */
export class Scene {
	private _engine?: Engine;
	private readonly _helpers: Record<string, any> = {};

	/**
	 * Override this. Called after Scene has been added to the Engine.
	 *
	 * @param engine The game engine current instance.
	 */
	start(engine: Engine): void {
		const viewportSize = engine.getViewportSize();
		this._engine = engine;
		this._helpers.stage = new Stage(
			this._engine.canvas,
			viewportSize.width,
			viewportSize.height,
		);
	}

	/**
	 * Returns the scene stage.
	 */
	get stage(): Stage {
		return this._helpers.stage as Stage;
	}

	/**
	 * Override this. Updates the game, updating the Scene and display objects.
	 */
	update(): void {
		this.stage.update();
	}

	/**
	 * Override this. Called when Scene is changed, and the active Scene is no longer this.
	 */
	destroy(): void {
		EC_DRAGGABLE_SPRITES.length = 0;
		EC_BUTTONS.length = 0;
		EC_PARTICLES.length = 0;
		EC_SHAKING_SPRITES.length = 0;
	}
}
