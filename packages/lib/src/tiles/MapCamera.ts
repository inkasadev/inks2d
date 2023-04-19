import { type DisplayObject } from "DisplayObject";
import { Point } from "inks2d/math";
import { type Map } from "./Map";

export class MapCamera {
	public scale: Point = new Point();
	public width: number = 0;
	public height: number = 0;

	private readonly _map: Map;
	private _x: number = 0;
	private _y: number = 0;

	constructor(map: Map, canvas: HTMLCanvasElement) {
		this.width = canvas.width;
		this.height = canvas.height;
		this._map = map;
	}

	get x(): number {
		return this._x;
	}

	set x(value: number) {
		this._x = value;
		this._map.position.x = -this._x;
	}

	get y(): number {
		return this._y;
	}

	set y(value: number) {
		this._y = value;
		this._map.position.y = -this._y;
	}

	get rightInnerBoundary(): number {
		return this._x + this.width / 2 + this.width / 4;
	}

	get leftInnerBoundary(): number {
		return this._x + this.width / 2 - this.width / 4;
	}

	get topInnerBoundary(): number {
		return this._y + this.height / 2 - this.height / 4;
	}

	get bottomInnerBoundary(): number {
		return this._y + this.height / 2 + this.height / 4;
	}

	follow(sprite: DisplayObject): void {
		if (sprite.position.x < this.leftInnerBoundary) {
			this.x = sprite.position.x - this.width / 4;
		}

		if (sprite.position.y < this.topInnerBoundary) {
			this.y = sprite.position.y - this.height / 4;
		}

		if (sprite.position.x + sprite.width > this.rightInnerBoundary) {
			this.x = sprite.position.x + sprite.width - (this.width / 4) * 3;
		}

		if (sprite.position.y + sprite.height > this.bottomInnerBoundary) {
			this.y = sprite.position.y + sprite.height - (this.height / 4) * 3;
		}

		if (this.x < 0) {
			this.x = 0;
		}

		if (this.y < 0) {
			this.y = 0;
		}

		if (this.x + this.width > this._map.mapWidth) {
			this.x = this._map.mapWidth - this.width;
		}

		if (this.y + this.height > this._map.mapHeight) {
			this.y = this._map.mapHeight - this.height;
		}
	}

	centerOver(sprite: DisplayObject): void {
		this.x = sprite.position.x + sprite.halfWidth - this.width / 2;
		this.y = sprite.position.y + sprite.halfHeight - this.height / 2;

		if (this.x < 0) {
			this.x = 0;
		}

		if (this.y < 0) {
			this.y = 0;
		}

		if (this.x + this.width > this._map.mapWidth) {
			this.x = this._map.mapWidth - this.width;
		}

		if (this.y + this.height > this._map.mapHeight) {
			this.y = this._map.mapHeight - this.height;
		}
	}
}
