import { randomInt } from "inks2d/math";

/**
 * Teste.
 */
export class Sound {
	private readonly _name: string;

	private readonly _actx: AudioContext = new AudioContext();
	private readonly _volumeNode: GainNode = this._actx.createGain();
	private readonly _panNode: StereoPannerNode = this._actx.createStereoPanner();
	private readonly _delayNode: DelayNode = this._actx.createDelay();
	private readonly _feedbackNode: GainNode = this._actx.createGain();
	private readonly _filterNode: BiquadFilterNode =
		this._actx.createBiquadFilter();

	private readonly _convolverNode: ConvolverNode = this._actx.createConvolver();
	private readonly _oscillatorNode: OscillatorNode =
		this._actx.createOscillator();

	private _buffer: AudioBuffer | null = null;
	private _reverbImpulse: AudioBuffer | null = null;

	private _startTime: number = 0;
	private _startOffset: number = 0;
	private _soundNode: AudioBufferSourceNode | null = null;
	private _echo: boolean = false;
	private _delayValue: number = 0.3;
	private _feedbackValue: number = 0.3;
	private _filterValue: number = 0;
	private _loop: boolean = false;
	private _playing: boolean = false;
	private readonly _volumeValue: number = 1;

	public reverb: boolean = false;
	public playbackRate: number = 1;

	constructor(source: string) {
		this._name = source;
	}

	get name(): string {
		return this._name;
	}

	async load(): Promise<any> {
		return await new Promise((resolve) => {
			fetch(this._name).then((res) => {
				res.arrayBuffer().then((file) => {
					this._actx.decodeAudioData(
						file,
						(buffer) => {
							this._buffer = buffer;
							resolve(true);
						},
						(error) => {
							throw new Error(
								`Audio could not be decoded: ${JSON.stringify(error)}`,
							);
						},
					);
				});
			});
		});
	}

	play(): void {
		if (this._buffer == null) throw new Error(`Audio not loaded.`);

		this._startTime = this._actx.currentTime;
		this._soundNode = this._actx.createBufferSource();
		this._soundNode.buffer = this._buffer;

		this._soundNode.connect(this._volumeNode);
		this._volumeNode.connect(this._panNode);

		if (!this.reverb) {
			this._volumeNode.connect(this._panNode);
		} else {
			this._volumeNode.connect(this._convolverNode);
			this._convolverNode.connect(this._panNode);
			this._convolverNode.buffer = this._reverbImpulse;
		}

		this._panNode.connect(this._actx.destination);

		if (this._echo) {
			this._feedbackNode.gain.value = this._feedbackValue;
			this._delayNode.delayTime.value = this._delayValue;
			this._filterNode.frequency.value = this._filterValue;

			this._delayNode.connect(this._feedbackNode);

			if (this._filterValue > 0) {
				this._feedbackNode.connect(this._filterNode);
				this._filterNode.connect(this._delayNode);
			} else {
				this._feedbackNode.connect(this._delayNode);
			}

			this._volumeNode.connect(this._delayNode);
			this._delayNode.connect(this._panNode);
		}

		this._soundNode.loop = this._loop;
		this._soundNode.playbackRate.value = this.playbackRate;
		this._soundNode.start(
			this._startTime,
			this._startOffset % this._buffer.duration,
		);

		this._playing = true;
	}

	pause(): void {
		if (!this._playing) return;

		this._soundNode?.stop(this._actx.currentTime);
		this._startOffset += this._actx.currentTime - this._startTime;
		this._playing = false;
	}

	stop(): void {
		this._soundNode?.stop(this._actx.currentTime);
		this._playing = false;
	}

	restart(): void {
		if (this._playing) this._soundNode?.stop(this._actx.currentTime);

		this._startOffset = 0;
		this.play();
	}

	playFrom(value: number): void {
		if (this._playing) {
			this._soundNode?.stop(this._actx.currentTime);
		}

		this._startOffset = value;
		this.play();
	}

	setEcho(
		delayValue: number = 0.3,
		feedbackValue: number = 0.3,
		filterValue: number = 0,
	): void {
		this._delayValue = delayValue;
		this._feedbackValue = feedbackValue;
		this._filterValue = filterValue;
		this._echo = true;
	}

	setReverb(
		duration: number = 2,
		decay: number = 2,
		reverse: boolean = false,
	): void {
		this._reverbImpulse = this.impulseResponse(duration, decay, reverse);
		this.reverb = true;
	}

	fadeIn(attack: number, wait: number = 0): void {
		this.volume = 0;
		this.volumeNode.gain.linearRampToValueAtTime(
			0,
			this._actx.currentTime + wait,
		);
		this.volumeNode.gain.linearRampToValueAtTime(
			this.volume,
			this._actx.currentTime + wait + attack,
		);
	}

	fadeOut(decay: number, wait: number = 0): void {
		this.volumeNode.gain.linearRampToValueAtTime(
			this.volume,
			this._actx.currentTime + wait,
		);
		this.volumeNode.gain.linearRampToValueAtTime(
			0,
			this._actx.currentTime + wait + decay,
		);
	}

	private impulseResponse(
		duration: number = 2,
		decay: number = 2,
		reverse: boolean = false,
	): AudioBuffer {
		const length = this._actx.sampleRate * duration;
		const impulse = this._actx.createBuffer(2, length, this._actx.sampleRate);

		const left = impulse.getChannelData(0);
		const right = impulse.getChannelData(1);

		for (let i = 0; i < length; i++) {
			let n;
			if (reverse) {
				n = length - i;
			} else {
				n = i;
			}

			left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
			right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
		}

		return impulse;
	}

	get loop(): boolean {
		return this._loop;
	}

	set loop(value: boolean) {
		this._loop = value;
	}

	get volume(): number {
		return this._volumeValue;
	}

	set volume(value: number) {
		this._volumeNode.gain.value = value;
	}

	get pan(): number {
		return this._panNode.pan.value;
	}

	set pan(value: number) {
		this._panNode.pan.value = value;
	}

	get playing(): boolean {
		return this._playing;
	}

	get oscillatorNode(): OscillatorNode {
		return this._oscillatorNode;
	}

	get volumeNode(): GainNode {
		return this._volumeNode;
	}

	get panNode(): StereoPannerNode {
		return this._panNode;
	}

	get audioContextDestination(): AudioDestinationNode {
		return this._actx.destination;
	}

	public playSfx(
		frequencyValue: number,
		// attack: number = 0,
		// decay: number = 1,
		type: "sine" | "triangle" | "square" | "sawtooth" = "sine",
		wait: number = 0,
		// pitchBendAmount: number = 0,
		// reverse: boolean = false,
		randomValue: number = 0,
		// dissonance: number = 0,
		// echo: number[] | undefined = undefined,
		// reverb: number[] | undefined = undefined,
	): void {
		const oscillator = this._actx.createOscillator();

		oscillator.connect(this._volumeNode);
		this._volumeNode.connect(this._panNode);
		this._panNode.connect(this._actx.destination);
		oscillator.type = type;

		if (randomValue > 0) {
			frequencyValue = randomInt(
				frequencyValue - randomValue / 2,
				frequencyValue + randomValue / 2,
			);
		}

		oscillator.frequency.value = frequencyValue;
		oscillator.start(this._actx.currentTime + wait);
	}
}
