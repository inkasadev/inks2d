import { DisplayObject } from "DisplayObject";

export class Sprite extends DisplayObject {
	private _currentFrame: number = 0;
	private _source: any;
	private _sourceX: number = 0;
	private _sourceY: number = 0;
	private _sourceWidth: number = 0;
	private _sourceHeight: number = 0;
	private _tilesetFrame: Record<string, any> = {};

	constructor(source: any) {
		super();

		if (source instanceof Image) {
			this.createFromImage(source);
		} else if (source.frame) {
			this.createFromAtlas(source); // JSON
		} else if (source.image && !source.data) {
			this.createFromTileset(source);
		} else if (source.image && source.data) {
			this.createFromTilesetFrames(source);
		} else if (source instanceof Array) {
			if (source[0] && source[0].source) {
				this.createFromAtlasFrames(source);
			} else if (source[0] instanceof Image) {
				this.createFromImages(source);
			} else {
				throw new Error(
					`The Image sources in ${JSON.stringify(source)} are not recognized`,
				);
			}
		} else {
			throw new Error(
				`The image source ${JSON.stringify(source)} is not recognized`,
			);
		}
	}

	get currentFrame(): number {
		return this._currentFrame;
	}

	private createFromImage(source: any): void {
		if (!(source instanceof Image)) {
			throw new Error(`source is not an image object`);
		} else {
			this._source = source;
			this._sourceX = 0;
			this._sourceY = 0;
			this.width = source.width;
			this.height = source.height;
			this._sourceWidth = source.width;
			this._sourceHeight = source.height;
		}
	}

	private createFromAtlas(source: any): void {
		this._tilesetFrame = source;
		this._source = this._tilesetFrame.source;
		this._sourceX = this._tilesetFrame.frame.x;
		this._sourceY = this._tilesetFrame.frame.y;
		this.width = this._tilesetFrame.frame.w;
		this.height = this._tilesetFrame.frame.h;
		this._sourceWidth = this._tilesetFrame.frame.w;
		this._sourceHeight = this._tilesetFrame.frame.h;
	}

	private createFromTileset(source: any): void {
		if (!(source.image instanceof Image)) {
			throw new Error(`source.image is not an image object`);
		} else {
			this._source = source.image;
			this._sourceX = source.x;
			this._sourceY = source.y;
			this.width = source.width;
			this.height = source.height;
			this._sourceWidth = source.width;
			this._sourceHeight = source.height;
		}
	}

	private createFromTilesetFrames(source: any): void {
		if (!(source.image instanceof Image)) {
			throw new Error(`source.image is not an image object`);
		} else {
			this._source = source.image;
			this.frames = source.data;

			this._sourceX = this.frames[0][0];
			this._sourceY = this.frames[0][1];
			this.width = source.width;
			this.height = source.height;
			this._sourceWidth = source.width;
			this._sourceHeight = source.height;
		}
	}

	private createFromAtlasFrames(source: any): void {
		this.frames = source;
		this._source = source[0].source;
		this._sourceX = source[0].frame.x;
		this._sourceY = source[0].frame.y;
		this.width = source[0].frame.w;
		this.height = source[0].frame.h;
		this._sourceWidth = source[0].frame.w;
		this._sourceHeight = source[0].frame.h;
	}

	private createFromImages(source: any): void {
		this.frames = source;
		this._source = source[0];
		this._sourceX = 0;
		this._sourceY = 0;
		this.width = source[0].width;
		this.height = source[0].height;
		this._sourceWidth = source[0].width;
		this._sourceHeight = source[0].height;
	}

	gotoAndStop(frameNumber: number): void {
		if (this.frames.length === 0) return;

		if (this.frames.length > 0 && frameNumber < this.frames.length) {
			if (this.frames[0] instanceof Array) {
				this._sourceX = this.frames[frameNumber][0];
				this._sourceY = this.frames[frameNumber][1];
			} else if (this.frames[frameNumber].frame) {
				this._sourceX = this.frames[frameNumber].frame.x;
				this._sourceY = this.frames[frameNumber].frame.y;

				this._sourceWidth = this.frames[frameNumber].frame.w;
				this._sourceHeight = this.frames[frameNumber].frame.h;

				this.width = this.frames[frameNumber].frame.w;
				this.height = this.frames[frameNumber].frame.h;
			} else {
				this._source = this.frames[frameNumber];

				this._sourceX = 0;
				this._sourceY = 0;

				this.width = this._source.width;
				this.height = this._source.height;

				this._sourceWidth = this._source.width;
				this._sourceHeight = this._source.height;
			}

			this._currentFrame = frameNumber;
			return;
		}

		throw new Error(`Frame number ${frameNumber} does not exist`);
	}

	render(ctx: CanvasRenderingContext2D): void {
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
}
