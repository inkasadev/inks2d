import { D as DisplayObject, P as Point } from "./DisplayObject-023e134d.js";

declare class Cursor {
	private _x;
	private _y;
	private readonly _g;
	downTime: number;
	elapsedTime?: number;
	isDown: boolean;
	isUp: boolean;
	tapped: boolean;
	isPrimary: boolean;
	clear: boolean;
	dragSprite: any;
	dragOffsetX: number;
	dragOffsetY: number;
	constructor(game: Engine);
	get x(): number;
	set x(value: number);
	get y(): number;
	set y(value: number);
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
 */
declare class Pointer {
	private readonly _g;
	private readonly _element;
	private _x;
	private _y;
	private readonly _cursors;
	private readonly _startPoint;
	private readonly _endPoint;
	isDown: boolean;
	isUp: boolean;
	tapped: boolean;
	press?: (cursor: Cursor) => void;
	release?: (cursor: Cursor) => void;
	tap?: (cursor: Cursor) => void;
	move?: (cursor: Cursor) => void;
	swipe?: (direction: string) => void;
	swipeTolerance: number;
	constructor(g: Engine);
	get x(): number;
	get y(): number;
	get centerX(): number;
	get centerY(): number;
	get cursors(): Map<number, Cursor>;
	private swipeDirection;
	private downHandler;
	private upHandler;
	private moveHandler;
	clearCache(): void;
	_____updateDragAndDrop(): void;
}

/**
 *
 * The Loader class. Useful to load sounds, graphics, fonts, etc.
 *
 * > ⚠️ You can **ONLY** use this class by the {@link Engine.loader | Engine.loader} property.
 *
 * ```ts
 * import { Engine, Scene } from "inks2d";
 * import { Point } from "inks2d/math";
 *
 * const g = new Engine(500, 500);
 *
 * class Main extends Scene {
 * 	constructor() {
 * 		super();
 * 	}
 *
 *	start(e: Engine) {
 * 		super.start(e);
 *
 * 		const cat = new Sprite(g.loader.store["images/spaceship.png"]);
 * 		cat.position = new Point(g.stage.width / 2, g.stage.height / 2);
 * 		g.stage.addChild(cat);
 * 	}
 * }
 *
 * g.loader.onUpdate = (toLoad, loaded) => {
 * 	console.log(toLoad, loaded);
 * };
 *
 * g.loader.onComplete = () => {
 * 	g.scene = new Main();
 * 	g.start();
 * };
 *
 * g.loader.load([
 * 	"images/spaceship.png",
 * 	"maps/level1.json",
 * 	"sounds/music.wav",
 * ]);
 *
 * ```
 *
 * @category inks2d
 */
declare class Loader {
	private readonly _imgExt;
	private readonly _fontExt;
	private readonly _jsonExt;
	private readonly _audioExt;
	private _store;
	/**
	 * Number of assets to load.
	 */
	toLoad: number;
	/**
	 * Number of loaded assets.
	 */
	loaded: number;
	/**
	 * Called when a resource finishes loading.
	 */
	onUpdate?: (loaded: number, toLoad: number) => void;
	/**
	 * Called when all resources have finished loading.
	 */
	onComplete?: (loaded: number) => void;
	/**
	 * All the loaded assets goes here.
	 */
	get store(): Record<string, any>;
	/**
	 * Loads the queue of resources. The following extensions are allowed:
	 *
	 * ```
	 * Image => "png", "jpg", "gif"
	 * Font  => "ttf", "otf", "ttc", "woff"
	 * Json  => "json"
	 * Audio => "mp3", "ogg", "wav", "webm", "m4a"
	 * ```
	 *
	 * @param sources An array of file names.
	 * @returns Promise
	 */
	load(sources: string[]): Promise<any>;
	loadbase64Image(source: string, tag: string, callback?: () => void): void;
	loadImage(source: string, callback?: () => void): void;
	loadFont(source: string, callback?: () => void): void;
	loadJson(source: string, callback?: () => void): void;
	private createTilesetFrames;
	loadSound(source: string, callback?: () => void): void;
}

/**
 *
 * Updated by Engine, main game DisplayObject that holds all currently active display objects.
 *
 * > ⚠️ You can **ONLY** use this class by the {@link Scene.stage | Scene.stage} property.
 *
 * ```ts
 * import { Engine, Scene } from "inks2d";
 * import { Rectangle } from "inks2d/graphics";
 * import { Point } from "inks2d/math";
 *
 * const g = new Engine(500, 500);
 *
 * class Main extends Scene {
 * 	constructor() {
 * 		super();
 * 	}
 *
 *	start(e: Engine) {
 * 		super.start(e);
 *
 * 		const box = new Rectangle();
 * 		box.position = new Point(g.stage.width / 2, g.stage.height / 2);
 * 		g.stage.addChild(box);
 * 	}
 * }
 *
 * g.scene = new Main();
 * g.start();
 *
 * ```
 *
 * @category inks2d
 */
declare class Stage extends DisplayObject {
	private readonly _graphics;
	constructor(canvas: HTMLCanvasElement, width: number, height: number);
	/**
	 * Graphics object where drawing commands can occur.
	 */
	get graphics(): CanvasRenderingContext2D;
	private updateChildren;
	update(): void;
}

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
declare class Scene {
	private _engine?;
	private readonly _helpers;
	/**
	 * Override this. Called after Scene has been added to the Engine.
	 *
	 * @param engine The game engine current instance.
	 */
	start(engine: Engine): void;
	/**
	 * Returns the scene stage.
	 */
	get stage(): Stage;
	/**
	 * Override this. Updates the game, updating the Scene and display objects.
	 */
	update(): void;
	/**
	 * Override this. Called when Scene is changed, and the active Scene is no longer this.
	 */
	destroy(): void;
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
declare class Engine {
	/**
	 * Returns the HTML5 canvas element where the game is rendered.
	 */
	canvas: HTMLCanvasElement;
	/**
	 * Enable/Disable the debug mode.
	 */
	debug: boolean;
	/**
	 * Returns the Pointer object.
	 */
	pointer: Pointer;
	/**
	 * Returns the Loader object.
	 *
	 * @see {@link Loader}
	 */
	loader: Loader;
	/**
	 * Prints a text on screen when `debug` is enable.
	 */
	print: string;
	private _scene;
	private _paused;
	private readonly _viewport;
	private readonly _interval;
	private _screenmode;
	private _then;
	private _lag;
	private _counter;
	private _elapsed;
	private _delta;
	private readonly _fixed;
	private _fps;
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
		width?: number,
		height?: number,
		framerate?: number,
		fixed?: boolean,
		border?: string,
		backgroundColor?: string,
	);
	/**
	 * The currently active Stage object.
	 */
	get stage(): Stage;
	/**
	 * Time elapsed since the last frame (in miliseconds).
	 */
	get elapsed(): number;
	/***/
	get fullscreen(): boolean;
	/**
	 * Enable/Disable fullscren mode.
	 * @defaultValue false
	 */
	set fullscreen(value: boolean);
	/***/
	get centerscreen(): boolean;
	/**
	 * Centers the game in the page.
	 * @defaultValue false
	 */
	set centerscreen(value: boolean);
	/**
	 * Returns if the game engine is playing (not paused).
	 */
	get playing(): boolean;
	/***/
	get scene(): Scene;
	/**
	 * The currently active Scene.
	 */
	set scene(value: Scene);
	/**
	 * The current fps.
	 */
	get fps(): number;
	/**
	 * Pause the game engine.
	 */
	pause(): void;
	/**
	 * Resume the game engine.
	 */
	resume(): void;
	/**
	 * Starts the game engine.
	 */
	start(): void;
	/**
	 * Updates the game, updating the Stage and display objects
	 */
	update(): void;
	/**
	 * Renders the game, rendering the Stage and display objects.
	 */
	render(): void;
	/**
	 * Returns the viewport scale.
	 */
	getViewportScale(): Point;
	/**
	 * Returns the viewport size.
	 */
	getViewportSize(): {
		width: number;
		height: number;
	};
	private isOnViewport;
	private gameloop;
	private resize;
}

export { Engine as E, Scene as S };
