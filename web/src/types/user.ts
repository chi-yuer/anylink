/*
 * @Author: Quarter
 * @Date: 2024-01-27 16:01:45
 * @LastEditors: Quarter
 * @LastEditTime: 2024-01-31 17:20:22
 * @FilePath: /anylink/web/src/types/user.ts
 * @Description: 用户相关
 */

import { RouteConfig } from "./common";

// 账号信息
export interface AccountInfo {
  disable_otp: boolean; // 是否禁用 otp
  email: string; // 邮箱地址
  groups: string[]; // 所在分组
  id: number; // 唯一识别码
  limittime: string | null; // 过期时间
  nickname: string; // 昵称
  otp_secret: string | null; // OTP 密钥
  pin_code: string | null; // PIN 码
  send_email: boolean; // 是否发送邮件
  status: 0 | 1 | 2; // 账号状态
  username: string; // 用户名
  created_at: string; // 创建时间
  updated_at: string; // 更新时间
}

// 账号列表项
export interface AccountRecord extends Omit<AccountInfo, "limittime"> {}

// 账号创建信息
export interface AccountCreateInfo extends Omit<AccountInfo, "id" | "created_at" | "updated_at"> {}

// 账号编辑信息
export interface AccountEditInfo extends Omit<AccountInfo, "created_at" | "updated_at"> {}

// 用户策略信息
export interface AccountPolicyInfo {
  allow_lan: boolean; // 是否允许本地网络连接
  client_dns: RouteConfig[]; // 客户端 DNS
  created_at: string; // 创建时间
  ds_exclude_domains: string; // 排除域名列表
  ds_include_domains: string; // 包含域名列表
  id: number; // 唯一识别码
  route_exclude: RouteConfig[]; // 排除路由列表
  route_include: RouteConfig[]; // 包含路由列表
  status: 0 | 1; // 状态
  updated_at: string; // 更新时间
  username: string; // 用户名
}

// 用户策略列表项
export interface AccountPolicyRecord extends AccountPolicyInfo {}

// 用户策略创建表单
export interface AccountPolicyCreateInfo
  extends Omit<AccountPolicyInfo, "id" | "created_at" | "updated_at"> {}

// 用户策略编辑表单
export interface AccountPolicyEditInfo
  extends Omit<AccountPolicyInfo, "created_at" | "updated_at"> {}

// 账号在线记录
export interface AccountOnlineRecord {
  bandwidth_down: string; // 下行速率
  bandwidth_down_all: string; // 下行总量
  bandwidth_up: string; // 上行速率
  bandwidth_up_all: string; // 上行总量
  client: "pc"; // 客户端类型
  group: string; // 登录权限组
  ip: string; // 分配 IP 地址
  last_login: string; // 上次登录时间
  mac_addr: string; // MAC 地址
  mtu: number; // MTU 值
  remote_addr: string; // 远端地址
  token: string; // 认证凭据
  tun_name: string; // 虚拟网卡名称
  unique_mac: boolean; // 是否唯一 MAC 值
  username: string; // 用户名
}

// IP 映射关系信息
export interface IPMapInfo {
  id: number; // 唯一识别码
  ip_addr: string; // IP 地址
  keep: boolean; // IP 保留
  keep_time: string; // 保留时间
  last_login: string; // 最近登录时间
  mac_addr: string; // MAC 地址
  note: string; // 备注
  unique_mac: boolean; // 是否唯一 MAC 值
  updated_at: string; // 更新时间
  username: string; // 用户名
}

// IP 映射关系列表项
export interface IPMapRecord extends IPMapInfo {}

// IP 映射关系创建表单
export interface IPMapCreateInfo
  extends Omit<IPMapInfo, "id" | "keep_time" | "last_login" | "unique_mac" | "updated_at"> {}

// IP 映射关系编辑表单
export interface IPMapEditInfo
  extends Omit<IPMapInfo, "keep_time" | "last_login" | "unique_mac" | "updated_at"> {}
