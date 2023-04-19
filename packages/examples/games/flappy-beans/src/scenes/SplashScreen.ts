import { DisplayObject, Engine, Scene } from "inks2d";
import { Sprite } from "inks2d/graphics";
import { Rectangle } from "inks2d/geom";
import { Text } from "inks2d/text";
import { wait } from "inks2d/utils";

export class SplashScreen extends Scene {
  private _assetsToLoad: string[];
  private _callback: () => void;
  private _forceClick: boolean;
  private _loader: Rectangle = new Rectangle(1080, 1920, "black");
  private _g: Engine;

  constructor(
    assetsToLoad: string[],
    callback: () => void | undefined,
    forceClick: boolean,
    g: Engine
  ) {
    super();

    this._assetsToLoad = assetsToLoad;
    this._callback = callback;
    this._forceClick = forceClick;
    this._g = g;
  }

  start(e: Engine): void {
    super.start(e);

    this._loader.pivot.x = this._loader.pivot.y = 0;
    this._loader.width = this._g.stage.width;
    this._loader.height = this._g.stage.height;
    this._g.stage.addChild(this._loader);

    if (this._assetsToLoad) {
      this._g.loader.loadFont("./assets/fonts/ubuntu.ttf", () => {});
      this._g.loader.loadImage("./assets/images/splash-logo.png", () => {
        this.loadAssets();
      });
    }
  }

  private loadAssets(): void {
    const logo = new Sprite(
      this._g.loader.store["./assets/images/splash-logo.png"]
    );
    logo.pivot.x = logo.pivot.y = 0.5;
    this.updateObjScale(logo);
    this._loader.putCenter(logo);
    this._loader.addChild(logo);

    const maxWidth = this._g.stage.width / 2.5;

    const back = new Rectangle(maxWidth, 50, "gray", "black", 2, 5);
    back.pivot.x = 0;
    this.updateObjSize(back);
    back.width = maxWidth - 3;
    back.position.x = 540 - 210;
    back.position.y = 960 + logo.height - 230;
    this.updateObjPos(back);
    this._loader.addChild(back);

    const front = new Rectangle(0, 50, "#ddd", "none", 2, 1);
    front.pivot.x = 0;
    this.updateObjSize(front);
    front.position.x = 540 - 210;
    front.position.y = 960 + logo.height - 230;
    this.updateObjPos(front);
    this._loader.addChild(front);

    this._g.loader.onUpdate = (loaded, total) => {
      const ratio = Math.floor((loaded * 100) / total);
      front.width = (ratio * maxWidth) / 100;
    };

    this._g.loader.onComplete = () => {
      this.startGame();
    };

    this._g.loader.load(this._assetsToLoad);
  }

  private updateObjScale(obj: DisplayObject): void {
    obj.scale.x = (this._g.stage.width * obj.scale.x) / 1080;
    obj.scale.y = (this._g.stage.height * obj.scale.y) / 1920;
  }

  private updateObjSize(obj: DisplayObject): void {
    obj.width = (this._g.stage.width * obj.width) / 1080;
    obj.height = (this._g.stage.height * obj.height) / 1920;
  }

  private updateObjPos(obj: DisplayObject): void {
    obj.position.x = (this._g.stage.width * obj.position.x) / 1080;
    obj.position.y = (this._g.stage.height * obj.position.y) / 1920;
  }

  private startGame(): void {
    const logoWidth = this._loader.children[0].height;
    if (!this._forceClick) {
      wait(2000).then(() => {
        if (this._callback) this._callback();
      });
      return;
    }

    const start = new Text("TAP TO START", 48, "white");
    start.family = "ubuntu";
    start.pivot.x = start.pivot.y = 0.5;
    start.position.x = 540 + 8;
    start.position.y = 960 + logoWidth - 150;
    start.size = (this._g.stage.width * start.size) / 1080;
    this.updateObjPos(start);
    this._loader.addChild(start);

    this._g.pointer.release = () => {
      this._g.pointer.release = undefined;
      if (this._callback) this._callback();
    };
  }
}
