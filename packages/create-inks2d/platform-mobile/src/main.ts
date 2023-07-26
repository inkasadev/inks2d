import { Engine, Scene } from "inks2d";
import { SplashScreen } from "inks2d/extras";
import { Sprite } from "inks2d/graphics";
import { Detect } from "inks2d/utils";
import "./app";

const border = Detect.Android() ? "none" : "1px dashed #000";
const g = new Engine(1080, 1920, 60, true, border);

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
	},
	0,
	"./mw_inks2d.png",
);

if (Detect.Android()) g.fullscreen = true;
else g.centerscreen = true;
g.start();
