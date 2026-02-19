import type { Events } from "game:alias";
export default abstract class Manager<Message extends {
    _brand: symbol;
} = {
    _brand: symbol;
}> {
    protected readonly messageSymbol: symbol;
    isSelfMessage(msg: any): msg is Message;
    protected canceledEvents: Set<keyof Message & `OnPre${string}`>;
    cancelEvent(event: keyof Message & `OnPre${string}`): void;
    /**
     * Initializes the manager.
     * @param args - The arguments to initialize the manager.
     */
    abstract init(...args: any[]): void;
    /**
     * Updates the manager.
     * @param e - The event data.
     */
    abstract update(e: Events): void;
}
