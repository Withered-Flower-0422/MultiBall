// @ts-nocheck
import { levelManager, settings } from "gameApi";
import multiBallManager from "Scripts/MultiBall/MultiBallManager.js";
let tipGuid = null;
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
const showTip = () => {
    if (tipGuid)
        return;
    tipGuid = levelManager.showTip(multiBallManager.tipText.switch[settings.language]);
};
const hideTip = () => {
    if (!tipGuid)
        return;
    levelManager.hideTip(tipGuid);
    tipGuid = null;
};
export const onEvents = (self, { OnStartLevel, OnPlayerDeadEnd, OnReceiveCustomEvent, OnPostCheckpointReached, OnPostDestinationReached, }) => {
    if (OnReceiveCustomEvent) {
        const e = OnReceiveCustomEvent[0];
        if (multiBallManager.isSelfEvent(e)) {
            if (e.OnPostMultiBallAppendEnd) {
                if (!activated)
                    return;
                activated = false;
                showTip();
                if (duration >= 0)
                    levelManager.invoke(hideTip, duration);
            }
        }
    }
    if (OnStartLevel || (OnPlayerDeadEnd && !sectionFinished)) {
        tipGuid = null;
        activated = true;
    }
    if (OnPostCheckpointReached || OnPostDestinationReached) {
        if (!activated)
            sectionFinished = true;
        if (duration < 0)
            hideTip();
    }
};
