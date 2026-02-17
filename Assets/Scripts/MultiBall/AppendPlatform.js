// @ts-nocheck
import multiBallManager from "Scripts/MultiBall/MultiBallManager.js";
export const init = (self, v) => multiBallManager.platformTrans.push(self.getTransform());
