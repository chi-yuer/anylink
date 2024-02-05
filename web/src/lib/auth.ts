/*
 * @Author: Quarter
 * @Date: 2024-01-26 15:06:42
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-01 13:42:05
 * @FilePath: /anylink/web/src/lib/auth.ts
 * @Description: 授权相关
 */

import { router, userStore } from "@/plugins";

// 是否登录
let isLogin = true;

/**
 * @description: 获取 JWT 凭据
 * @returns {string}
 */
export const getJWT = (): string | undefined => {
  const user = userStore();
  const jwt = user.jwt;
  if (typeof jwt === "string") {
    return jwt;
  }

  return undefined;
};

/**
 * @description: 获取登录用户名
 * @returns {string}
 */
export const getUsername = (): string | undefined => {
  const user = userStore();
  const username = user.username;
  if (typeof username === "string") {
    return username;
  }

  return undefined;
};

/**
 * @description: 清空用户信息
 * @returns {string}
 */
export const clear = (): void => {
  const user = userStore();
  user.updateUsername();
  user.updateJWT();
};

/**
 * @description: 请求登录
 * @returns
 */
export const requestLogin = (): void => {
  if (isLogin) {
    isLogin = false;
    clear();
    router.push({ path: "/login" });
  }
};

/**
 * @description: 登录
 * @param {Object} params 参数
 * @param {string} params.username 用户名
 * @param {string} params.token token
 * @returns
 */
export const login = ({ username, token }: { username: string; token: string }): void => {
  isLogin = true;
  const user = userStore();
  if (typeof username === "string") {
    user.updateUsername(username);
  }
  if (typeof token === "string") {
    user.updateJWT(token);
  }
};
