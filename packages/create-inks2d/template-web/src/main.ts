import { Engine, Scene } from "inks2d";
import { SplashScreen } from "inks2d/extras";
import { Sprite } from "inks2d/graphics";

const g = new Engine(640, 480);

class Main extends Scene {
	constructor() {
		super();
	}

	override start(e: Engine) {
		super.start(e);

		const logo = new Sprite(g.loader.store["./logo.png"]);
		logo.position.x = g.stage.width / 2;
		logo.position.y = g.stage.height / 2;
		g.stage.addChild(logo);
	}
}

g.scene = new SplashScreen(
	["./logo.png"],
	() => {
		g.scene = new Main();
		g.pause();
	},
	0,
	"./mw_inks2d.png",
);

g.centerscreen = true;
g.start();
