/*
 * @Author: Quarter
 * @Date: 2024-01-26 10:20:43
 * @LastEditors: Quarter
 * @LastEditTime: 2024-01-30 09:43:10
 * @FilePath: /anylink/web/src/definition/index.ts
 * @Description: 定义
 */

// JWT 凭据键名
export const JWT_TOKEN_KEY = "AnyLink-Jwt-Token";

// 登录用户名键名
export const LOGIN_USERNAME_KEY = "AnyLink-Login-Username";

// 群组认证方式文本
export const GROUP_AUTH_LABEL = new Map<string, string>([["local", "本地认证"]]);

export const DEVICE_ICON_LABEL = new Map<string, { icon: string; label: string }>([
  ["pc", { icon: "desktop", label: "桌面端" }],
  ["mobile", { icon: "mobile", label: "移动端" }],
  ["default", { icon: "device", label: "未识别" }],
]);
