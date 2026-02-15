import { uiCanvas, Float2, ColorRGBA } from "gameApi";
const COLOR_NODES = [
    [100, new ColorRGBA(1, 1, 1, 0.75)],
    [25, new ColorRGBA(1, 1, 1, 0.75)],
    [20, new ColorRGBA(1, 0xe6 / 255, 0x78 / 255, 0.75)],
    [15, new ColorRGBA(1, 0x82 / 255, 0x12 / 255, 0.75)],
    [5, new ColorRGBA(1, 0x4c / 255, 0x28 / 255, 0.75)],
    [0, new ColorRGBA(1, 0, 0, 0.75)],
];
const getColor = (durability) => {
    for (let i = 0; i < COLOR_NODES.length - 1; i++) {
        // `node2` is lower than `node1`
        const [node1, color1] = COLOR_NODES[i];
        const [node2, color2] = COLOR_NODES[i + 1];
        if (durability <= node1 && durability >= node2) {
            const t = (node1 - durability) / (node1 - node2);
            return new ColorRGBA(color1.r * (1 - t) + color2.r * t, color1.g * (1 - t) + color2.g * t, color1.b * (1 - t) + color2.b * t, color1.a * (1 - t) + color2.a * t);
        }
    }
    throw new Error("Invalid durability");
};
/**
 * Ball avatar UI for multi ball system.
 */
export class Avatar {
    ui;
    /**
     * Creates a new ball avatar UI.
     * @param avatarPath - Texture path of the avatar image.
     */
    constructor(avatarPath) {
        const panel = uiCanvas.createUI("Panel");
        panel.sizeDelta = new Float2(0, 0);
        panel.anchorMin = panel.anchorMax = new Float2(0.5, 0.95);
        const imgSub = uiCanvas.createUI("Image");
        imgSub.parent = panel;
        imgSub.sizeDelta = new Float2(50, 50);
        imgSub.mask = true;
        const img = uiCanvas.createUI("Image");
        img.parent = imgSub;
        img.texture = avatarPath;
        img.sizeDelta = new Float2(0, 0);
        img.anchorMin = new Float2(-0.1, -0.9);
        img.anchorMax = new Float2(1.9, 1.1);
        const bar = uiCanvas.createUI("Image");
        bar.parent = imgSub;
        bar.sizeDelta = new Float2(0, 0);
        bar.color = new ColorRGBA(1, 1, 1, 0.75);
        bar.anchorMin = new Float2(0, 0);
        bar.anchorMax = new Float2(1, 0.1);
        panel.enabled = false;
        this.ui = { panel, imgSub, img, bar };
    }
    /**
     * Sets the texture path of the avatar image.
     * @param avatarPath - Texture path of the avatar image.
     */
    setAvatarPath(avatarPath) {
        if (this.ui.img.texture === avatarPath)
            return;
        this.ui.img.texture = avatarPath;
    }
    /**
     * Updates the avatar UI.
     * @param enabled - Whether the avatar UI is enabled.
     * @param chosen - Whether the avatar is chosen.
     * @param durability - The durability of the ball.
     * @param offset - The offset of the avatar UI.
     */
    update(enabled, chosen, durability, offset) {
        if (!(this.ui.panel.enabled = enabled))
            return;
        const { panel, imgSub, bar } = this.ui;
        panel.position = new Float2(offset, 0);
        imgSub.color = chosen
            ? new ColorRGBA(1, 1, 1, 0.2)
            : new ColorRGBA(0, 0, 0, 0.5);
        bar.anchorMax = new Float2(durability / 100, 0.1);
        bar.color = getColor(durability);
    }
    /**
     * Destroys the avatar UI.
     */
    destroy() {
        uiCanvas.destroyUI(this.ui.panel);
    }
}
export default Avatar;
