// @ts-nocheck
import { math, player, console, settings, inputManager, levelManager, Float2, Float3, ColorRGBA, tweenManager, } from "gameApi";
import mathEx from "Scripts/Utility/mathEx.js";
import Avatar from "Scripts/MultiBall/AvatarClass.js";
import MultiBall from "Scripts/MultiBall/MultiBallClass.js";
import AmazingTextUI from "Scripts/Amazing/AmazingTextUIClass.js";
import { allKeys, isPlayer, isMouseKey, checkKeyDown, defaultStatus, createSingleton, getStatusFromPlayer, } from "Scripts/MultiBall/Utils.js";
class MultiBallManager {
    switchKeys;
    get switchKey() {
        return this.switchKeys[levelManager.cameraMode === 0 ? 0 : 1];
    }
    set switchKey(key) {
        this.switchKeys[levelManager.cameraMode === 0 ? 0 : 1] = key;
    }
    cameraEase;
    easeDistance;
    get canSwitch() {
        return !this.keyTipUI.duringConfig && this.locks.every(lock => !lock);
    }
    locks = [
        false,
        false,
    ];
    skinSuffix = ["", "Mush"][levelManager.skin];
    sfx;
    keyTipUI;
    keyTipGuid = null;
    canceledEvents = new Set();
    get keyTipText() {
        return {
            English: `When multiple balls appear in the status bar, you can use the ${this.keyTipUIText} key to switch between them.`,
            简体中文: `当状态栏有多个球出现时，你可以使用${this.keyTipUIText}键进行切换。`,
            日本語: `ステ一タスバ一に複数のボ一ルが表示された場合、${this.keyTipUIText}キ一で切り替えることができます。`,
            Spanish: `Cuando aparece más de una bola en la barra de estado, puedes utilizar la tecla ${this.keyTipUIText} para cambiar de una a otra.`,
            繁體中文: `當狀態列有多個球出現時，你可以使用${this.keyTipUIText}鍵進行切換。`,
        }[settings.language];
    }
    get keyTipUIText() {
        const key = this.switchKey;
        const prefix = isMouseKey(key) ? "MOUSE" : "";
        return this.keyTipUI?.duringConfig
            ? "[ . . . ]"
            : `${prefix} ${key.toUpperCase()}`;
    }
    init(switchKeys, cameraEase, easeDistance, sfxAppendEnd, sfxSwitch) {
        this.switchKeys = switchKeys;
        this.cameraEase = cameraEase;
        this.easeDistance = easeDistance;
        this.sfx = { appendEnd: sfxAppendEnd, switch: sfxSwitch };
        this.keyTipUI = new AmazingTextUI(this.keyTipUIText, 21, new Float2(0.5, 0.915), false, 1, new ColorRGBA(1, 1, 1, 1));
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
        const text = this.keyTipUIText;
        if (this.balls.length > 1) {
            this.keyTipUI.show(text);
        }
        else {
            this.keyTipUI.hide();
        }
        this.keyTipUI.update(text);
    }
    keyConfig() {
        if (this.keyTipUI.duringConfig) {
            for (const key of allKeys) {
                if (checkKeyDown(key)) {
                    this.switchKey = key;
                    this.keyTipUI.duringConfig = false;
                    this.balls;
                }
            }
        }
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
    showKeyTip() {
        if (this.keyTipGuid)
            return;
        this.keyTipGuid = levelManager.showTip(this.keyTipText);
    }
    hideKeyTip() {
        if (!this.keyTipGuid)
            return;
        levelManager.hideTip(this.keyTipGuid);
        this.keyTipGuid = null;
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
        this.forceSwitchBall(this.balls.length - 1);
        this.sfx.appendEnd.play();
        levelManager.spawnVfxPRS("TransportEnd", platformPos, platformRot, new Float3(1, 1, 1));
        this.locks[1] = false;
        levelManager.sendCustomEvent({
            _brand: "MultiBallMessage",
            OnPostMultiBallAppendEnd: { ballType },
        });
    }
    startAppend(ballType, appenderTrans, audioPlayer) {
        levelManager.sendCustomEvent({
            _brand: "MultiBallMessage",
            OnPreMultiBallAppendStart: { ballType },
        });
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
            levelManager.sendCustomEvent({
                _brand: "MultiBallMessage",
                OnPreMultiBallAppendEnd: { ballType },
            });
            if (this.canceledEvents.has("OnPreMultiBallAppendEnd"))
                return;
            this.appendBall(ballType, appenderPos);
        })
            .play();
    }
    forceSwitchBall(index) {
        index ??= this.nextIndex;
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
        this.sfx.switch.play();
        this.locks[1] = true;
        levelManager.invoke(() => (this.locks[1] = false), 10);
        levelManager.sendCustomEvent({
            _brand: "MultiBallMessage",
            OnMultiBallSwitch: {},
        });
    }
    switchBall(index) {
        index ??= this.nextIndex;
        if (!this.canSwitch)
            return false;
        this.forceSwitchBall(index);
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
    cancelEvent(event) {
        this.canceledEvents.add(event);
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
        this.keyConfig();
        this.updateKeyTipUI();
    }
    updateBalls() {
        this.removeDestroyedBalls();
        this.removeBallsWithSameTypeAsPlayer();
    }
    update({ OnStartLevel, OnTimerActive, OnPhysicsUpdate, OnPlayerDeadEnd, OnPostSwitchBallEnd, OnPreSwitchBallStart, OnPostTransferBallEnd, OnPreTransferBallStart, OnPostCheckpointReached, OnPostDestinationReached, }) {
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
            this.updateBalls();
            if (checkKeyDown(this.switchKey))
                this.switchBall(inputManager.keyboard.checkKeyHold("LeftCtrl")
                    ? this.previousIndex
                    : this.nextIndex);
            this.updateUI();
        }
        this.canceledEvents.clear();
    }
}
export const multiBallManager = createSingleton(MultiBallManager);
export default multiBallManager;
