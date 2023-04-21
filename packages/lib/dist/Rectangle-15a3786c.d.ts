import { D as DisplayObject } from './DisplayObject-023e134d.js';

declare class Rectangle extends DisplayObject {
    constructor(width?: number, height?: number, fillStyle?: string, strokeStyle?: string, lineWidth?: number, radius?: number);
    render(ctx: CanvasRenderingContext2D): void;
}

export { Rectangle as R };
