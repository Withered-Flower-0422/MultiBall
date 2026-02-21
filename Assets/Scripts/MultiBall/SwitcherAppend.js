// @ts-nocheck
import { player, levelManager } from "gameApi";
import multiBallManager from "Scripts/MultiBall/MultiBallManager.js";
let active = true;
export const init = (self, v) => Object.assign(globalThis, v);
export const onTrigger = (self, triggeredItem, type) => {
    if (!active ||
        !levelManager.timerEnabled ||
        triggeredItem.guid !== player.guid ||
        player.ballType === switchBallType)
        return;
    multiBallManager.startAppend(switchBallType, self.getTransform(), self.getComponent("AudioPlayer"));
};
export const registerEvents = [
    "OnReceiveCustomEvent",
];
export const onEvents = (self, { OnReceiveCustomEvent }) => {
    if (OnReceiveCustomEvent) {
        const e = OnReceiveCustomEvent[0];
        if (multiBallManager.isSelfEvent(e)) {
            if (e.OnPostMultiBallSwitch) {
                active = false;
                levelManager.invoke(() => (active = true), 10);
            }
        }
    }
};
