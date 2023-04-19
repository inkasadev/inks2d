import fs from "fs";

fs.rmSync(".readme", { recursive: true, force: true });
fs.rmSync("README.md", { recursive: true, force: true });
