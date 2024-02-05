/*
 * @Author: Quarter
 * @Date: 2024-01-26 10:58:59
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-05 16:39:50
 * @FilePath: /anylink/web/src/request/group.ts
 * @Description: 用户组相关
 */

import { net } from "@/lib";
import { request } from "@/plugins";
import {
  GroupAuthConfig,
  GroupCreateInfo,
  GroupEditInfo,
  GroupInfo,
  GroupRecord,
  PaginationData,
  PaginationParam,
} from "@/types";

/**
 * @description: 获取全部权限组列表
 * @returns {Promise<PaginationData<string>>}
 */
export const getAllGroupList = (): Promise<PaginationData<string>> =>
  request.get<PaginationData<string>>("/group/names");

/**
 * @description: 获取权限组列表
 * @param {QueryGroupListParam} param 参数
 * @returns {Promise<PaginationData<GroupRecord>>}
 */
export const queryGroupList = ({
  pageNo,
}: PaginationParam<{}>): Promise<PaginationData<GroupRecord>> =>
  request.get<PaginationData<GroupRecord>>("/group/list", {
    page: pageNo,
  });

/**
 * @description: 获取权限组信息
 * @param {number} id 权限组 id
 * @returns {Promise<GroupInfo>}
 */
export const queryGroupInfo = (id: number): Promise<GroupInfo> =>
  request.get<GroupInfo>("/group/detail", {
    id,
  });

/**
 * @description: 更新权限组信息
 * @param {GroupCreateInfo|GroupEditInfo} group 权限组信息
 * @returns
 */
export const updateGroup = (group: GroupCreateInfo | GroupEditInfo): Promise<void> =>
  request.post<void>("/group/set", {
    ...group,
    auth: {
      type: group.auth.type,
      radius: group.auth.type === "radius" ? group.auth.radius : undefined,
      ldap: group.auth.type === "ldap" ? group.auth.ldap : undefined,
    },
    ds_exclude_domains: Array.from(
      new Set(
        group.ds_exclude_domains
          .split(/[,，]+/g)
          .filter((domain) => !!domain)
          .map((domain) => domain.toLocaleLowerCase()),
      ),
    ).join(","),
    ds_include_domains: Array.from(
      new Set(
        group.ds_include_domains
          .split(/[,，]+/g)
          .filter((domain) => !!domain)
          .map((domain) => domain.toLocaleLowerCase()),
      ),
    ).join(","),
    link_acl: group.link_acl
      .filter(({ val }) => !!val)
      .map((config) => {
        const { ip, net: length } = net.parseRoute(config.val);
        return {
          ...config,
          val: `${ip}/${length}`,
        };
      }),
    route_exclude: group.route_exclude
      .filter(({ val }) => !!val)
      .map(({ val, note }) => {
        if (val === "all") {
          return { val, ip_mask: "", note };
        }

        const { ip, net: length, netmask } = net.parseRoute(val);

        return { val: `${ip}/${length}`, ip_mask: `${ip}/${netmask}`, note };
      }),
    route_include: group.route_include
      .filter(({ val }) => !!val)
      .map(({ val, note }) => {
        if (val === "all") {
          return { val, ip_mask: "", note };
        }

        const { ip, net: length, netmask } = net.parseRoute(val);

        return { val: `${ip}/${length}`, ip_mask: `${ip}/${netmask}`, note };
      }),
  });

/**
 * @description: 删除权限组
 * @param {number} id 权限组 id
 * @returns {Promise<void>}
 */
export const deleteGroup = (id: number): Promise<void> =>
  request.post<void>("/group/del", undefined, {
    params: {
      id,
    },
  });

/**
 * @description: 验证认证
 * @param {Object} account 账户信息
 * @param {string} account.username 用户名
 * @param {string} account.password 密码
 * @param {GroupAuthConfig} auth 认证配置
 * @returns {Promise<void>}
 */
export const validateAuth = (
  account: { username: string; password: string },
  auth: GroupAuthConfig,
): Promise<void> =>
  request.post("/group/auth_login", {
    name: account.username,
    pwd: account.password,
    auth: {
      type: auth.type,
      radius: auth.type === "radius" ? auth.radius : undefined,
      ldap: auth.type === "ldap" ? auth.ldap : undefined,
    },
  });
