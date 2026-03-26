// @ts-nocheck
import { levelManager, settings } from "gameApi";















export default class Manager





{


  #eventSymbol = Symbol();

  canceledEvents = new Set(

  );

  sendEvent(
  name,
  data)
  {var _levelManager$sendCus;
    levelManager.sendCustomEvent((_levelManager$sendCus = {}, _levelManager$sendCus[
    this.#eventSymbol] = true, _levelManager$sendCus[
    name] = data, _levelManager$sendCus)
    );
  }

  sendEvents(events) {var _Object$assign;
    levelManager.sendCustomEvent(Object.assign((_Object$assign = {}, _Object$assign[
    this.#eventSymbol] = true, _Object$assign),
    events)
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



  #keys = null;


  get keys() {
    if (!this.#keys)
    throw new ReferenceError("Custom keys are not initialized.");

    return this.#keys;
  }

  set keys(value) {
    this.#keys = value;
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

    const keys = Object.values(this.keys);
    if (e.OnStartLevel) keys.forEach((key) => key.updateConflictKey());
    if (e.OnPhysicsUpdate) keys.forEach((key) => key.update());

    this.canceledEvents.clear();
  }
}