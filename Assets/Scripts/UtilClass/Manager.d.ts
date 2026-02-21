import { settings } from "gameApi";
import type { Events as E } from "game:alias";
export default abstract class Manager<Events extends {
    readonly _brand: symbol;
} = {
    readonly _brand: symbol;
}, TipKey extends string = never> {
    protected readonly eventSymbol: symbol;
    protected canceledEvents: Set<keyof Events & `OnPre${string}`>;
    protected sendEvent<T extends Exclude<keyof Events, "_brand">>(name: T, data: Events[T]): void;
    /**
     * Checks whether the given object is an event of this manager.
     * @param e - The object to check.
     * @returns Whether the object is an event of this manager.
     */
    isSelfEvent(e: any): e is Events;
    /**
     * Cancels the given event.
     * @param event - The event to cancel.
     */
    cancelEvent(event: keyof Events & `OnPre${string}`): void;
    protected abstract get tipText(): Record<TipKey, Record<typeof settings.language, string>>;
    /**
     * Shows the tip with the given key for the given duration.
     * @param tipKey - The key of the tip to show.
     * @param duration - The duration of the tip in frames.
     */
    showTip(tipKey: TipKey, duration: int): void;
    /**
     * Initializes the manager.
     * @param args - The arguments to initialize the manager.
     */
    abstract init(...args: any[]): void;
    /**
     * Updates the manager.
     * @param e - The event data.
     */
    abstract update(e: E): void;
}
