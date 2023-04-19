import { Engine } from "inks2d";
import { Sprite, Spritemap } from "inks2d/graphics";
import { Group } from "inks2d/group";
import { _gameConfig } from "../gameConfig";
import { Point, randomInt, randomOption } from "inks2d/math";
import { Circle } from "inks2d/geom";
import { contain } from "inks2d/utils";
import { ParticleSystem } from "inks2d/effects/particles";
import { hitTestCircleRectangle } from "inks2d/collision";
import { Tween } from "inks2d/effects/tweens";
import { Text } from "inks2d/text";
import { TransitionScreen } from "inks2d/extras";
import { StartScreen } from "./StartScreen";

export class GameScreen extends Group {
  private _g: Engine;
  private _paddle: Sprite;
  private _tiles: Spritemap[] = [];
  private _ball: Circle;
  private _ballFx: ParticleSystem;
  private _score: number = 0;
  private _lives: number = _gameConfig.game.maxLives;
  private _txtScore: Text;
  private _lose: boolean = false;

  constructor(g: Engine) {
    super();

    this._g = g;
    this._paddle = new Sprite(this._g.loader.store["assets/images/paddle.png"]);
  }

  added(): void {
    this.layer = 0;
    this.createPaddle();
    this.createBall();
    this.createTiles();

    this._txtScore = new Text(
      `lives: ${this._lives}\nscore: ${this._score}`,
      32,
      "white"
    );
    this._txtScore.family = "Gemunu Libre";
    this._txtScore.leading = 2;
    this._txtScore.align.h = "left";
    this._txtScore.align.v = "top";
    this._txtScore.position.x = 15;
    this._txtScore.position.y = this._g.stage.height - 55;
    this._txtScore.layer = 3;
    this.addChild(this._txtScore);
  }

  private createPaddle(): void {
    this._paddle.position.x = Number(this._g.pointer.x);
    this._paddle.position.y = 600;
    this._paddle.layer = 3;
    this.addChild(this._paddle);

    this._g.pointer.move = () => {
      if (this._g.pointer.x <= this._paddle.width / 2) {
        this._paddle.position.x = this._paddle.width / 2;
        return;
      }

      if (this._g.pointer.x >= this._g.stage.width - this._paddle.width / 2) {
        this._paddle.position.x = this._g.stage.width - this._paddle.width / 2;
        return;
      }

      this._paddle.position.x = Number(this._g.pointer.x);
    };
  }

  private createBall(): void {
    this._ball = new Circle(15, 15, "#f23737");
    this._ball.velocity.x = _gameConfig.ball.initialSpeed.x;
    this._ball.velocity.y = _gameConfig.ball.initialSpeed.y;
    this._ball.friction = new Point(1, 1);
    this._ball.position.x = this._g.stage.width / 2;
    this._ball.position.y = 570;
    this._ball.layer = 1;
    this.addChild(this._ball);

    this._ballFx = new ParticleSystem(
      () => {
        const particle = new Circle(15, 15, "#f23737");
        particle.blendMode = "lighter";
        particle.layer = 1;
        this.addChild(particle);

        return particle;
      },
      new Point(),
      new Point(),
      10,
      false,
      0,
      0,
      0,
      15,
      0,
      0,
      0.02,
      0.02,
      0.06,
      0.06
    );
  }

  private createTiles(): void {
    for (
      let i = 0;
      i < _gameConfig.tiles.numberOfRows * _gameConfig.tiles.tilesPerRow;
      i++
    ) {
      if (Math.random() > _gameConfig.tiles.chanceToSpawn) continue;

      const column = i % _gameConfig.tiles.tilesPerRow;
      const row = Math.floor(i / _gameConfig.tiles.tilesPerRow);

      const tile = new Spritemap(
        this._g.loader.store["assets/images/tiles.png"],
        64,
        32
      );
      tile.pivot = new Point();
      tile.frame = row;
      tile.position.x = column * tile.width;
      tile.position.y = row * tile.height;
      tile.alpha = 0;
      tile.layer = 2;
      tile.customProperties.score = _gameConfig.tiles.scoresPerRow[row];
      this.addChild(tile);
      this._tiles.push(tile);

      const tween = new Tween();
      tween.onUpdate = ({ alpha }) => {
        tile.alpha = alpha;
      };
      tween
        .from({ alpha: 0 })
        .to({ alpha: 1 })
        .duration(200)
        .delay(column * 50 + 50)
        .start();
    }
  }

  private moveBall(): void {
    this._ballFx.setPosition(this._ball.position);
    this._ballFx.emit();
    this._ball.move();

    contain(
      this._ball,
      {
        x: this._ball.width / 2,
        y: this._ball.height / 2,
        width: this._g.stage.width - this._ball.width / 2,
        height: this._g.stage.height - this._ball.height / 2,
      },
      true,
      (side) => {
        if (side === "bottom") {
          this._txtScore.content = `lives: ${--this._lives}\nscore: ${
            this._score
          }`;

          if (this._lives === 0) {
            this._lose = true;
            this._g.pointer.move = undefined;
            _gameConfig.game.lastScore = this._score;

            const transition = new TransitionScreen(1000, this._g, "#475c8d");
            transition.layer = 1;
            this._g.stage.addChild(transition);

            transition.onBetween = () => {
              this._g.stage.removeChild(this);

              const startscreen = new StartScreen(this._g);
              this._g.stage.addChild(startscreen);
            };
            transition.start();
            return;
          }

          this.removeChild(this._ball);
          this.createBall();
        }
      }
    );
  }

  private ballPaddleCollision(): void {
    const collider = hitTestCircleRectangle(
      this._ball,
      this._paddle,
      false,
      true,
      true
    );

    if (collider.hasContact && collider.side === "bottom") {
      this._ball.velocity = new Point(
        randomInt(_gameConfig.ball.initialSpeed.x, _gameConfig.ball.maxSpeed.x),
        randomInt(_gameConfig.ball.initialSpeed.y, _gameConfig.ball.maxSpeed.y)
      );
      this._ball.velocity.x *= randomOption([-1, 1]);
    }
  }

  private ballTilesCollision(): void {
    for (let i = this._tiles.length - 1; i >= 0; i--) {
      const tile = this._tiles[i];

      if (tile.alpha < 1) continue;

      const collider = hitTestCircleRectangle(
        this._ball,
        tile,
        false,
        true,
        true
      );

      if (collider.hasContact) {
        this._score += tile.customProperties.score;
        this._txtScore.content = `lives: ${this._lives}\nscore: ${this._score}`;
        this._tiles.splice(i, 1);

        const tween = new Tween();
        tween.onComplete = () => {
          this.removeChild(tile);
        };
        tween.onUpdate = ({ alpha }) => {
          tile.alpha = alpha;
        };
        tween.from({ alpha: 1 }).to({ alpha: 0 }).duration(500).start();
      }
    }

    if (this._tiles.length === 0) {
      this.createTiles();
    }
  }

  update(): void {
    if (this._lose) return;

    this.moveBall();
    this.ballPaddleCollision();
    this.ballTilesCollision();
  }
}
