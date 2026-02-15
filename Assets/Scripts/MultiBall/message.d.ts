// Install [BST](https://github.com/Withered-Flower-0422/BST) to get type hints.

declare module "multiBall:message" {
    import { Float3 } from "gameApi"
    import {
        Item,
        Text,
        Player,
        BallType,
        NonNoneKey,
        MouseButton,
        TexturePath,
    } from "game:alias"

    export interface Avatar {
        /**
         * Sets the texture path of the avatar image.
         * @param avatarPath - Texture path of the avatar image.
         */
        setAvatarPath(avatarPath: TexturePath): void

        /**
         * Updates the avatar UI.
         * @param enabled - Whether the avatar UI is enabled.
         * @param chosen - Whether the avatar is chosen.
         * @param durability - The durability of the ball.
         * @param offset - The offset of the avatar UI.
         */
        update(
            enabled: bool,
            chosen: bool,
            durability: float,
            offset: float,
        ): void

        /**
         * Destroys the avatar UI.
         */
        destroy(): void
    }

    export interface MultiBall {
        /**
         * The instance of the ball.
         */
        instance: Item

        /**
         * The avatar UI of the ball.
         */
        avatar: Avatar

        /**
         * The type of the ball.
         */
        ballType: BallType

        /**
         * The status of the ball.
         */
        status: Status

        /**
         * Switches the ball to a new type.
         * @param ballType - The type of ball to switch to.
         * @param trans - The new position, rotation, and scale of the ball.
         * @param velocity - The new linear and angular velocity of the ball.
         * @param status - The new status of the ball.
         * @param templateNameSuffix - The suffix of the template name to use.
         */
        switch(
            ballType: BallType,
            trans?: [pos: Float3, rot: Float3, scl: Float3],
            velocity?: [linear: Float3, angular: Float3],
            status?: Status,
            templateNameSuffix?: string,
        ): void

        /**
         * Destroys the ball.
         * @param vfx - Whether to spawn a visual effect when destroying the ball.
         */
        destroy(vfx: bool): void
    }

    export interface Status {
        durability: float
        temperature: float
        wetness: float
        power: float
        scale: float
    }

    export interface MultiBallManager {
        /**
         * The list of balls of the multi ball system.
         */
        balls: (MultiBall | Player)[]

        /**
         * Whether the key configuration is currently being done.
         */
        duringKeyConfig: bool

        /**
         * The current player's avatar.
         */
        playerAvatar: Avatar

        /**
         * The UI element for displaying the keybind for switching balls.
         */
        readonly keyTipUI: Text

        /**
         * The index of the current ball.
         */
        get currentIndex(): int

        /**
         * The next ball's index.
         */
        get nextIndex(): int

        /**
         * The next ball instance.
         */
        get nextBall(): MultiBall | Player

        /**
         * The previous ball's index.
         */
        get previousIndex(): int

        /**
         * The previous ball instance.
         */
        get previousBall(): MultiBall | Player

        /**
         * Initializes the multi ball system.
         * @param vfx - Whether to destroy the ball with visual effects or not. Defaults to `true`.
         */
        init(vfx?: bool): void

        /**
         * Updates the key tip UI.
         * @param text - The text to display on the key tip UI. Defaults to `""`.
         */
        updateKeyTipUI(text?: string): void

        /**
         * Updates the avatar UI.
         */
        updateAvatarUI(): void

        /**
         * Adds a new ball to the multi ball system.
         * @param ballType - The type of the ball to add.
         * @param trans - The position, rotation and scale of the ball.
         * @param velocity - The velocity of the ball.
         * @param templateNameSuffix - The suffix of the template name to create the ball from.
         * @param status - The status of the ball.
         * @param index - The index to add the ball at. Defaults to `undefined` to add it at the end.
         */
        addBall(
            ballType: BallType,
            trans: [pos: Float3, rot: Float3, scl: Float3],
            velocity: [linear: Float3, angular: Float3],
            templateNameSuffix?: string,
            status?: Status,
            index?: int,
        ): void

        /**
         * Appends a new ball at the end of the ball list, and switches to it.
         * @param ballType - The type of the ball to append.
         * @param trans - The position, rotation and scale of the ball.
         * @param cameraEase - Whether to use the camera ease or not.
         * @param easeDistance
         * If the distance between the player and the next ball is greater than this value,
         * the camera always jumps to the next ball. Otherwise, the camera ease is used.
         * If this value is negative, the camera ease is always used.
         * @param velocity - The velocity of the ball.
         * @param templateNameSuffixForOld - The suffix of the template name to create the ball from for the old ball.
         * @param templateNameSuffixForNew - The suffix of the template name to create the ball from for the new ball.
         * @param status - The status of the ball.
         */
        appendBall(
            ballType: BallType,
            trans: [pos: Float3, rot: Float3, scl: Float3],
            cameraEase: bool,
            easeDistance?: float,
            velocity?: [linear: Float3, angular: Float3],
            templateNameSuffixForOld?: string,
            templateNameSuffixForNew?: string,
            status?: Status,
        ): void

        /**
         * Switches to the ball at the given index.
         * @param cameraEase - Whether to use the camera ease or not.
         * @param easeDistance
         * If the distance between the player and the next ball is greater than this value,
         * the camera always jumps to the next ball. Otherwise, the camera ease is used.
         * If this value is negative, the camera ease is always used.
         * Defaults to `10`.
         * @param templateNameSuffix - The suffix of the template name to create the ball from.
         * @param index - The index of the ball to switch to. Defaults to the next ball.
         * @returns Whether the switch was successful or not.
         */
        switchBall(
            cameraEase: bool,
            easeDistance?: float,
            templateNameSuffix?: string,
            index?: int,
        ): bool

        /**
         * Removes the balls at the given indexes.
         * @param indexes - The indexes of the balls to remove.
         * @param vfx - Whether to destroy the ball with visual effects or not. Defaults to `true`.
         */
        removeBall(indexes: int[], vfx?: bool): void

        /**
         * Removes the balls with the same type as the player.
         * @param vfx - Whether to destroy the ball with visual effects or not. Defaults to `true`.
         */
        removeBallsWithSameTypeAsPlayer(vfx?: bool): void

        /**
         * Removes the balls that have been destroyed.
         */
        removeDestroyedBalls(): void

        /**
         * Removes all balls except the player ball.
         * @param vfx - Whether to destroy the ball with visual effects or not. Defaults to `true`.
         */
        removeAllBalls(vfx?: bool): void

        /**
         * Updates the multi ball system.
         * @param keyTipText - The text to display on the key tip UI.
         */
        update(keyTipText: string): void
    }

    export type Key = NonNoneKey | MouseButton
    export type SwitchBallKeys = [Key, Key]

    export type PreAppendData = { ballType: BallType; position: Float3 }
    export type PlatformTransData = [pos: Float3, rot: Float3, scl: Float3]
    export type SwitchData = { switchBallKeys: SwitchBallKeys }
    export type PostAppendData = PreAppendData & SwitchData

    export type MultiBallMessage = {
        _brand: "MultiBallMessage"

        OnLoadMultiBallPlatform?: PlatformTransData
        OnPreMultiBallAppendStart?: PreAppendData
        OnPreMultiBallAppendEnd?: PreAppendData
        OnPostMultiBallAppendEnd?: PostAppendData
        OnMultiBallSwitch?: SwitchData
    }
}

declare module "Scripts/MultiBall/Utils.js" {
    import type { Player, MouseButton } from "game:alias"
    import type {
        Key,
        Status,
        MultiBall,
        MultiBallMessage,
    } from "multiBall:message"

    export const allKeys: [
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
    ]

    export const defaultStatus: Status

    export const isMouseKey: (key: Key) => key is MouseButton

    export const isPlayer: (obj: MultiBall | Player) => obj is Player

    export const isMultiBallMessage: (msg: any) => msg is MultiBallMessage

    export const getStatusFromPlayer: () => Status

    export const createSingleton: <
        T extends new (...args: any[]) => InstanceType<T>,
    >(
        cls: T,
        ...args: ConstructorParameters<T>
    ) => InstanceType<T>
}

declare module "Scripts/MultiBall/MultiBallManager.js" {
    import type { MultiBallManager } from "multiBall:message"

    export const multiBallManager: MultiBallManager

    export default multiBallManager
}
