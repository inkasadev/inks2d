import { defineConfig } from "tsup";

export default defineConfig({
	entry: [
		"src/index.ts",
		"src/collision/index.ts",
		"src/effects/particles/index.ts",
		"src/effects/sfx/index.ts",
		"src/effects/tweens/index.ts",
		"src/effects/utils/index.ts",
		"src/extras/index.ts",
		"src/geom/index.ts",
		"src/graphics/index.ts",
		"src/group/index.ts",
		"src/inputs/index.ts",
		"src/math/index.ts",
		"src/text/index.ts",
		"src/tiles/index.ts",
		"src/utils/index.ts",
	],
	format: ["esm"],
	dts: true,
	minify: true,
	sourcemap: true,
	treeshake: true,
	clean: true,
});
