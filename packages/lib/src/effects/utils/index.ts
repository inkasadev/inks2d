import { DisplayObject } from "DisplayObject";
import { Point, randomInt } from "inks2d/math";
import { Easing, Interpolation, Tween } from "inks2d/effects/tweens";
import { Sound } from "inks2d/effects/sfx";

export const fadeIn = (
	sprite: DisplayObject,
	duration: number,
	easing = Easing.Linear.None,
	interpolation = Interpolation.Linear,
): Tween => {
	const tween = new Tween();
	tween.onUpdate = (props) => {
		sprite.alpha = props.alpha;
	};
	tween
		.from({ alpha: sprite.alpha })
		.to({ alpha: 1 })
		.duration(duration)
		.easing(easing)
		.interpolation(interpolation)
		.start();

	return tween;
};

export const fadeOut = (
	sprite: DisplayObject,
	duration: number,
	easing = Easing.Linear.None,
	interpolation = Interpolation.Linear,
): Tween => {
	const tween = new Tween();
	tween.onUpdate = (props) => {
		sprite.alpha = props.alpha;
	};
	tween
		.from({ alpha: sprite.alpha })
		.to({ alpha: 0 })
		.duration(duration)
		.easing(easing)
		.interpolation(interpolation)
		.start();

	return tween;
};

export const pulse = (
	sprite: DisplayObject,
	minAlpha: number,
	duration: number,
	easing = Easing.Linear.None,
	interpolation = Interpolation.Linear,
): Tween => {
	const tween = new Tween();
	tween.onUpdate = (props) => {
		sprite.alpha = props.alpha;
	};
	tween
		.from({ alpha: sprite.alpha })
		.to({ alpha: minAlpha })
		.duration(duration)
		.yoyo(true)
		.easing(easing)
		.interpolation(interpolation)
		.start();

	return tween;
};

export const slide = (
	sprite: DisplayObject,
	to: Record<string, any>,
	duration: number,
	easing = Easing.Linear.None,
	interpolation = Interpolation.Linear,
): Tween => {
	const tween = new Tween();
	tween.onUpdate = (props) => {
		sprite.position = new Point(props.x, props.y);
	};
	tween
		.from({ x: sprite.position.x, y: sprite.position.y })
		.to(to)
		.duration(duration)
		.easing(easing)
		.interpolation(interpolation)
		.start();

	return tween;
};

export const blink = (
	sprite: DisplayObject,
	duration: number,
	yoyo: boolean = true,
	easing = Easing.Linear.None,
	interpolation = Interpolation.Linear,
): Tween => {
	const tween = new Tween();
	tween.onUpdate = (props) => {
		sprite.visible = !!Math.round(props.updateVisible);
	};
	tween
		.from({ updateVisible: 0 })
		.to({ updateVisible: 1 })
		.duration(duration)
		.yoyo(yoyo)
		.easing(easing)
		.interpolation(interpolation)
		.start();

	return tween;
};

export const playSfx = (
	frequencyValue: number,
	attack: number = 0,
	decay: number = 1,
	type: "sine" | "triangle" | "square" | "sawtooth" = "sine",
	volumeValue: number = 1,
	panValue: number = 1,
	wait: number = 0,
	// pitchBendAmount: number = 0,
	// reverse: boolean = false,
	randomValue: number = 0,
	// dissonance: number = 0,
	// echo: number[] | undefined = undefined,
	// reverb: number[] | undefined = undefined,
): void => {
	const sfx = new Sound("");

	sfx.oscillatorNode.connect(sfx.volumeNode);
	sfx.volumeNode.connect(sfx.panNode);
	sfx.panNode.connect(sfx.audioContextDestination);

	sfx.volume = volumeValue;
	sfx.pan = panValue;
	sfx.oscillatorNode.type = type;

	if (randomValue > 0) {
		frequencyValue = randomInt(
			frequencyValue - randomValue / 2,
			frequencyValue + randomValue / 2,
		);
	}

	sfx.oscillatorNode.frequency.value = frequencyValue;

	if (attack > 0) sfx.fadeIn(sfx.volume, wait);
	if (decay > 0) sfx.fadeOut(sfx.volume, wait);

	sfx.oscillatorNode.start(wait);

	/*
	const oscillator = this._actx.createOscillator();

	oscillator.connect(this._volumeNode);
	this._volumeNode.connect(this._panNode);
	this._panNode.connect(this._actx.destination);


	oscillator.start(this._actx.currentTime + wait);
	*/
	// snd.playSfx(frequencyValue, type, wait, randomValue);
};
