// Install [BST](https://github.com/Withered-Flower-0422/BST) to get type hints.

declare module "multiBall:message" {
    import { Float3 } from "gameApi"
    import { BallType, NonNoneKey, MouseButton } from "game:alias"

    export type Key = NonNoneKey | MouseButton
    export type SwitchBallKeys = [Key, Key]

    export type Trans = [pos: Float3, rot: Float3, scl: Float3]
    export type PreAppendData = { ballType: BallType; position: Float3 }
    export type PlatformTransData = { platformTrans: Trans }
    export type SwitchData = { switchBallKeys: SwitchBallKeys }
    export type PostAppendData = {
        ballType: BallType
        platformTrans: Trans
        switchBallKeys: SwitchBallKeys
    }

    export type MultiBallMessage = {
        _brand: "MultiBallMessage"

        OnLoadMultiBallPlatform?: PlatformTransData
        OnPreMultiBallAppendStart?: PreAppendData
        OnPreMultiBallAppendEnd?: PreAppendData
        OnPostMultiBallAppendEnd?: PostAppendData
        OnMultiBallSwitch?: SwitchData
    }
}
