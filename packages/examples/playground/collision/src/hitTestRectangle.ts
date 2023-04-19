import { Engine, Scene } from "inks2d";
import { hitTestRectangle } from "inks2d/collision";
import { Rectangle } from "inks2d/geom";
import { Point } from "inks2d/math";
import { contain } from "inks2d/utils";

const g = new Engine(512, 512);

class Main extends Scene {
  private _r1: Rectangle = new Rectangle(40, 40, "red");
  private _r2: Rectangle = new Rectangle(50, 50, "green");

  constructor() {
    super();
  }

  async start(engine: Engine) {
    super.start(engine);

    this._r1.position = new Point(200, 250);
    this._r1.velocity = new Point(2, 2);
    this._r1.friction = new Point(1, 1);
    this._r1.alpha = 0.5;
    g.stage.addChild(this._r1);

    this._r2.position = new Point(g.stage.width / 2, g.stage.height / 2);
    this._r2.velocity = new Point(2, 2);
    this._r2.friction = new Point(1, 1);
    this._r2.alpha = 0.5;
    g.stage.addChild(this._r2);
  }

  update() {
    this._r1.update();
    contain(
      this._r1,
      {
        x: this._r1.width / 2,
        y: this._r1.height / 2,
        width: g.stage.width - this._r1.width / 2,
        height: g.stage.height - this._r1.height / 2,
      },
      true
    );
    hitTestRectangle(this._r1, this._r2, true, true, true);
  }
}

g.scene = new Main();
g.centerscreen = true;
g.start();
