import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const _dirname =
	typeof __dirname !== "undefined"
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	server: {
		port: 3000,
	},

	build: {
		outDir: "dist/",
		emptyOutDir: true,
	},

	plugins: [],
});
