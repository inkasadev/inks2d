import fs from "fs";

const libImports = `
import "./collision";
import "./effects/particles";
import "./effects/sfx";
import "./effects/tweens";
import "./effects/utils";
import "./extras";
import "./geom";
import "./graphics";
import "./group";
import "./inputs";
import "./math";
import "./text";
import "./tiles/";
import "./utils";
`;

fs.appendFileSync("./dist/index.d.ts", libImports);
console.log("Done!");
