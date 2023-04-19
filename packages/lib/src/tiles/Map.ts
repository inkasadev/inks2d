import { type DisplayObject } from "DisplayObject";
import { Sprite } from "inks2d/graphics";
import { Point } from "inks2d/math";
import { Group } from "inks2d/group";
import { frame } from "inks2d/utils";
import { getIndex, getPoints } from "inks2d/tiles";

export class Map extends Group {
	private readonly _tiledMap: Record<string, any>;
	private readonly _tileset: HTMLImageElement;
	private readonly _tileWidth: number;
	private readonly _tileHeight: number;
	private readonly _mapWidth: number;
	private readonly _mapHeight: number;
	private readonly _mapWidthInTiles: number;
	private readonly _mapHeightInTiles: number;
	private readonly _spacing: number;
	private readonly _objects: any[] = [];

	constructor(jsonTiledMap: Record<string, any>, tileset: HTMLImageElement) {
		super();

		this._tiledMap = jsonTiledMap;
		this._tileset = tileset;
		this._tileWidth = this._tiledMap.tilewidth;
		this._tileHeight = this._tiledMap.tileheight;
		this._mapWidth = this._tiledMap.width * this._tiledMap.tilewidth;
		this._mapHeight = this._tiledMap.height * this._tiledMap.tileheight;
		this._mapWidthInTiles = this._tiledMap.width;
		this._mapHeightInTiles = this._tiledMap.height;
		this._spacing = this._tiledMap.tilesets[0].spacing;

		const numberOfTilesetColumns = Math.floor(
			this._tiledMap.tilesets[0].imagewidth / this._tiledMap.tilewidth +
				this._spacing,
		);

		this._tiledMap.layers.forEach((tiledLayer: Record<string, any>) => {
			const layerGroup = new Group();
			layerGroup.alpha = tiledLayer.opacity;
			layerGroup.visible = tiledLayer.visible;
			layerGroup.customProperties.name = tiledLayer.name;
			layerGroup.customProperties.data = tiledLayer.data;
			layerGroup.position.set(tiledLayer.x, tiledLayer.y);
			layerGroup.renderOutside = true;

			this._objects.push(layerGroup);
			this.addChild(layerGroup);

			if (tiledLayer.type === "tilelayer") {
				tiledLayer.data.forEach((gid: number, index: number) => {
					if (gid === 0) return;

					let tilesetX, tilesetY;

					const mapColumn = index % this._mapWidthInTiles;
					const mapRow = Math.floor(index / this._mapWidthInTiles);
					const mapX = mapColumn * this._tileWidth;
					const mapY = mapRow * this._tileHeight;

					const tilesetColumn = (gid - 1) % numberOfTilesetColumns;
					const tilesetRow = Math.floor((gid - 1) / numberOfTilesetColumns);
					tilesetX = tilesetColumn * this._tileWidth;
					tilesetY = tilesetRow * this._tileHeight;

					if (this._spacing > 0) {
						tilesetX +=
							this._spacing +
							this._spacing * ((gid - 1) % numberOfTilesetColumns);
						tilesetY +=
							this._spacing +
							this._spacing * Math.floor((gid - 1) / numberOfTilesetColumns);
					}

					const texture = frame(
						this._tileset,
						tilesetX,
						tilesetY,
						this._tileWidth,
						this._tileHeight,
					);

					const tileProperties = this._tiledMap.tilesets[0].tileproperties;
					const key = String(gid - 1);
					const tileSprite = new Sprite(texture);

					if (tileProperties[key].name) {
						Object.keys(tileProperties[key]).forEach((property: string) => {
							tileSprite.customProperties[property] =
								tileProperties[key][property];
						});

						this._objects.push(tileSprite);
					}

					tileSprite.position.set(mapX, mapY);
					tileSprite.pivot.set(0, 0);
					tileSprite.customProperties.index = index;
					tileSprite.customProperties.gid = gid;

					layerGroup.addChild(tileSprite);
				});
			}

			if (tiledLayer.type === "objectgroup") {
				tiledLayer.objects.forEach((object: Record<string, any>) => {
					object.group = layerGroup;
					this._objects.push(object);
				});
			}
		});
	}

	get mapWidth(): number {
		return this._mapWidth;
	}

	get mapHeight(): number {
		return this._mapHeight;
	}

	get mapWidthInTiles(): number {
		return this._mapWidthInTiles;
	}

	get mapHeightInTiles(): number {
		return this._mapHeightInTiles;
	}

	get tileWidth(): number {
		return this._tileWidth;
	}

	get tileHeight(): number {
		return this._tileHeight;
	}

	getObject(objectName: string): any {
		const object = this._objects.find((obj) => {
			return (
				(obj.name && obj.name === objectName) ||
				(obj.customProperties.name && obj.customProperties.name === objectName)
			);
		});

		if (object) return object;

		throw new Error(`There is no object with the property name: ${objectName}`);
	}

	getObjects(objectName: string): any[] {
		const object = this._objects.filter((obj) => {
			return (
				(obj.name && obj.name === objectName) ||
				(obj.customProperties.name && obj.customProperties.name === objectName)
			);
		});

		if (object) return object;

		throw new Error(`There is no object with the property name: ${objectName}`);
	}

	updateMap(
		mapArray: number[],
		spritesToUpdate: DisplayObject | DisplayObject[],
	): number[] {
		const newMapArray = mapArray.map((gid) => {
			gid = 0;
			return gid;
		});

		if (spritesToUpdate instanceof Array) {
			spritesToUpdate.forEach((sprite) => {
				sprite.customProperties.index = getIndex(
					new Point(sprite.localCenterX, sprite.localCenterY),
					this.tileWidth,
					this.tileHeight,
					this.mapWidthInTiles,
				);

				newMapArray[sprite.customProperties.index] =
					sprite.customProperties.gid;
			});

			return newMapArray;
		}

		const sprite = spritesToUpdate;

		sprite.customProperties.index = getIndex(
			new Point(sprite.localCenterX, sprite.localCenterY),
			this.tileWidth,
			this.tileHeight,
			this.mapWidthInTiles,
		);

		newMapArray[sprite.customProperties.index] = sprite.customProperties.gid;

		return newMapArray;
	}

	hitTestTile(
		sprite: DisplayObject,
		mapArray: number[],
		gidToCheck: number,
		pointsToCheck: "every" | "some" | "center" = "some",
	): Record<string, number | boolean> {
		const collision: Record<string, number | boolean> = {};
		let collisionPoints: Record<string, Point> = getPoints(sprite);

		const checkPoints = (key: string): boolean => {
			const point = collisionPoints[key];
			collision.index = getIndex(
				point,
				this.tileWidth,
				this.tileHeight,
				this.mapWidthInTiles,
			);

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
	}
}
