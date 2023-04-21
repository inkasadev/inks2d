import { P as Point } from './DisplayObject-023e134d.js';

declare class Vector2D {
    private readonly _a;
    private readonly _b;
    private _vx;
    private _vy;
    private _scaleAmount;
    constructor(a?: Point, b?: Point, scaleAmount?: number);
    get a(): Point;
    get b(): Point;
    get vx(): number;
    set vx(value: number);
    get vy(): number;
    set vy(value: number);
    get angle(): number;
    set angle(value: number);
    get length(): number;
    set length(value: number);
    get lengthSquared(): number;
    get leftNormal(): Vector2D;
    get rightNormal(): Vector2D;
    get normalized(): Point;
    get scaleAmount(): number;
    set scaleAmount(value: number);
    /**
     *
     * @param v2 Another Point instance
     * @returns Number The dot product of this vector and
     * the one passed in as a parameter.
     */
    dotProd(v2: Vector2D): number;
    projection(v2: Vector2D): Vector2D;
    reverse(): void;
    /**
     *
     * @param v2 Another Point instance
     * @returns Number The dot product of this vector and
     * the one passed in as a parameter.
     */
    perpDotProd(v2: Vector2D): number;
    /**
     * Finds a vector that is perpendicular to this vector.
     *
     * @returns Point A vector perpendicular to this vector.
     */
    get perp(): Vector2D;
    /**
     *
     * @param v2 Another vector instance.
     * @returns Number If to the left, returns -1.
     * If to the right, +1;
     */
    sign(v2: Vector2D): number;
    clone(): Vector2D;
    draw(graphics: CanvasRenderingContext2D, basicMode?: boolean): void;
}

export { Vector2D as V };
