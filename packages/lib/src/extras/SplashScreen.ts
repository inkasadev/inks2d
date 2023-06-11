import { DisplayObject } from "DisplayObject";
import { Engine } from "Engine";
import { Scene } from "Scene";
import { Rectangle } from "inks2d/geom";
import { Sprite } from "inks2d/graphics";
import { Text } from "inks2d/text";
import { wait } from "inks2d/utils";

export class SplashScreen extends Scene {
	private _loader: Rectangle = new Rectangle(1080, 1920, "black");
	private _assetsToLoad: string[];
	private _logo: DisplayObject = new Rectangle(0, 0);
	private _splashImage: string | DisplayObject;
	private _callback: () => void;
	private _forceClick: boolean;
	// @ts-ignore
	private _g: Engine;
	private _ctaText: string;
	private _yOffset: number;

	constructor(
		assetsToLoad: string[],
		callback: () => void,
		yOffset: number = 0,
		splashImage: string | DisplayObject,
		forceClick: boolean = false,
		ctaText: string = "TAP TO START",
	) {
		super();

		this._assetsToLoad = assetsToLoad;
		this._splashImage = splashImage;
		this._callback = callback;
		this._forceClick = forceClick;
		this._ctaText = ctaText;
		this._yOffset = yOffset;
	}

	override start(e: Engine): void {
		super.start(e);
		this._g = e;

		this._loader.pivot.x = this._loader.pivot.y = 0;
		this._loader.width = this._g.stage.width;
		this._loader.height = this._g.stage.height;
		this._g.stage.addChild(this._loader);

		if (!this._splashImage) {
			this.loadAssets();
			return;
		}

		if (typeof this._splashImage === "string") {
			this._g.loader.onComplete = () => {
				const maxWidth = this._g.stage.width / 2.5;
				const maxHeight = this._g.stage.height / 2.5;
				const minSize = Math.min(Math.min(maxWidth, maxHeight), 300);
				const targetArea = minSize * minSize;

				this._logo = new Sprite(
					this._g.loader.store[this._splashImage as string],
				);
				const newWidth = Math.sqrt(
					(this._logo.width / this._logo.height) * targetArea,
				);
				const newHeight = targetArea / newWidth;
				this._logo.width = Math.round(newWidth);
				this._logo.height = Math.round(
					newHeight - (this._logo.width - newWidth),
				);
				this.loadAssets();
			};
			this._g.loader.load([this._splashImage]);
			return;
		}

		this._logo = this._splashImage;
		this.loadAssets();
	}

	private loadAssets(): void {
		const maxWidth = this._g.stage.width / 2.5;

		this._logo.pivot.x = this._logo.pivot.y = 0.5;
		this._loader.putCenter(this._logo);
		this._loader.addChild(this._logo);

		const back = new Rectangle(maxWidth, 25, "gray", "black", 2, 5);
		back.pivot.x = 0;
		this.updateObjSize(back);
		back.width = maxWidth - 3;
		back.position.x = 540 - 210;
		back.position.y = 960;
		this.updateObjPos(back);
		back.position.y += this._logo.height / 2 + back.height + this._yOffset;
		this._loader.addChild(back);

		const front = new Rectangle(0, 25, "#ddd", "none", 2, 1);
		front.pivot.x = 0;
		this.updateObjSize(front);
		front.position.x = 540 - 210;
		front.position.y = 960;
		this.updateObjPos(front);
		front.position.y += this._logo.height / 2 + back.height + this._yOffset;
		this._loader.addChild(front);

		this._g.loader.onUpdate = (loaded, total) => {
			const ratio = Math.floor((loaded * 100) / total);
			front.width = (ratio * maxWidth) / 100;
		};

		if (this._assetsToLoad.length === 0) {
			this._g.loader.onUpdate(1, 1);
			this.startGame();
			return;
		}

		this._g.loader.onComplete = () => {
			this.startGame();
		};

		this._g.loader.load(this._assetsToLoad);
	}

	private updateObjSize(obj: DisplayObject): void {
		obj.width = (this._g.stage.width * obj.width) / 1080;
		obj.height = (this._g.stage.height * obj.height) / 1920;
	}

	private updateObjPos(obj: DisplayObject): void {
		obj.position.x = (this._g.stage.width * obj.position.x) / 1080;
		obj.position.y = (this._g.stage.height * obj.position.y) / 1920;
	}

	private startGame(): void {
		if (!this._forceClick) {
			wait(2000).then(() => {
				if (this._callback) this._callback();
			});
			return;
		}

		const start = new Text(this._ctaText, 48, "white");
		start.family = "ubuntu";
		start.pivot.x = start.pivot.y = 0.5;
		start.position.x = 540 + 8;
		start.position.y = 960;
		start.size = (this._g.stage.width * start.size) / 1080;
		this.updateObjPos(start);
		start.position.y +=
			this._logo.height / 2 +
			this._loader.children[1].height * 3.5 +
			this._yOffset;
		this._loader.addChild(start);

		this._g.pointer.release = () => {
			this._g.pointer.release = undefined;
			if (this._callback) this._callback();
		};
	}
}
