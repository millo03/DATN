import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
  // ...vite configures
  server: {
    port: 2024,
  },
  plugins: [
    ...VitePluginNode({
      adapter: "express",
      appPath: "./src/app.js",
      exportName: "viteNodeApp",
      initAppOnBoot: false,
      tsCompiler: "esbuild",
      swcOptions: {},
    }),
  ],
  optimizeDeps: {},
});
