// @ts-nocheck
import { player, math, levelManager, Float3 } from "gameApi";
import mathEx from "Scripts/Utility/mathEx.js";
import { isMultiBallMessage } from "Scripts/MultiBall/Utils.js";
let selfPos;
let selfRot;
let targetPos;
let audioPlayer;
const properties = {};
let active = true;
let isSwitching = false;
export const init = (self, v) => {
    Object.assign(globalThis, v);
    [selfPos, selfRot] = self.getTransform();
    targetPos = mathEx.addFloat3(selfPos, mathEx.transFloat3WithQuat(new Float3(0, 1, 0), math.float3ToQuaternion(selfRot)));
    audioPlayer = self.getComponent("AudioPlayer");
};
export const onTrigger = (self, triggeredItem, type) => {
    if (!active ||
        !levelManager.timerEnabled ||
        triggeredItem.guid !== player.guid ||
        player.ballType === switchBallType)
        return;
    if (type === "Enter") {
        isSwitching = true;
        audioPlayer.play();
        const { durability, temperature, wetness, power, scale } = player;
        Object.assign(properties, {
            durability,
            temperature,
            wetness,
            power,
            scale,
        });
        levelManager.spawnVfxPRS("TransportStart", selfPos, selfRot, new Float3(1, 1, 1));
        const data = {
            ballType: switchBallType,
            position: selfPos,
        };
        levelManager.sendCustomEvent({
            _brand: "MultiBallMessage",
            OnPreMultiBallAppendStart: data,
        });
        levelManager.invoke(() => {
            isSwitching = false;
            levelManager.sendCustomEvent({
                _brand: "MultiBallMessage",
                OnPreMultiBallAppendEnd: data,
            });
        }, 125);
    }
    else {
        if (!isSwitching)
            return;
        Object.assign(player, properties);
        player.physicsObject.setVelocity(mathEx.scaleFloat3(mathEx.subFloat3(targetPos, player.position), 5), mathEx.getAngularVelocityToUnit(player.rotationQuaternion));
    }
};
export const registerEvents = [
    "OnReceiveCustomEvent",
];
export const onEvents = (self, { OnReceiveCustomEvent }) => {
    if (OnReceiveCustomEvent) {
        const msg = OnReceiveCustomEvent[0];
        if (isMultiBallMessage(msg)) {
            if (msg.OnMultiBallSwitch) {
                active = false;
                levelManager.invoke(() => (active = true), 10);
            }
        }
    }
};
