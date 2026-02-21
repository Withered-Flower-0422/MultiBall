import { Float2, ColorRGBA } from "gameApi";
export default class AmazingTextUI {
    color: ColorRGBA;
    animeDuration: int;
    allowMouseRightToggle: bool;
    duringConfig: bool;
    private text;
    private duringAnimation;
    private ui;
    /**
     * Creates a new instance of AmazingTextUI.
     * @param text - The text to display.
     * @param fontSize - The font size of the text.
     * @param offset - The offset of the text.
     * @param defaultShow - Whether to show the text by default.
     * @param animeDuration - The duration of the animation.
     * @param color - The color of the text.
     * @param allowMouseRightToggle - Whether to allow toggling the UI with the mouse right button.
     */
    constructor(text: string, fontSize: float, offset: Float2, defaultShow: bool, animeDuration: int, color: ColorRGBA, allowMouseRightToggle: bool);
    private startAnimation;
    /**
     * Sets the text of the UI.
     * @param text - The text to display.
     */
    setText(text: string): void;
    /**
     * Shows the UI with the given text.
     * @param text - The text to display.
     */
    show(text: string): void;
    /**
     * Hides the UI.
     */
    hide(): void;
    /**
     * Toggles the UI between showing and hiding.
     * @param text - The text to display.
     */
    toggle(text: string): void;
    /**
     * Updates the UI with the given text.
     * @param text - The text to display.
     */
    update(text: string): void;
}
