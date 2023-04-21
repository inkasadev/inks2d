import { D as DisplayObject } from '../DisplayObject-023e134d.js';

declare class Sprite extends DisplayObject {
    private _currentFrame;
    private _source;
    private _sourceX;
    private _sourceY;
    private _sourceWidth;
    private _sourceHeight;
    private _tilesetFrame;
    constructor(source: any);
    get currentFrame(): number;
    private createFromImage;
    private createFromAtlas;
    private createFromTileset;
    private createFromTilesetFrames;
    private createFromAtlasFrames;
    private createFromImages;
    gotoAndStop(frameNumber: number): void;
    render(ctx: CanvasRenderingContext2D): void;
}

declare class Spritemap extends DisplayObject {
    private readonly _framesPerRow;
    private _frames;
    private _loop;
    private _speed;
    private _currentFrame;
    private _currentAnim;
    private _frameInAnim;
    private _complete;
    private _playing;
    private _animations;
    private readonly _source;
    private _sourceX;
    private _sourceY;
    private readonly _sourceWidth;
    private readonly _sourceHeight;
    private _elapsed;
    onAnimStart?: (currentAnim: string, currentFrame: number) => void;
    onAnimUpdate?: (currentAnim: string, currentFrame: number) => void;
    onAnimComplete?: (currentAnim: string, currentFrame: number) => void;
    constructor(source: any, frameWidth: number, frameHeight: number);
    get complete(): boolean;
    get animationName(): string;
    get frame(): number;
    set frame(value: number);
    addAnimation(name: string, frames: string | number | number[], speed: number, loop: boolean): void;
    play(name: string): void;
    pause(): void;
    resume(): void;
    render(ctx: CanvasRenderingContext2D): void;
    private updtFrame;
}

export { Sprite, Spritemap };
