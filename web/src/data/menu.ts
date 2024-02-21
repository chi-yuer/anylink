/*
 * @Author: Quarter
 * @Date: 2024-02-21 14:37:25
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-21 15:28:15
 * @FilePath: /anylink/web/src/data/menu.ts
 * @Description: 菜单
 */

import { MenuItemConfig } from "@/types";

// 菜单定义
export const MENU_LIST: MenuItemConfig[] = [
  {
    icon: "dashboard",
    title: "仪表盘",
    path: "/admin/dashboard",
  },
  {
    icon: "user",
    title: "用户管理",
    path: "/admin/user",
    children: [
      {
        icon: "user-list",
        title: "用户管理",
        path: "/admin/user/account",
      },
      {
        icon: "verify",
        title: "用户策略",
        path: "/admin/user/policy",
      },
      {
        icon: "internet",
        title: "在线用户",
        path: "/admin/user/online",
      },
      {
        icon: "link",
        title: "IP 映射",
        path: "/admin/user/ip",
      },
    ],
  },
  {
    icon: "usergroup",
    title: "权限组管理",
    path: "/admin/group",
    children: [
      {
        icon: "tree-round-dot-vertical",
        title: "权限组配置",
        path: "/admin/group/manage",
      },
    ],
  },
  {
    icon: "coordinate-system",
    title: "系统配置",
    path: "/admin/system",
    children: [
      {
        icon: "system-application",
        title: "运行状态",
        path: "/admin/system/status",
      },
      {
        icon: "setting",
        title: "系统配置",
        path: "/admin/system/config",
      },
      {
        icon: "system-log",
        title: "日志审计",
        path: "/admin/system/log",
      },
    ],
  },
];
