/*
 * @Author: Quarter
 * @Date: 2024-01-26 09:43:08
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-05 17:18:45
 * @FilePath: /anylink/web/vite.config.ts
 * @Description: vite 配置
 */

import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vite";
import Package from "./package.json";
import autoprefixer from "autoprefixer";

// 文档: https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, "."),
  base: "/ui/",
  define: {
    __APP__: {
      base: "/ui/",
      version: Package.version,
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: [
            "Android >= 4",
            "IOS >= 9",
            "IE >= 11",
            "Firefox >= 56",
            "Chrome >= 49",
            "Safari >= 9",
          ],
          flexbox: "no-2009",
        }),
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 8080,
    host: "0.0.0.0",
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:8800",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "ui",
    emptyOutDir: true,
    target: "es2015",
  },
  plugins: [vue()],
});
