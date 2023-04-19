import { Engine } from "inks2d";
import { Sprite, Spritemap } from "inks2d/graphics";
import { Group } from "inks2d/group";
import { Point } from "inks2d/math";
import { Text } from "inks2d/text";
import { makeInteractive } from "inks2d/utils";
import { StartScreen } from "../scenes/StartScreen";
import { Gamescreen } from "../scenes/Gamescreen";
import { Easing, Tween } from "inks2d/effects/tweens";
import { _gameConfig } from "../gameConfig";

export class Wnd_GameOver extends Group {
  private _g: Engine;
  private _gamescreen: Group;

  constructor(g: Engine, gamescreen: Group) {
    super();

    this._g = g;
    this._gamescreen = gamescreen;

    this.pivot = new Point();
    this.dynamicSize = true;

    _gameConfig.game.best =
      _gameConfig.game.best < _gameConfig.game.score
        ? _gameConfig.game.score
        : _gameConfig.game.best;
  }

  added(): void {
    const resultBg = new Sprite(
      this._g.loader.store["assets/images/result_bg.png"]
    );
    resultBg.pivot = new Point();
    this.addChild(resultBg);

    const badges = new Spritemap(
      this._g.loader.store["assets/images/badges.png"],
      45,
      45
    );
    badges.frame =
      _gameConfig.game.score < _gameConfig.config.silverBadgeIn
        ? 0
        : _gameConfig.game.score >= _gameConfig.config.silverBadgeIn &&
          _gameConfig.game.score < _gameConfig.config.goldBadgeIn
        ? 1
        : 2;
    badges.position.x = 57;
    badges.position.y = 62;
    this.addChild(badges);

    const txtScore = new Text("0", 21, "white");
    txtScore.align.h = "right";
    txtScore.family = "prstartk";
    txtScore.position.x = 206;
    txtScore.position.y = 45;
    this.addChild(txtScore);

    const txtBest = new Text("0", 21, "white");
    txtBest.align.h = "right";
    txtBest.family = "prstartk";
    txtBest.content = _gameConfig.game.best.toString();
    txtBest.position.x = 206;
    txtBest.position.y = 83;
    this.addChild(txtBest);

    const menu = new Sprite(this._g.loader.store["assets/images/menu.png"]);
    menu.pivot.x = menu.pivot.y = 0.5;
    makeInteractive(menu);
    menu.customProperties.buttonProps.release = () => {
      this._gamescreen.parent?.removeChild(this._gamescreen);

      const startscreen = new StartScreen(this._g);
      this._g.stage.addChild(startscreen);
    };
    menu.position.x = 70;
    menu.position.y = 113;
    menu.visible = false;
    this.addChild(menu);

    const restart = new Sprite(
      this._g.loader.store["assets/images/restart.png"]
    );
    restart.pivot.x = restart.pivot.y = 0.5;
    makeInteractive(restart);
    restart.customProperties.buttonProps.release = () => {
      this._g.stage.removeChild(this._gamescreen);

      const gamescreen = new Gamescreen(this._g);
      this._g.stage.addChild(gamescreen);
    };
    restart.position.x = 160;
    restart.position.y = 112;
    restart.visible = false;
    this.addChild(restart);

    const tween = new Tween();
    tween.onUpdate = ({ score }) => {
      txtScore.content = parseInt(score).toString();
    };
    tween.onComplete = () => {
      menu.visible = true;
      restart.visible = true;
    };
    tween
      .from({ score: 0 })
      .to({ score: _gameConfig.game.score })
      .duration(_gameConfig.game.score * 500)
      .easing(Easing.Quartic.Out)
      .start();
  }
}
