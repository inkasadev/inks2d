import { Rectangle } from "inks2d/geom";
import { Sprite } from "inks2d/graphics";
import { Grid } from "inks2d/group";

export class Backdrop extends Rectangle {
	private _tileGrid: Grid;

	constructor(source: any, width: number, height: number) {
		super(width, height, "none", "none");

		let tileWidth: number, tileHeight: number, columns: number, rows: number;

		this.pivot.x = this.pivot.y = 0;
		this.renderOutside = true;
		this.mask = true;

		// Is it a texture atlas?
		if (source.frame) {
			tileWidth = source.frame.w;
			tileHeight = source.frame.h;
		} else {
			tileWidth = source.width;
			tileHeight = source.height;
		}

		/**
		 * Calculates the number of rows and columns.
		 * The number of rows and columns have to be always 1
		 * bigger than the total number of tiles that fill
		 * the rectangle. It gives an aditional row and column,
		 * allowing us to create infite scroll effect;
		 */

		/**
		 * 1. Columns
		 *
		 * If the rectangle width is bigger than the tile width,
		 * calculates the number columns.
		 */
		if (width >= tileWidth) {
			columns = Math.round(width / tileWidth) + 1;
		} else {
			/**
			 * If the rectangle width is smaller than the tile width,
			 * defines the columns to 2, which is the minimum;
			 */
			columns = 2;
		}

		/**
		 * 2. Rows
		 *
		 * If the rectangle height is bigger than the tile height,
		 * calculates the number rows.
		 */
		if (height >= tileHeight) {
			rows = Math.round(height / tileHeight) + 1;
		} else {
			/**
			 * If the rectangle height is smaller than the tile height,
			 * defines the rows to 2, which is the minimum;
			 */
			rows = 2;
		}

		this._tileGrid = new Grid(
			columns,
			rows,
			tileWidth,
			tileHeight,
			false,
			0,
			0,
			() => {
				const tile = new Sprite(source);
				tile.pivot.x = tile.pivot.y = 0;

				return tile;
			},
		);

		this._tileGrid.pivot.x = this._tileGrid.pivot.y = 0;
		this._tileGrid.dynamicSize = true;
		this._tileGrid.renderOutside = true;

		this._tileGrid.position.x = -(this._tileGrid.width - this.width);
		this._tileGrid.position.y = -(this._tileGrid.height - this.height);
	}

	override added(): void {
		this.addChild(this._tileGrid);
	}

	public setTileX(value: number): void {
		this._tileGrid.position.x += value;

		if (this._tileGrid.position.x >= value) {
			this._tileGrid.position.x = -(this._tileGrid.width - this.width - value);
			return;
		}

		if (this._tileGrid.position.x < -(this._tileGrid.width - this.width)) {
			this._tileGrid.position.x = value;
		}
	}

	public setTileY(value: number): void {
		this._tileGrid.position.y += value;

		if (this._tileGrid.position.y >= value) {
			this._tileGrid.position.y = -(
				this._tileGrid.height -
				this.height -
				value
			);
			return;
		}

		if (this._tileGrid.position.y < -(this._tileGrid.height - this.height)) {
			this._tileGrid.position.y = value;
		}
	}

	public setAlpha(value: number): void {
		this._tileGrid.alpha = value;
	}

	public getAlpha(): number {
		return this._tileGrid.alpha;
	}
}
