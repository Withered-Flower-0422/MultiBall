// @ts-nocheck
function _defineProperty(e, r, t) {return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e;}function _toPropertyKey(t) {var i = _toPrimitive(t, "string");return "symbol" == typeof i ? i : i + "";}function _toPrimitive(t, r) {if ("object" != typeof t || !t) return t;var e = t[Symbol.toPrimitive];if (void 0 !== e) {var i = e.call(t, r || "default");if ("object" != typeof i) return i;throw new TypeError("@@toPrimitive must return a primitive value.");}return ("string" === r ? String : Number)(t);}import { levelManager, settings } from "gameApi";






















export default class Manager



{


  #eventSymbol = Symbol();

  canceledEvents = new Set(

  );

  sendEvent(
  name,
  data)
  {
    levelManager.sendCustomEvent(_defineProperty(_defineProperty({},
    this.#eventSymbol, true),
    name, data)
    );
  }






  isSelfEvent(e) {
    return e?.[this.#eventSymbol] === true;
  }





  cancelEvent(event) {
    this.canceledEvents.add(event);
  }













  showTip(tipKey, duration) {
    levelManager.hideTipDelay(
      levelManager.showTip(this.tipText[tipKey][settings.language]),
      duration
    );
  }












  #enabled = true;

  get enabled() {
    return this.#enabled;
  }

  set enabled(value) {
    if (this.#enabled === value) return;

    if (value) {
      this.enable();
    } else {
      this.disable();
      Object.values(this.keys).forEach(
        (key) => key.ui.ui.enabled = false
      );
    }

    this.#enabled = value;
  }















  update(e) {
    if (!this.#enabled) return;
    this.onEvents(e);
    if (e.OnStartLevel)
    Object.values(this.keys).forEach((key) =>
    key.updateConflictKey()
    );
    if (e.OnPhysicsUpdate)
    Object.values(this.keys).forEach((key) => key.update());
    this.canceledEvents.clear();
  }
}