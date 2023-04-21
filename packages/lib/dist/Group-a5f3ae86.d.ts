import { D as DisplayObject } from './DisplayObject-023e134d.js';

declare class Group extends DisplayObject {
    private _resize;
    constructor(...spritesToGroup: DisplayObject[]);
    get dynamicSize(): boolean;
    set dynamicSize(value: boolean);
    private calculateSize;
    addChild(sprite: DisplayObject): void;
    removeChild(sprite: DisplayObject): boolean;
}

export { Group as G };
