import { Engine, Scene } from "inks2d";
import { SplashScreen } from "inks2d/extras";
import { StartScreen } from "./scenes/StartScreen";

const g = new Engine(512, 700, 60, false, "none", "#475c8d");

class Main extends Scene {
  constructor() {
    super();
  }

  async start(engine: Engine) {
    super.start(engine);

    const startscreen = new StartScreen(g);
    g.stage.addChild(startscreen);
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
  () => {
    g.scene = new Main();
  },
  0,
  "assets/mw_inks2d.png",
  true
);

g.centerscreen = true;
g.start();
