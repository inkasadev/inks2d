import { Engine } from "inks2d";
import { blink, fadeOut } from "inks2d/effects/utils";
import { Sprite, Spritemap } from "inks2d/graphics";
import { Group } from "inks2d/group";
import { Backdrop } from "inks2d/extras";
import { Text } from "inks2d/text";
import { contain, makeInteractive, shake } from "inks2d/utils";
import { Point, randomInt, toRadians } from "inks2d/math";
import { Rectangle } from "inks2d/geom";
import { hitTestRectangle } from "inks2d/collision";
import { Wnd_GameOver } from "../objects/Wnd_GameOver";
import { _gameConfig } from "../gameConfig";

export class Gamescreen extends Group {
  private _g;
  private _getReadyGroup: Group = new Group();
  private _bg: Backdrop;
  private _floor: Backdrop;
  private _bean: Spritemap;
  private _txtScore: Text = new Text("0", 36, "white");
  private _btnPause: Spritemap;
  private _colliders: Rectangle[] = [];
  private _pipes: Spritemap[] = [];
  private _lose: boolean = false;

  constructor(g: Engine) {
    super();

    this._g = g;
    _gameConfig.game.score = 0;
  }

  added(): void {
    this._bg = new Backdrop(
      this._g.loader.store["assets/images/bg.png"],
      290,
      515
    );

    this._floor = new Backdrop(
      this._g.loader.store["assets/images/floor.png"],
      290,
      55
    );
    this._floor.position.y = 460;

    this._bean = new Spritemap(
      this._g.loader.store["assets/images/bean.png"],
      32,
      32
    );
    this._bean.position.x = this._g.stage.width / 2 - 110;
    this._bean.position.y = this._g.stage.height / 2;
    this._bean.addAnimation("fly", [0, 1, 2], 200, true);
    this._bean.play("fly");
    this._bean.gravity.y = 0.2;

    const getReady = new Sprite(
      this._g.loader.store["assets/images/ready.png"]
    );
    getReady.pivot.x = getReady.pivot.y = 0.5;
    getReady.position.x = 145;
    getReady.position.y = 340;

    const hand = new Sprite(this._g.loader.store["assets/images/hand.png"]);
    hand.position.x = 145;
    hand.position.y = 320;
    blink(hand, 500);

    this._getReadyGroup.renderOutside = true;
    this._getReadyGroup.addChild(getReady);
    this._getReadyGroup.addChild(hand);

    this._txtScore.family = "prstartk";
    this._txtScore.shadow = true;
    this._txtScore.shadowColor = "rgba(100, 100, 100, 1)";
    this._txtScore.shadowOffsetX = 3;
    this._txtScore.shadowOffsetY = 3;
    this._txtScore.shadowBlur = 2;
    this._txtScore.position.x = 145;
    this._txtScore.position.y = 72;

    this._btnPause = new Spritemap(
      this._g.loader.store["assets/images/btn_pause.png"],
      28,
      30
    );
    this._btnPause.layer = 1;
    this._btnPause.visible = false;
    makeInteractive(this._btnPause);
    this._btnPause.customProperties.buttonProps.release = () => {
      if (this._g.playing) {
        this._g.pause();
        this._bean.pause();
        this._btnPause.frame = 1;
        return;
      }

      this._g.resume();
      this._bean.resume();
      this._btnPause.frame = 0;
    };
    this._btnPause.position.x = 266;
    this._btnPause.position.y = 25;

    this.addChild(this._bg);
    this.addChild(this._bean);
    this.addChild(this._getReadyGroup);
    this.createPipes();
    this.addChild(this._floor);
    this.addChild(this._btnPause);
    this.addChild(this._txtScore);

    this._g.pointer.release = () => {
      if (this._lose || this._g.pointer.y < 50 || this._btnPause.frame !== 0)
        return;

      if (!this._g.playing) {
        this._g.resume();
        this._btnPause.visible = true;
        fadeOut(getReady, 3000);
        fadeOut(hand, 3000);
      }

      this._bean.velocity.y = _gameConfig.config.jumpForce;
      this._g.loader.store["assets/sounds/bounce.wav"].play();
    };

    /*
    this._g.scene.update = () => {
      this.update();
    };
    */
  }

  start(): void {}

  update(): void {
    const angle =
      this._bean.velocity.y < 0
        ? -_gameConfig.config.beanRotation
        : _gameConfig.config.beanRotation;

    this._bean.rotation = toRadians(angle);

    if (!this._lose) {
      contain(
        this._bean,
        {
          x: 0,
          y: 0,
          width: this._g.stage.width,
          height: 450,
        },
        false,
        this.topBottomCollide.bind(this)
      );
    } else {
      contain(
        this._bean,
        {
          x: -380,
          y: 0,
          width: this._g.stage.width,
          height: 450,
        },
        false,
        this.topBottomCollide.bind(this)
      );
      this._bean.position.x -= _gameConfig.config.gameSpeed;

      if (this._bean.position.x <= -this._bean.width) {
        if (!this._g.playing) return;

        this._g.pause();
      }
    }

    for (let i = 0; i < this._pipes.length; i += 2) {
      const tPipe = this._pipes[i];
      const bPipe = this._pipes[i + 1];
      const pipeHeight = this.normalizePipeHeight(randomInt(-312, -30));

      if (
        (hitTestRectangle(
          this._bean as unknown as Rectangle,
          tPipe as unknown as Rectangle
        ).hasContact ||
          hitTestRectangle(
            this._bean as unknown as Rectangle,
            bPipe as unknown as Rectangle
          ).hasContact) &&
        !this._lose
      ) {
        this._bean.pause();
        this._bean.frame = 3;
        this._lose = true;
        this._btnPause.visible = false;
        shake(this, 50, 10);

        const wnd = new Wnd_GameOver(this._g, this);
        this.addChild(wnd);
        wnd.position.x = this._g.stage.width / 2 - wnd.width / 2;
        wnd.position.y = 178;
      }

      tPipe.position.x -= _gameConfig.config.gameSpeed;
      bPipe.position.x -= _gameConfig.config.gameSpeed;

      if (tPipe.position.x < -tPipe.width) {
        tPipe.position.x = this._g.stage.width;
        bPipe.position.x = this._g.stage.width;

        tPipe.frame = randomInt(0, 1);
        tPipe.position.y = pipeHeight;

        bPipe.frame = randomInt(0, 1);
        bPipe.position.y =
          tPipe.position.y + tPipe.height + _gameConfig.config.pipeGap;

        tPipe.children[0].visible = true;
      }
    }

    this._colliders.forEach((collider) => {
      if (!collider.visible) return;

      if (
        hitTestRectangle(this._bean as unknown as Rectangle, collider, true)
          .hasContact
      ) {
        _gameConfig.game.score++;
        this._txtScore.content = _gameConfig.game.score.toString();
        collider.visible = false;
      }
    });

    this._bean.move();
    this._bg.setTileX(-_gameConfig.config.gameSpeed);
    this._floor.setTileX(-_gameConfig.config.gameSpeed);
    this._getReadyGroup.position.x -= _gameConfig.config.gameSpeed;
  }

  private createPipes(): void {
    for (let i = 0; i < _gameConfig.config.numPipes; i++) {
      const pipeHeight = this.normalizePipeHeight(randomInt(-312, -30));

      const tPipe = new Spritemap(
        this._g.loader.store["assets/images/t_pipe.png"],
        49,
        328
      );
      tPipe.pivot = new Point();
      tPipe.frame = randomInt(0, 1);
      tPipe.position.x =
        _gameConfig.config.distanceUntilFirstPipe +
        49 * i +
        i * _gameConfig.config.distanceBetweenPipes;
      tPipe.position.y = pipeHeight;

      const bPipe = new Spritemap(
        this._g.loader.store["assets/images/b_pipe.png"],
        49,
        328
      );
      bPipe.pivot = new Point();
      bPipe.frame = randomInt(0, 1);
      bPipe.position.x =
        _gameConfig.config.distanceUntilFirstPipe +
        49 * i +
        i * _gameConfig.config.distanceBetweenPipes;
      bPipe.position.y =
        tPipe.position.y + tPipe.height + _gameConfig.config.pipeGap;

      const collider = new Rectangle(
        tPipe.width / 2,
        _gameConfig.config.pipeGap,
        "none",
        "none"
      );
      collider.position.x = tPipe.width;
      collider.position.y = tPipe.height;

      this.addChild(tPipe);
      this.addChild(bPipe);
      tPipe.addChild(collider);

      this._pipes.push(tPipe);
      this._pipes.push(bPipe);
      this._colliders.push(collider);
    }
  }

  private normalizePipeHeight(h: number): number {
    if (_gameConfig.config.lastHeight) {
      if (_gameConfig.config.lastHeight > h) {
        if (
          _gameConfig.config.lastHeight + h <
          _gameConfig.config.maxDistanceBetweenGaps
        )
          h = _gameConfig.config.maxDistanceBetweenGaps + 30;
      } else {
        if (
          _gameConfig.config.lastHeight + h <
          _gameConfig.config.maxDistanceBetweenGaps
        )
          h = -30;
      }
    }

    _gameConfig.config.lastHeight = h;

    return h;
  }

  private topBottomCollide(collide: string): void {
    if (collide === "top") {
      this._bean.velocity.y *= -1;
      return;
    }

    if (!this._lose) {
      this._bean.pause();
      this._bean.frame = 3;
      this._lose = true;
      shake(this, 50, 10);

      const wnd = new Wnd_GameOver(this._g, this);
      this.addChild(wnd);
      wnd.position.x = this._g.stage.width / 2 - wnd.width / 2;
      wnd.position.y = 178;
    }
  }
}
