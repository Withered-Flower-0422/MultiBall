import { levelManager } from "gameApi";
export const registerEvents = ["OnLoadLevel"];
export const onEvents = (self, { OnLoadLevel }) => {
    if (OnLoadLevel) {
        levelManager.sendCustomEvent({
            _brand: "MultiBallMessage",
            OnLoadMultiBallPlatform: self.getTransform(),
        });
    }
};
