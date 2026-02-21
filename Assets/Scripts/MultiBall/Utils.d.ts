import type { Player } from "game:alias";
import type { MultiBall } from "Scripts/MultiBall/MultiBallClass.js";
export interface Status {
    durability: float;
    temperature: float;
    wetness: float;
    power: float;
    scale: float;
}
export declare const defaultStatus: {
    readonly durability: 100;
    readonly temperature: 20;
    readonly wetness: 0;
    readonly power: 100;
    readonly scale: 1;
};
export declare const isPlayer: (obj: MultiBall | Player) => obj is Player;
export declare const getStatusFromPlayer: () => Status;
export declare const createSingleton: <T extends new (...args: any[]) => InstanceType<T>>(cls: T, ...args: ConstructorParameters<T>) => InstanceType<T>;
