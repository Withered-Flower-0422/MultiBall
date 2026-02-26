// @ts-nocheck
import { levelManager, scene, Float3 } from "gameApi";
import Avatar from "Scripts/MultiBall/AvatarClass.js";
import { defaultStatus } from "Scripts/MultiBall/Utils.js";


export class MultiBall {




























  constructor(
  ballType,
  templateName,
  trans,
  velocity)

  {let status = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : defaultStatus;
    this.ballType = ballType;
    this.status = status;
    this.instance = scene.createItem(templateName, ...trans);
    this.instance.getComponent("PhysicsObject").setVelocity(...velocity);
    this.avatar = new Avatar(`Textures/Balls/${ballType}.tex`);
  }








  switch(
  ballType,
  templateName)





  {let trans = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.instance.getTransform();let velocity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [this.instance.getComponent("PhysicsObject").getLinearVelocity(), this.instance.getComponent("PhysicsObject").getAngularVelocity()];
    this.ballType = ballType;
    this.avatar.setAvatarPath(`Textures/Balls/${ballType}.tex`);

    scene.destroyItem(this.instance.guid);

    this.instance = scene.createItem(templateName, ...trans);
    this.instance.getComponent("PhysicsObject").setVelocity(...velocity);
  }





  destroy(vfx) {
    this.avatar.destroy();

    if (vfx) {
      const [pos, rot, scl] = this.instance.getTransform();
      levelManager.spawnVfxPRS("DestroyObject", pos, rot, scl);
      const sfx = scene.createItem(
        "DestroySfx",
        pos,
        new Float3(0, 0, 0),
        new Float3(1, 1, 1)
      );
      sfx.getComponent("AudioPlayer").play();
      levelManager.invoke(() => scene.destroyItem(sfx.guid), 200);
    }

    scene.destroyItem(this.instance.guid);
  }
}

export default MultiBall;