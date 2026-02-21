// @ts-nocheck
import { levelManager, settings } from "gameApi";
export default class Manager {
    eventSymbol = Symbol();
    canceledEvents = new Set();
    sendEvent(name, data) {
        const event = { _brand: this.eventSymbol };
        event[name] = data;
        levelManager.sendCustomEvent(event);
    }
    isSelfEvent(e) {
        return e?._brand === this.eventSymbol;
    }
    cancelEvent(event) {
        this.canceledEvents.add(event);
    }
    showTip(tipKey, duration) {
        levelManager.hideTipDelay(levelManager.showTip(this.tipText[tipKey][settings.language]), duration);
    }
}
