/**
 * Teste.
 */
declare class Sound {
    private readonly _name;
    private readonly _actx;
    private readonly _volumeNode;
    private readonly _panNode;
    private readonly _delayNode;
    private readonly _feedbackNode;
    private readonly _filterNode;
    private readonly _convolverNode;
    private readonly _oscillatorNode;
    private _buffer;
    private _reverbImpulse;
    private _startTime;
    private _startOffset;
    private _soundNode;
    private _echo;
    private _delayValue;
    private _feedbackValue;
    private _filterValue;
    private _loop;
    private _playing;
    private readonly _volumeValue;
    reverb: boolean;
    playbackRate: number;
    constructor(source: string);
    get name(): string;
    load(): Promise<any>;
    play(): void;
    pause(): void;
    stop(): void;
    restart(): void;
    playFrom(value: number): void;
    setEcho(delayValue?: number, feedbackValue?: number, filterValue?: number): void;
    setReverb(duration?: number, decay?: number, reverse?: boolean): void;
    fadeIn(attack: number, wait?: number): void;
    fadeOut(decay: number, wait?: number): void;
    private impulseResponse;
    get loop(): boolean;
    set loop(value: boolean);
    get volume(): number;
    set volume(value: number);
    get pan(): number;
    set pan(value: number);
    get playing(): boolean;
    get oscillatorNode(): OscillatorNode;
    get volumeNode(): GainNode;
    get panNode(): StereoPannerNode;
    get audioContextDestination(): AudioDestinationNode;
    playSfx(frequencyValue: number, type?: "sine" | "triangle" | "square" | "sawtooth", wait?: number, randomValue?: number): void;
}

export { Sound };
