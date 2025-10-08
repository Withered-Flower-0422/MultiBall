import { scene, levelManager } from "gameApi";
export const init = (self, v) => {
    for (const k in v)
        globalThis[k] = v[k];
};
export const registerEvents = ["OnLoadLevel"];
export const onEvents = (self, events) => {
    if (events.OnLoadLevel) {
        levelManager.sendCustomEvent({
            OnLoadMultiBallPlatformPos: [self.getTransform(), scene.getItem(target).getTransform()[0]],
        });
    }
};
