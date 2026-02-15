import { Float3 } from "gameApi";
import Avatar from "Scripts/MultiBall/AvatarClass.js";
import MultiBall from "Scripts/MultiBall/MultiBallClass.js";
import type { BallType, Text, Player } from "game:alias";
import type { Status } from "Scripts/MultiBall/Utils.js";
export declare const multiBallManager: {
    /**
     * The list of balls of the multi ball system.
     */
    balls: (MultiBall | Player)[];
    /**
     * Whether the key configuration is currently being done.
     */
    duringKeyConfig: boolean;
    /**
     * The current player's avatar.
     */
    playerAvatar: Avatar;
    /**
     * The UI element for displaying the keybind for switching balls.
     */
    readonly keyTipUI: Text;
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
    /**
     * Initializes the multi ball system.
     * @param vfx - Whether to destroy the ball with visual effects or not. Defaults to `true`.
     */
    init(vfx?: boolean | undefined): void;
    /**
     * Updates the key tip UI.
     * @param text - The text to display on the key tip UI. Defaults to `""`.
     */
    updateKeyTipUI(text?: string | undefined): void;
    /**
     * Updates the avatar UI.
     */
    updateAvatarUI(): void;
    /**
     * Adds a new ball to the multi ball system.
     * @param ballType - The type of the ball to add.
     * @param trans - The position, rotation and scale of the ball.
     * @param velocity - The velocity of the ball.
     * @param templateNameSuffix - The suffix of the template name to create the ball from.
     * @param status - The status of the ball.
     * @param index - The index to add the ball at. Defaults to `undefined` to add it at the end.
     */
    addBall(ballType: BallType, trans: [pos: Float3, rot: Float3, scl: Float3], velocity: [linear: Float3, angular: Float3], templateNameSuffix?: string | undefined, status?: Status | undefined, index?: number | undefined): void;
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
    appendBall(ballType: BallType, trans: [pos: Float3, rot: Float3, scl: Float3], cameraEase: boolean, easeDistance?: number | undefined, velocity?: [linear: Float3, angular: Float3] | undefined, templateNameSuffixForOld?: string | undefined, templateNameSuffixForNew?: string | undefined, status?: Status | undefined): void;
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
    switchBall(cameraEase: boolean, easeDistance?: number | undefined, templateNameSuffix?: string | undefined, index?: number | undefined): boolean;
    /**
     * Removes the balls at the given indexes.
     * @param indexes - The indexes of the balls to remove.
     * @param vfx - Whether to destroy the ball with visual effects or not. Defaults to `true`.
     */
    removeBall(indexes: number[], vfx?: boolean | undefined): void;
    /**
     * Removes the balls with the same type as the player.
     * @param vfx - Whether to destroy the ball with visual effects or not. Defaults to `true`.
     */
    removeBallsWithSameTypeAsPlayer(vfx?: boolean | undefined): void;
    /**
     * Removes the balls that have been destroyed.
     */
    removeDestroyedBalls(): void;
    /**
     * Removes all balls except the player ball.
     * @param vfx - Whether to destroy the ball with visual effects or not. Defaults to `true`.
     */
    removeAllBalls(vfx?: boolean | undefined): void;
    /**
     * Updates the multi ball system.
     * @param keyTipText - The text to display on the key tip UI.
     */
    update(keyTipText: string): void;
};
export default multiBallManager;
