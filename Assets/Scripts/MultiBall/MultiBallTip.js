import { settings, levelManager } from "gameApi";
let tipGuid;
let activated = true;
let switchBallKeys;
let sectionFinished = false;
const mouseButtons = new Set(["Left", "Middle", "Right"]);
export const init = (self, v) => {
    for (const k in v) {
        globalThis[k] = v[k];
    }
};
export const registerEvents = [
    "OnStartLevel",
    "OnPlayerDeadEnd",
    "OnReceiveCustomEvent",
    "OnPostCheckpointReached",
    "OnPostDestinationReached",
];
export const onEvents = (self, events) => {
    if ("OnReceiveCustomEvent" in events) {
        const msg = events.OnReceiveCustomEvent[0];
        if (typeof msg === "object") {
            if ("OnLoadMultiBall" in msg) {
                switchBallKeys = msg.OnLoadMultiBall.switchBallKeys;
            }
            if ("OnPostMultiBallAppendEnd" in msg) {
                if (!activated)
                    return;
                activated = false;
                const switchBallKey = switchBallKeys[levelManager.cameraMode === 0 ? 0 : 1];
                const prefix = mouseButtons.has(switchBallKey) ? "MOUSE " : "";
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
    if ("OnStartLevel" in events || ("OnPlayerDeadEnd" in events && !sectionFinished)) {
        tipGuid = null;
        activated = true;
    }
    if ("OnPostCheckpointReached" in events || "OnPostDestinationReached" in events) {
        if (!activated)
            sectionFinished = true;
        if (duration < 0 && tipGuid)
            levelManager.hideTip(tipGuid);
    }
};
