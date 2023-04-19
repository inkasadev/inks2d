import { Engine, Scene } from "inks2d";
import { Spritemap } from "inks2d/graphics";

const g = new Engine(512, 512);

class Main extends Scene {
  constructor() {
    super();
  }

  async start(engine: Engine) {
    super.start(engine);

    const warriorLeft = new Spritemap(
      g.loader.store["assets/warrior_1.png"],
      32,
      32
    );
    warriorLeft.addAnimation("left", [3, 4, 5], 200, true);
    warriorLeft.addAnimation("right", "3-5", 200, true);
    warriorLeft.position.x = g.stage.width / 2 - 64;
    warriorLeft.position.y = g.stage.height / 2;
    warriorLeft.scale.x = 2;
    warriorLeft.scale.y = 2;
    warriorLeft.frame = 3;
    warriorLeft.play("left");
    g.stage.addChild(warriorLeft);

    const warriorDown = new Spritemap(
      g.loader.store["assets/warrior_1.png"],
      32,
      32
    );
    warriorDown.addAnimation("left", [3, 4, 5], 200, true);
    warriorDown.addAnimation("right", "3-5", 200, true);
    warriorDown.position.x = g.stage.width / 2;
    warriorDown.position.y = g.stage.height / 2 + 64;
    warriorDown.scale.x = 2;
    warriorDown.scale.y = 2;
    warriorDown.frame = 1;
    g.stage.addChild(warriorDown);

    const warriorRight = new Spritemap(
      g.loader.store["assets/warrior_1.png"],
      32,
      32
    );
    warriorRight.addAnimation("left", [3, 4, 5], 200, true);
    warriorRight.addAnimation("right", "6-8", 200, true);
    warriorRight.position.x = g.stage.width / 2 + 64;
    warriorRight.position.y = g.stage.height / 2;
    warriorRight.scale.x = 2;
    warriorRight.scale.y = 2;
    warriorRight.frame = 6;
    warriorRight.play("right");
    g.stage.addChild(warriorRight);
  }
}

g.loader.onComplete = () => {
  g.scene = new Main();
  g.centerscreen = true;
  g.start();
};

g.loader.load(["assets/warrior_1.png"]);
