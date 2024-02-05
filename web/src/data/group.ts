/*
 * @Author: Quarter
 * @Date: 2024-02-05 09:27:25
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-05 11:16:35
 * @FilePath: /anylink/web/src/data/group.ts
 * @Description: 权限组相关
 */

import { object } from "@/lib";
import { GroupCreateInfo, GroupInfo, GroupLDAPConfig, GroupRadiusConfig } from "@/types";

// 权限组 Raidus 配置
export const GROUP_RADIUS_CONFIG: GroupRadiusConfig = {
  addr: "", // 连接地址
  secret: "", // 连接密钥
};

// 权限组 LDAP 配置
export const GROUP_LDAP_CONFIG: GroupLDAPConfig = {
  addr: "", // 连接地址
  tls: false, // 是否使用 tls 连接
  bind_name: "", // 管理员 DN
  bind_pwd: "", // 管理员密码
  base_dn: "", // Base DN
  object_class: "person", // 用户对象类
  search_attr: "sAMAccountName", // 用户唯一ID
  member_of: "", // 受限用户组
};

// 权限组初始值
export const GROUP_CREATE_INFO: GroupCreateInfo = {
  allow_lan: true, // 是否允许本地网络连接
  auth: {
    type: "local", // 认证类型
    radius: object.copy(GROUP_RADIUS_CONFIG), //  Raidus 配置
    ldap: object.copy(GROUP_LDAP_CONFIG), // 认证
  },
  bandwidth: 0, // 带宽
  client_dns: [], // 客户端 DNS
  ds_exclude_domains: "", // 排除域名
  ds_include_domains: "", // 包含域名列表
  link_acl: [], // 访问控制列表
  name: "", // 权限组名称
  note: "", // 备注
  route_exclude: [], // 排除路由
  route_include: [{ val: "all", ip_mask: "", note: "全部路由" }], // 包含路由
  status: 1, // 权限组状态
};

// 权限组初始值
export const GROUP_INFO: GroupInfo = {
  allow_lan: true, // 是否允许本地网络连接
  auth: { type: "local" }, // 认证
  bandwidth: 0, // 带宽
  client_dns: [], // 客户端 DNS
  created_at: "2000-01-01T00:00:00Z", // 创建时间
  ds_exclude_domains: "", // 排除域名
  ds_include_domains: "", // 包含域名列表
  id: 0, // 唯一标识
  link_acl: [], // 访问控制列表
  name: "", // 权限组名称
  note: "", // 备注
  route_exclude: [], // 排除路由
  route_include: [], // 包含路由
  status: 1, // 权限组状态
  updated_at: "2000-01-01T00:00:00Z", // 更新时间
};
