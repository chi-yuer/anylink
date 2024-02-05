/*
 * @Author: Quarter
 * @Date: 2024-01-26 09:42:54
 * @LastEditors: Quarter
 * @LastEditTime: 2024-01-26 11:23:43
 * @FilePath: /anylink/web/src/main.ts
 * @Description: 程序主入口
 */

import { createApp } from "vue";
import TDesign from "tdesign-vue-next";
import "tdesign-vue-next/es/style/index.css";
import { pinia, router } from "./plugins";
import App from "./app.vue";
import "./style";

const app = createApp(App);

app.use(TDesign);
app.use(pinia);
app.use(router);
app.mount("#app");
