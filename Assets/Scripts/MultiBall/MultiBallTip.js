import { settings, levelManager } from "gameApi";
let tipGuid;
let activated = true;
let switchBallKey;
let sectionFinished = false;
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
                switchBallKey = msg.OnLoadMultiBall.switchBallKey.toUpperCase();
            }
            if ("OnPostMultiBallAppendEnd" in msg) {
                if (!activated)
                    return;
                activated = false;
                tipGuid = levelManager.showTip({
                    English: `When multiple balls appear in the status bar, you can use the ${switchBallKey} key to switch between them.`,
                    简体中文: `当状态栏有多个球出现时，你可以使用${switchBallKey}键进行切换。`,
                    日本語: `ステ一タスバ一に複数のボ一ルが表示された場合、${switchBallKey}キ一で切り替えることができます。`,
                    Spanish: `Cuando aparece más de una bola en la barra de estado, puedes utilizar la tecla ${switchBallKey} para cambiar de una a otra.`,
                    繁體中文: `當狀態列有多個球出現時，你可以使用${switchBallKey}鍵進行切換。`,
                }[settings.language]);
                if (globalThis["duration"] >= 0)
                    levelManager.hideTipDelay(tipGuid, globalThis["duration"]);
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
        if (globalThis["duration"] < 0 && tipGuid)
            levelManager.hideTip(tipGuid);
    }
};
