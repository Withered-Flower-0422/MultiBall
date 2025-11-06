import { scene, levelManager } from "gameApi";
export const init = (self, v) => Object.assign(globalThis, v);
export const registerEvents = ["OnLoadLevel"];
export const onEvents = (self, events) => {
    if (events.OnLoadLevel) {
        levelManager.sendCustomEvent({
            _brand: "MultiBallMessage",
            OnLoadMultiBallPlatformPos: [self.getTransform(), scene.getItem(target).getTransform()[0]],
        });
    }
};
