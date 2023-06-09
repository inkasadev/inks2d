import { Engine, Scene } from "inks2d";
import { SplashScreen } from "inks2d/extras";
import { StartScreen } from "./scenes/StartScreen";

const g = new Engine(290, 515, 60, false, "none");

class Main extends Scene {
  constructor() {
    super();
  }

  async start(engine: Engine) {
    super.start(engine);

    g.loader.store["assets/sounds/bounce.wav"].volume = 0.2;

    const startscreen = new StartScreen(g);
    g.stage.addChild(startscreen);
  }
}

g.scene = new SplashScreen(
  [
    "assets/images/bg.png",
    "assets/images/hand.png",
    "assets/images/play.png",
    "assets/images/ranking.png",
    "assets/images/tap_right.png",
    "assets/images/tap_left.png",
    "assets/images/title.png",
    "assets/images/bean.png",
    "assets/images/t_pipe.png",
    "assets/images/b_pipe.png",
    "assets/images/floor.png",
    "assets/images/ready.png",
    "assets/images/hand.png",
    "assets/images/btn_play.png",
    "assets/images/btn_pause.png",
    "assets/images/result_bg.png",
    "assets/images/badges.png",
    "assets/images/menu.png",
    "assets/images/restart.png",
    "assets/fonts/prstartk.ttf",
    "assets/sounds/bounce.wav",
  ],
  () => {
    g.scene = new Main();
    g.pause();
  },
  0,
  "assets/mw_inks2d.png",
  true
);
g.centerscreen = true;
g.start();
