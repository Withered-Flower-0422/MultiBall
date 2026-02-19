import { Float3 } from "gameApi";
import MultiBall from "Scripts/MultiBall/MultiBallClass.js";
import type { Player, BallType, AudioPlayer, RegisterEvents } from "game:alias";
import type { Status } from "Scripts/MultiBall/Utils.js";
import type { Key, Trans, SwitchBallKeys, MultiBallMessage, CancelableMultiBallEvent } from "multiBall:message";
type NeededEvents = [
    "OnStartLevel",
    "OnTimerActive",
    "OnPhysicsUpdate",
    "OnPlayerDeadEnd",
    "OnPostSwitchBallEnd",
    "OnPreSwitchBallStart",
    "OnPostTransferBallEnd",
    "OnPreTransferBallStart",
    "OnPostCheckpointReached",
    "OnPostDestinationReached"
];
type E = RegisterEvents<NeededEvents>;
declare class MultiBallManager {
    #private;
    isMultiBallMessage(msg: any): msg is MultiBallMessage;
    /**
     * The keys to switch balls.
     * The first key is for `Four Direction` view mode,
     * and the second key is for `Free Look` and `First Person` view mode.
     */
    switchKeys: SwitchBallKeys;
    /**
     * The keys to switch balls in current view mode.
     */
    get switchKey(): Key;
    set switchKey(key: Key);
    /**
     * Whether to use the camera ease when switching or appending.
     */
    cameraEase: bool;
    /**
     * This only works when `cameraEase` is `true`.
     * If the distance between the player and the next ball is greater than this value,
     * the camera always jumps to the next ball. Otherwise, the camera ease is used.
     * If this value is negative, the camera ease is always used.
     */
    easeDistance: float;
    /**
     * Whether switching balls is allowed.
     */
    get canSwitch(): boolean;
    /**
     * - [0]: Lock for built-in system. (whether during normal switching or transferring)
     * - [1]: Lock for multi ball system. (whether during appending or switching cd)
     */
    private readonly locks;
    private skinSuffix;
    private sfx;
    private keyTipUI;
    private keyTipGuid;
    private readonly canceledEvents;
    private get keyTipText();
    private get keyTipUIText();
    /**
     * Initializes the multi ball manager.
     * @param switchKeys - The keys to switch balls.
     * @param cameraEase - Whether to use the camera ease when switching or appending.
     * @param easeDistance - Affects the camera ease.
     * @param sfxAppendEnd - The sound effect to play when appending balls is done.
     * @param sfxSwitch - The sound effect to play when switching balls.
     */
    init(switchKeys: SwitchBallKeys, cameraEase: bool, easeDistance: float, sfxAppendEnd: AudioPlayer, sfxSwitch: AudioPlayer): void;
    /**
     * The list of balls of the multi ball system.
     */
    balls: (MultiBall | Player)[];
    /**
     * The list of trans data of the platforms.
     */
    readonly platformTrans: Trans[];
    /**
     * The index of the current ball.
     */
    get currentIndex(): number;
    /**
     * The next ball's index.
     */
    get nextIndex(): number;
    /**
     * The next ball instance.
     */
    get nextBall(): MultiBall | Player;
    /**
     * The previous ball's index.
     */
    get previousIndex(): number;
    /**
     * The previous ball instance.
     */
    get previousBall(): MultiBall | Player;
    private playerAvatar;
    private updateKeyTipUI;
    private keyConfig;
    private updateAvatarUI;
    /**
     * Shows the key tip.
     */
    showKeyTip(): void;
    /**
     * Hides the key tip.
     */
    hideKeyTip(): void;
    /**
     * Resets the multi ball system.
     * @param vfx - Whether to destroy the ball with visual effects or not. Defaults to `true`.
     */
    reset(vfx?: bool): void;
    /**
     * Adds a new ball to the multi ball system.
     * @param ballType - The type of the ball to add.
     * @param templateName - The template name to create the ball from.
     * @param trans - The position, rotation and scale of the ball.
     * @param velocity - The velocity of the ball.
     * @param status - The status of the ball.
     * @param index - The index to add the ball at. Defaults to `undefined` to add it at the end.
     */
    addBall(ballType: BallType, templateName: string, trans: [pos: Float3, rot: Float3, scl: Float3], velocity: [linear: Float3, angular: Float3], status?: Status, index?: int): void;
    /**
     * Appends a new ball at the end of the ball list, and switches to it.
     * @param ballType - The type of the ball to append.
     * @param appenderPos - The position of the appender.
     */
    appendBall(ballType: BallType, appenderPos: Float3): void;
    /**
     * Starts appending.
     * @param ballType - The type of the ball to start appending.
     * @param appenderTrans - The position, rotation and scale of the appender.
     * @param audioPlayer - The audio player to play the start append sound effect.
     */
    startAppend(ballType: BallType, appenderTrans: Trans, audioPlayer: AudioPlayer): void;
    private forceSwitchBall;
    /**
     * Switches to the ball at the given index.
     * @param index - The index of the ball to switch to. Defaults to the next ball.
     * @returns Whether the switch is successful or not.
     */
    switchBall(index?: int): boolean;
    /**
     * Removes the balls at the given indexes.
     * @param indexes - The indexes of the balls to remove.
     * @param vfx - Whether to destroy the ball with visual effects or not. Defaults to `true`.
     */
    removeBall(indexes: int[], vfx?: bool): void;
    private removeBallsWithSameTypeAsPlayer;
    private removeDestroyedBalls;
    cancelEvent(event: CancelableMultiBallEvent): void;
    /**
     * Gets the closest platform's trans to the given position.
     * @param pos - The current position.
     * @returns The closet platform's trans.
     */
    private getClosetPlatformTrans;
    private updateUI;
    private updateBalls;
    /**
     * Updates the multi ball system.
     * @param e - The event data. See {@link NeededEvents | needed events}.
     */
    update({ OnStartLevel, OnTimerActive, OnPhysicsUpdate, OnPlayerDeadEnd, OnPostSwitchBallEnd, OnPreSwitchBallStart, OnPostTransferBallEnd, OnPreTransferBallStart, OnPostCheckpointReached, OnPostDestinationReached }: E): void;
}
export declare const multiBallManager: MultiBallManager;
export default multiBallManager;
