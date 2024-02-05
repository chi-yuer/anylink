/*
 * @Author: Quarter
 * @Date: 2024-01-29 16:32:00
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-01 19:06:45
 * @FilePath: /anylink/web/src/data/user.ts
 * @Description: 用户相关
 */

import {
  AccountCreateInfo,
  AccountPolicyCreateInfo,
  AccountPolicyInfo,
  IPMapCreateInfo,
} from "@/types";

// 账号创建初始值
export const ACCOUNT_CREATE_INFO: AccountCreateInfo = {
  disable_otp: false, // 是否禁用 otp
  email: "", // 邮箱地址
  groups: [], // 所在分组
  limittime: null, // 过期时间
  nickname: "", // 昵称
  otp_secret: null, // OTP 密钥
  pin_code: "", // PIN 码
  send_email: true, // 是否发送邮件
  status: 1, // 账号状态
  username: "", // 用户名
};

// 账号策略初始值
export const ACCOUNT_POLICY_INFO: AccountPolicyInfo = {
  allow_lan: true, // 是否允许本地网络连接
  client_dns: [{ val: "223.5.5.5", ip_mask: "", note: "阿里公共DNS" }], // 客户端 DNS
  created_at: "2000-01-01T00:00:00Z", // 创建时间
  ds_exclude_domains: "", // 排除域名列表
  ds_include_domains: "", // 包含域名列表
  id: 0,
  route_exclude: [], // 排除路由列表
  route_include: [{ val: "all", ip_mask: "", note: "全部路由" }], // 包含路由列表
  status: 1, // 状态
  updated_at: "2000-01-01T00:00:00Z", // 更新时间
  username: "", // 用户名
};

// 账号策略初始值
export const ACCOUNT_POLICY_CREATE_INFO: AccountPolicyCreateInfo = {
  allow_lan: true, // 是否允许本地网络连接
  client_dns: [{ val: "223.5.5.5", ip_mask: "", note: "阿里公共DNS" }], // 客户端 DNS
  ds_exclude_domains: "", // 排除域名列表
  ds_include_domains: "", // 包含域名列表
  route_exclude: [], // 排除路由列表
  route_include: [{ val: "all", ip_mask: "", note: "全部路由" }], // 包含路由列表
  status: 1, // 状态
  username: "", // 用户名
};

// IP 映射关系创建初始值
export const IP_MAP_CREATE_INFO: IPMapCreateInfo = {
  ip_addr: "", // IP 地址
  keep: false, // IP 保留
  mac_addr: "", // MAC 地址
  note: "", // 备注
  username: "", // 用户名
};
