/*
 * @Author: Quarter
 * @Date: 2024-01-26 09:43:08
 * @LastEditors: Quarter
 * @LastEditTime: 2024-08-02 10:49:03
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
  base: "/",
  define: {
    __APP__: {
      base: "/",
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
        // target: "http://localhost:8800",
        target: "https://anyconnect-local.lesdev.cn",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
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
