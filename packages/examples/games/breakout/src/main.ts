import { Engine, Scene } from "inks2d";
import { SplashScreen } from "inks2d/extras";
import { Rectangle } from "inks2d/geom";
import { StartScreen } from "./scenes/StartScreen";
import { GameScreen } from "./scenes/GameScreen";

const g = new Engine(512, 700, 60, false, "none", "#475c8d");

class Main extends Scene {
  constructor() {
    super();
  }

  async start(engine: Engine) {
    super.start(engine);

    const startscreen = new StartScreen(g);
    g.stage.addChild(startscreen);

    // const gamescreen = new GameScreen(g);
    // g.stage.addChild(gamescreen);
  }
}

g.scene = new SplashScreen(
  [
    "assets/images/button.png",
    "assets/images/paddle.png",
    "assets/images/star.png",
    "assets/images/startscreen-bg.png",
    "assets/images/tiles.png",
  ],
  new Rectangle(0, 0),
  () => {
    g.scene = new Main();
  },
  false,
  g
);

g.centerscreen = true;
g.start();
