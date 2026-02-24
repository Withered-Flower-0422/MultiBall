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
    _enabled = true;
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        if (this._enabled === value)
            return;
        if (value) {
            this.enable();
        }
        else {
            this.disable();
            Object.values(this.keys).forEach(key => (key.ui.ui.enabled = false));
        }
        this._enabled = value;
    }
    update(e) {
        if (!this._enabled)
            return;
        this.onEvents(e);
        if (e.OnStartLevel)
            Object.values(this.keys).forEach(key => key.updateConflictKey());
        if (e.OnPhysicsUpdate)
            Object.values(this.keys).forEach(key => key.update());
        this.canceledEvents.clear();
    }
}
