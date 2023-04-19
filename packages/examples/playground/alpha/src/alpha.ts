import { Engine, Scene } from "inks2d";
import { Rectangle } from "inks2d/geom";

const g = new Engine(512, 512);

class Main extends Scene {
  constructor() {
    super();
  }

  async start(engine: Engine) {
    super.start(engine);

    const rect1 = new Rectangle(50, 50, "blue");
    rect1.position.x = g.stage.width / 2;
    rect1.position.y = g.stage.height / 2;
    g.stage.addChild(rect1);

    const rect2 = new Rectangle(50, 50, "green");
    rect2.position.x = g.stage.width / 2 + 25;
    rect2.position.y = g.stage.height / 2 + 25;
    rect2.alpha = 0.5;
    g.stage.addChild(rect2);

    const rect3 = new Rectangle(50, 50, "red");
    rect3.position.x = g.stage.width / 2 - 25;
    rect3.position.y = g.stage.height / 2 - 25;
    rect3.alpha = 0.5;
    g.stage.addChild(rect3);
  }
}

g.scene = new Main();
g.centerscreen = true;
g.start();
