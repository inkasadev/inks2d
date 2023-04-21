import { D as DisplayObject } from '../../DisplayObject-023e134d.js';
import { T as Tween } from '../../Tween-2c97587c.js';

declare const fadeIn: (sprite: DisplayObject, duration: number, easing?: (k: number) => number, interpolation?: (v: number[], k: number) => number) => Tween;
declare const fadeOut: (sprite: DisplayObject, duration: number, easing?: (k: number) => number, interpolation?: (v: number[], k: number) => number) => Tween;
declare const pulse: (sprite: DisplayObject, minAlpha: number, duration: number, easing?: (k: number) => number, interpolation?: (v: number[], k: number) => number) => Tween;
declare const slide: (sprite: DisplayObject, to: Record<string, any>, duration: number, easing?: (k: number) => number, interpolation?: (v: number[], k: number) => number) => Tween;
declare const blink: (sprite: DisplayObject, duration: number, yoyo?: boolean, easing?: (k: number) => number, interpolation?: (v: number[], k: number) => number) => Tween;
declare const playSfx: (frequencyValue: number, attack?: number, decay?: number, type?: "sine" | "triangle" | "square" | "sawtooth", volumeValue?: number, panValue?: number, wait?: number, randomValue?: number) => void;

export { blink, fadeIn, fadeOut, playSfx, pulse, slide };
