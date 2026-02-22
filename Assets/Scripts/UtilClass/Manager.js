// @ts-nocheck
import { levelManager, settings } from "gameApi";
export default class Manager {
    eventSymbol = Symbol();
    canceledEvents = new Set();
    sendEvent(name, data) {
        const event = {};
        event[this.eventSymbol] = true;
        event[name] = data;
        levelManager.sendCustomEvent(event);
    }
    isSelfEvent(e) {
        return e?.[this.eventSymbol] === true;
    }
    cancelEvent(event) {
        this.canceledEvents.add(event);
    }
    showTip(tipKey, duration) {
        levelManager.hideTipDelay(levelManager.showTip(this.tipText[tipKey][settings.language]), duration);
    }
    update(e) {
        this.onEvents(e);
        this.canceledEvents.clear();
    }
}
