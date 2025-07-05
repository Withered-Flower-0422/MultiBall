# MultiBall

MultiBall patch for Ballex².

[![](https://img.shields.io/badge/Steam-Ballex%C2%B2:%20The%20Hanging%20Gardens-235?style=flat)](https://store.steampowered.com/app/1383570/)
[![](<https://img.shields.io/badge/Steam-Ballex%C2%B2%20--%20Map%20Editor%20(BME%20Pro)-235?style=flat>)](https://store.steampowered.com/app/1809190/)

[![](https://img.shields.io/badge/QQ%20Group-797934847-09f?style=flat)](https://qm.qq.com/q/2mIPnK8JIk)
[![](https://img.shields.io/badge/Discord-5NygdBmksE-56e?style=flat)](https://discord.gg/5NygdBmksE/)

## Usage

1. Put the whole `Assets` folder in `%USERPROFILE%\AppData\LocalLow\Mushreb\BME Pro HDRP`.
2. Drag the `MultiBall` item into the scene.
3. If you want MultiBall tips, drag the `MultiBallTip` item into the scene. The tip will show up after first ball appending in the game.
4. Then you can use the MultiBall related items in BME Pro HDRP like official items.

## Config

### MultiBall

| Variable Name   | Type   | Description                                                                                                                                                                                                                                                                                                                                          |
| --------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `switchBallKey` | string | The key to switch the ball.                                                                                                                                                                                                                                                                                                                          |
| `cameraEase`    | bool   | How the camera moves when switching the ball. If set to `true`, the camera will follow the ball smoothly. If set to `false`, the camera will jump to the ball's position.                                                                                                                                                                            |
| `easeDistance`  | float  | This works only when `cameraEase` is set to `true`. Only when the distance between the start switching position and the target position is less than this value, the camera will follow the ball smoothly. Otherwise, the camera will jump to the target position. If the value is set to negative, the camera will always follow the ball smoothly. |

### MultiBallTip

| Variable Name | Type | Description                                                                                                                              |
| ------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `duration`    | int  | How long the tip will stay on the screen. The unit is frame. If set to negative, the tip will stay on the screen until the next section. |
