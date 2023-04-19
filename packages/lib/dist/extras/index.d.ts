import { R as Rectangle } from "../Rectangle-15a3786c.js";
import { D as DisplayObject } from "../DisplayObject-023e134d.js";
import { S as Scene, E as Engine } from "../Engine-e71e0646.js";

declare class Backdrop extends Rectangle {
	private _tileGrid;
	constructor(source: any, width: number, height: number);
	added(): void;
	setTileX(value: number): void;
	setTileY(value: number): void;
	setAlpha(value: number): void;
	getAlpha(): number;
}

declare class SplashScreen extends Scene {
	private _loader;
	private _assetsToLoad;
	private _image;
	private _callback;
	private _forceClick;
	private _g;
	private _ctaText;
	private _yOffset;
	constructor(
		assetsToLoad: string[],
		image: DisplayObject,
		callback: () => void | undefined,
		forceClick: boolean,
		g: Engine,
		ctaText?: string,
		yOffset?: number,
	);
	start(e: Engine): void;
	private loadAssets;
	private updateObjScale;
	private updateObjSize;
	private updateObjPos;
	private startGame;
}

declare class TransitionScreen extends Rectangle {
	private _delay;
	onBetween: (() => void) | undefined;
	constructor(delay: number, g: Engine, color?: string);
	start(removeAfterBlink?: boolean): void;
}

export { Backdrop, SplashScreen, TransitionScreen };
