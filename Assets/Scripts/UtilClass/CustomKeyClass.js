// @ts-nocheck
import { inputManager, levelManager, settings, } from "gameApi";
import AmazingTextUI from "Scripts/UtilClass/AmazingTextUIClass.js";
const allPlayerKeys = [
    "MoveForward",
    "MoveBackward",
    "MoveLeft",
    "MoveRight",
    "ViewClockwiseRotate",
    "ViewCounterclockwiseRotate",
    "CameraOverlook",
    "FreeLookMoveForward",
    "FreeLookMoveBackward",
    "FreeLookMoveLeft",
    "FreeLookMoveRight",
    "FreeLookLockView",
    "FreeLookToggleFirstPersonView",
];
const allKeyboardKeys = [
    "Space",
    "Enter",
    "Tab",
    "Backquote",
    "Quote",
    "Semicolon",
    "Comma",
    "Period",
    "Slash",
    "Backslash",
    "LeftBracket",
    "RightBracket",
    "Minus",
    "Equals",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "Digit0",
    "LeftShift",
    "RightShift",
    "LeftAlt",
    "RightAlt",
    "AltGr",
    "LeftCtrl",
    "RightCtrl",
    "LeftMeta",
    "RightMeta",
    "LeftWindows",
    "RightWindows",
    "LeftApple",
    "RightApple",
    "LeftCommand",
    "RightCommand",
    "ContextMenu",
    "Escape",
    "LeftArrow",
    "RightArrow",
    "UpArrow",
    "DownArrow",
    "Backspace",
    "PageDown",
    "PageUp",
    "Home",
    "End",
    "Insert",
    "Delete",
    "CapsLock",
    "NumLock",
    "PrintScreen",
    "ScrollLock",
    "Pause",
    "NumpadEnter",
    "NumpadDivide",
    "NumpadMultiply",
    "NumpadPlus",
    "NumpadMinus",
    "NumpadPeriod",
    "NumpadEquals",
    "Numpad0",
    "Numpad1",
    "Numpad2",
    "Numpad3",
    "Numpad4",
    "Numpad5",
    "Numpad6",
    "Numpad7",
    "Numpad8",
    "Numpad9",
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
    "OEM1",
    "OEM2",
    "OEM3",
    "OEM4",
    "OEM5",
];
const isMouseButton = (key) => key === "Left" || key === "Right" || key === "Middle";
const checkKeyDown = (key) => isMouseButton(key)
    ? inputManager.mouse.checkButtonDown(key)
    : inputManager.keyboard.checkKeyDown(key);
export default class CustomKey {
    disableConflictKey;
    keyName;
    keys;
    get key() {
        return this.keys[levelManager.cameraMode === 0 ? 0 : 1];
    }
    set key(key) {
        this.keys[levelManager.cameraMode === 0 ? 0 : 1] = key;
    }
    get duringConfig() {
        return this.ui.duringConfig;
    }
    ui;
    get uiText() {
        const keyName = this.keyName[settings.language];
        return `${keyName}${keyName === "" ? "" : ": "}${this.ui.duringConfig ? "[ . . . ]" : `${this.isMouseButton() ? "MOUSE" : ""} ${this.key.toUpperCase()}`}`;
    }
    get uiTipText() {
        return `${{
            English: "Left click the UI to change the keybind.",
            Spanish: "Haz clic izquierdo en la interfaz para cambiar la asignación de teclas.",
            日本語: "左クリックでキー設定を変更します。",
            简体中文: "鼠标左键点击 UI 以更改键位。",
            繁體中文: "滑鼠左鍵點擊 UI 以更改鍵位。",
        }[settings.language]}${this.ui.allowMouseRightToggle
            ? {
                English: " Right click the screen to toggle the UI.",
                Spanish: " Haz clic derecho en la pantalla para mostrar / ocultar la interfaz de usuario.",
                日本語: "右クリックでUIの表示／非表示を切り替えます。",
                简体中文: "鼠标右键点击屏幕以显示 / 隐藏 UI。",
                繁體中文: "滑鼠右鍵點擊屏幕以顯示 / 隱藏 UI。",
            }[settings.language]
            : ""}`;
    }
    constructor(keyName, key, disableConflictKey, fontSize, offset, defaultShow, animeDuration, color, allowMouseRightToggle) {
        this.disableConflictKey = disableConflictKey;
        this.keyName =
            typeof keyName === "string"
                ? {
                    English: keyName,
                    Spanish: keyName,
                    日本語: keyName,
                    简体中文: keyName,
                    繁體中文: keyName,
                }
                : keyName;
        this.keys = typeof key === "string" ? [key, key] : key;
        this.ui = new AmazingTextUI("", fontSize, offset, defaultShow, animeDuration, color, allowMouseRightToggle);
    }
    isMouseButton() {
        return (this.key === "Left" || this.key === "Right" || this.key === "Middle");
    }
    isKeyboardKey() {
        return !this.isMouseButton();
    }
    checkDown() {
        return this.ui.duringConfig
            ? false
            : this.isKeyboardKey()
                ? inputManager.keyboard.checkKeyDown(this.key)
                : inputManager.mouse.checkButtonDown(this.key);
    }
    checkHold() {
        return this.ui.duringConfig
            ? false
            : this.isKeyboardKey()
                ? inputManager.keyboard.checkKeyHold(this.key)
                : inputManager.mouse.checkButtonHold(this.key);
    }
    checkUp() {
        return this.ui.duringConfig
            ? false
            : this.isKeyboardKey()
                ? inputManager.keyboard.checkKeyUp(this.key)
                : inputManager.mouse.checkButtonUp(this.key);
    }
    changeKey(key) {
        if (key === this.key)
            return;
        if (this.disableConflictKey) {
            for (const k of allPlayerKeys) {
                const playerKey = inputManager.getPlayerKey(k);
                if (playerKey === this.key)
                    inputManager.enablePlayerKey(k);
                if (playerKey === key)
                    inputManager.disablePlayerKey(k);
            }
        }
        this.key = key;
    }
    showUI() {
        this.ui.show(this.uiText);
    }
    hideUI() {
        this.ui.hide();
    }
    showUITip(duration) {
        levelManager.hideTipDelay(levelManager.showTip(this.uiTipText), duration);
    }
    updateConflictKey() {
        if (this.disableConflictKey) {
            for (const k of allPlayerKeys) {
                if (inputManager.getPlayerKey(k) === this.key)
                    inputManager.disablePlayerKey(k);
            }
        }
    }
    update() {
        if (this.ui.duringConfig) {
            for (const key of [
                ...allKeyboardKeys,
                "Left",
                "Right",
                "Middle",
            ]) {
                if (checkKeyDown(key)) {
                    this.changeKey(key);
                    this.ui.duringConfig = false;
                    break;
                }
            }
        }
        this.ui.update(this.uiText);
    }
}
