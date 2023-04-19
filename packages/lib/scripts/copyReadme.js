import fs from "fs";
import fse from "fs-extra";

fse.copySync("../../.readme", ".readme", { overwrite: true });
fs.copyFile("../../README.md", "README.md", (err) => {
	if (err) throw err;
	console.log("Root README.md copied!");
});
