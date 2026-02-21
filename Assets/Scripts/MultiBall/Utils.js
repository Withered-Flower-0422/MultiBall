// @ts-nocheck
import { player, variables } from "gameApi";
export const defaultStatus = {
    durability: 100,
    temperature: 20,
    wetness: 0,
    power: 100,
    scale: 1,
};
export const isPlayer = (obj) => "guid" in obj;
export const getStatusFromPlayer = () => ({
    durability: player.durability,
    temperature: player.temperature,
    wetness: player.wetness,
    power: player.power,
    scale: player.scale,
});
export const createSingleton = (cls, ...args) => {
    let instance = variables.get(cls.name);
    if (!instance)
        variables.set(cls.name, (instance = new cls(...args)));
    return instance;
};
