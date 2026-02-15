import { Float3 } from "gameApi";
import Avatar from "Scripts/MultiBall/AvatarClass.js";
import type { Item, BallType } from "game:alias";
import type { Status } from "Scripts/MultiBall/Utils.js";
export declare class MultiBall {
    /**
     * The instance of the ball.
     */
    instance: Item;
    /**
     * The avatar UI of the ball.
     */
    avatar: Avatar;
    /**
     * The type of the ball.
     */
    ballType: BallType;
    /**
     * The status of the ball.
     */
    status: Status;
    /**
     * Creates a new ball.
     * @param ballType - The type of ball to create.
     * @param status - The initial status of the ball.
     * @param trans - The initial position, rotation, and scale of the ball.
     * @param velocity - The initial linear and angular velocity of the ball.
     * @param templateNameSuffix - The suffix of the template name to use.
     */
    constructor(ballType: BallType, status: Status, trans: [pos: Float3, rot: Float3, scl: Float3], velocity: [linear: Float3, angular: Float3], templateNameSuffix?: string);
    /**
     * Switches the ball to a new type.
     * @param ballType - The type of ball to switch to.
     * @param trans - The new position, rotation, and scale of the ball.
     * @param velocity - The new linear and angular velocity of the ball.
     * @param status - The new status of the ball.
     * @param templateNameSuffix - The suffix of the template name to use.
     */
    switch(ballType: BallType, trans?: [
        pos: Float3,
        rot: Float3,
        scl: Float3
    ], velocity?: [linear: Float3, angular: Float3], status?: Status, templateNameSuffix?: string): void;
    /**
     * Destroys the ball.
     * @param vfx - Whether to spawn a visual effect when destroying the ball.
     */
    destroy(vfx: bool): void;
}
export default MultiBall;
