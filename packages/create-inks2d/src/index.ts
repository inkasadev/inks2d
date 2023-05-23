/**
 * Deeply based by create-vite project.
 * link: https://github.com/vitejs/vite/tree/main/packages/create-vite
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import spawn from "cross-spawn";
import minimist from "minimist";
import prompts from "prompts";
import { red, reset } from "kolorist";
import { Platform } from "types";
import PLATFORMS from "platforms";
import TEMPLATES from "templates";

const _dirname =
	typeof __dirname !== "undefined"
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));

/** Avoids autoconversion to number of the project name by
 *  defining that the args non associated with an option ( _ )
 *  needs to be parsed as a string.
 */
const argv = minimist<{
	t?: string;
	template?: string;
}>(process.argv.slice(2), { string: ["_"] });

const cwd = process.cwd();
const defaultTargetDir = "inks2d-project";
const renameFiles: Record<string, string | undefined> = {
	_gitignore: ".gitignore",
};

const init = async () => {
	const argTargetDir = formatTargetDir(argv._[0]);
	const argTemplate = argv.template || argv.t;
	let targetDir = argTargetDir || defaultTargetDir;
	let result: prompts.Answers<
		"projectName" | "overwrite" | "packageName" | "platform" | "variant"
	>;

	const getProjectName = () =>
		targetDir === "." ? path.basename(path.resolve()) : targetDir;

	try {
		result = await prompts(
			[
				{
					type: argTargetDir ? null : "text",
					name: "projectName",
					message: reset("Project name:"),
					initial: defaultTargetDir,
					onState: (state) => {
						targetDir = formatTargetDir(state.value) || defaultTargetDir;
					},
				},
				{
					type: () =>
						!fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
					name: "overwrite",
					message: () =>
						(targetDir === "."
							? "Current directory"
							: `Target directory "${targetDir}"`) +
						` is not empty. Remove existing files and continue?`,
				},
				{
					type: (_, { overwrite }: { overwrite?: boolean }) => {
						if (overwrite === false) {
							throw new Error(red("✖") + " Operation cancelled");
						}
						return null;
					},
					name: "overwriteChecker",
				},
				{
					type: () => (isValidPackageName(getProjectName()) ? null : "text"),
					name: "packageName",
					message: reset("Package name:"),
					initial: () => toValidPackageName(getProjectName()),
					validate: (dir) =>
						isValidPackageName(dir) || "Invalid package.json name",
				},
				{
					type:
						argTemplate && TEMPLATES.includes(argTemplate) ? null : "select",
					name: "platform",
					message:
						typeof argTemplate === "string" && !TEMPLATES.includes(argTemplate)
							? reset(
									`"${argTemplate}" isn't a valid template. Please choose from below: `,
							  )
							: reset("Select a template:"),
					initial: 0,
					choices: PLATFORMS.map((platform) => {
						const platformColor = platform.color;
						return {
							title: platformColor(platform.display || platform.name),
							value: platform,
						};
					}),
				},
				{
					type: (platform: Platform) =>
						platform && platform.variants ? "select" : null,
					name: "variant",
					message: reset("Select a variant:"),
					choices: (platform: Platform) =>
						platform.variants?.map((variant) => {
							const variantColor = variant.color;
							return {
								title: variantColor(variant.display || variant.name),
								value: variant.name,
							};
						}),
				},
			],
			{
				onCancel: () => {
					throw new Error(red("✖") + " Operation cancelled");
				},
			},
		);
	} catch (error: any) {
		console.log(error.message);
		return;
	}

	// user choice associated with prompts
	const { platform, overwrite, packageName, variant } = result;
	const root = path.join(cwd, targetDir);

	if (overwrite) {
		emptyDir(root);
	} else if (!fs.existsSync(root)) {
		fs.mkdirSync(root, { recursive: true });
	}

	// determine template
	let template: string = variant || platform?.name || argTemplate;
	const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
	const pkgManager = pkgInfo ? pkgInfo.name : "npm";
	const isYarn1 = pkgManager === "yarn" && pkgInfo?.version.startsWith("1.");
	const { customCommand } =
		PLATFORMS.flatMap((f) => f.variants).find((v) => {
			if (!v) return false;
			return v.name === template;
		}) ?? {};

	if (customCommand) {
		const fullCustomCommand = customCommand
			.replace(/^npm create/, `${pkgManager} create`)
			// Only Yarn 1.x doesn't support `@version` in the `create` command;
			.replace("@latest", () => (isYarn1 ? "" : "@latest"))
			.replace(/^npm exec/, () => {
				// Prefer `pnpm dlx` or `yarn dlx`;
				if (pkgManager === "pnpm") return "pnpm dlx";
				if (pkgManager === "yarn" && !isYarn1) return "yarn dlx";

				// Use `npm exec` in all other cases,
				// including Yarn 1.x and other custom npm clients.
				return "npm exec";
			});

		const [command, ...args] = fullCustomCommand.split(" ");
		// We replace TARGET_DIR here because targetDir may include a space;
		const replacedArgs = args.map((arg) =>
			arg.replace("TARGET_DIR", targetDir),
		);
		const { status } = spawn.sync(command, replacedArgs, {
			stdio: "inherit",
		});
		process.exit(status ?? 0);
	}

	console.log(`\nScaffolding project in ${root}...`);

	const templateDir = path.resolve(_dirname, "../", `template-${template}`);

	const write = (file: string, content?: string) => {
		const targetPath = path.join(root, renameFiles[file] ?? file);

		if (content) {
			fs.writeFileSync(targetPath, content);
		} else {
			copy(path.join(templateDir, file), targetPath);
		}
	};
	const files = fs.readdirSync(templateDir);

	for (const file of files.filter((f) => f !== "package.json")) {
		write(file);
	}

	const pkg = JSON.parse(
		fs.readFileSync(path.join(templateDir, `package.json`), "utf-8"),
	);
	pkg.name = packageName || getProjectName();

	write("package.json", JSON.stringify(pkg, null, 2) + "\n");

	const cdProjectName = path.relative(cwd, root);

	console.log(`\nDone. Now run:\n`);

	if (root !== cwd) {
		console.log(
			`  cd ${
				cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName
			}`,
		);
	}

	switch (pkgManager) {
		case "yarn":
			console.log("  yarn");
			console.log("  yarn dev");
			break;
		default:
			console.log(`  ${pkgManager} install`);
			console.log(`  ${pkgManager} run dev`);
			break;
	}
	console.log();
};

const formatTargetDir = (targetDir: string | undefined) => {
	return targetDir?.trim().replace(/\/+$/g, "");
};

const isEmpty = (path: string) => {
	const files = fs.readdirSync(path);
	return files.length === 0 || (files.length === 1 && files[0] === ".git");
};

const isValidPackageName = (projectName: string) => {
	return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
		projectName,
	);
};

const toValidPackageName = (projectName: string) => {
	return projectName
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/^[._]/, "")
		.replace(/[^a-z\d\-~]+/g, "-");
};

const emptyDir = (dir: string) => {
	if (!fs.existsSync(dir)) return;

	for (const file of fs.readdirSync(dir)) {
		if (file === ".git") continue;
		fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
	}
};

const pkgFromUserAgent = (userAgent: string | undefined) => {
	if (!userAgent) return undefined;
	const pkgSpec = userAgent.split(" ")[0];
	const pkgSpecArr = pkgSpec.split("/");
	return {
		name: pkgSpecArr[0],
		version: pkgSpecArr[1],
	};
};

const copy = (src: string, dest: string) => {
	const stat = fs.statSync(src);

	if (stat.isDirectory()) {
		copyDir(src, dest);
	} else {
		fs.copyFileSync(src, dest);
	}
};

const copyDir = (srcDir: string, destDir: string) => {
	fs.mkdirSync(destDir, { recursive: true });

	for (const file of fs.readdirSync(srcDir)) {
		const srcFile = path.resolve(srcDir, file);
		const destFile = path.resolve(destDir, file);
		copy(srcFile, destFile);
	}
};

init().catch((e) => {
	console.error(e);
});
