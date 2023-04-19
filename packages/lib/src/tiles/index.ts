import { DisplayObject } from "DisplayObject";
import { Point } from "inks2d/math";

export { Map } from "./Map";
export { MapCamera } from "./MapCamera";

export const getIndex = (
	pos: Point,
	tileWidth: number,
	tileHeight: number,
	mapWidthInTiles: number,
): number => {
	const index = new Point();

	index.x = Math.floor(pos.x / tileWidth);
	index.y = Math.floor(pos.y / tileHeight);

	return index.x + index.y * mapWidthInTiles;
};

export const getPoints = (
	sprite: DisplayObject,
	global: boolean = false,
): Record<string, Point> => {
	const bounds = global ? sprite.localBounds() : sprite.globalBounds();
	/**
	 * The bottom and left corner points are 1 pixel
	 * less than the sprite’s width and height so that
	 * the points remain inside the sprite, and not
	 * outside it;
	 */
	return {
		topLeft: new Point(bounds.x, bounds.y),
		topRight: new Point(bounds.x + bounds.width - 1, bounds.y),
		bottomLeft: new Point(bounds.x, bounds.y + bounds.height - 1),
		bottomRight: new Point(
			bounds.x + bounds.width - 1,
			bounds.y + bounds.height - 1,
		),
	};
};

export const hitTestTile = (
	sprite: DisplayObject,
	mapArray: number[],
	gidToCheck: number,
	pointsToCheck: "every" | "some" | "center" = "some",
	tileWidth: number,
	tileHeight: number,
	mapWidthInTiles: number,
): Record<string, number | boolean> => {
	const collision: Record<string, number | boolean> = {};
	let collisionPoints: Record<string, Point> = getPoints(sprite);

	const checkPoints = (key: string): boolean => {
		const point = collisionPoints[key];
		collision.index = getIndex(point, tileWidth, tileHeight, mapWidthInTiles);

		collision.gid = mapArray[collision.index];

		if (collision.gid === gidToCheck) {
			return true;
		}

		return false;
	};

	const methodToExec = pointsToCheck === "center" ? "some" : pointsToCheck;

	if (pointsToCheck === "center") {
		const point = {
			center: new Point(sprite.localCenterX, sprite.localCenterY),
		};
		collisionPoints = point;
	}

	collision.hasContact =
		Object.keys(collisionPoints)[methodToExec](checkPoints);

	return collision;
};
