import { D as DisplayObject, P as Point } from '../DisplayObject-023e134d.js';
import { G as Group } from '../Group-a5f3ae86.js';

declare class Map extends Group {
    private readonly _tiledMap;
    private readonly _tileset;
    private readonly _tileWidth;
    private readonly _tileHeight;
    private readonly _mapWidth;
    private readonly _mapHeight;
    private readonly _mapWidthInTiles;
    private readonly _mapHeightInTiles;
    private readonly _spacing;
    private readonly _objects;
    constructor(jsonTiledMap: Record<string, any>, tileset: HTMLImageElement);
    get mapWidth(): number;
    get mapHeight(): number;
    get mapWidthInTiles(): number;
    get mapHeightInTiles(): number;
    get tileWidth(): number;
    get tileHeight(): number;
    getObject(objectName: string): any;
    getObjects(objectName: string): any[];
    updateMap(mapArray: number[], spritesToUpdate: DisplayObject | DisplayObject[]): number[];
    hitTestTile(sprite: DisplayObject, mapArray: number[], gidToCheck: number, pointsToCheck?: "every" | "some" | "center"): Record<string, number | boolean>;
}

declare class MapCamera {
    scale: Point;
    width: number;
    height: number;
    private readonly _map;
    private _x;
    private _y;
    constructor(map: Map, canvas: HTMLCanvasElement);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get rightInnerBoundary(): number;
    get leftInnerBoundary(): number;
    get topInnerBoundary(): number;
    get bottomInnerBoundary(): number;
    follow(sprite: DisplayObject): void;
    centerOver(sprite: DisplayObject): void;
}

declare const getIndex: (pos: Point, tileWidth: number, tileHeight: number, mapWidthInTiles: number) => number;
declare const getPoints: (sprite: DisplayObject, global?: boolean) => Record<string, Point>;
declare const hitTestTile: (sprite: DisplayObject, mapArray: number[], gidToCheck: number, pointsToCheck: "center" | "every" | "some" | undefined, tileWidth: number, tileHeight: number, mapWidthInTiles: number) => Record<string, number | boolean>;

export { Map, MapCamera, getIndex, getPoints, hitTestTile };
