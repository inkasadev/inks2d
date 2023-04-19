import { Engine, Scene } from "inks2d";
import { hitTestCircle } from "inks2d/collision";
import { Circle } from "inks2d/geom";
import { Point } from "inks2d/math";
import { contain } from "inks2d/utils";

const g = new Engine(512, 512);

class Main extends Scene {
  private _c1: Circle = new Circle(50, 50, "red");
  private _c2: Circle = new Circle(60, 60, "green");

  constructor() {
    super();
  }

  async start(engine: Engine) {
    super.start(engine);

    this._c1.position = new Point(g.stage.width / 2, g.stage.height / 2);
    this._c1.velocity = new Point(2, 2);
    this._c1.friction = new Point(1, 1);
    this._c1.alpha = 0.5;
    g.stage.addChild(this._c1);

    this._c2.position = new Point(100, 250);
    this._c2.velocity = new Point(2, 2);
    this._c2.friction = new Point(1, 1);
    this._c2.alpha = 0.5;
    g.stage.addChild(this._c2);
  }

  update() {
    this._c1.update();
    this._c2.update();
    contain(
      this._c1,
      {
        x: this._c1.width / 2,
        y: this._c1.height / 2,
        width: g.stage.width - this._c1.width / 2,
        height: g.stage.height - this._c1.height / 2,
      },
      true
    );
    contain(
      this._c2,
      {
        x: this._c2.width / 2,
        y: this._c2.height / 2,
        width: g.stage.width - this._c2.width / 2,
        height: g.stage.height - this._c2.height / 2,
      },
      true
    );

    hitTestCircle(this._c1, this._c2, false, true, true, true);
    // hitTestRectangle(this._r1, this._r2, true, true, true);
  }
}

g.scene = new Main();
g.centerscreen = true;
g.start();
