import fse from "fs-extra";

fse.copySync("../../.readme", "docs/.readme", { overwrite: true });
