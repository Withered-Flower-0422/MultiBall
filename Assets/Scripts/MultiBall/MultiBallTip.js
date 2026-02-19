// @ts-nocheck
import { levelManager } from "gameApi";
import multiBallManager from "Scripts/MultiBall/MultiBallManager.js";
let activated = true;
let sectionFinished = false;
export const init = (self, v) => Object.assign(globalThis, v);
export const registerEvents = [
    "OnStartLevel",
    "OnPlayerDeadEnd",
    "OnReceiveCustomEvent",
    "OnPostCheckpointReached",
    "OnPostDestinationReached",
];
export const onEvents = (self, { OnStartLevel, OnPlayerDeadEnd, OnReceiveCustomEvent, OnPostCheckpointReached, OnPostDestinationReached, }) => {
    if (OnReceiveCustomEvent) {
        const msg = OnReceiveCustomEvent[0];
        if (multiBallManager.isMultiBallMessage(msg)) {
            if (msg.OnPostMultiBallAppendEnd) {
                if (!activated)
                    return;
                activated = false;
                multiBallManager.showKeyTip();
                if (duration >= 0)
                    levelManager.invoke(multiBallManager.hideKeyTip, duration);
            }
        }
    }
    if (OnStartLevel || (OnPlayerDeadEnd && !sectionFinished)) {
        activated = true;
    }
    if (OnPostCheckpointReached || OnPostDestinationReached) {
        if (!activated)
            sectionFinished = true;
        if (duration < 0)
            multiBallManager.hideKeyTip();
    }
};
