import { player, console, scene, levelManager, inputManager, math, uiCanvas, Float2, Float3, ColorRGBA } from "gameApi";
var multiBallManager;
(function (multiBallManager) {
    multiBallManager.removeMultiBalls = (ballTypes) => {
        for (const ballType of ballTypes) {
            removeBall(ballType);
        }
    };
    multiBallManager.removeAllMultiBalls = (vfx) => {
        initAllBalls(vfx);
    };
    multiBallManager.getMultiBallData = (ballType) => {
        if (ballType === player.ballType) {
            const { durability, temperature, wetness, power, scale } = player;
            return { index: ballIndex, durability, temperature, wetness, power, scale, instance: player };
        }
        for (const [i, ball] of allBalls.entries()) {
            if (ball.instance.guid === player.guid)
                continue;
            if (ballType === ball.instance.getComponent("Settings").getData("Tags")[0]) {
                return {
                    index: i,
                    ...ball,
                };
            }
        }
        return null;
    };
    multiBallManager.isMultiBall = (item) => allBalls.some(ball => ball.instance.guid === item.guid);
})(multiBallManager || (multiBallManager = {}));
const ballTypes = [
    "WoodenBall",
    "StoneBall",
    "PaperBall",
    "IceBall",
    "SteelBall",
    "RubberBall",
    "BalloonBall",
    "StickyBall",
    "SpongeBall",
];
const mouseButtons = new Set(["Left", "Middle", "Right"]);
const checkKeyDown = (key) => mouseButtons.has(key)
    ? inputManager.mouse.checkButtonDown(key)
    : inputManager.keyboard.checkKeyDown(key);
const addFloat3 = (a, b) => new Float3(a.x + b.x, a.y + b.y, a.z + b.z);
let switchActivated = true;
let multiSwitchActivated = true;
let suffix;
let switchSfxPlayer;
let transferEndSfxPlayer;
let stickyBallPreMats;
const appendPlatformData = [];
let ballIndex = 0;
const allBalls = [];
let uiLayer;
let uiKeyTip;
const ui = {
    WoodenBall: null,
    StoneBall: null,
    PaperBall: null,
    IceBall: null,
    SteelBall: null,
    RubberBall: null,
    BalloonBall: null,
    StickyBall: null,
    SpongeBall: null,
};
const createAllUIs = () => {
    const createUI = (ballTypeIndex) => {
        const panel = uiCanvas.createUI("Panel");
        panel.sizeDelta = new Float2(0, 0);
        panel.parent = uiLayer;
        const imgSub = uiCanvas.createUI("Image");
        imgSub.parent = panel;
        imgSub.mask = true;
        const img = uiCanvas.createUI("Image");
        img.parent = imgSub;
        img.texture = ballAvatars[ballTypeIndex];
        img.sizeDelta = new Float2(0, 0);
        img.anchorMin = new Float2(-0.1, -0.9);
        img.anchorMax = new Float2(1.9, 1.1);
        const bar = uiCanvas.createUI("Image");
        bar.parent = imgSub;
        bar.sizeDelta = new Float2(0, 0);
        bar.color = new ColorRGBA(1, 1, 1, 0.75);
        bar.anchorMin = new Float2(0, 0);
        bar.anchorMax = new Float2(1, 0.1);
        return { panel, imgSub, img, bar };
    };
    uiLayer = uiCanvas.createUI("Panel");
    uiLayer.sizeDelta = new Float2(0, 0);
    uiLayer.anchorMin = uiLayer.anchorMax = new Float2(0.5, 0.95);
    uiKeyTip = uiCanvas.createUI("Text");
    uiKeyTip.parent = uiLayer;
    const switchBallKey = switchBallKeys[levelManager.cameraMode === 0 ? 0 : 1];
    const prefix = mouseButtons.has(switchBallKey) ? "MOUSE " : "";
    uiKeyTip.text = `<b>${prefix}${switchBallKey.toUpperCase()}</b>`;
    uiKeyTip.fontSize = 42;
    uiKeyTip.pivot = new Float2(0.5, 2.5);
    for (const [i, ballType] of ballTypes.entries()) {
        ui[ballType] = createUI(i);
    }
    uiLayer.scale = new Float2(0.5, 0.5);
    uiLayer.enabled = false;
};
const updateUI = () => {
    uiLayer.enabled = allBalls.length > 1;
    const switchBallKey = switchBallKeys[levelManager.cameraMode === 0 ? 0 : 1];
    const prefix = mouseButtons.has(switchBallKey) ? "MOUSE " : "";
    uiKeyTip.text = `<b>${prefix}${switchBallKey.toUpperCase()}</b>`;
    const exists = allBalls.map(ball => ball.instance.guid === player.guid
        ? player.ballType
        : ball.instance.getComponent("Settings").getData("Tags")[0]);
    for (const ballType in ui) {
        const index = exists.indexOf(ballType);
        if (index === -1) {
            ui[ballType].panel.enabled = false;
            continue;
        }
        else {
            const { panel, imgSub, bar } = ui[ballType];
            panel.enabled = true;
            panel.position = new Float2((index - (allBalls.length - 1) / 2) * 105, 0);
            const c = +(index === ballIndex);
            imgSub.color = new ColorRGBA(c, c, c, c === 1 ? 0.2 : 0.5);
            const durability = allBalls[index].instance.guid === player.guid ? player.durability : allBalls[index].durability;
            bar.anchorMax = new Float2(durability / 100, 0.1);
            if (durability > 25) {
                bar.color = new ColorRGBA(1, 1, 1, 0.75);
            }
            else if (durability > 20) {
                const lerp = 5 - durability / 5;
                bar.color = new ColorRGBA(1, math.lerp(0xff / 255, 0xe6 / 255, lerp), math.lerp(0xff / 255, 0x78 / 255, lerp), 0.75);
            }
            else if (durability > 15) {
                const lerp = 4 - durability / 5;
                bar.color = new ColorRGBA(1, math.lerp(0xe6 / 255, 0x82 / 255, lerp), math.lerp(0x78 / 255, 0x12 / 255, lerp), 0.75);
            }
            else if (durability > 5) {
                const lerp = 1.5 - durability / 10;
                bar.color = new ColorRGBA(1, math.lerp(0x82 / 255, 0x4c / 255, lerp), math.lerp(0x12 / 255, 0x28 / 255, lerp), 0.75);
            }
            else {
                const lerp = 1 - durability / 5;
                bar.color = new ColorRGBA(1, math.lerp(0x4c / 255, 0x00 / 255, lerp), math.lerp(0x28 / 255, 0x00 / 255, lerp), 0.75);
            }
        }
    }
};
const initAllBalls = (vfx = false) => {
    switchActivated = true;
    multiSwitchActivated = true;
    for (let i = 0; i < allBalls.length; i++) {
        if (allBalls[i].instance.guid !== player.guid) {
            destroyBallItem(allBalls[i].instance, i, vfx, false);
        }
    }
    allBalls.length = 0;
    const { durability, temperature, wetness, power, scale } = player;
    allBalls.push({
        durability,
        temperature,
        wetness,
        power,
        scale,
        instance: player,
    });
    ballIndex = 0;
};
const destroyBallItem = (ins, index, vfx, modGlob = true) => {
    if (vfx) {
        const [pos, rot, scl] = ins.getTransform();
        levelManager.spawnVfxPRS("DestroyObject", pos, rot, scl);
        const sfx = scene.createItem("DestroySfx", pos, new Float3(0, 0, 0), new Float3(1, 1, 1));
        sfx.getComponent("AudioPlayer").play();
        levelManager.invoke(() => scene.destroyItem(sfx.guid), 200);
    }
    scene.destroyItem(ins.guid);
    if (modGlob) {
        allBalls.splice(index, 1);
        if (ballIndex >= index)
            ballIndex--;
    }
};
const removeBall = (ballType) => {
    ballType ??= player.ballType;
    for (let i = 0; i < allBalls.length; i++) {
        if (allBalls[i].instance.guid === player.guid)
            continue;
        const ins = allBalls[i].instance;
        if (ins.getComponent("Settings").getData("Tags")[0] === ballType) {
            destroyBallItem(ins, i, true);
            break;
        }
        else if (ins.getComponent("PhysicsObject").isDestroyed()) {
            destroyBallItem(ins, i, false);
            break;
        }
    }
};
const append = ({ ballType, position }) => {
    transferEndSfxPlayer.play();
    const closestPlatform = getClosestPlatform(position);
    if (!closestPlatform) {
        console.error("No Append Platform found in the map.");
        return;
    }
    const [[pp, pr, _ps], tp] = closestPlatform;
    levelManager.spawnVfxPRS("TransportEnd", pp, pr, new Float3(1, 1, 1));
    let { durability, temperature, wetness, power, scale } = player;
    Object.assign(allBalls[ballIndex], { durability, temperature, wetness, power, scale });
    allBalls[ballIndex].instance = scene.createItem(`Multi${player.ballType}${suffix}`, addFloat3(position, new Float3(0, 1, 0)), new Float3(0, 0, 0), new Float3(scale, scale, scale));
    if (player.ballType === "StickyBall") {
        const renderer = allBalls[ballIndex].instance.getComponent("Renderer");
        const mats = renderer.getData("Materials");
        stickyBallPreMats ??= mats;
        renderer.setData({
            Materials: player.power === 0 ? stickyBallPreMats.toSpliced(-1, 1, stickyOutOfPowerMat) : stickyBallPreMats,
        });
    }
    player.rotation = new Float3(0, 0, 0);
    !cameraEase || (easeDistance >= 0 && math.distanceFloat3(player.position, tp) >= easeDistance)
        ? player.transfer(tp)
        : (player.position = tp);
    player.ballType = ballType;
    player.recoverAll();
    ({ durability, temperature, wetness, power, scale } = player);
    allBalls.push({
        durability,
        temperature,
        wetness,
        power,
        scale,
        instance: player,
    });
    ballIndex = allBalls.length - 1;
    multiSwitchActivated = true;
    levelManager.sendCustomEvent({ OnPostMultiBallAppendEnd: { ballType, position } });
};
const switchBall = () => {
    if (!multiSwitchActivated || !switchActivated || allBalls.length <= 1)
        return;
    multiSwitchActivated = false;
    levelManager.invoke(() => (multiSwitchActivated = true), 10);
    levelManager.sendCustomEvent({ OnMultiBallSwitch: {} });
    switchSfxPlayer.play();
    const nextIndex = (ballIndex + 1) % allBalls.length;
    const nextBall = allBalls[nextIndex].instance;
    const playerLV = player.physicsObject.getLinearVelocity();
    const playerAV = player.physicsObject.getAngularVelocity();
    const { position: playerPos, rotation: playerRot, ballType: playerType, power: playerPower, scale: playerScale, } = player;
    const nextBallPhysicsObject = nextBall.getComponent("PhysicsObject");
    const nextBallType = nextBall.getComponent("Settings").getData("Tags")[0];
    const nextBallLV = nextBallPhysicsObject.getLinearVelocity();
    const nextBallAV = nextBallPhysicsObject.getAngularVelocity();
    const [nextBallPos, nextBallRot] = nextBall.getTransform();
    scene.destroyItem(nextBall.guid);
    let { durability, temperature, wetness, power, scale } = player;
    Object.assign(allBalls[ballIndex], { durability, temperature, wetness, power, scale });
    ({ durability, temperature, wetness, power, scale } = allBalls[nextIndex]);
    allBalls[nextIndex].instance = player;
    player.physicsObject.setVelocity(nextBallLV, nextBallAV);
    if (!cameraEase || (easeDistance >= 0 && math.distanceFloat3(playerPos, nextBallPos) >= easeDistance))
        player.transfer(nextBallPos);
    Object.assign(player, {
        position: nextBallPos,
        ballType: nextBallType,
        rotation: nextBallRot,
        durability,
        temperature,
        wetness,
        power,
        scale,
    });
    const newBall = scene.createItem(`Multi${playerType}${suffix}`, playerPos, playerRot, new Float3(playerScale, playerScale, playerScale));
    newBall.getComponent("PhysicsObject").setVelocity(playerLV, playerAV);
    if (playerType === "StickyBall") {
        const renderer = newBall.getComponent("Renderer");
        const mats = renderer.getData("Materials");
        stickyBallPreMats ??= mats;
        renderer.setData({
            Materials: playerPower === 0 ? stickyBallPreMats.toSpliced(-1, 1, stickyOutOfPowerMat) : stickyBallPreMats,
        });
    }
    allBalls[ballIndex].instance = newBall;
    ballIndex = nextIndex;
};
const getClosestPlatform = (pos) => {
    let res = null;
    let minDist = Infinity;
    for (const data of appendPlatformData) {
        const [[pp, _pr, _ps], _tp] = data;
        const dist = math.distanceFloat3(pos, pp);
        if (dist < minDist) {
            res = data;
            minDist = dist;
        }
    }
    return res;
};
export const init = (self, v) => {
    for (const k in v)
        globalThis[k] = v[k];
};
export const registerEvents = [
    "OnLoadLevel",
    "OnStartLevel",
    "OnTimerActive",
    "OnPhysicsUpdate",
    "OnPlayerDeadEnd",
    "OnPostSwitchBallEnd",
    "OnPreSwitchBallStart",
    "OnReceiveCustomEvent",
    "OnPostTransferBallEnd",
    "OnPreTransferBallStart",
    "OnPostCheckpointReached",
    "OnPostDestinationReached",
];
export const onEvents = (self, events) => {
    if (events.OnReceiveCustomEvent) {
        const msg = events.OnReceiveCustomEvent[0];
        if (typeof msg === "object") {
            if (msg.OnLoadMultiBallPlatformPos) {
                appendPlatformData.push(msg.OnLoadMultiBallPlatformPos);
            }
            if (msg.OnPreMultiBallAppendStart) {
                multiSwitchActivated = false;
            }
            if (msg.OnPreMultiBallAppendEnd) {
                append(msg.OnPreMultiBallAppendEnd);
            }
        }
    }
    if (events.OnPreSwitchBallStart || events.OnPreTransferBallStart) {
        if (!multiSwitchActivated) {
            levelManager.cancelEvent("OnPreSwitchBallStart");
            levelManager.cancelEvent("OnPreTransferBallStart");
        }
        else {
            switchActivated = false;
        }
    }
    if (events.OnPostSwitchBallEnd || events.OnPostTransferBallEnd) {
        switchActivated = true;
    }
    if (events.OnLoadLevel) {
        suffix = ["", "Mush"][levelManager.skin];
        levelManager.sendCustomEvent({ OnLoadMultiBall: { switchBallKeys, multiBallManager } });
        transferEndSfxPlayer = self.getComponent("AudioPlayer");
        switchSfxPlayer = scene.getItem(switchSfx).getComponent("AudioPlayer");
        createAllUIs();
    }
    if (events.OnTimerActive) {
        initAllBalls();
    }
    if (events.OnPostCheckpointReached || events.OnPostDestinationReached) {
        initAllBalls(true);
    }
    if ((events.OnStartLevel || events.OnPlayerDeadEnd) && player.ballType) {
        initAllBalls();
        updateUI();
    }
    if (events.OnPhysicsUpdate) {
        if (!levelManager.timerEnabled) {
            return;
        }
        if (checkKeyDown(switchBallKeys[levelManager.cameraMode === 0 ? 0 : 1])) {
            switchBall();
        }
        removeBall();
        updateUI();
    }
};
