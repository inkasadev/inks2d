import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { directoryPlugin } from "vite-plugin-list-directory-contents";

const _dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",

  server: {
    port: 3000,
  },

  plugins: [directoryPlugin({ baseDir: __dirname })],
});
