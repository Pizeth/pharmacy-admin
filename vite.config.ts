import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import Terminal from "vite-plugin-terminal";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Terminal({
    //   console: "terminal",
    //   output: ["terminal", "console"],
    // }),
  ],
  server: {
    host: true,
    port: 8080,
  },
  build: {
    target: "es2022",
  },
  esbuild: {
    supported: {
      "top-level-await": true,
    },
    target: "es2022",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022",
    },
  },
  base: "./",
});

// export default defineConfig({
//   plugins: [Terminal({
//     console: 'terminal',
//     output: ['terminal', 'console']
//   })],
// });
