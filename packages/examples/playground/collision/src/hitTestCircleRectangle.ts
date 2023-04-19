import { Engine, Scene } from "inks2d";
import { hitTestCircleRectangle } from "inks2d/collision";
import { Circle, Rectangle } from "inks2d/geom";
import { Point } from "inks2d/math";

const g = new Engine(512, 512);

let _r1: Rectangle, _c1: Circle;

class Main extends Scene {
  constructor() {
    super();
  }

  async start(engine: Engine) {
    super.start(engine);

    _r1 = new Rectangle(50, 50, "gray");
    _r1.position.x = g.stage.width / 2;
    _r1.position.y = g.stage.height / 2;
    _r1.pivot.x = _r1.pivot.y = 0.5;
    _r1.alpha = 0.7;
    g.stage.addChild(_r1);

    _c1 = new Circle(50, 50);
    _c1.pivot.x = _c1.pivot.y = 0.5;
    g.stage.addChild(_c1);
  }

  update() {
    _c1.position = new Point(g.pointer.x, g.pointer.y);

    if (hitTestCircleRectangle(_c1, _r1, false, true, true).hasContact)
      _c1.fillStyle = "red";
    else _c1.fillStyle = "gray";
  }
}

g.scene = new Main();
g.centerscreen = true;
g.start();
