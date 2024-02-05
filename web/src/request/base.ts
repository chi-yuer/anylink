/*
 * @Author: Quarter
 * @Date: 2024-01-26 10:57:11
 * @LastEditors: Quarter
 * @LastEditTime: 2024-01-27 16:30:46
 * @FilePath: /anylink/web/src/request/base.ts
 * @Description: 系统相关
 */

import { request } from "@/plugins";
import qs from "qs";

// 管理员账户
export interface AdminAccount {
  admin_user: string; // 用户名
  admin_pass: string; // 管理员密码
}

// 管理员登录结果
export interface AdminLoginData {
  admin_user: string; // 用户名
  expires_at: string; // 过期时间
  token: string; // JWT 凭据
}

/**
 * @description: 登录
 * @param {AdminAccount} account 管理员账户
 * @returns {Promise<AdminLoginData>}
 */
export const login = (account: AdminAccount): Promise<AdminLoginData> =>
  request.post<AdminLoginData>("/base/login", qs.stringify(account));
