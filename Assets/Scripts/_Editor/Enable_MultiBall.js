import { editor, file, scene, dialogWindowManager, Float3 } from "editorApi";
const builtinBalls = [
    "WoodenBall",
    "StoneBall",
    "PaperBall",
    "IceBall",
    "SteelBall",
    "RubberBall",
    "BalloonBall",
    "StickyBall",
    "SpongeBall",
];
const addBallAvatarTexAssets = () => {
    const paths = builtinBalls.map(ball => `Textures/Balls/${ball}.tex`);
    const assetReference = scene
        .getAllObjects()
        .find(obj => obj.type === "Settings")
        .getComponent("AssetReference");
    const data = JSON.parse(assetReference.getData());
    for (const path of paths) {
        if (!file.exist(`${file.dataDirectoryPath}/Assets/${path}`))
            return false;
        if (data.Textures.includes(path))
            continue;
        data.Textures.push(path);
    }
    data.Textures = [...new Set(data.Textures)];
    assetReference.setData(JSON.stringify(data));
    return true;
};
const addMultiBallItemToScene = () => {
    for (const obj of scene.getAllObjects()) {
        if (obj.type === "Item") {
            const executor = obj.getComponent("Executor");
            if (executor) {
                const data = JSON.parse(executor.getData());
                if (data.ScriptPath === "Scripts/MultiBall/MultiBall.js") {
                    return true;
                }
            }
        }
    }
    const multiBallItemPath = "Items/MultiBall/MultiBall.item";
    if (!file.exist(`${file.dataDirectoryPath}/Assets/${multiBallItemPath}`))
        return false;
    scene
        .createObjectsFromAssets(multiBallItemPath)
        .setPosition(new Float3(0, 0, 0));
    return true;
};
export const menuPath = editor.language === "Chinese" ? "启用多球" : "Enable MultiBall";
export const execute = () => {
    if (!addBallAvatarTexAssets()) {
        dialogWindowManager.openMessageDialog(menuPath, editor.language === "Chinese"
            ? '球种头像材质文件不完整，请检查 "Assets/Textures/Balls/" 文件夹。'
            : 'Some ball avatar texture files are missing. Please check "Assets/Textures/Balls/" folder.', editor.language === "Chinese" ? "确认" : "Ok", () => { });
        return;
    }
    if (!addMultiBallItemToScene()) {
        dialogWindowManager.openMessageDialog(menuPath, editor.language === "Chinese"
            ? '"MultiBall.item" 文件不存在，请将其添加到 "Assets/Items/MultiBall/" 文件夹中。'
            : '"MultiBall.item" file is missing. Please add it to "Assets/Items/MultiBall/" folder.', editor.language === "Chinese" ? "确认" : "Ok", () => { });
        return;
    }
    dialogWindowManager.openMessageDialog(menuPath, editor.language === "Chinese"
        ? "多球已启用。"
        : "MultiBall has been enabled.", editor.language === "Chinese" ? "确认" : "Ok", () => { });
};
