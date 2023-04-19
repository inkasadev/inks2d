import { Engine } from "inks2d";
import { Sprite, Spritemap } from "inks2d/graphics";
import { Group } from "inks2d/group";
import { Text } from "inks2d/text";
import { Gamescreen } from "./Gamescreen";
import { makeInteractive, wait } from "inks2d/utils";
import { fadeOut } from "inks2d/effects/utils";

export class StartScreen extends Group {
  private _g: Engine;

  constructor(g: Engine) {
    super();
    this._g = g;
  }

  added(): void {
    const bg = new Sprite(this._g.loader.store["assets/images/bg.png"]);
    bg.pivot.x = bg.pivot.y = 0;
    this.addChild(bg);

    const title = new Text("Flappy Beans", 20, "white");
    title.family = "prstartk";
    title.strokeStyle = "#603913";
    title.lineWidth = 1;
    title.position.x = 145;
    title.position.y = 85;
    this.addChild(title);

    const bean = new Spritemap(
      this._g.loader.store["assets/images/bean.png"],
      32,
      32
    );
    bean.position.x = this._g.stage.width / 2 - 110;
    bean.position.y = this._g.stage.height / 2;
    bean.addAnimation("fly", [0, 1, 2], 200, true);
    bean.play("fly");
    this.addChild(bean);

    const play = new Sprite(this._g.loader.store["assets/images/play.png"]);
    play.pivot.x = play.pivot.y = 0.5;
    makeInteractive(play);
    play.customProperties.buttonProps.release = () => {
      play.customProperties.buttonProps.enabled = false;

      fadeOut(play, 250);
      fadeOut(title, 250);

      wait(250).then(() => {
        this._g.stage.removeChild(this);
        this._g.stage.addChild(new Gamescreen(this._g));
      });
    };
    play.position.x = this._g.stage.width / 2;
    play.position.y = 400;
    this.addChild(play);
  }

  udpate() {}
}
