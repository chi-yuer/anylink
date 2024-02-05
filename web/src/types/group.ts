/*
 * @Author: Quarter
 * @Date: 2024-01-29 16:07:55
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-05 13:53:12
 * @FilePath: /anylink/web/src/types/group.ts
 * @Description: 权限组相关
 */

import { ACLConfig, RouteConfig } from "./common";

// Radius 配置
export interface GroupRadiusConfig {
  addr: string; // 连接地址
  secret: string; // 连接密钥
}

// LDAP 配置
export interface GroupLDAPConfig {
  addr: string; // 连接地址
  tls: boolean; // 是否使用 tls 连接
  bind_name: string; // 管理员 DN
  bind_pwd: string; // 管理员密码
  base_dn: string; // Base DN
  object_class: string; // 用户对象类
  search_attr: string; // 用户唯一ID
  member_of: string; // 受限用户组
}

// 权限组认证配置
export type GroupAuthConfig = {
  type: "local" | "radius" | "ldap"; // 认证方式
  radius?: GroupRadiusConfig; // Radius 配置
  ldap?: GroupLDAPConfig; // LDAP 配置
};

// 权限组信息
export interface GroupInfo {
  allow_lan: boolean; // 是否允许本地网络连接
  auth: GroupAuthConfig; // 认证配置
  bandwidth: number; // 带宽
  client_dns: RouteConfig[]; // 客户端 DNS
  created_at: string; // 创建时间
  ds_exclude_domains: string; // 排除域名
  ds_include_domains: string; // 包含域名列表
  id: number; // 唯一标识
  link_acl: ACLConfig[]; // 访问控制列表
  name: string; // 权限组名称
  note: string; // 备注
  route_exclude: RouteConfig[]; // 排除路由
  route_include: RouteConfig[]; // 包含路由
  status: 0 | 1; // 权限组状态
  updated_at: string; // 更新时间
}

// 权限组列表项
export interface GroupRecord extends GroupInfo {}

// 权限组创建信息
export interface GroupCreateInfo
  extends Omit<GroupInfo, "auth" | "id" | "created_at" | "updated_at"> {
  auth: {
    type: "local" | "radius" | "ldap"; // 认证方式
    radius: GroupRadiusConfig; // Radius 配置
    ldap: GroupLDAPConfig; // LDAP 配置
  }; // 认证
}

// 权限组编辑信息
export interface GroupEditInfo extends Omit<GroupInfo, "auth" | "created_at" | "updated_at"> {
  auth: {
    type: "local" | "radius" | "ldap"; // 认证方式
    radius: GroupRadiusConfig; // Radius 配置
    ldap: GroupLDAPConfig; // LDAP 配置
  }; // 认证
}
