// @ts-nocheck
export default class Manager {
    messageSymbol = Symbol();
    isSelfMessage(msg) {
        return msg?._brand === this.messageSymbol;
    }
    canceledEvents = new Set();
    cancelEvent(event) {
        this.canceledEvents.add(event);
    }
}
