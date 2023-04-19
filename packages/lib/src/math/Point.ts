/**
 *
 * Main game engine class. Manages the game loop.
 *
 */
export class Point {
	private _x: number;
	private _y: number;

	/**
	 * Constructor.
	 *
	 * @param x
	 * @param y
	 */
	constructor(x: number = 0, y: number = 0) {
		this._x = x;
		this._y = y;
	}

	/**
	 * Generates a copy of this vector.
	 *
	 * @returns Point A copy of this vector
	 */
	public clone(): Point {
		return new Point(this._x, this._y);
	}

	/**
	 * Sets this vector's x and y values (and thus length) to zero.
	 *
	 * @returns Point A reference to this vector.
	 */
	public zero(): Point {
		this._x = 0;
		this._y = 0;

		return this;
	}

	/**
	 * Whether or not this vector is equal to zero,
	 * i.e. its x, y and length are zero.
	 *
	 * @returns Boolean True if vector is zero, otherwise false.
	 */
	public isZero(): boolean {
		return this._x === 0 && this._y === 0;
	}

	/***/
	get x(): number {
		return this._x;
	}

	/**
	 * Gets/Sets the x value of this vector.
	 */
	set x(value: number) {
		this._x = value;
	}

	/***/
	get y(): number {
		return this._y;
	}

	/**
	 * Gets/Sets the y value of this vector.
	 */
	set y(value: number) {
		this._y = value;
	}

	/***/
	get length(): number {
		return Math.sqrt(this.lengthSquared);
	}

	/**
	 * Gets/Sets the length or magnitude of this vector.
	 * Changing the length will change the x and y
	 * but not the angle of this vector.
	 */
	set length(value: number) {
		this._x = Math.cos(this.angle) * value;
		this._y = Math.sin(this.angle) * value;
	}

	/**
	 * Gets the length of this vector, squared.
	 */
	get lengthSquared(): number {
		return this._x * this._x + this._y * this._y;
	}

	/***/
	get angle(): number {
		return Math.atan2(this._y, this._x);
	}

	/**
	 * Gets/Sets the angle of this vector.
	 * Changing the angle also changes the x and y but
	 * retains the same length.
	 */
	set angle(value: number) {
		this._x = Math.cos(value) * this.length;
		this._y = Math.sin(value) * this.length;
	}

	public set(x: number = 0, y: number = 0): void {
		this.x = x;
		this.y = y;
	}

	/**
	 * Ensures the length of the vector is no longer than
	 * the given value.
	 *
	 * @param max The maximum value this vector should be.
	 * @returns
	 */
	public truncate(max: number): Point {
		this.length = Math.min(max, this.length);
		return this;
	}

	/**
	 * Whether or not this vector is normalized, i.e. its
	 * length is equal to one.
	 *
	 * @returns Boolean True if length is one, otherwise false.
	 */
	public isNormalized(): boolean {
		return this.length === 1;
	}

	/**
	 * Calculates the distance from this vector to another
	 * given vector.
	 *
	 * @param v2 A Point instance
	 * @returns Number The distance from this vector to the
	 * vector passed as a parameter.
	 */
	public dist(v2: Point): number {
		return Math.sqrt(this.distSquared(v2));
	}

	/**
	 * Calculates the distance squared from this vector to another
	 * given vector.
	 *
	 * @param v2 A Point instance
	 * @returns Number The distance squared from this vector
	 * to the vector passed as a parameter.
	 */
	public distSquared(v2: Point): number {
		const dx = v2.x - this.x;
		const dy = v2.y - this.y;

		return dx * dx + dy * dy;
	}

	/**
	 * Adds a vector to this vector, creating a new
	 * Point instance to hold the result.
	 *
	 * @param v2 A Point instance
	 * @returns Point A new vector containing the results of
	 * the addition.
	 */
	public add(v2: Point): Point {
		return new Point(this._x + v2.x, this._y + v2.y);
	}

	/**
	 * Subtracts a vector from this vector, creating a new
	 * Point instance to hold the result.
	 *
	 * @param v2 A Point instance
	 * @returns Point A new vector containing the results of
	 * the subtraction.
	 */
	public subtract(v2: Point): Point {
		return new Point(this._x - v2.x, this._y - v2.y);
	}

	/**
	 * Multiplies this vector by a value, creating a new
	 * Point instance to hold the result.
	 *
	 * @param value A number
	 * @returns Point A new vector containing the results of
	 * the multiplication.
	 */
	public multiply(value: number): Point {
		return new Point(this._x * value, this._y * value);
	}

	/**
	 * Divides this vector by a value, creating a new Point
	 * instance to hold the result.
	 *
	 * @param value A number
	 * @returns Point A new vector containing the results of
	 * the division.
	 */
	public divide(value: number): Point {
		return new Point(this._x / value, this._y / value);
	}

	/**
	 * Indicates whether this vector and another Point instance
	 * are equal in value.
	 *
	 * @param v2 A Point instance
	 * @returns Boolean True if the other vector is equal to
	 * this one, false if not.
	 */
	public equals(v2: Point): boolean {
		return this._x === v2.x && this._y === v2.y;
	}
}
