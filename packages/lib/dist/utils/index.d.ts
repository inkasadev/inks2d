import { D as DisplayObject } from '../DisplayObject-023e134d.js';

declare const Detect: {
    Android: () => boolean;
    iOS: () => boolean;
};
declare const wait: (duration?: number) => Promise<PromiseConstructor>;
declare const shake: (sprite: DisplayObject, numberOfShakes?: number, magnitude?: number, angular?: boolean) => void;
declare const makeInteractive: (sprite: DisplayObject) => void;
declare const remove: (...spritesToRemove: DisplayObject[]) => void;
declare const frame: (source: HTMLImageElement, x: number, y: number, width: number, height: number) => {
    image: HTMLImageElement;
    x: number;
    y: number;
    width: number;
    height: number;
};
declare const frames: (source: HTMLImageElement, arrOfPositions: number[], width: number, height: number) => {
    image: HTMLImageElement;
    data: number[];
    width: number;
    height: number;
};
declare const contain: (sprite: DisplayObject, bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
}, bounce?: boolean, callback?: ((side: string) => void) | undefined) => string | undefined;
declare const getSpatialGrid: (spritesArray: DisplayObject[], columns?: number, rows?: number, cellWidth?: number, cellHeight?: number) => any[];
declare const move: (...sprites: DisplayObject[]) => void;
declare const miliToTimer: (mili: number, includeHour?: boolean, removeSpace?: boolean) => string;

export { Detect, contain, frame, frames, getSpatialGrid, makeInteractive, miliToTimer, move, remove, shake, wait };
