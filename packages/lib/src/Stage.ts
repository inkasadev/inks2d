import { DisplayObject } from "./DisplayObject";

/**
 *
 * Updated by Engine, main game DisplayObject that holds all currently active display objects.
 *
 * > ⚠️ You can **ONLY** use this class by the {@link Scene.stage | Scene.stage} property.
 *
 * ```ts
 * import { Engine, Scene } from "inks2d";
 * import { Rectangle } from "inks2d/graphics";
 * import { Point } from "inks2d/math";
 *
 * const g = new Engine(500, 500);
 *
 * class Main extends Scene {
 * 	constructor() {
 * 		super();
 * 	}
 *
 *	start(e: Engine) {
 * 		super.start(e);
 *
 * 		const box = new Rectangle();
 * 		box.position = new Point(g.stage.width / 2, g.stage.height / 2);
 * 		g.stage.addChild(box);
 * 	}
 * }
 *
 * g.scene = new Main();
 * g.start();
 *
 * ```
 *
 * @category inks2d
 */
export class Stage extends DisplayObject {
	private readonly _graphics: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement, width: number, height: number) {
		super();

		this.width = width;
		this.height = height;
		this._graphics = canvas.getContext("2d") as CanvasRenderingContext2D;
	}

	/**
	 * Graphics object where drawing commands can occur.
	 */
	get graphics(): CanvasRenderingContext2D {
		return this._graphics;
	}

	private updateChildren(children: DisplayObject[]): void {
		for (let i = children.length - 1; i >= 0; i--) {
			const child = children[i];

			child.update && child.update();

			if (child.children && child.children.length > 0) {
				this.updateChildren(child.children);
				continue;
			}
		}
	}

	override update(): void {
		this.updateChildren(this.children);
	}
}
