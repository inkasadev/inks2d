import { type DisplayObject } from "DisplayObject";
import { type Engine } from "Engine";
import { hitTestPoint } from "inks2d/collision";
import { Point } from "inks2d/math";
import { EC_DRAGGABLE_SPRITES } from "EngineConstants";

class Cursor {
	private _x: number = 0;
	private _y: number = 0;
	private readonly _g: Engine;

	public downTime: number = 0;
	public elapsedTime?: number;

	public isDown: boolean = false;
	public isUp: boolean = true;
	public tapped: boolean = false;
	public isPrimary: boolean = false;

	public clear: boolean = false;

	public dragSprite: any = null;
	public dragOffsetX: number = 0;
	public dragOffsetY: number = 0;

	constructor(game: Engine) {
		this._g = game;
	}

	get x(): number {
		return this._x / this._g.getViewportScale().x;
	}

	set x(value: number) {
		this._x = value;
	}

	get y(): number {
		return this._y / this._g.getViewportScale().y;
	}

	set y(value: number) {
		this._y = value;
	}
}

/**
 *
 * Main game engine class. Manages the game loop.
 *
 * ```ts
 * import { Engine } from "inks2d";
 *
 * const g = new Engine(500, 500);
 * g.start();
 * ```
 *
 */
export class Pointer {
	private readonly _g: Engine;
	private readonly _element: HTMLCanvasElement;
	private _x: number = 0;
	private _y: number = 0;
	private readonly _cursors: Map<number, Cursor>;
	private readonly _startPoint: Point = new Point();
	private readonly _endPoint: Point = new Point();

	public isDown: boolean = false;
	public isUp: boolean = true;
	public tapped: boolean = false;

	public press?: (cursor: Cursor) => void;
	public release?: (cursor: Cursor) => void;
	public tap?: (cursor: Cursor) => void;
	public move?: (cursor: Cursor) => void;
	public swipe?: (direction: string) => void;
	public swipeTolerance: number = 10;

	constructor(g: Engine) {
		this._g = g;
		this._element = g.canvas;
		this._cursors = new Map();

		this._element.addEventListener(
			"pointerdown",
			this.downHandler.bind(this),
			false,
		);
		this._element.addEventListener(
			"pointerup",
			this.upHandler.bind(this),
			false,
		);
		this._element.addEventListener(
			"pointermove",
			this.moveHandler.bind(this),
			false,
		);

		this._element.style.touchAction = "none";
	}

	get x(): number {
		return this._x / this._g.getViewportScale().x;
	}

	get y(): number {
		return this._y / this._g.getViewportScale().y;
	}

	get centerX(): number {
		return this._x;
	}

	get centerY(): number {
		return this._y;
	}

	get cursors(): Map<number, Cursor> {
		return this._cursors;
	}

	private swipeDirection(): void {
		const distX = this._startPoint.x - this._endPoint.x;
		const distY = this._startPoint.y - this._endPoint.y;

		if (Math.abs(distX) + Math.abs(distY) > this.swipeTolerance) {
			if (Math.abs(distX) > Math.abs(distY)) {
				if (distX > 0) {
					if (this.swipe != null) this.swipe("left");
				} else {
					if (this.swipe != null) this.swipe("right");
				}
			} else {
				if (distY > 0) {
					if (this.swipe != null) this.swipe("up");
				} else {
					if (this.swipe != null) this.swipe("down");
				}
			}
		}
	}

	private downHandler(e: PointerEvent): void {
		const cursor: Cursor = new Cursor(this._g);
		cursor.x = e.pageX - this._element.offsetLeft;
		cursor.y = e.pageY - this._element.offsetTop;

		cursor.isDown = true;
		cursor.isUp = false;
		cursor.tapped = false;

		cursor.downTime = Date.now();
		this._cursors.set(e.pointerId, cursor);

		if (e.isPrimary) {
			this._x = e.pageX - this._element.offsetLeft;
			this._y = e.pageY - this._element.offsetTop;

			this.isDown = true;
			this.isUp = false;
			this.tapped = false;

			cursor.isPrimary = true;
		}

		if (this.press != null) this.press(cursor);

		this._startPoint.set(this._x, this._y);

		e.preventDefault();
	}

	private upHandler(e: PointerEvent): void {
		const cursor = this._cursors.get(e.pointerId);

		if (!cursor) return;

		cursor.x = e.pageX - this._element.offsetLeft;
		cursor.y = e.pageY - this._element.offsetTop;

		cursor.isDown = false;
		cursor.isUp = true;

		cursor.elapsedTime = Math.abs(cursor.downTime - Date.now());
		this._cursors.set(e.pointerId, cursor);

		if (cursor.elapsedTime <= 200 && !cursor.tapped) {
			cursor.tapped = true;

			if (this.tap != null) this.tap(cursor);
		}

		if (e.isPrimary) {
			this._x = e.pageX - this._element.offsetLeft;
			this._y = e.pageY - this._element.offsetTop;
			this.isDown = false;
			this.isUp = true;
			this.tapped = cursor.tapped;
		}

		if (this.release != null) this.release(cursor);

		this._endPoint.set(this._x, this._y);

		this.swipeDirection();

		cursor.clear = true;

		e.preventDefault();
	}

	private moveHandler(e: PointerEvent): void {
		let cursor = this._cursors.get(e.pointerId);

		if (!cursor) cursor = new Cursor(this._g);

		cursor.x = e.pageX - this._element.offsetLeft;
		cursor.y = e.pageY - this._element.offsetTop;
		this._cursors.set(e.pointerId, cursor);

		if (e.isPrimary) {
			this._x = e.pageX - this._element.offsetLeft;
			this._y = e.pageY - this._element.offsetTop;
		}

		if (this.move != null) this.move(cursor);

		e.preventDefault();
	}

	clearCache(): void {
		const cIds = Array.from(this._cursors.keys());

		for (let i = this._cursors.size - 1; i >= 0; i--) {
			const cursor = this._cursors.get(cIds[i]);

			if (!cursor) continue;

			if (cursor.clear) this._cursors.delete(cIds[i]);
		}
	}

	_____updateDragAndDrop(): void {
		const cIds = Array.from(this._cursors.keys());

		for (let i = 0; i < cIds.length; i++) {
			const cursor = this._cursors.get(cIds[i]);

			if (!cursor) continue;

			if (cursor.isDown) {
				if (cursor.dragSprite === null) {
					for (let i = EC_DRAGGABLE_SPRITES.length - 1; i > -1; i--) {
						const sprite = EC_DRAGGABLE_SPRITES[i];

						if (
							hitTestPoint(new Point(cursor.x, cursor.y), sprite, true)
								.hasContact &&
							sprite.draggable &&
							sprite.visible
						) {
							if (sprite.allowHorizontalDrag)
								cursor.dragOffsetX = cursor.x - sprite.position.x;
							if (sprite.allowVerticalDrag)
								cursor.dragOffsetY = cursor.y - sprite.position.y;

							cursor.dragSprite = sprite;

							if (sprite.allowFocusDrag) {
								const children = sprite.parent?.children;
								if (children) {
									children.splice(children.indexOf(sprite), 1);
									children.push(sprite);
								}
							}

							EC_DRAGGABLE_SPRITES.splice(
								EC_DRAGGABLE_SPRITES.indexOf(sprite),
								1,
							);
							EC_DRAGGABLE_SPRITES.push(sprite);

							break;
						}
					}
				} else {
					if (cursor.dragSprite.allowHorizontalDrag)
						cursor.dragSprite.position.x = cursor.x - cursor.dragOffsetX;
					if (cursor.dragSprite.allowVerticalDrag)
						cursor.dragSprite.position.y = cursor.y - cursor.dragOffsetY;
				}
			}

			if (cursor.isUp) {
				cursor.dragSprite = null;
			}
		}

		EC_DRAGGABLE_SPRITES.some((sprite: DisplayObject) => {
			if (
				hitTestPoint(new Point(this._x, this._y), sprite, true).hasContact &&
				sprite.draggable &&
				sprite.visible
			) {
				this._element.style.cursor = "pointer";
				return true;
			}

			return false;
		});
	}
}
