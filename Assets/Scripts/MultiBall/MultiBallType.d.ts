import { Float3 } from "gameApi"
import { BallType, KeyboardKey, MouseButton } from "game:alias"

export interface Status {
    durability: float
    temperature: float
    wetness: float
    power: float
    scale: float
}

export type Key = KeyboardKey | MouseButton
export type SwitchBallKeys = [Key, Key]

export type Trans = [pos: Float3, rot: Float3, scl: Float3]
export type AppendData = { ballType: BallType }
export type SwitchData = { index: int }
