import { Float3 } from "gameApi";
import Avatar from "Scripts/MultiBall/AvatarClass.js";
import { type Status } from "Scripts/MultiBall/Utils.js";
import type { Item, BallType } from "game:alias";
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
     * @param templateName - The name of the template.
     * @param trans - The initial position, rotation, and scale of the ball.
     * @param velocity - The initial linear and angular velocity of the ball.
     * @param status - The initial status of the ball.
     */
    constructor(ballType: BallType, templateName: string, trans: [pos: Float3, rot: Float3, scl: Float3], velocity: [linear: Float3, angular: Float3], status?: Status);
    /**
     * Switches the ball to a new type.
     * @param ballType - The type of ball to switch to.
     * @param templateName - The name of the template.
     * @param trans - The new position, rotation, and scale of the ball.
     * @param velocity - The new linear and angular velocity of the ball.
     */
    switch(ballType: BallType, templateName: string, trans?: [pos: Float3, rot: Float3, scl: Float3], velocity?: [linear: Float3, angular: Float3]): void;
    /**
     * Destroys the ball.
     * @param vfx - Whether to spawn a visual effect when destroying the ball.
     */
    destroy(vfx: bool): void;
}
export default MultiBall;
