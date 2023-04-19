import { Sound } from "./effects/sfx/Sound";

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
export class Loader {
	private readonly _imgExt: string[] = ["png", "jpg", "gif"];
	private readonly _fontExt: string[] = ["ttf", "otf", "ttc", "woff"];
	private readonly _jsonExt: string[] = ["json"];
	private readonly _audioExt: string[] = ["mp3", "ogg", "wav", "webm", "m4a"];
	private _store: Record<string, any> = {};

	/**
	 * Number of assets to load.
	 */
	public toLoad: number = 0;
	/**
	 * Number of loaded assets.
	 */
	public loaded: number = 0;
	/**
	 * Called when a resource finishes loading.
	 */
	public onUpdate?: (loaded: number, toLoad: number) => void;
	/**
	 * Called when all resources have finished loading.
	 */
	public onComplete?: (loaded: number) => void;

	/**
	 * All the loaded assets goes here.
	 */
	get store(): Record<string, any> {
		return this._store;
	}

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
	public async load(sources: string[]): Promise<any> {
		return await new Promise((resolve) => {
			const loadHandler = (): void => {
				this.loaded += 1;

				if (this.onUpdate != null) this.onUpdate(this.loaded, this.toLoad);

				if (this.toLoad === this.loaded) {
					this.toLoad = 0;
					this.loaded = 0;

					if (this.onComplete != null) this.onComplete(this.loaded);

					resolve(true);
				}
			};

			this.loaded = 0;
			this.toLoad = sources.length;

			sources.forEach((source) => {
				const extension = source.split(".").pop() as string;

				if (this._imgExt.includes(extension)) {
					this.loadImage(source, loadHandler);
				} else if (this._fontExt.includes(extension)) {
					this.loadFont(source, loadHandler);
				} else if (this._jsonExt.includes(extension)) {
					this.loadJson(source, loadHandler);
				} else if (this._audioExt.includes(extension)) {
					this.loadSound(source, loadHandler);
				} else {
					throw new Error(`File type not recognized: ${source}`);
				}
			});
		});
	}

	public loadbase64Image(
		source: string,
		tag: string,
		callback?: () => void,
	): void {
		const image = new Image();

		if (callback != null) image.addEventListener("load", callback);

		this._store[tag] = image;

		image.src = source;
	}

	public loadImage(source: string, callback?: () => void): void {
		const image = new Image();

		if (callback != null) image.addEventListener("load", callback);

		this._store[source] = image;

		image.src = source;
	}

	public loadFont(source: string, callback?: () => void): void {
		const fontFamily = source.split("/").pop()?.split(".")[0] ?? "";
		const newStyle = document.createElement("style");
		const fontFace = `@font-face {font-family: '${fontFamily}'; src: url('${source}');}`;
		newStyle.appendChild(document.createTextNode(fontFace));
		document.head.appendChild(newStyle);
		if (callback != null) callback();
	}

	public loadJson(source: string, callback?: () => void): void {
		fetch(source).then((res) => {
			if (res.status === 200) {
				res.json().then((file) => {
					file.name = source;
					this._store[file.name] = file;

					if (file.frames) {
						this.createTilesetFrames(file, source, callback);
						return;
					}

					if (callback != null) callback();
				});
			}
		});
	}

	private createTilesetFrames(
		file: any,
		source: string,
		callback?: () => void,
	): void {
		const baseUrl = source.replace(/[^\\/]*$/, "");
		const imageUrl = file.meta.image as string;
		const imgSrc = baseUrl + imageUrl;

		const imgCallback = (): void => {
			this._store[imgSrc] = image;

			Object.keys(file.frames).forEach((frame) => {
				this._store[frame] = file.frames[frame];
				this._store[frame].source = image;
			});

			if (callback != null) callback();
		};

		const image = new Image();
		image.addEventListener("load", imgCallback);
		image.src = imgSrc;
	}

	public loadSound(source: string, callback?: () => void): void {
		const sound = new Sound(source);
		sound.load().then(() => {
			this._store[sound.name] = sound;
			if (callback != null) callback();
		});
	}
}
