// @ts-nocheck
import { math, player, console, inputManager, levelManager, tweenManager, Float2, Float3, ColorRGBA, } from "gameApi";
import mathEx from "Scripts/Utility/mathEx.js";
import Avatar from "Scripts/MultiBall/AvatarClass.js";
import MultiBall from "Scripts/MultiBall/MultiBallClass.js";
import CustomKey from "Scripts/UtilClass/CustomKeyClass.js";
import Manager from "Scripts/UtilClass/Manager.js";
import { isPlayer, defaultStatus, createSingleton, getStatusFromPlayer, } from "Scripts/MultiBall/Utils.js";
class MultiBallManager extends Manager {
    switchKey;
    cameraEase;
    easeDistance;
    get canSwitch() {
        return this.locks.every(lock => !lock);
    }
    get tipText() {
        return {
            switch: {
                English: `When multiple balls appear in the status bar, you can use the ${this.switchKey.key} key to switch between them.`,
                简体中文: `当状态栏有多个球出现时，你可以使用${this.switchKey.key}键进行切换。`,
                日本語: `ステ一タスバ一に複数のボ一ルが表示された場合、${this.switchKey.key}キ一で切り替えることができます。`,
                Spanish: `Cuando aparece más de una bola en la barra de estado, puedes utilizar la tecla ${this.switchKey.key} para cambiar de una a otra.`,
                繁體中文: `當狀態列有多個球出現時，你可以使用${this.switchKey.key}鍵進行切換。`,
            },
            ctrl: {
                English: "Hold Left Ctrl to switch in reverse order.",
                简体中文: "按住左Ctrl键逆序切换。",
                日本語: "左Ctrlキを押し続けて逆順に切り替えます。",
                Spanish: "Mantén pulsado el Ctrl izquierdo para cambiar de una a otra en orden inverso.",
                繁體中文: "按住左Ctrl鍵逆序切換。",
            },
        };
    }
    locks = [
        false,
        false,
    ];
    skinSuffix = ["", "Mush"][levelManager.skin];
    sfx;
    init(switchKeys, cameraEase, easeDistance, sfxAppendEnd, sfxSwitch) {
        this.switchKey = new CustomKey("", switchKeys, false, 21, new Float2(0.5, 0.915), false, 1, new ColorRGBA(1, 1, 1, 1), false);
        this.cameraEase = cameraEase;
        this.easeDistance = easeDistance;
        this.sfx = { appendEnd: sfxAppendEnd, switch: sfxSwitch };
    }
    balls = [player];
    platformTrans = [];
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
        return (this.currentIndex - 1 + this.balls.length) % this.balls.length;
    }
    get previousBall() {
        return this.balls[this.previousIndex];
    }
    playerAvatar = new Avatar(`Textures/Balls/${player.ballType}.tex`);
    updateKeyTipUI() {
        if (this.balls.length > 1)
            this.switchKey.showUI();
        else
            this.switchKey.hideUI();
        this.switchKey.update();
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
                durability = ball.status.durability;
            }
            avatar.update(enabled, chosen, durability, (i - (this.balls.length - 1) / 2) * 52.5);
        }
    }
    reset(vfx) {
        vfx ??= true;
        this.locks.fill(false);
        for (const ball of this.balls) {
            if (!isPlayer(ball)) {
                ball.destroy(vfx);
            }
        }
        this.balls = [player];
    }
    addBall(ballType, templateName, trans, velocity, status, index) {
        status ??= defaultStatus;
        const newBall = new MultiBall(ballType, templateName, trans, velocity, status);
        if (index === undefined)
            this.balls.push(newBall);
        else
            this.balls.splice(index, 0, newBall);
    }
    appendBall(ballType, appenderPos) {
        const platformTrans = this.getClosetPlatformTrans(appenderPos);
        if (!platformTrans) {
            console.error("No Append Platform found in the map.");
            return;
        }
        const [platformPos, platformRot] = platformTrans;
        this.addBall(ballType, `Multi${ballType}${this.skinSuffix}`, [
            mathEx.addFloat3(platformPos, mathEx.transFloat3WithQuat(new Float3(0, 1, 0), math.float3ToQuaternion(platformRot))),
            new Float3(0, 0, 0),
            new Float3(1, 1, 1),
        ], [new Float3(0, 0, 0), new Float3(0, 0, 0)]);
        this.forceSwitchBall(this.balls.length - 1, false);
        this.sfx.appendEnd.play();
        levelManager.spawnVfxPRS("TransportEnd", platformPos, platformRot, new Float3(1, 1, 1));
        this.locks[1] = false;
        this.sendEvent("OnPostMultiBallAppendEnd", { ballType });
    }
    startAppend(ballType, appenderTrans, audioPlayer) {
        this.sendEvent("OnPreMultiBallAppendStart", { ballType });
        if (this.canceledEvents.has("OnPreMultiBallAppendStart"))
            return;
        this.locks[1] = true;
        audioPlayer.play();
        const [appenderPos, appenderRot] = appenderTrans;
        levelManager.spawnVfxPRS("TransportStart", appenderPos, appenderRot, new Float3(1, 1, 1));
        const playerTargetPos = mathEx.addFloat3(appenderPos, mathEx.transFloat3WithQuat(new Float3(0, 1, 0), math.float3ToQuaternion(appenderRot)));
        const { durability, temperature, wetness, power, scale } = player;
        tweenManager
            .createFloatTween(0, 0, "Linear", 125, () => {
            Object.assign(player, {
                durability,
                temperature,
                wetness,
                power,
                scale,
            });
            player.physicsObject.setVelocity(mathEx.scaleFloat3(mathEx.subFloat3(playerTargetPos, player.position), 5), mathEx.getAngularVelocityToUnit(player.rotationQuaternion));
        }, () => {
            this.locks[1] = false;
            this.sendEvent("OnPreMultiBallAppendEnd", { ballType });
            if (this.canceledEvents.has("OnPreMultiBallAppendEnd"))
                return;
            this.appendBall(ballType, appenderPos);
        })
            .play();
    }
    forceSwitchBall(index, sfx) {
        index ??= this.nextIndex;
        sfx ??= true;
        const curIndex = this.currentIndex;
        if (index === curIndex)
            return;
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
        if (!this.cameraEase ||
            (this.easeDistance >= 0 &&
                math.distanceFloat3(playerPos, nextBallPos) >=
                    this.easeDistance))
            player.transfer(nextBallPos);
        Object.assign(player, {
            position: nextBallPos,
            ballType: nextBallType,
            rotation: nextBallRot,
            ...nextBallStatus,
        });
        this.balls[curIndex] = nextBall;
        nextBall.status = playerStatus;
        nextBall.switch(playerBallType, `Multi${playerBallType}${playerBallType === "StickyBall" && playerStatus.power === 0 ? "OOP" : ""}${this.skinSuffix}`, [
            playerPos,
            playerRot,
            new Float3(playerStatus.scale, playerStatus.scale, playerStatus.scale),
        ], [playerLinearVelocity, playerAngularVelocity]);
        if (sfx)
            this.sfx.switch.play();
        this.locks[1] = true;
        levelManager.invoke(() => (this.locks[1] = false), 10);
    }
    switchBall(index) {
        index ??= this.nextIndex;
        if (!this.canSwitch)
            return;
        this.sendEvent("OnPreMultiBallSwitch", { index });
        if (this.canceledEvents.has("OnPreMultiBallSwitch"))
            return;
        this.forceSwitchBall(index);
        this.sendEvent("OnPostMultiBallSwitch", { index });
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
    removeBallsWithSameTypeAsPlayer() {
        const indexesToRemove = [];
        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];
            if (!isPlayer(ball) && ball.ballType === player.ballType) {
                indexesToRemove.push(i);
            }
        }
        this.removeBall(indexesToRemove, true);
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
    getClosetPlatformTrans(pos) {
        let res = null;
        let minDist = Infinity;
        for (const trans of this.platformTrans) {
            const dist = math.distanceFloat3(pos, trans[0]);
            if (dist < minDist) {
                res = trans;
                minDist = dist;
            }
        }
        return res;
    }
    updateUI() {
        this.updateAvatarUI();
        this.updateKeyTipUI();
    }
    updateBalls() {
        this.removeDestroyedBalls();
        this.removeBallsWithSameTypeAsPlayer();
    }
    onEvents({ OnStartLevel, OnTimerActive, OnPhysicsUpdate, OnPlayerDeadEnd, OnPostSwitchBallEnd, OnPreSwitchBallStart, OnPostTransferBallEnd, OnPreTransferBallStart, OnPostCheckpointReached, OnPostDestinationReached, }) {
        if (OnPreSwitchBallStart || OnPreTransferBallStart) {
            if (this.locks[1]) {
                levelManager.cancelEvent("OnPreSwitchBallStart");
                levelManager.cancelEvent("OnPreTransferBallStart");
            }
            else {
                this.locks[0] = true;
            }
        }
        if (OnPostSwitchBallEnd || OnPostTransferBallEnd) {
            this.locks[0] = false;
        }
        if (OnTimerActive) {
            this.reset(false);
        }
        if (OnPostCheckpointReached || OnPostDestinationReached) {
            this.reset(true);
        }
        if ((OnStartLevel || OnPlayerDeadEnd) && player.ballType) {
            this.reset(false);
            this.updateUI();
        }
        if (OnPhysicsUpdate) {
            if (!levelManager.timerEnabled)
                return;
            if (this.switchKey.checkDown())
                this.switchBall(inputManager.keyboard.checkKeyHold("LeftCtrl")
                    ? this.previousIndex
                    : this.nextIndex);
            this.updateBalls();
            this.updateUI();
        }
    }
}
export const multiBallManager = createSingleton(MultiBallManager);
export default multiBallManager;
