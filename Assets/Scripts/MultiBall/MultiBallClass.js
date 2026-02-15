import { levelManager, scene, Float3 } from "gameApi";
import Avatar from "Scripts/MultiBall/AvatarClass.js";
export class MultiBall {
    /**
     * The instance of the ball.
     */
    instance;
    /**
     * The avatar UI of the ball.
     */
    avatar;
    /**
     * The type of the ball.
     */
    ballType;
    /**
     * The status of the ball.
     */
    status;
    /**
     * Creates a new ball.
     * @param ballType - The type of ball to create.
     * @param status - The initial status of the ball.
     * @param trans - The initial position, rotation, and scale of the ball.
     * @param velocity - The initial linear and angular velocity of the ball.
     * @param templateNameSuffix - The suffix of the template name to use.
     */
    constructor(ballType, status, trans, velocity, templateNameSuffix = "") {
        this.ballType = ballType;
        this.status = status;
        this.instance = scene.createItem(`Multi${ballType}${templateNameSuffix}`, ...trans);
        this.instance.getComponent("PhysicsObject").setVelocity(...velocity);
        this.avatar = new Avatar(`Textures/Balls/${ballType}.tex`);
    }
    /**
     * Switches the ball to a new type.
     * @param ballType - The type of ball to switch to.
     * @param trans - The new position, rotation, and scale of the ball.
     * @param velocity - The new linear and angular velocity of the ball.
     * @param status - The new status of the ball.
     * @param templateNameSuffix - The suffix of the template name to use.
     */
    switch(ballType, trans = this.instance.getTransform(), velocity = [
        this.instance.getComponent("PhysicsObject").getLinearVelocity(),
        this.instance.getComponent("PhysicsObject").getAngularVelocity(),
    ], status = this.status, templateNameSuffix = "") {
        this.ballType = ballType;
        this.status = status;
        this.avatar.setAvatarPath(`Textures/Balls/${ballType}.tex`);
        scene.destroyItem(this.instance.guid);
        this.instance = scene.createItem(`Multi${ballType}${templateNameSuffix}`, ...trans);
        this.instance.getComponent("PhysicsObject").setVelocity(...velocity);
    }
    /**
     * Destroys the ball.
     * @param vfx - Whether to spawn a visual effect when destroying the ball.
     */
    destroy(vfx) {
        this.avatar.destroy();
        if (vfx) {
            const [pos, rot, scl] = this.instance.getTransform();
            levelManager.spawnVfxPRS("DestroyObject", pos, rot, scl);
            const sfx = scene.createItem("DestroySfx", pos, new Float3(0, 0, 0), new Float3(1, 1, 1));
            sfx.getComponent("AudioPlayer").play();
            levelManager.invoke(() => scene.destroyItem(sfx.guid), 200);
        }
        scene.destroyItem(this.instance.guid);
    }
}
export default MultiBall;
