# MultiBall

MultiBall patch for Ballex².

[![](https://img.shields.io/badge/Steam-Ballex%C2%B2:%20The%20Hanging%20Gardens-235?style=flat)](https://store.steampowered.com/app/1383570/)
[![](<https://img.shields.io/badge/Steam-Ballex%C2%B2%20--%20Map%20Editor%20(BME%20Pro)-235?style=flat>)](https://store.steampowered.com/app/1809190/)

[![](https://img.shields.io/badge/QQ%20Group-797934847-09f?style=flat)](https://qm.qq.com/q/2mIPnK8JIk)
[![](https://img.shields.io/badge/Discord-5NygdBmksE-56e?style=flat)](https://discord.gg/5NygdBmksE/)

[![](https://img.shields.io/github/license/Withered-Flower-0422/MultiBall)](https://github.com/Withered-Flower-0422/MultiBall/blob/main/LICENSE)

## Usage

1. Put the whole `Assets` folder in `%USERPROFILE%\AppData\LocalLow\Mushreb\BME Pro HDRP`.
2. Click `Scripts → Enable MultiBall` in the menu bar to enable the Laser system for the current scene.
3. If you want MultiBall tips, drag the `MultiBallTip` item into the scene. The tip will show up after first ball appending in the game.
4. Then you can use the MultiBall related items in BME Pro HDRP like official items.

> [!TIP]
> If there is no `Scripts → Enable MultiBall` in the menu bar, please restart BME.

## Custom Ball Support

<details>

<summary>Not supported yet</summary>

> [!WARNING]
> MultiBall is currently incompatible with custom ball.

1. Make an custom ball avatar and [import it into BME Pro HDRP](https://withered-flower-0422.github.io/BMT/en/advanced/assets#import-texture).
2. Add the custom ball avatar texture to `Scene Settings → Asset Reference → Textures`.
3. Create a custom ball [following the guide](https://withered-flower-0422.github.io/BMT/en/advanced/sceneSettings/customBall).
4. Make two copies of the custom ball template. (See how it does in `Hierarchy → MultiBall → Balls`)
    - First copy: Rename its template name as `Multi + {Ball Name}`.
    - Second copy: Modify its `Renderer` as a Mush-skin version, then rename its template name as `Multi + {Ball Name} + Mush`.

</details>

## Config

### MultiBall

| Variable Name    | Type       | Description                                                                                                                                                                                                                                                                                                                                          |
| ---------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `switchBallKeys` | `string[]` | The keys to switch the ball. There are two strings in the array. The first is the key to switch the ball when in _Four Direction View Mode_, and the second is the key to switch the ball when in _Free View Mode_ or _First Person View Mode_.                                                                                                      |
| `cameraEase`     | `bool`     | How the camera moves when switching the ball. If set to `true`, the camera will follow the ball smoothly. If set to `false`, the camera will jump to the ball's position.                                                                                                                                                                            |
| `easeDistance`   | `float`    | This works only when `cameraEase` is set to `true`. Only when the distance between the start switching position and the target position is less than this value, the camera will follow the ball smoothly. Otherwise, the camera will jump to the target position. If the value is set to negative, the camera will always follow the ball smoothly. |

### MultiBallTip

| Variable Name | Type  | Description                                                                                                                              |
| ------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `duration`    | `int` | How long the tip will stay on the screen. The unit is frame. If set to negative, the tip will stay on the screen until the next section. |

## Apis

Get [apis](Assets/Scripts/MultiBall/message.d.ts) by:

```js
import multiBallManager from "Scripts/MultiBall/MultiBallManager.js"
```

> [!TIP]
> Install [BST](https://github.com/Withered-Flower-0422/BST) to get type hints.
