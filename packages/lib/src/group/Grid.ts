import { type DisplayObject } from "DisplayObject";
import { Group } from "./Group";

export class Grid extends Group {
	constructor(
		columns: number = 0,
		rows: number = 0,
		cellWidth: number = 32,
		cellHeight: number = 32,
		centerCell: boolean = false,
		xOffset: number = 0,
		yOffset: number = 0,
		makeSprite: () => DisplayObject,
		callback?: (sprite: DisplayObject) => void,
	) {
		super();

		const length = columns * rows;

		for (let i = 0; i < length; i++) {
			const x = (i % columns) * cellWidth;
			const y = Math.floor(i / columns) * cellHeight;

			const sprite = makeSprite();
			this.addChild(sprite);

			if (!centerCell) {
				sprite.position.x = x + xOffset;
				sprite.position.y = y + yOffset;
			} else {
				sprite.position.x = x + cellWidth / 2 + xOffset;
				sprite.position.y = y + cellHeight / 2 + yOffset;
			}

			if (callback != null) callback(sprite);
		}
	}
}
