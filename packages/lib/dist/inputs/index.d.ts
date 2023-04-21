declare class Keyboard {
    private readonly _keys;
    isDown: boolean;
    isUp: boolean;
    press?: (e: KeyboardEvent) => void;
    release?: (e: KeyboardEvent) => void;
    constructor(...keys: number[]);
    removeListeners(): void;
    private downHandler;
    private upHandler;
}

declare const Keys: Record<string, number>;

export { Keyboard, Keys };
