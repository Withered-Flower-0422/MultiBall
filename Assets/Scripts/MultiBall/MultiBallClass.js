import { levelManager, scene, Float3 } from "gameApi";
import Avatar from "Scripts/MultiBall/AvatarClass.js";
export class MultiBall {
    ballType;
    status;
    instance;
    avatar;
    constructor(ballType, status, trans, velocity, templateNameSuffix = "") {
        this.ballType = ballType;
        this.status = status;
        this.instance = scene.createItem(`Multi${ballType}${templateNameSuffix}`, ...trans);
        this.instance.getComponent("PhysicsObject").setVelocity(...velocity);
        this.avatar = new Avatar(`Textures/Balls/${ballType}.tex`);
    }
    switch(ballType, trans = this.instance.getTransform(), velocity = [
        this.instance.getComponent("PhysicsObject").getLinearVelocity(),
        this.instance.getComponent("PhysicsObject").getAngularVelocity(),
    ], status = this.status, templateNameSuffix = "") {
        this.ballType = ballType;
        this.status = status;
        this.avatar.setAvatarPath(`Textures/Balls/${ballType}.tex`);
        scene.destroyItem(this.instance.guid);
        this.instance = scene.createItem(`Multi${ballType}${templateNameSuffix}`, ...trans);
        this.instance.getComponent("PhysicsObject").setVelocity(...velocity);
    }
    destroy(vfx) {
        this.avatar.destroy();
        if (vfx) {
            const [pos, rot, scl] = this.instance.getTransform();
            levelManager.spawnVfxPRS("DestroyObject", pos, rot, scl);
            const sfx = scene.createItem("DestroySfx", pos, new Float3(0, 0, 0), new Float3(1, 1, 1));
            sfx.getComponent("AudioPlayer").play();
            levelManager.invoke(() => scene.destroyItem(sfx.guid), 200);
        }
        scene.destroyItem(this.instance.guid);
    }
}
export default MultiBall;
