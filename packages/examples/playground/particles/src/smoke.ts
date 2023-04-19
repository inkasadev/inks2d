import { Engine, Scene } from "inks2d";
import { Emitter, ParticleSystem } from "inks2d/effects/particles";
import { Spritemap } from "inks2d/graphics";
import { Point } from "inks2d/math";
import { randomInt } from "inks2d/math";

const g = new Engine(512, 512, 60, false, "none", "black");

class Main extends Scene {
  constructor() {
    super();
  }

  async start(engine: Engine) {
    super.start(engine);

    const emitter = new Emitter();
    const smoke = new ParticleSystem(
      () => {
        const sprite = new Spritemap(
          g.loader.store["assets/smokes.png"],
          64,
          64
        );
        sprite.blendMode = "lighter";
        sprite.frame = randomInt(0, 3);
        g.stage.addChild(sprite);
        return sprite;
      },
      new Point(g.stage.halfWidth, g.stage.halfHeight + 150),
      new Point(0, -0.1),
      10, // numParticles
      true, // randomSpacing
      -150,
      0, // min/max Angle
      20,
      100, // min/max Size
      -0.1,
      1, // min/max Speed
      0.01,
      100, // min/max Scale Speed
      0.005,
      0.01, // min/max Alpha Speed
      0,
      0 // min/max Rotation Speed
    );

    emitter.addParticle("smoke", smoke, 0.05);
    emitter.play("smoke");
  }
}

g.loader.onComplete = () => {
  g.scene = new Main();
  g.centerscreen = true;
  g.start();
};

g.loader.load(["assets/smokes.png"]);
