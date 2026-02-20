// Install [BST](https://github.com/Withered-Flower-0422/BST) to get type hints.

declare module "multiBall:message" {
    import { Float3 } from "gameApi"
    import { BallType, KeyboardKey, MouseButton } from "game:alias"

    export type Key = KeyboardKey | MouseButton
    export type SwitchBallKeys = [Key, Key]

    export type Trans = [pos: Float3, rot: Float3, scl: Float3]
    export type AppendData = { ballType: BallType }
    export type SwitchData = { [key: PropertyKey]: never }

    export type MultiBallMessage = {
        _brand: symbol

        OnPreMultiBallAppendStart?: AppendData
        OnPreMultiBallAppendEnd?: AppendData
        OnPostMultiBallAppendEnd?: AppendData
        OnPreMultiBallSwitch?: SwitchData
        OnPostMultiBallSwitch?: SwitchData
    }
}
