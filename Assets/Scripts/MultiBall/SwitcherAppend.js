import { scene, levelManager, Float3 } from "gameApi";
const subFloat3 = (a, b) => new Float3(a.x - b.x, a.y - b.y, a.z - b.z);
const scaleFloat3 = (a, b) => new Float3(a.x * b, a.y * b, a.z * b);
const getAngularVelocityToUnit = ({ x, y, z, w }, kp = 8) => {
    const sinHalfAngle = Math.sqrt(1 - w * w);
    if (sinHalfAngle < 1e-9)
        return new Float3(0, 0, 0);
    if (w < 0) {
        w = -w;
    }
    else {
        x = -x;
        y = -y;
        z = -z;
    }
    const ratio = (kp * Math.acos(w)) / sinHalfAngle;
    return new Float3(ratio * x, ratio * y, ratio * z);
};
let player;
let selfPos;
let selfRot;
let targetPos;
let audioPlayer;
const properties = {};
let active = true;
let isSwitching = false;
export const init = (self, v) => {
    for (const k in v) {
        globalThis[k] = v[k];
    }
};
export const onTrigger = (self, triggeredItem, type) => {
    if (!active ||
        !levelManager.timerEnabled ||
        triggeredItem.guid !== player?.guid ||
        player.ballType === switchBallType) {
        return;
    }
    if (type === "Enter") {
        isSwitching = true;
        audioPlayer.play();
        const { durability, temperature, wetness, power, scale } = player;
        Object.assign(properties, { durability, temperature, wetness, power, scale });
        levelManager.spawnVfxPRS("TransportStart", selfPos, selfRot, new Float3(1, 1, 1));
        const data = {
            ballType: switchBallType,
            position: selfPos,
        };
        levelManager.sendCustomEvent({ OnPreMultiBallAppendStart: data });
        levelManager.invoke(() => {
            isSwitching = false;
            levelManager.sendCustomEvent({ OnPreMultiBallAppendEnd: data });
        }, 125);
    }
    else {
        if (!isSwitching)
            return;
        Object.assign(player, properties);
        player.physicsObject.setVelocity(scaleFloat3(subFloat3(targetPos, player.position), 5), getAngularVelocityToUnit(player.rotationQuaternion));
    }
};
export const registerEvents = ["OnLoadLevel", "OnTimerActive", "OnReceiveCustomEvent"];
export const onEvents = (self, events) => {
    if ("OnLoadLevel" in events) {
        ;
        [selfPos, selfRot] = self.getTransform();
        targetPos = scene.getItem(target).getTransform()[0];
        audioPlayer = self.getComponent("AudioPlayer");
    }
    if ("OnTimerActive" in events) {
        player ??= scene.getPlayer();
    }
    if ("OnReceiveCustomEvent" in events) {
        const msg = events.OnReceiveCustomEvent[0];
        if (typeof msg === "object") {
            if ("OnMultiBallSwitch" in msg) {
                active = false;
                levelManager.invoke(() => (active = true), 10);
            }
        }
    }
};
