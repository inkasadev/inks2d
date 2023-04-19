import { Engine } from "inks2d";
import { Easing, Tween } from "inks2d/effects/tweens";
import { Sprite } from "inks2d/graphics";
import { Group } from "inks2d/group";
import { Point } from "inks2d/math";
import { Text } from "inks2d/text";
import { makeInteractive } from "inks2d/utils";
import { TransitionScreen } from "inks2d/extras";
import { GameScreen } from "./GameScreen";
import { _gameConfig } from "../gameConfig";

export class StartScreen extends Group {
  private _g: Engine;
  private _disableButtons: boolean = false;
  private _elapsed: number = 0;
  private _counter: number = 0;
  private _seconds: number = 0;

  constructor(g: Engine) {
    super();
    this._g = g;
  }

  added(): void {
    this.layer = 0;
    const bg = new Sprite(
      this._g.loader.store["assets/images/startscreen-bg.png"]
    );
    bg.pivot = new Point();
    this.addChild(bg);

    const btnPlay = new Sprite(
      this._g.loader.store["assets/images/button.png"]
    );
    btnPlay.position.x = this._g.stage.width / 2;
    btnPlay.position.y = 345;
    makeInteractive(btnPlay);
    btnPlay.customProperties.buttonProps.tap = () => {
      if (this._disableButtons) return;
      this._disableButtons = true;

      const tween1 = new Tween();
      tween1.onComplete = () => {
        const transition = new TransitionScreen(1000, this._g, "#475c8d");
        transition.layer = 1;
        this._g.stage.addChild(transition);

        transition.onBetween = () => {
          this._g.stage.removeChild(this);

          const gamescreen = new GameScreen(this._g);
          this._g.stage.addChild(gamescreen);
        };
        transition.start();
      };
      tween1.onUpdate = ({ x }) => {
        btnPlay.position.x = txtPlay.position.x = x;
      };
      tween1
        .from({ x: this._g.stage.width / 2 })
        .to({ x: this._g.stage.width + this._g.stage.width / 2 })
        .duration(1000)
        .easing(Easing.Back.In)
        .start();

      const tween2 = new Tween();
      tween2.onUpdate = ({ x }) => {
        btnOption2.position.x = txtOption2.position.x = x;
      };
      tween2
        .from({ x: this._g.stage.width / 2 })
        .to({ x: this._g.stage.width + this._g.stage.width / 2 })
        .duration(1000)
        .delay(50)
        .easing(Easing.Back.In)
        .start();

      const tween3 = new Tween();
      tween3.onUpdate = ({ x }) => {
        btnOption3.position.x = txtOption3.position.x = x;
      };
      tween3
        .from({ x: this._g.stage.width / 2 })
        .to({ x: this._g.stage.width + this._g.stage.width / 2 })
        .duration(1000)
        .delay(100)
        .easing(Easing.Back.In)
        .start();
    };
    this.addChild(btnPlay);

    const txtPlay = new Text("Play", 32, "black");
    txtPlay.family = "Gemunu Libre";
    txtPlay.pivot.x = txtPlay.pivot.y = 0.5;
    txtPlay.position.x = btnPlay.position.x;
    txtPlay.position.y = btnPlay.position.y;
    this.addChild(txtPlay);

    const btnOption2 = new Sprite(
      this._g.loader.store["assets/images/button.png"]
    );
    btnOption2.position.x = this._g.stage.width / 2;
    btnOption2.position.y = 420;
    makeInteractive(btnOption2);
    this.addChild(btnOption2);

    const txtOption2 = new Text("Option 2", 32, "black");
    txtOption2.family = "Gemunu Libre";
    txtOption2.pivot.x = txtOption2.pivot.y = 0.5;
    txtOption2.position.x = btnOption2.position.x;
    txtOption2.position.y = btnOption2.position.y;
    this.addChild(txtOption2);

    const btnOption3 = new Sprite(
      this._g.loader.store["assets/images/button.png"]
    );
    btnOption3.position.x = this._g.stage.width / 2;
    btnOption3.position.y = 495;
    makeInteractive(btnOption3);
    this.addChild(btnOption3);

    const txtOption3 = new Text("Option 3", 32, "black");
    txtOption3.family = "Gemunu Libre";
    txtOption3.pivot.x = txtOption3.pivot.y = 0.5;
    txtOption3.position.x = btnOption3.position.x;
    txtOption3.position.y = btnOption3.position.y;
    this.addChild(txtOption3);

    const paddle = new Sprite(this._g.loader.store["assets/images/paddle.png"]);
    paddle.position.x = Number(this._g.pointer.x);
    paddle.position.y = 600;
    this.addChild(paddle);

    this._g.pointer.move = () => {
      if (this._g.pointer.x <= paddle.width / 2) {
        paddle.position.x = paddle.width / 2;
        return;
      }

      if (this._g.pointer.x >= this._g.stage.width - paddle.width / 2) {
        paddle.position.x = this._g.stage.width - paddle.width / 2;
        return;
      }

      paddle.position.x = Number(this._g.pointer.x);
    };

    _gameConfig.game.best =
      _gameConfig.game.best < _gameConfig.game.lastScore
        ? _gameConfig.game.lastScore
        : _gameConfig.game.best;

    const txtScore = new Text(
      `last score: ${
        _gameConfig.game.lastScore === -1 ? "???" : _gameConfig.game.lastScore
      }\nbest: ${_gameConfig.game.best}`,
      32,
      "white"
    );
    txtScore.family = "Gemunu Libre";
    txtScore.leading = 2;
    txtScore.align.h = "left";
    txtScore.align.v = "top";
    txtScore.position.x = 15;
    txtScore.position.y = this._g.stage.height - 55;
    txtScore.layer = 3;
    this.addChild(txtScore);
  }
  /*
  update(): void {
    this._elapsed += this._g.elapsed * 1000;
    this._counter++;

    if (this._elapsed > 1000) {
      this._seconds++;

      console.log("this._elapsed => ", this._g.elapsed);
      console.log("this._counter => ", this._counter);
      console.log("this._seconds => ", this._seconds);

      this._elapsed = 0;
      this._counter = 0;
    }
  }
  */

  destroy(): void {
    super.destroy();
    this._g.pointer.move = undefined;
  }
}
