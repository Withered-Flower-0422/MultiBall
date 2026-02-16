// @ts-nocheck
import { scene } from "gameApi";
import multiBallManager from "Scripts/MultiBall/MultiBallManager.js";
export const init = (self, v) => {
    Object.assign(globalThis, v);
    multiBallManager.init(switchBallKeys, cameraEase, easeDistance, self.getComponent("AudioPlayer"), scene.getItem(switchSfx).getComponent("AudioPlayer"));
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
export const onEvents = (self, e) => multiBallManager.update(e);
