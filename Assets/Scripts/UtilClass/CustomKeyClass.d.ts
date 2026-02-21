import { settings, type Float2, type ColorRGBA } from "gameApi";
import type { MouseButton, KeyboardKey } from "game:alias";
type Key = KeyboardKey | MouseButton;
export default class CustomKey {
    private readonly disableConflictKey;
    keyName: Record<typeof settings.language, string>;
    private keys;
    get key(): Key;
    set key(key: Key);
    get duringConfig(): boolean;
    private ui;
    private get uiText();
    private get uiTipText();
    constructor(keyName: string | Record<typeof settings.language, string>, key: Key | [Key, Key], disableConflictKey: bool, fontSize: float, offset: Float2, defaultShow: bool, animeDuration: int, color: ColorRGBA, allowMouseRightToggle: bool);
    /**
     * Checks whether the key is a mouse button or not.
     * @returns Whether the key is a mouse button or not.
     */
    isMouseButton(): boolean;
    /**
     * Checks whether the key is a keyboard key or not.
     * @returns Whether the key is a keyboard key or not.
     */
    isKeyboardKey(): boolean;
    /**
     * Checks whether the key is pressed or not.
     * @returns Whether the key is pressed or not.
     */
    checkDown(): boolean;
    /**
     * Checks whether the key is being held or not.
     * @returns Whether the key is being held or not.
     */
    checkHold(): boolean;
    /**
     * Checks whether the key is released or not.
     * @returns Whether the key is released or not.
     */
    checkUp(): boolean;
    /**
     * Changes the key of the custom key.
     * @param key - The new key.
     */
    changeKey(key: KeyboardKey | MouseButton): void;
    showUI(): void;
    hideUI(): void;
    /**
     * Shows the ui tip.
     * @param duration - The duration of the tip.
     */
    showUITip(duration: int): void;
    updateConflictKey(): void;
    /**
     * Updates the custom key's ui, etc.
     */
    update(): void;
}
export {};
