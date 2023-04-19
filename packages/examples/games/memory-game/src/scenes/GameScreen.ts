import { Group } from "inks2d/group";
import { Spritemap } from "inks2d/graphics";
import { Engine } from "inks2d";
import { makeInteractive, wait } from "inks2d/utils";
import { Tween } from "inks2d/effects/tweens";
import { shuffleArray } from "inks2d/math";
import { Text } from "inks2d/text";
import { TransitionScreen } from "inks2d/extras";
import { _gameConfig } from "../gameConfig";

export class GameScreen extends Group {
  private _g: Engine;
  private _cardsData: Record<string, number>[] = [];
  private _cardsFlipped: Spritemap[] = [];
  private _canPlay: boolean = true;
  private _moves: number = 0;
  private _pairsRemaing: number = 10;
  private _txtScore: Text;

  constructor(g: Engine) {
    super();
    this._g = g;

    for (let i = 1; i < 11; i++) {
      this._cardsData.push({
        id: i,
        frame: i,
      });

      this._cardsData.push({
        id: i,
        frame: i + 10,
      });
    }

    this._cardsData = shuffleArray(this._cardsData);
  }

  added(): void {
    this.layer = 0;
    this.createCards();

    const best = _gameConfig.game.best === -1 ? "???" : _gameConfig.game.best;
    this._txtScore = new Text(
      `moves: ${this._moves}\nbest: ${best}`,
      32,
      "white"
    );
    this._txtScore.family = "Gemunu Libre";
    this._txtScore.leading = 10;
    this._txtScore.align.h = "left";
    this._txtScore.align.v = "top";
    this._txtScore.position.x = 25;
    this._txtScore.position.y = this._g.stage.height - 65;
    this._txtScore.layer = 3;
    this.addChild(this._txtScore);
  }

  private createCards(): void {
    for (let i = 0; i < _gameConfig.game.numberOfCards; i++) {
      const x: number = 65;
      const y: number = 162;
      const gap: number = 10;
      const cardData = this._cardsData.pop();

      const card = new Spritemap(
        this._g.loader.store["assets/images/cards.png"],
        85,
        115
      );
      card.frame = 0;
      card.position.x =
        x + Math.floor(i % _gameConfig.game.cardsPerLine) * (card.width + gap);
      card.position.y =
        y + Math.floor(i / _gameConfig.game.cardsPerLine) * (card.height + gap);
      card.customProperties.id = cardData?.id;
      card.customProperties.frame = cardData?.frame;
      card.customProperties.isFlipping = false;
      card.customProperties.isFlipped = false;

      makeInteractive(card);
      card.customProperties.buttonProps.tap = () => {
        if (
          !this._canPlay ||
          card.customProperties.isFlipped ||
          card.customProperties.isFlipping
        )
          return;

        card.customProperties.isFlipping = true;
        this._cardsFlipped.push(card);
        this.flipCard(card);

        if (this._cardsFlipped.length >= 2) {
          this._canPlay = false;
          const isMatch = this.checkMatch();

          if (!isMatch) {
            wait(1250).then(() => {
              this.flipCard(this._cardsFlipped[0]);
              this.flipCard(this._cardsFlipped[1]);

              card.customProperties.isFlipped = false;
              this._moves++;
              this._cardsFlipped = [];
              this._canPlay = true;
              this.updateGui();
            });

            return;
          }

          this._moves++;
          this._pairsRemaing--;
          this._cardsFlipped = [];
          this._canPlay = true;
          this.updateGui();

          if (this._pairsRemaing === 0) {
            this._canPlay = false;

            if (_gameConfig.game.best === -1) {
              _gameConfig.game.best = this._moves;
            } else {
              _gameConfig.game.best =
                _gameConfig.game.best < this._moves
                  ? _gameConfig.game.best
                  : this._moves;
            }

            wait(1500).then(() => {
              const transition = new TransitionScreen(1000, this._g, "#475c8d");
              transition.layer = 1;
              this._g.stage.addChild(transition);

              transition.onBetween = () => {
                this._g.stage.removeChild(this);

                const gamescreen = new GameScreen(this._g);
                this._g.stage.addChild(gamescreen);
              };
              transition.start();
            });
          }
        }
      };
      this.addChild(card);
    }
  }

  private checkMatch(): boolean {
    const card1 = this._cardsFlipped[0].customProperties.id;
    const card2 = this._cardsFlipped[1].customProperties.id;

    return card1 === card2;
  }

  private flipCard(card: Spritemap): void {
    const tween1 = new Tween();
    tween1.onUpdate = ({ scaleX, scaleY }) => {
      card.scale.x = scaleX;
      card.scale.y = scaleY;
    };
    tween1.onComplete = () => {
      if (card.frame !== 0) {
        card.frame = 0;
        return;
      }

      card.frame = card.customProperties.frame;
    };
    tween1
      .from({ scaleX: 1, scaleY: 1 })
      .to({ scaleX: 0, scaleY: 1.2 })
      .duration(250);

    const tween2 = new Tween();
    tween2.onUpdate = ({ scaleX, scaleY }) => {
      card.scale.x = scaleX;
      card.scale.y = scaleY;
    };
    tween2.onComplete = () => {
      card.customProperties.isFlipping = false;
      card.customProperties.isFlipped = !!card.frame;
    };
    tween2
      .from({ scaleX: 0, scaleY: 1.2 })
      .to({ scaleX: 1, scaleY: 1 })
      .duration(250);

    tween1.chain(tween2);
    tween1.start();
  }

  private updateGui(): void {
    const best = _gameConfig.game.best === -1 ? "???" : _gameConfig.game.best;
    this._txtScore.content = `moves: ${this._moves}\nbest: ${best}`;
  }
}
