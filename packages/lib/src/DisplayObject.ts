import {
	EC_BUTTONS,
	EC_DRAGGABLE_SPRITES,
	EC_PARTICLES,
	EC_SHAKING_SPRITES,
} from "./EngineConstants";
import { Point } from "./math";

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
export abstract class DisplayObject {
	private _layer: number = 0;
	private _draggable: boolean = false;
	private _visible: boolean = true;
	private _rotation: number = 0;
	private readonly _children: DisplayObject[] = [];

	/**
	 * The x and y positions of the display object in the Stage.
	 */
	public position: Point = new Point(0, 0);

	/**
	 * Helper property. Can be used to set the display object velocity.
	 */
	public velocity: Point = new Point(0, 0);

	/**
	 * Helper property. Can be used to set the display object acceleration.
	 */
	public acceleration: Point = new Point(0, 0);

	/**
	 * Helper property. Can be used to set the display object friction.
	 */
	public friction: Point = new Point(0.96, 0.96);

	/**
	 * Helper property. Can be used to set the display object gravity.
	 */
	public gravity: Point = new Point(0, 0);

	/**
	 * Width of the display object.
	 */
	public width: number = 0;

	/**
	 * Height of the display object.
	 */
	public height: number = 0;

	/**
	 * The display object bounds.
	 */
	public bounds: Bounds = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	};

	/**
	 * Sets the DisplayObject object name.
	 */
	public name: string = "";

	/**
	 * Helper property. Sets the display object mass.
	 */
	public mass: number = 1;

	/**
	 * Indicates the alpha transparency value of the display object.
	 */
	public alpha: number = 1;

	/**
	 * Sets if the display object would be rendered outside the viewport.
	 */
	public renderOutside: boolean = false;

	/**
	 * Indicates the horizontal/vertical scale of the display object.
	 */
	public scale: Point = new Point(1, 1);

	/**
	 * Sets if the display object can be vertically draggable.
	 */
	public allowVerticalDrag: boolean = true;

	/**
	 * Sets if the display object can be horizontally draggable.
	 */
	public allowHorizontalDrag: boolean = true;

	/**
	 * Defines if the display object can be draggable.
	 */
	public allowFocusDrag: boolean = true;

	/**
	 * Sets the pivot of the display object.
	 */
	public pivot: Point = new Point(0.5, 0.5);

	/**
	 * The display object that contains this display object.
	 */
	public parent?: DisplayObject;

	/**
	 * Enables/Disables display object's shadow.
	 */
	public shadow: boolean = false;

	public shadowColor: string = "rgba(100, 100, 100, 0.5)";
	public shadowOffsetX: number = 3;
	public shadowOffsetY: number = 3;
	public shadowBlur: number = 3;
	public isOnViewport: boolean = true;

	public blendMode: GlobalCompositeOperation = "source-over";
	public filter: string = "none";

	public frames: any[] = [];
	public loop: boolean = true;

	public fillStyle: string = "gray";
	public strokeStyle: string = "none";
	public lineWidth: number = 0;
	public mask: boolean = false;

	public customProperties: Record<string, any> = {};

	/***/
	get rotation(): number {
		return this._rotation;
	}

	/**
	 * Indicates the rotation of the display object, in radians, from its original orientation.
	 */
	set rotation(value: number) {
		this._rotation = value % (Math.PI * 2);
	}

	/**
	 * The X global position.
	 */
	get gx(): number {
		if (this.parent != null) return this.position.x + this.parent.gx;
		return this.position.x;
	}

	/**
	 * The Y global position.
	 */
	get gy(): number {
		if (this.parent != null) return this.position.y + this.parent.gy;
		return this.position.y;
	}

	/** */
	get layer(): number {
		return this._layer;
	}

	/**
	 * The rendering layer of this display object.
	 */
	set layer(value: number) {
		this._layer = value;

		if (this.parent != null) {
			this.parent.children.sort((a, b) => {
				return a.layer - b.layer;
			});
		}
	}

	/** */
	get visible(): boolean {
		if (this.parent != null && !this.parent.visible) return false;
		return this._visible;
	}

	/**
	 * If the display object should render.
	 */
	set visible(value: boolean) {
		this._visible = value;
	}

	/**
	 * The children of this display object.
	 */
	get children(): DisplayObject[] {
		return this._children;
	}

	/**
	 * Half the display object's width.
	 *
	 * @readonly
	 */
	get halfWidth(): number {
		return this.width / 2;
	}

	/**
	 * Half the display object's height.
	 *
	 * @readonly
	 */
	get halfHeight(): number {
		return this.height / 2;
	}

	/**
	 * The center x position of the display object.
	 *
	 * Same as {@link localCenterX}.
	 */
	get centerX(): number {
		return this.localCenterX;
	}

	/**
	 * The center y position of the display object.
	 *
	 * Same as {@link localCenterY}.
	 */
	get centerY(): number {
		return this.localCenterY;
	}

	/**
	 * The local center x position of the display object.
	 *
	 * Same as {@link centerX}.
	 */
	get localCenterX(): number {
		return (
			this.position.x -
			this.width * this.pivot.x +
			this.bounds.x +
			this.bounds.width / 2
		);
	}

	/**
	 * The local center y position of the display object.
	 *
	 * Same as {@link centerY}.
	 */
	get localCenterY(): number {
		return (
			this.position.y -
			this.height * this.pivot.y +
			this.bounds.y +
			this.bounds.height / 2
		);
	}

	/**
	 * The global center x position of the display object.
	 */
	get globalCenterX(): number {
		return (
			this.gx -
			this.width * this.pivot.x +
			this.bounds.x +
			this.bounds.width / 2
		);
	}

	/**
	 * The global center y position of the display object.
	 */
	get globalCenterY(): number {
		return (
			this.gy -
			this.height * this.pivot.y +
			this.bounds.y +
			this.bounds.height / 2
		);
	}

	/**
	 * Gets the display object's local bounds properties.
	 *
	 * @returns Bounds
	 */
	localBounds(): Bounds {
		return {
			x: this.position.x + this.bounds.x,
			y: this.position.y + this.bounds.y,
			width: this.bounds.width,
			height: this.bounds.height,
		};
	}

	/**
	 * Gets the display object's global bounds properties.
	 *
	 * @returns Bounds
	 */
	globalBounds(): Bounds {
		return {
			x: this.gx + this.bounds.x,
			y: this.gy + this.bounds.y,
			width: this.bounds.width,
			height: this.bounds.height,
		};
	}

	get empty(): boolean {
		if (this.children.length === 0) return true;
		return false;
	}

	get draggable(): boolean {
		return this._draggable;
	}

	set draggable(value: boolean) {
		if (value) {
			EC_DRAGGABLE_SPRITES.push(this);
			this._draggable = true;
			return;
		}

		EC_DRAGGABLE_SPRITES.splice(EC_DRAGGABLE_SPRITES.indexOf(this), 1);
	}

	added(): void {}
	update(): void {}
	destroy(): void {
		for (let i = this.children.length - 1; i >= 0; i--) {
			const child = this.children[i];
			this.removeChild(child);
		}
	}

	move(): void {
		this.velocity = this.velocity.add(this.acceleration);

		this.velocity.x *= this.friction.x;
		this.velocity.y *= this.friction.y;

		if (Math.abs(this.velocity.x) < 0.05 && Math.abs(this.velocity.y) < 0.05) {
			this.acceleration.x = 0;
			this.acceleration.y = 0;
		}

		this.velocity = this.velocity.add(this.gravity);
		this.position = this.position.add(this.velocity);
	}

	addChild(sprite: DisplayObject): void {
		if (sprite.parent != null) {
			sprite.parent.remove(sprite);
		}

		sprite.parent = this;

		if (sprite.bounds.width === 0) sprite.bounds.width = sprite.width;
		if (sprite.bounds.height === 0) sprite.bounds.height = sprite.height;

		this.children.push(sprite);

		sprite.added();

		const spriteLayer = sprite.layer;
		if (spriteLayer !== 0) sprite.layer = spriteLayer;
	}

	removeChild(sprite: DisplayObject): boolean {
		if (sprite.parent === this) {
			const btnId = EC_BUTTONS.indexOf(sprite);
			const dragId = EC_DRAGGABLE_SPRITES.indexOf(sprite);
			const particleId = EC_PARTICLES.indexOf(sprite);
			const shakeId = EC_SHAKING_SPRITES.indexOf(sprite);

			this.children.splice(this.children.indexOf(sprite), 1);

			if (btnId !== -1) EC_BUTTONS.splice(btnId, 1);

			if (dragId !== -1) EC_DRAGGABLE_SPRITES.splice(dragId, 1);

			if (particleId !== -1) EC_PARTICLES.splice(particleId, 1);

			if (shakeId !== -1) EC_SHAKING_SPRITES.splice(shakeId, 1);

			sprite.destroy();

			sprite.parent = undefined;

			return true;
		}

		throw new Error(
			`${JSON.stringify(sprite)} is not a child of ${JSON.stringify(this)}`,
		);
	}

	putTop(sprite: DisplayObject, xOffset = 0, yOffset = 0): void {
		yOffset *= -1;
		sprite.position.x =
			this.position.x + this.halfWidth - sprite.halfWidth + xOffset;
		sprite.position.y = this.position.y - sprite.height + yOffset;
	}

	putRight(sprite: DisplayObject, xOffset = 0, yOffset = 0): void {
		sprite.position.x = this.position.x + this.width + xOffset;
		sprite.position.y =
			this.position.y + this.halfHeight - sprite.halfHeight + yOffset;
	}

	putBottom(sprite: DisplayObject, xOffset = 0, yOffset = 0): void {
		sprite.position.x =
			this.position.x + this.halfWidth - sprite.halfWidth + xOffset;
		sprite.position.y = this.position.y + this.height + yOffset;
	}

	putLeft(sprite: DisplayObject, xOffset = 0, yOffset = 0): void {
		xOffset *= -1;
		sprite.position.x = this.position.x - sprite.width + xOffset;
		sprite.position.y =
			this.position.y + this.halfHeight - sprite.halfHeight + yOffset;
	}

	putCenter(sprite: DisplayObject, xOffset = 0, yOffset = 0): void {
		sprite.position.x =
			this.position.x - this.width * this.pivot.x + this.halfWidth + xOffset;
		sprite.position.y =
			this.position.y - this.height * this.pivot.y + this.halfHeight + yOffset;
	}

	swapChildren(child1: DisplayObject, child2: DisplayObject): void {
		const index1 = this.children.indexOf(child1);
		const index2 = this.children.indexOf(child2);

		if (index1 !== -1 && index2 !== -1) {
			this.children[index1] = child2;
			this.children[index2] = child1;
			return;
		}

		throw new Error(
			`Both objects must be a child of the calle ${JSON.stringify(this)}`,
		);
	}

	add(...spritesToAdd: DisplayObject[]): void {
		spritesToAdd.forEach((sprite) => {
			this.addChild(sprite);
		});
	}

	remove(...spritesToRemove: DisplayObject[]): void {
		spritesToRemove.forEach((sprite) => this.removeChild(sprite));
	}
}
