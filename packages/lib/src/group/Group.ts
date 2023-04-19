import { DisplayObject } from "DisplayObject";

export class Group extends DisplayObject {
	private _resize: boolean = false;

	constructor(...spritesToGroup: DisplayObject[]) {
		super();
		this.add(...spritesToGroup);
	}

	get dynamicSize(): boolean {
		return this._resize;
	}

	set dynamicSize(value: boolean) {
		this._resize = value;
		if (value) this.calculateSize();
	}

	private calculateSize(): void {
		if (this.children.length > 0) {
			let _newWidth = 0;
			let _newHeight = 0;

			this.children.forEach((child) => {
				if (child.position.x + child.width > _newWidth) {
					_newWidth = child.position.x + child.width;
				}

				if (child.position.y + child.height > _newHeight) {
					_newHeight = child.position.y + child.height;
				}
			});

			this.width = _newWidth;
			this.height = _newHeight;
		}
	}

	public override addChild(sprite: DisplayObject): void {
		super.addChild(sprite);
		this.calculateSize();
	}

	public override removeChild(sprite: DisplayObject): boolean {
		const isRemoved = super.removeChild(sprite);

		if (isRemoved) this.calculateSize();

		return isRemoved;
	}
}
