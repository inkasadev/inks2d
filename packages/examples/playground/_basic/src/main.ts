import { Engine, Scene } from "inks2d";
import { Rectangle } from "inks2d/geom";

const g = new Engine(512, 512);

class Main extends Scene {
  constructor() {
    super();
  }

  override start(engine: Engine) {
    super.start(engine);

    const rect = new Rectangle(50, 50, "blue");
    rect.draggable = true;
    rect.position.x = g.stage.width / 2;
    rect.position.y = g.stage.height / 2;
    g.stage.addChild(rect);
  }
}

g.scene = new Main();
g.centerscreen = true;
g.start();
