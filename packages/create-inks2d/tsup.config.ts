import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["cjs"],
	dts: true,
	minify: true,
	sourcemap: true,
	treeshake: true,
	clean: true,
});
