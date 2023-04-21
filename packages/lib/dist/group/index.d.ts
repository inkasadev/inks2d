import { G as Group } from "../Group-a5f3ae86.js";
import { D as DisplayObject } from "../DisplayObject-023e134d.js";

declare class Grid extends Group {
	constructor(
		columns: number | undefined,
		rows: number | undefined,
		cellWidth: number | undefined,
		cellHeight: number | undefined,
		centerCell: boolean | undefined,
		xOffset: number | undefined,
		yOffset: number | undefined,
		makeSprite: () => DisplayObject,
		callback?: (sprite: DisplayObject) => void,
	);
}

export { Grid, Group };
