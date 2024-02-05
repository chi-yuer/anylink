/*
 * @Author: Quarter
 * @Date: 2024-01-26 10:27:29
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-05 17:05:58
 * @FilePath: /anylink/web/src/plugins/router.ts
 * @Description: vue-router 插件配置
 */

import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  { path: "/login", component: () => import("@/pages/login.vue") },
  {
    path: "/admin",
    component: () => import("@/layout/admin-layout.vue"),
    redirect: { path: "/admin/dashboard" },
    children: [
      // 仪表盘
      { path: "dashboard", component: () => import("@/pages/dashboard/dashboard.vue") },
      // 用户管理
      { path: "user", redirect: { path: "/admin/user/account" } },
      { path: "user/account", component: () => import("@/pages/user/account-list.vue") },
      { path: "user/policy", component: () => import("@/pages/user/account-policy.vue") },
      { path: "user/online", component: () => import("@/pages/user/online-user.vue") },
      { path: "user/ip", component: () => import("@/pages/user/ip-map.vue") },
      // 群组管理
      { path: "group", redirect: { path: "/admin/group/manage" } },
      { path: "group/manage", component: () => import("@/pages/group/group-list.vue") },
      // 系统配置
      { path: "system", redirect: { path: "/admin/system/status" } },
      { path: "system/status", component: () => import("@/pages/system/system-status.vue") },
      { path: "system/config", component: () => import("@/pages/system/system-config.vue") },
      { path: "system/log", component: () => import("@/pages/system/log-audit.vue") },
    ],
  },
  { path: "/:catchAll(.*)", redirect: { path: "/admin" } },
];

export const router = createRouter({
  history: createWebHistory(__APP__.base),
  routes,
});
