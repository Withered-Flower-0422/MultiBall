// @ts-nocheck
import { scene } from "gameApi";
import multiBallManager from "Scripts/MultiBall/MultiBallManager.js";
export const init = (self, v) => Object.assign(globalThis, v);
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
export const onEvents = (self, e) => {
    if (e.OnLoadLevel)
        multiBallManager.init(switchBallKeys, cameraEase, easeDistance, self.getComponent("AudioPlayer"), scene.getItem(switchSfx).getComponent("AudioPlayer"));
    multiBallManager.update(e);
};
