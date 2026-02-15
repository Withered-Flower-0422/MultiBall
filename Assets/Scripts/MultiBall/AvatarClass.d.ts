import type { TexturePath } from "game:alias";
/**
 * Ball avatar UI for multi ball system.
 */
export declare class Avatar {
    private readonly ui;
    /**
     * Creates a new ball avatar UI.
     * @param avatarPath - Texture path of the avatar image.
     */
    constructor(avatarPath: TexturePath);
    /**
     * Sets the texture path of the avatar image.
     * @param avatarPath - Texture path of the avatar image.
     */
    setAvatarPath(avatarPath: TexturePath): void;
    /**
     * Updates the avatar UI.
     * @param enabled - Whether the avatar UI is enabled.
     * @param chosen - Whether the avatar is chosen.
     * @param durability - The durability of the ball.
     * @param offset - The offset of the avatar UI.
     */
    update(enabled: bool, chosen: bool, durability: float, offset: float): void;
    /**
     * Destroys the avatar UI.
     */
    destroy(): void;
}
export default Avatar;
