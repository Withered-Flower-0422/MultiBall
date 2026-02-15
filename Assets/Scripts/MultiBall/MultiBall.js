import { math, scene, player, console, levelManager, inputManager, Float3, } from "gameApi";
import { allKeys, isMouseKey, isMultiBallMessage, } from "Scripts/MultiBall/Utils.js";
import mathEx from "Scripts/Utility/mathEx.js";
import multiBallManager from "Scripts/MultiBall/MultiBallManager.js";
let switchActivated = true;
let multiSwitchActivated = true;
let switchSfxPlayer;
let transferEndSfxPlayer;
const suffix = ["", "Mush"][levelManager.skin];
const appendPlatformTrans = [];
const switchBall = (key) => {
    if (checkKeyDown(key) &&
        switchActivated &&
        multiSwitchActivated &&
        !multiBallManager.duringKeyConfig) {
        multiSwitchActivated = false;
        levelManager.invoke(() => (multiSwitchActivated = true), 10);
        levelManager.sendCustomEvent({
            _brand: "MultiBallMessage",
            OnMultiBallSwitch: { switchBallKeys },
        });
        if (multiBallManager.switchBall(cameraEase, easeDistance, getSuffix(), inputManager.keyboard.checkKeyHold("LeftCtrl")
            ? multiBallManager.previousIndex
            : multiBallManager.nextIndex))
            switchSfxPlayer.play();
    }
};
const appendBall = ({ ballType, position, }) => {
    transferEndSfxPlayer.play();
    const targetTrans = getClosestPlatform(position);
    if (!targetTrans) {
        console.error("No Append Platform found in the map.");
        return;
    }
    const [tp, tr] = targetTrans;
    const tpAbove1 = mathEx.addFloat3(tp, mathEx.transFloat3WithQuat(new Float3(0, 1, 0), math.float3ToQuaternion(tr)));
    multiBallManager.appendBall(ballType, [tpAbove1, new Float3(0, 0, 0), new Float3(1, 1, 1)], cameraEase, easeDistance, undefined, getSuffix(), getSuffix(ballType));
    levelManager.sendCustomEvent({
        _brand: "MultiBallMessage",
        OnPostMultiBallAppendEnd: { ballType, position, switchBallKeys },
    });
    multiSwitchActivated = true;
    levelManager.spawnVfxPRS("TransportEnd", tpAbove1, tr, new Float3(1, 1, 1));
};
const checkKeyConfig = () => {
    if (multiBallManager.duringKeyConfig) {
        for (const key of allKeys) {
            if (checkKeyDown(key)) {
                switchBallKeys[0] = key;
                multiBallManager.duringKeyConfig = false;
                break;
            }
        }
    }
};
const initMultiBall = (vfx) => {
    switchActivated = multiSwitchActivated = true;
    multiBallManager.init(vfx);
};
const updateMultiBall = () => {
    const keybind = switchBallKeys[levelManager.cameraMode === 0 ? 0 : 1];
    switchBall(keybind);
    multiBallManager.update(`${isMouseKey(keybind) ? "MOUSE " : ""}${keybind}`);
    checkKeyConfig();
};
const checkKeyDown = (key) => isMouseKey(key)
    ? inputManager.mouse.checkButtonDown(key)
    : inputManager.keyboard.checkKeyDown(key);
const getClosestPlatform = (pos) => {
    let res = null;
    let minDist = Infinity;
    for (const trans of appendPlatformTrans) {
        const dist = math.distanceFloat3(pos, trans[0]);
        if (dist < minDist) {
            res = trans;
            minDist = dist;
        }
    }
    return res;
};
const getSuffix = (bt = player.ballType) => `${bt === "StickyBall" && player.power === 0 ? "OOP" : ""}${suffix}`;
export const init = (self, v) => {
    Object.assign(globalThis, v);
    switchSfxPlayer = scene.getItem(switchSfx).getComponent("AudioPlayer");
    transferEndSfxPlayer = self.getComponent("AudioPlayer");
};
export const registerEvents = [
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
export const onEvents = (self, { OnStartLevel, OnTimerActive, OnPhysicsUpdate, OnPlayerDeadEnd, OnPostSwitchBallEnd, OnReceiveCustomEvent, OnPreSwitchBallStart, OnPostTransferBallEnd, OnPreTransferBallStart, OnPostCheckpointReached, OnPostDestinationReached, }) => {
    if (OnReceiveCustomEvent) {
        const msg = OnReceiveCustomEvent[0];
        if (isMultiBallMessage(msg)) {
            if (msg.OnLoadMultiBallPlatform) {
                appendPlatformTrans.push(msg.OnLoadMultiBallPlatform);
            }
            if (msg.OnPreMultiBallAppendStart) {
                multiSwitchActivated = false;
            }
            if (msg.OnPreMultiBallAppendEnd) {
                appendBall(msg.OnPreMultiBallAppendEnd);
            }
        }
    }
    if (OnPreSwitchBallStart || OnPreTransferBallStart) {
        if (!multiSwitchActivated) {
            levelManager.cancelEvent("OnPreSwitchBallStart");
            levelManager.cancelEvent("OnPreTransferBallStart");
        }
        else {
            switchActivated = false;
        }
    }
    if (OnPostSwitchBallEnd || OnPostTransferBallEnd) {
        switchActivated = true;
    }
    if (OnTimerActive) {
        initMultiBall(false);
    }
    if (OnPostCheckpointReached || OnPostDestinationReached) {
        initMultiBall(true);
    }
    if ((OnStartLevel || OnPlayerDeadEnd) && player.ballType) {
        initMultiBall(false);
        multiBallManager.updateAvatarUI();
        multiBallManager.updateKeyTipUI();
    }
    if (OnPhysicsUpdate) {
        if (!levelManager.timerEnabled)
            return;
        updateMultiBall();
    }
};
