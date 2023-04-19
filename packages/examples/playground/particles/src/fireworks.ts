import { Engine, Scene } from "inks2d";
import { Emitter, ParticleSystem } from "inks2d/effects/particles";
import { Sprite } from "inks2d/graphics";
import { Point } from "inks2d/math";

const g = new Engine(512, 512, 60, false, "none", "black");

class Main extends Scene {
  constructor() {
    super();
  }

  async start(engine: Engine) {
    super.start(engine);

    const emitter = new Emitter();
    const fireworks = new ParticleSystem(
      () => {
        const sprite = new Sprite(g.loader.store["assets/spark.png"]);
        sprite.blendMode = "lighter";
        g.stage.addChild(sprite);
        return sprite;
      },
      new Point(),
      new Point(0, 0.01),
      100, // numParticles
      true, // randomSpacing
      0,
      360, // min/max Angle
      10,
      30, // min/max Size
      0.1,
      1, // min/max Speed
      1,
      1, // min/max Scale Speed
      0.001,
      0.005, // min/max Alpha Speed
      0,
      0, // min/max Rotation Speed,
      250
    );

    fireworks.setPosition(new Point(g.stage.halfWidth, g.stage.halfHeight));
    emitter.addParticle("fireworks", fireworks, 5);
    emitter.play("fireworks");
  }
}

g.loader.onComplete = () => {
  g.scene = new Main();
  g.centerscreen = true;
  g.start();
};

g.loader.load(["assets/spark.png"]);
