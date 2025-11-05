// Install [BST](https://github.com/Withered-Flower-0422/BST) to get type hints.

declare module "multiBall:message" {
    import { Float3 } from "gameApi"
    import { BuiltinBallType, NonNoneKey, MouseButton } from "game:alias"
    import { MultiBallManager } from "multiBallApi"

    type Key = NonNoneKey | MouseButton

    type LoadData = { switchBallKeys: [Key, Key]; multiBallManager: MultiBallManager }
    type SwitchData = { ballType: BuiltinBallType; position: Float3 }
    type EmptyData = { [key: PropertyKey]: never }
    type PlatformPosData = [selfTrans: [pos: Float3, rot: Float3, scl: Float3], targetPos: Float3]

    type MultiBallMessage = {
        _brand: "MultiBallMessage"

        OnLoadMultiBall?: LoadData
        OnLoadMultiBallPlatformPos?: PlatformPosData
        OnPreMultiBallAppendStart?: SwitchData
        OnPostMultiBallAppendEnd?: SwitchData
        OnPreMultiBallAppendEnd?: SwitchData
        OnMultiBallSwitch?: EmptyData
    }
}
