/*# ********************************************************************************
Because of BME's quirk, there are bugs of default parameters, so use `??=` instead.
******************************************************************************** #*/
import { math, player, uiCanvas, Float2, Float3, ColorRGBA } from "gameApi";
import Avatar from "Scripts/MultiBall/AvatarClass.js";
import MultiBall from "Scripts/MultiBall/MultiBallClass.js";
import { isPlayer, defaultStatus, createSingleton, getStatusFromPlayer, } from "Scripts/MultiBall/Utils.js";
export const multiBallManager = createSingleton(class MultiBallManager {
    /**
     * The list of balls of the multi ball system.
     */
    balls = [player];
    /**
     * Whether the key configuration is currently being done.
     */
    duringKeyConfig = false;
    /**
     * The current player's avatar.
     */
    playerAvatar = new Avatar(`Textures/Balls/${player.ballType}.tex`);
    /**
     * The UI element for displaying the keybind for switching balls.
     */
    keyTipUI;
    /**
     * The index of the current ball.
     */
    get currentIndex() {
        return this.balls.findIndex(ball => isPlayer(ball));
    }
    /**
     * The next ball's index.
     */
    get nextIndex() {
        return (this.currentIndex + 1) % this.balls.length;
    }
    /**
     * The next ball instance.
     */
    get nextBall() {
        return this.balls[this.nextIndex];
    }
    /**
     * The previous ball's index.
     */
    get previousIndex() {
        return ((this.currentIndex - 1 + this.balls.length) % this.balls.length);
    }
    /**
     * The previous ball instance.
     */
    get previousBall() {
        return this.balls[this.previousIndex];
    }
    constructor() {
        this.keyTipUI = uiCanvas.createUI("Text");
        this.keyTipUI.anchorMin = this.keyTipUI.anchorMax = new Float2(0.5, 0.985);
        this.keyTipUI.fontSize = 21;
        this.keyTipUI.pivot = new Float2(0.5, 2.5);
        this.keyTipUI.raycastEvent = true;
        this.keyTipUI.onPointerClick = mouseButton => {
            if (mouseButton === 0 && !this.duringKeyConfig) {
                this.duringKeyConfig = true;
            }
        };
        this.keyTipUI.onPointerEnter = () => {
            this.keyTipUI.color = new ColorRGBA(1, 1, 1, 0.5);
        };
        this.keyTipUI.onPointerExit = () => {
            this.keyTipUI.color = new ColorRGBA(1, 1, 1, 1);
        };
    }
    /**
     * Initializes the multi ball system.
     * @param vfx - Whether to destroy the ball with visual effects or not. Defaults to `true`.
     */
    init(vfx) {
        vfx ??= true;
        for (const ball of this.balls) {
            if (!isPlayer(ball)) {
                ball.destroy(vfx);
            }
        }
        this.balls = [player];
    }
    /**
     * Updates the key tip UI.
     * @param text - The text to display on the key tip UI. Defaults to `""`.
     */
    updateKeyTipUI(text) {
        text ??= "";
        if (!(this.keyTipUI.enabled = this.balls.length > 1))
            return;
        this.keyTipUI.text = `<b>${text.toUpperCase()}</b>`;
    }
    /**
     * Updates the avatar UI.
     */
    updateAvatarUI() {
        const enabled = this.balls.length > 1;
        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];
            const chosen = isPlayer(ball);
            let avatar;
            let ballType;
            let durability;
            if (chosen) {
                avatar = this.playerAvatar;
                ballType = player.ballType;
                avatar.setAvatarPath(`Textures/Balls/${ballType}.tex`);
                durability = player.durability;
            }
            else {
                avatar = ball.avatar;
                ballType = ball.ballType;
                durability = ball.status.durability;
            }
            avatar.update(enabled, chosen, durability, (i - (this.balls.length - 1) / 2) * 52.5);
        }
    }
    /**
     * Adds a new ball to the multi ball system.
     * @param ballType - The type of the ball to add.
     * @param trans - The position, rotation and scale of the ball.
     * @param velocity - The velocity of the ball.
     * @param templateNameSuffix - The suffix of the template name to create the ball from.
     * @param status - The status of the ball.
     * @param index - The index to add the ball at. Defaults to `undefined` to add it at the end.
     */
    addBall(ballType, trans, velocity, templateNameSuffix, status, index) {
        templateNameSuffix ??= "";
        status ??= defaultStatus;
        const newBall = new MultiBall(ballType, status, trans, velocity, templateNameSuffix);
        if (index === undefined)
            this.balls.push(newBall);
        else
            this.balls.splice(index, 0, newBall);
    }
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
    appendBall(ballType, trans, cameraEase, easeDistance, velocity, templateNameSuffixForOld, templateNameSuffixForNew, status) {
        easeDistance ??= 10;
        velocity ??= [new Float3(0, 0, 0), new Float3(0, 0, 0)];
        templateNameSuffixForOld ??= "";
        templateNameSuffixForNew ??= "";
        status ??= defaultStatus;
        this.addBall(ballType, trans, velocity, templateNameSuffixForNew, status);
        this.switchBall(cameraEase, easeDistance, templateNameSuffixForOld, this.balls.length - 1);
    }
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
    switchBall(cameraEase, easeDistance, templateNameSuffix, index) {
        easeDistance ??= 10;
        templateNameSuffix ??= "";
        index ??= this.nextIndex;
        const curIndex = this.currentIndex;
        if (index === curIndex)
            return false;
        const nextBall = this.balls[index];
        const nextBallPhysicsObject = nextBall.instance.getComponent("PhysicsObject");
        const playerPos = player.position;
        const playerRot = player.rotation;
        const playerLinearVelocity = player.physicsObject.getLinearVelocity();
        const playerAngularVelocity = player.physicsObject.getAngularVelocity();
        const playerBallType = player.ballType;
        const playerStatus = getStatusFromPlayer();
        const [nextBallPos, nextBallRot] = nextBall.instance.getTransform();
        const nextBallLinearVelocity = nextBallPhysicsObject.getLinearVelocity();
        const nextBallAngularVelocity = nextBallPhysicsObject.getAngularVelocity();
        const nextBallType = nextBall.ballType;
        const nextBallStatus = nextBall.status;
        [this.playerAvatar, nextBall.avatar] = [
            nextBall.avatar,
            this.playerAvatar,
        ]; // this if for avoiding ui blinking
        this.balls[index] = player;
        player.physicsObject.setVelocity(nextBallLinearVelocity, nextBallAngularVelocity);
        if (!cameraEase ||
            (easeDistance >= 0 &&
                math.distanceFloat3(playerPos, nextBallPos) >= easeDistance))
            player.transfer(nextBallPos);
        Object.assign(player, {
            position: nextBallPos,
            ballType: nextBallType,
            rotation: nextBallRot,
            ...nextBallStatus,
        });
        this.balls[curIndex] = nextBall;
        nextBall.switch(playerBallType, [
            playerPos,
            playerRot,
            new Float3(playerStatus.scale, playerStatus.scale, playerStatus.scale),
        ], [playerLinearVelocity, playerAngularVelocity], playerStatus, templateNameSuffix);
        return true;
    }
    /**
     * Removes the balls at the given indexes.
     * @param indexes - The indexes of the balls to remove.
     * @param vfx - Whether to destroy the ball with visual effects or not. Defaults to `true`.
     */
    removeBall(indexes, vfx) {
        vfx ??= true;
        for (const index of indexes) {
            const ball = this.balls[index];
            if (ball && !isPlayer(ball)) {
                ball.destroy(vfx);
            }
        }
        this.balls = this.balls.filter((_, i) => !indexes.includes(i));
    }
    /**
     * Removes the balls with the same type as the player.
     * @param vfx - Whether to destroy the ball with visual effects or not. Defaults to `true`.
     */
    removeBallsWithSameTypeAsPlayer(vfx) {
        vfx ??= true;
        const indexesToRemove = [];
        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];
            if (!isPlayer(ball) && ball.ballType === player.ballType) {
                indexesToRemove.push(i);
            }
        }
        this.removeBall(indexesToRemove, vfx);
    }
    /**
     * Removes the balls that have been destroyed.
     */
    removeDestroyedBalls() {
        const indexesToRemove = [];
        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];
            if (isPlayer(ball))
                continue;
            if (ball.instance.getComponent("PhysicsObject").isDestroyed()) {
                indexesToRemove.push(i);
            }
        }
        this.removeBall(indexesToRemove, false);
    }
    /**
     * Removes all balls except the player ball.
     * @param vfx - Whether to destroy the ball with visual effects or not. Defaults to `true`.
     */
    removeAllBalls(vfx) {
        vfx ??= true;
        this.init(vfx);
    }
    /**
     * Updates the multi ball system.
     * @param keyTipText - The text to display on the key tip UI.
     */
    update(keyTipText) {
        this.removeDestroyedBalls();
        this.removeBallsWithSameTypeAsPlayer();
        this.updateKeyTipUI(this.duringKeyConfig ? "[ . . . ]" : keyTipText);
        this.updateAvatarUI();
    }
});
export default multiBallManager;
