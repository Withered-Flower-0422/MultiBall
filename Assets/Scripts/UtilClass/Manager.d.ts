import { settings } from "gameApi";
import type { Events as BuiltinEvents, Item } from "game:alias";
import type CustomKey from "Scripts/UtilClass/CustomKeyClass.js";
type AssertEvents<T> = {
    [K in keyof T]: K extends `On${string}` ? T[K] extends object | undefined ? T[K] : never : never;
};
/** A type that gets the events of a manager. */
export type ManagerEvents<M extends Manager<any, any>> = M extends Manager<infer E, any> ? E : never;
export type OnCustomEvents<M extends Manager<any, any>> = (self: Item, events: ManagerEvents<M>) => void;
export type E = BuiltinEvents & {
    OnReceiveCustomEvent?: never;
};
export default abstract class Manager<Events extends AssertEvents<Events> = {}, TipKey extends string = never, CustomKeyName extends string = never> {
    #private;
    protected readonly canceledEvents: Set<keyof Events & `OnPre${string}`>;
    protected sendEvent<T extends keyof Events>(name: T, data: NonNullable<Events[T]>): void;
    protected sendEvents(events: Events): void;
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
    /** Custom keys of this manager. */
    get keys(): Record<CustomKeyName, CustomKey>;
    protected set keys(keys: Record<CustomKeyName, CustomKey>);
    protected abstract enable(): void;
    protected abstract disable(): void;
    get enabled(): bool;
    set enabled(value: bool);
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
