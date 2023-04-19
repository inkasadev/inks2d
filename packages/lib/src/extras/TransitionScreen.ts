import { Engine } from "Engine";
import { Tween } from "inks2d/effects/tweens";
import { Rectangle } from "inks2d/geom";
import { Point } from "inks2d/math";

export class TransitionScreen extends Rectangle {
	private _delay: number;
	public onBetween: (() => void) | undefined;

	constructor(delay: number, g: Engine, color: string = "black") {
		super(g.stage.width, g.stage.height, color);

		this.pivot = new Point();
		this.alpha = 0;
		this._delay = delay;
	}

	start(removeAfterBlink: boolean = true): void {
		const tween1 = new Tween();
		tween1.onComplete = () => {
			if (this.onBetween) this.onBetween();
		};
		tween1.onUpdate = ({ alpha }) => {
			this.alpha = alpha;
		};
		tween1.from({ alpha: 0 }).to({ alpha: 1 }).duration(this._delay);

		const tween2 = new Tween();
		tween2.onComplete = () => {
			if (removeAfterBlink) this.parent?.removeChild(this);
		};
		tween2.onUpdate = ({ alpha }) => {
			this.alpha = alpha;
		};
		tween2.from({ alpha: 1 }).to({ alpha: 0 }).duration(this._delay);

		tween1.chain(tween2);
		tween1.start();
	}
}
