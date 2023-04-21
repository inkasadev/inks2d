/**
 *
 * Main game engine class. Manages the game loop.
 *
 */
declare class Point {
	private _x;
	private _y;
	/**
	 * Constructor.
	 *
	 * @param x
	 * @param y
	 */
	constructor(x?: number, y?: number);
	/**
	 * Generates a copy of this vector.
	 *
	 * @returns Point A copy of this vector
	 */
	clone(): Point;
	/**
	 * Sets this vector's x and y values (and thus length) to zero.
	 *
	 * @returns Point A reference to this vector.
	 */
	zero(): Point;
	/**
	 * Whether or not this vector is equal to zero,
	 * i.e. its x, y and length are zero.
	 *
	 * @returns Boolean True if vector is zero, otherwise false.
	 */
	isZero(): boolean;
	/***/
	get x(): number;
	/**
	 * Gets/Sets the x value of this vector.
	 */
	set x(value: number);
	/***/
	get y(): number;
	/**
	 * Gets/Sets the y value of this vector.
	 */
	set y(value: number);
	/***/
	get length(): number;
	/**
	 * Gets/Sets the length or magnitude of this vector.
	 * Changing the length will change the x and y
	 * but not the angle of this vector.
	 */
	set length(value: number);
	/**
	 * Gets the length of this vector, squared.
	 */
	get lengthSquared(): number;
	/***/
	get angle(): number;
	/**
	 * Gets/Sets the angle of this vector.
	 * Changing the angle also changes the x and y but
	 * retains the same length.
	 */
	set angle(value: number);
	set(x?: number, y?: number): void;
	/**
	 * Ensures the length of the vector is no longer than
	 * the given value.
	 *
	 * @param max The maximum value this vector should be.
	 * @returns
	 */
	truncate(max: number): Point;
	/**
	 * Whether or not this vector is normalized, i.e. its
	 * length is equal to one.
	 *
	 * @returns Boolean True if length is one, otherwise false.
	 */
	isNormalized(): boolean;
	/**
	 * Calculates the distance from this vector to another
	 * given vector.
	 *
	 * @param v2 A Point instance
	 * @returns Number The distance from this vector to the
	 * vector passed as a parameter.
	 */
	dist(v2: Point): number;
	/**
	 * Calculates the distance squared from this vector to another
	 * given vector.
	 *
	 * @param v2 A Point instance
	 * @returns Number The distance squared from this vector
	 * to the vector passed as a parameter.
	 */
	distSquared(v2: Point): number;
	/**
	 * Adds a vector to this vector, creating a new
	 * Point instance to hold the result.
	 *
	 * @param v2 A Point instance
	 * @returns Point A new vector containing the results of
	 * the addition.
	 */
	add(v2: Point): Point;
	/**
	 * Subtracts a vector from this vector, creating a new
	 * Point instance to hold the result.
	 *
	 * @param v2 A Point instance
	 * @returns Point A new vector containing the results of
	 * the subtraction.
	 */
	subtract(v2: Point): Point;
	/**
	 * Multiplies this vector by a value, creating a new
	 * Point instance to hold the result.
	 *
	 * @param value A number
	 * @returns Point A new vector containing the results of
	 * the multiplication.
	 */
	multiply(value: number): Point;
	/**
	 * Divides this vector by a value, creating a new Point
	 * instance to hold the result.
	 *
	 * @param value A number
	 * @returns Point A new vector containing the results of
	 * the division.
	 */
	divide(value: number): Point;
	/**
	 * Indicates whether this vector and another Point instance
	 * are equal in value.
	 *
	 * @param v2 A Point instance
	 * @returns Boolean True if the other vector is equal to
	 * this one, false if not.
	 */
	equals(v2: Point): boolean;
}

interface Bounds {
	x: number;
	y: number;
	width: number;
	height: number;
}
/**
 *
 * The DisplayObject class is the base class for all objects that can be placed on the display list. The display list manages all objects displayed in the Inks2D game engine. Display objects can have child display objects.
 *
 * The DisplayObject class itself does not include any APIs for rendering content onscreen. For that reason, if you want create a custom subclass of the DisplayObject class, you will want to extend one of its subclasses that do have APIs for rendering content onscreen, such as the Sprite, Spritemap, Button, etc.
 *
 * \> ⚠️ DisplayObject is an abstract base class; therefore, you cannot call DisplayObject directly.
 * All display objects inherit from the DisplayObject class.
 *
 * @category inks2d
 */
declare abstract class DisplayObject {
	private _layer;
	private _draggable;
	private _visible;
	private _rotation;
	private readonly _children;
	/**
	 * The x and y positions of the display object in the Stage.
	 */
	position: Point;
	/**
	 * Helper property. Can be used to set the display object velocity.
	 */
	velocity: Point;
	/**
	 * Helper property. Can be used to set the display object acceleration.
	 */
	acceleration: Point;
	/**
	 * Helper property. Can be used to set the display object friction.
	 */
	friction: Point;
	/**
	 * Helper property. Can be used to set the display object gravity.
	 */
	gravity: Point;
	/**
	 * Width of the display object.
	 */
	width: number;
	/**
	 * Height of the display object.
	 */
	height: number;
	/**
	 * The display object bounds.
	 */
	bounds: Bounds;
	/**
	 * Sets the DisplayObject object name.
	 */
	name: string;
	/**
	 * Helper property. Sets the display object mass.
	 */
	mass: number;
	/**
	 * Indicates the alpha transparency value of the display object.
	 */
	alpha: number;
	/**
	 * Sets if the display object would be rendered outside the viewport.
	 */
	renderOutside: boolean;
	/**
	 * Indicates the horizontal/vertical scale of the display object.
	 */
	scale: Point;
	/**
	 * Sets if the display object can be vertically draggable.
	 */
	allowVerticalDrag: boolean;
	/**
	 * Sets if the display object can be horizontally draggable.
	 */
	allowHorizontalDrag: boolean;
	/**
	 * Defines if the display object can be draggable.
	 */
	allowFocusDrag: boolean;
	/**
	 * Sets the pivot of the display object.
	 */
	pivot: Point;
	/**
	 * The display object that contains this display object.
	 */
	parent?: DisplayObject;
	/**
	 * Enables/Disables display object's shadow.
	 */
	shadow: boolean;
	shadowColor: string;
	shadowOffsetX: number;
	shadowOffsetY: number;
	shadowBlur: number;
	isOnViewport: boolean;
	blendMode: GlobalCompositeOperation;
	filter: string;
	frames: any[];
	loop: boolean;
	fillStyle: string;
	strokeStyle: string;
	lineWidth: number;
	mask: boolean;
	customProperties: Record<string, any>;
	/***/
	get rotation(): number;
	/**
	 * Indicates the rotation of the display object, in radians, from its original orientation.
	 */
	set rotation(value: number);
	/**
	 * The X global position.
	 */
	get gx(): number;
	/**
	 * The Y global position.
	 */
	get gy(): number;
	/** */
	get layer(): number;
	/**
	 * The rendering layer of this display object.
	 */
	set layer(value: number);
	/** */
	get visible(): boolean;
	/**
	 * If the display object should render.
	 */
	set visible(value: boolean);
	/**
	 * The children of this display object.
	 */
	get children(): DisplayObject[];
	/**
	 * Half the display object's width.
	 *
	 * @readonly
	 */
	get halfWidth(): number;
	/**
	 * Half the display object's height.
	 *
	 * @readonly
	 */
	get halfHeight(): number;
	/**
	 * The center x position of the display object.
	 *
	 * Same as {@link localCenterX}.
	 */
	get centerX(): number;
	/**
	 * The center y position of the display object.
	 *
	 * Same as {@link localCenterY}.
	 */
	get centerY(): number;
	/**
	 * The local center x position of the display object.
	 *
	 * Same as {@link centerX}.
	 */
	get localCenterX(): number;
	/**
	 * The local center y position of the display object.
	 *
	 * Same as {@link centerY}.
	 */
	get localCenterY(): number;
	/**
	 * The global center x position of the display object.
	 */
	get globalCenterX(): number;
	/**
	 * The global center y position of the display object.
	 */
	get globalCenterY(): number;
	/**
	 * Gets the display object's local bounds properties.
	 *
	 * @returns Bounds
	 */
	localBounds(): Bounds;
	/**
	 * Gets the display object's global bounds properties.
	 *
	 * @returns Bounds
	 */
	globalBounds(): Bounds;
	get empty(): boolean;
	get draggable(): boolean;
	set draggable(value: boolean);
	added(): void;
	update(): void;
	destroy(): void;
	move(): void;
	addChild(sprite: DisplayObject): void;
	removeChild(sprite: DisplayObject): boolean;
	putTop(sprite: DisplayObject, xOffset?: number, yOffset?: number): void;
	putRight(sprite: DisplayObject, xOffset?: number, yOffset?: number): void;
	putBottom(sprite: DisplayObject, xOffset?: number, yOffset?: number): void;
	putLeft(sprite: DisplayObject, xOffset?: number, yOffset?: number): void;
	putCenter(sprite: DisplayObject, xOffset?: number, yOffset?: number): void;
	swapChildren(child1: DisplayObject, child2: DisplayObject): void;
	add(...spritesToAdd: DisplayObject[]): void;
	remove(...spritesToRemove: DisplayObject[]): void;
}

export { DisplayObject as D, Point as P };
