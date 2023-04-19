export class Keyboard {
	private readonly _keys: number[] = [];

	public isDown: boolean = false;
	public isUp: boolean = true;
	public press?: (e: KeyboardEvent) => void;
	public release?: (e: KeyboardEvent) => void;

	constructor(...keys: number[]) {
		this._keys = [...keys];

		window.addEventListener("keydown", this.downHandler.bind(this), false);
		window.addEventListener("keyup", this.upHandler.bind(this), false);
	}

	removeListeners(): void {
		window.removeEventListener("keydown", this.downHandler.bind(this), false);
		window.removeEventListener("keyup", this.upHandler.bind(this), false);
	}

	private downHandler(e: KeyboardEvent): void {
		if (this._keys.includes(e.keyCode) || this._keys.length === 0) {
			if (this.isUp && this.press != null) {
				this.press(e);
			}

			this.isDown = true;
			this.isUp = false;
		}

		e.preventDefault();
	}

	private upHandler(e: KeyboardEvent): void {
		if (this._keys.includes(e.keyCode) || this._keys.length === 0) {
			if (this.release != null) {
				this.release(e);
			}

			this.isDown = false;
			this.isUp = true;
		}

		e.preventDefault();
	}
}
