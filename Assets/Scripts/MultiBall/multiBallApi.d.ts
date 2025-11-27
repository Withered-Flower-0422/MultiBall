// Install [BST](https://github.com/Withered-Flower-0422/BST) to get type hints.

declare module "multiBallApi" {
    import { Key } from "multiBall:message"
    import { Item, Player, BuiltinBallType } from "game:type"

    interface MultiBallManager {
        readonly switchBallKeys: readonly [Key, Key]

        /**
         * Removes the specified ball types from the multi-ball system.
         * @param ballTypes - The ball types to be removed from the multi-ball system.
         * @returns
         */
        readonly removeMultiBalls: (...ballTypes: BuiltinBallType[]) => void

        /**
         * Removes all multi-balls from the multi-ball system.
         * @param vfx - Whether to show the vfx when removing balls.
         * @returns
         */
        readonly removeAllMultiBalls: (vfx: bool) => void

        /**
         * Gets the data of the specified ball type.
         * @param ballType - The ball type to get the data of.
         * @returns The data of the specified ball type, or `null` if the ball type does not exist in the multi-ball system.
         */
        readonly getMultiBallData: (ballType: BuiltinBallType) => {
            index: int
            durability: float
            temperature: float
            wetness: float
            power: float
            scale: float
            instance: Item | Player
        } | null

        /**
         * Checks if the specified item is a multi-ball.
         * @param item - The item to check if it is a multi-ball.
         * @returns `true` if the item is a multi-ball, `false` otherwise.
         */
        readonly isMultiBall: (item: Item) => bool
    }
}
