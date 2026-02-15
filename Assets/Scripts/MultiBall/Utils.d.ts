import type { Player } from "game:alias";
import type { Key, MultiBallMessage } from "multiBall:message";
import type { MultiBall } from "Scripts/MultiBall/MultiBallClass.js";
export interface Status {
    durability: float;
    temperature: float;
    wetness: float;
    power: float;
    scale: float;
}
export declare const allKeys: ["Space", "Enter", "Tab", "Backquote", "Quote", "Semicolon", "Comma", "Period", "Slash", "Backslash", "LeftBracket", "RightBracket", "Minus", "Equals", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "LeftShift", "RightShift", "LeftAlt", "RightAlt", "AltGr", "LeftCtrl", "RightCtrl", "LeftMeta", "RightMeta", "LeftWindows", "RightWindows", "LeftApple", "RightApple", "LeftCommand", "RightCommand", "ContextMenu", "Escape", "LeftArrow", "RightArrow", "UpArrow", "DownArrow", "Backspace", "PageDown", "PageUp", "Home", "End", "Insert", "Delete", "CapsLock", "NumLock", "PrintScreen", "ScrollLock", "Pause", "NumpadEnter", "NumpadDivide", "NumpadMultiply", "NumpadPlus", "NumpadMinus", "NumpadPeriod", "NumpadEquals", "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "OEM1", "OEM2", "OEM3", "OEM4", "OEM5"];
export declare const defaultStatus: {
    readonly durability: 100;
    readonly temperature: 20;
    readonly wetness: 0;
    readonly power: 100;
    readonly scale: 1;
};
export declare const isMouseKey: (key: Key) => key is "Left" | "Middle" | "Right";
export declare const isPlayer: (obj: MultiBall | Player) => obj is Player;
export declare const isMultiBallMessage: (msg: any) => msg is MultiBallMessage;
export declare const getStatusFromPlayer: () => Status;
export declare const createSingleton: <T extends new (...args: any[]) => InstanceType<T>>(cls: T, ...args: ConstructorParameters<T>) => InstanceType<T>;
