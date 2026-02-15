import { math, player, uiCanvas, Float2, Float3, ColorRGBA } from "gameApi";
import Avatar from "Scripts/MultiBall/AvatarClass.js";
import MultiBall from "Scripts/MultiBall/MultiBallClass.js";
import { isPlayer, defaultStatus, createSingleton, getStatusFromPlayer, } from "Scripts/MultiBall/Utils.js";
export const multiBallManager = createSingleton(class MultiBallManager {
    balls = [player];
    duringKeyConfig = false;
    playerAvatar = new Avatar(`Textures/Balls/${player.ballType}.tex`);
    keyTipUI;
    get currentIndex() {
        return this.balls.findIndex(ball => isPlayer(ball));
    }
    get nextIndex() {
        return (this.currentIndex + 1) % this.balls.length;
    }
    get nextBall() {
        return this.balls[this.nextIndex];
    }
    get previousIndex() {
        return ((this.currentIndex - 1 + this.balls.length) % this.balls.length);
    }
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
    init(vfx) {
        vfx ??= true;
        for (const ball of this.balls) {
            if (!isPlayer(ball)) {
                ball.destroy(vfx);
            }
        }
        this.balls = [player];
    }
    updateKeyTipUI(text) {
        text ??= "";
        if (!(this.keyTipUI.enabled = this.balls.length > 1))
            return;
        this.keyTipUI.text = `<b>${text.toUpperCase()}</b>`;
    }
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
    addBall(ballType, trans, velocity, templateNameSuffix, status, index) {
        templateNameSuffix ??= "";
        status ??= defaultStatus;
        const newBall = new MultiBall(ballType, status, trans, velocity, templateNameSuffix);
        if (index === undefined)
            this.balls.push(newBall);
        else
            this.balls.splice(index, 0, newBall);
    }
    appendBall(ballType, trans, cameraEase, easeDistance, velocity, templateNameSuffixForOld, templateNameSuffixForNew, status) {
        easeDistance ??= 10;
        velocity ??= [new Float3(0, 0, 0), new Float3(0, 0, 0)];
        templateNameSuffixForOld ??= "";
        templateNameSuffixForNew ??= "";
        status ??= defaultStatus;
        this.addBall(ballType, trans, velocity, templateNameSuffixForNew, status);
        this.switchBall(cameraEase, easeDistance, templateNameSuffixForOld, this.balls.length - 1);
    }
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
        ];
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
    removeAllBalls(vfx) {
        vfx ??= true;
        this.init(vfx);
    }
    update(keyTipText) {
        this.removeDestroyedBalls();
        this.removeBallsWithSameTypeAsPlayer();
        this.updateKeyTipUI(this.duringKeyConfig ? "[ . . . ]" : keyTipText);
        this.updateAvatarUI();
    }
});
export default multiBallManager;
