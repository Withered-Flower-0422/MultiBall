import { settings } from "gameApi";
import type { Events as BuiltinEvents } from "game:alias";
export type E = Omit<BuiltinEvents, "OnReceiveCustomEvent">;
type AssertEvents<T> = {
    [K in keyof T]: K extends `On${string}` ? T[K] extends object | undefined ? T[K] : never : never;
};
export default abstract class Manager<Events extends AssertEvents<Events> = {}, TipKey extends string = never> {
    protected readonly eventSymbol: symbol;
    protected canceledEvents: Set<keyof Events & `OnPre${string}`>;
    protected sendEvent<T extends keyof Events>(name: T, data: NonNullable<Events[T]>): void;
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
    protected abstract onEvents(e: E): void;
    /**
     * Updates the manager.
     * @param e - The event data.
     */
    update(e: E): void;
}
export {};
