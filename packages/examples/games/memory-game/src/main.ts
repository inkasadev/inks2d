import { Engine, Scene } from "inks2d";
import { SplashScreen } from "inks2d/extras";
import { GameScreen } from "./scenes/GameScreen";

const g = new Engine(512, 700, 60, false, "none", "#475c8d");

class Main extends Scene {
  constructor() {
    super();
  }

  async start(engine: Engine) {
    super.start(engine);

    const gamescreen = new GameScreen(g);
    g.stage.addChild(gamescreen);
  }
}

g.scene = new SplashScreen(
  ["assets/images/cards.png"],
  () => {
    g.scene = new Main();
  },
  0,
  "assets/mw_inks2d.png"
);

g.centerscreen = true;
g.start();
