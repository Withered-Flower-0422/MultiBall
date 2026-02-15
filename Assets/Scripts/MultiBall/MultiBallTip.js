import { settings, levelManager } from "gameApi";
import { isMultiBallMessage, isMouseKey } from "Scripts/MultiBall/Utils.js";
let tipGuid;
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
        if (isMultiBallMessage(msg)) {
            if (msg.OnPostMultiBallAppendEnd) {
                if (!activated)
                    return;
                activated = false;
                const switchBallKey = msg.OnPostMultiBallAppendEnd.switchBallKeys[levelManager.cameraMode === 0 ? 0 : 1];
                const prefix = isMouseKey(switchBallKey) ? "MOUSE " : "";
                const key = prefix + switchBallKey.toUpperCase();
                tipGuid = levelManager.showTip({
                    English: `When multiple balls appear in the status bar, you can use the ${key} key to switch between them.`,
                    简体中文: `当状态栏有多个球出现时，你可以使用${key}键进行切换。`,
                    日本語: `ステ一タスバ一に複数のボ一ルが表示された場合、${key}キ一で切り替えることができます。`,
                    Spanish: `Cuando aparece más de una bola en la barra de estado, puedes utilizar la tecla ${key} para cambiar de una a otra.`,
                    繁體中文: `當狀態列有多個球出現時，你可以使用${key}鍵進行切換。`,
                }[settings.language]);
                if (duration >= 0)
                    levelManager.hideTipDelay(tipGuid, duration);
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
        if (duration < 0 && tipGuid)
            levelManager.hideTip(tipGuid);
    }
};
