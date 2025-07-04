import { scene, levelManager } from "gameApi";
export const init = (self, vars) => {
    for (const k in vars) {
        globalThis[k] = vars[k];
    }
};
export const registerEvents = ["OnLoadLevel"];
export const onEvents = (self, events) => {
    if ("OnLoadLevel" in events) {
        levelManager.sendCustomEvent({
            OnLoadMultiBallPlatformPos: [self.getTransform(), scene.getItem(target).getTransform()[0]],
        });
    }
};
