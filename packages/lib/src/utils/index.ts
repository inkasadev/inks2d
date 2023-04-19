import { type DisplayObject } from "DisplayObject";
import { type Pointer } from "../inputs/Pointer";
import { EC_BUTTONS, EC_SHAKING_SPRITES } from "EngineConstants";
import { Sprite } from "inks2d/graphics";
import { hitTestPoint } from "inks2d/collision";
import { Point, randomInt } from "inks2d/math";
import { getIndex } from "inks2d/tiles";

export const Detect = {
	Android: () => !(navigator.userAgent.match(/Android/i) == null),
	iOS: () => !(navigator.userAgent.match(/iPhone|iPad|iPod/i) == null),
};

export const wait = async (
	duration: number = 0,
): Promise<PromiseConstructor> => {
	return await new Promise(function (resolve) {
		setTimeout(resolve, duration);
	});
};

export const shake = (
	sprite: DisplayObject,
	numberOfShakes: number = 10,
	magnitude: number = 16,
	angular: boolean = false,
): void => {
	let counter = 1;
	const startX = sprite.position.x;
	const startY = sprite.position.y;
	const startAngle = sprite.rotation;
	let tiltAngle = 1;

	const magnitudeUnit = magnitude / numberOfShakes;

	if (!EC_SHAKING_SPRITES.includes(sprite)) {
		EC_SHAKING_SPRITES.push(sprite);

		sprite.customProperties._____updateShake = function () {
			if (angular) {
				angularShake();
			} else {
				upAndDownShake();
			}
		};
	}

	function upAndDownShake(): void {
		if (counter < numberOfShakes) {
			sprite.position.x = startX;
			sprite.position.y = startY;

			magnitude -= magnitudeUnit;

			sprite.position.x += randomInt(-magnitude, magnitude);
			sprite.position.y += randomInt(-magnitude, magnitude);

			counter++;
		}

		if (counter >= numberOfShakes) {
			sprite.position.x = startX;
			sprite.position.y = startY;
			EC_SHAKING_SPRITES.splice(EC_SHAKING_SPRITES.indexOf(sprite), 1);
		}
	}

	function angularShake(): void {
		if (counter < numberOfShakes) {
			sprite.rotation = startAngle;
			magnitude -= magnitudeUnit;
			sprite.rotation = magnitude * tiltAngle;
			counter++;
			tiltAngle *= -1;
		}

		if (counter >= numberOfShakes) {
			sprite.rotation = startAngle;
			EC_SHAKING_SPRITES.splice(EC_SHAKING_SPRITES.indexOf(sprite), 1);
		}
	}
};

export const makeInteractive = (sprite: DisplayObject): void => {
	sprite.customProperties.buttonProps = {};
	const { buttonProps } = sprite.customProperties;
	const isInstanceOfSprite = sprite instanceof Sprite;

	buttonProps.enabled = true;
	buttonProps.state = "up";
	buttonProps.action = "";
	buttonProps.pressed = false;
	buttonProps.hoverOver = false;
	buttonProps._pointerId = undefined;
	buttonProps._____updateButton = (pointer: Pointer) => {
		const cursors = pointer.cursors;
		const cIds = Array.from(cursors.keys());

		if (!sprite.visible || !buttonProps.enabled) {
			buttonProps.state = "up";
			buttonProps.action = "";
			return;
		}

		for (let i = cIds.length - 1; i >= 0; i--) {
			const cursor = cursors.get(cIds[i]);

			if (!cursor) continue;

			const hit = hitTestPoint(new Point(cursor.x, cursor.y), sprite, true);

			if (cursor.isUp) {
				if (buttonProps._pointerId === cIds[i] || cIds.length === 1) {
					buttonProps.state = "up";
					isInstanceOfSprite && sprite.gotoAndStop(0);
					buttonProps._pointerId = undefined;
				}
			}

			if (hit.hasContact) {
				buttonProps.state = "over";

				if (isInstanceOfSprite && sprite.frames && sprite.frames.length === 3) {
					sprite.gotoAndStop(1);
				}

				if (cursor.isDown) {
					buttonProps.state = "down";
					buttonProps._pointerId = cIds[i];

					isInstanceOfSprite && sprite.gotoAndStop(1);

					if (isInstanceOfSprite && sprite.frames.length === 3) {
						sprite.gotoAndStop(2);
					}
				}
			} else {
				if (buttonProps._pointerId === cIds[i] || cIds.length === 1) {
					buttonProps.state = "up";
					buttonProps.pressed = false;

					isInstanceOfSprite && sprite.gotoAndStop(0);

					buttonProps._pointerId = undefined;
				}
			}

			if (buttonProps.state === "down") {
				if (!buttonProps.pressed) {
					if (buttonProps.press) buttonProps.press(this);

					buttonProps.pressed = true;
					buttonProps.action = "pressed";
				}
			}

			if (buttonProps.state === "over") {
				if (buttonProps.pressed) {
					if (buttonProps.release) buttonProps.release(sprite);

					buttonProps.pressed = false;
					buttonProps.action = "released";

					if (cursor.tapped && buttonProps.tap) buttonProps.tap(sprite);
				}

				if (!buttonProps.hoverOver) {
					if (buttonProps.over) buttonProps.over(sprite);

					buttonProps.hoverOver = true;
				}
			}

			if (buttonProps.state === "up") {
				if (buttonProps.pressed) {
					if (buttonProps.release) buttonProps.release(sprite);

					buttonProps.pressed = false;
					buttonProps.action = "released";
				}

				if (buttonProps.hoverOver) {
					if (buttonProps.out) buttonProps.out(sprite);

					buttonProps.hoverOver = false;
				}
			}
		}
	};

	EC_BUTTONS.push(sprite);
};

export const remove = (...spritesToRemove: DisplayObject[]): void => {
	spritesToRemove.forEach((sprite) => {
		if (sprite.parent != null) sprite.parent.removeChild(sprite);
	});
};

export const frame = (
	source: HTMLImageElement,
	x: number,
	y: number,
	width: number,
	height: number,
): {
	image: HTMLImageElement;
	x: number;
	y: number;
	width: number;
	height: number;
} => {
	return {
		image: source,
		x,
		y,
		width,
		height,
	};
};

export const frames = (
	source: HTMLImageElement,
	arrOfPositions: number[],
	width: number,
	height: number,
): {
	image: HTMLImageElement;
	data: number[];
	width: number;
	height: number;
} => {
	return {
		image: source,
		data: arrOfPositions,
		width,
		height,
	};
};

export const contain = (
	sprite: DisplayObject,
	bounds: { x: number; y: number; width: number; height: number },
	bounce: boolean = false,
	callback?: (side: string) => void,
): string | undefined => {
	const x = bounds.x;
	const y = bounds.y;
	const width = bounds.width;
	const height = bounds.height;
	let side;

	if (sprite.position.x < x) {
		if (bounce) sprite.velocity.x *= -1;

		if (sprite.mass) sprite.velocity.x /= sprite.mass;

		sprite.position.x = x;
		side = "left";
	}

	if (sprite.position.y < y) {
		if (bounce) sprite.velocity.y *= -1;

		if (sprite.mass) sprite.velocity.y /= sprite.mass;

		sprite.position.y = y;
		side = "top";
	}

	if (sprite.position.x > width) {
		if (bounce) sprite.velocity.x *= -1;

		if (sprite.mass) sprite.velocity.x /= sprite.mass;

		sprite.position.x = width;
		side = "right";
	}

	if (sprite.position.y > height) {
		if (bounce) sprite.velocity.y *= -1;

		if (sprite.mass) sprite.velocity.y /= sprite.mass;

		sprite.position.y = height;
		side = "bottom";
	}

	if (side && callback) callback(side);

	return side;
};

export const getSpatialGrid = (
	spritesArray: DisplayObject[],
	columns: number = 0,
	rows: number = 0,
	cellWidth: number = 32,
	cellHeight: number = 32,
): any[] => {
	const length = columns * rows;
	const gridArray: any[] = [];

	for (let i = 0; i < length; i++) {
		gridArray.push([]);
	}

	spritesArray.forEach((sprite) => {
		const index = getIndex(
			sprite.position.clone(),
			cellWidth,
			cellHeight,
			columns,
		);

		gridArray[index].push(sprite);
	});

	return gridArray;
};

export const move = (...sprites: DisplayObject[]): void => {
	sprites.forEach((s) => {
		s.position = s.position.add(s.velocity);
	});
};

export const miliToTimer = (
	mili: number,
	includeHour: boolean = false,
	removeSpace: boolean = false,
): string => {
	let h, s;
	s = mili / 1000;

	if (includeHour) {
		h = Math.floor(s / 3600);
		s = s % 3600;
	}

	const m = Math.floor(s / 60);
	s = Math.floor(s % 60);

	let txtHour = "";
	if (h) txtHour = h >= 10 ? `${h}` : h > 0 ? `0${h}` : "00";
	const txtMinute = m >= 10 ? m : m > 0 ? `0${m}` : "00";
	const txtSeconds = s >= 10 ? s : s > 0 ? `0${s}` : "00";

	let timer = includeHour ? `${txtHour?.toString()} : ` : "";
	timer += `${txtMinute} : ${txtSeconds}`;

	if (removeSpace) timer = timer.split(" ").join("");

	return timer;
};
