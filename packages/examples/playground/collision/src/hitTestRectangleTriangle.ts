import { Engine, Scene } from "inks2d";
import { hitTestRectangleTriangle } from "inks2d/collision";
import { Rectangle, Triangle } from "inks2d/geom";
import { Keyboard, Keys } from "inks2d/inputs";
import { Point } from "inks2d/math";

const g = new Engine(512, 512);

class Main extends Scene {
  private _r1: Rectangle = new Rectangle(20, 20, "red");
  private _tLeft: Triangle = new Triangle(250, 120, "right", "green");
  private _tRight: Triangle = new Triangle(90, 50, "left", "green");

  constructor() {
    super();
  }

  async start(engine: Engine) {
    super.start(engine);

    this._r1.position = new Point(100, 100);
    this._r1.alpha = 0.5;
    this._r1.friction = new Point(1, 1);
    g.stage.addChild(this._r1);

    this._tLeft.position = new Point(
      g.stage.width / 2 - 50,
      g.stage.height / 2
    );
    this._tLeft.velocity = new Point(2, 2);
    this._tLeft.alpha = 0.5;
    g.stage.addChild(this._tLeft);

    this._tRight.position = new Point(
      g.stage.width / 2 + 150,
      g.stage.height / 2 - 50
    );
    this._tRight.velocity = new Point(2, 2);
    this._tRight.alpha = 0.5;
    g.stage.addChild(this._tRight);

    this.createKeyboardControls();
  }

  createKeyboardControls() {
    const leftArrow = new Keyboard(Keys.LEFT_ARROW);
    leftArrow.press = () => {
      this._r1.velocity.x = -1;
    };
    leftArrow.release = () => {
      this._r1.velocity.x = 0;
    };

    const rightArrow = new Keyboard(Keys.RIGHT_ARROW);
    rightArrow.press = () => {
      this._r1.velocity.x = 1;
    };
    rightArrow.release = () => {
      this._r1.velocity.x = 0;
    };

    const upArrow = new Keyboard(Keys.UP_ARROW);
    upArrow.press = () => {
      this._r1.velocity.y = -1;
    };
    upArrow.release = () => {
      this._r1.velocity.y = 0;
    };

    const downArrow = new Keyboard(Keys.DOWN_ARROW);
    downArrow.press = () => {
      this._r1.velocity.y = 1;
    };
    downArrow.release = () => {
      this._r1.velocity.y = 0;
    };
  }

  update() {
    this._r1.update();
    hitTestRectangleTriangle(this._r1, this._tLeft, true, true, false);
    hitTestRectangleTriangle(this._r1, this._tRight, true, true, false);
  }
}

g.scene = new Main();
g.centerscreen = true;
g.start();
