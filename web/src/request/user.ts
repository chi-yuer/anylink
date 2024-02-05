/*
 * @Author: Quarter
 * @Date: 2024-01-27 15:52:25
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-01 17:21:13
 * @FilePath: /anylink/web/src/request/user.ts
 * @Description: 用户相关
 */

import { date, net } from "@/lib";
import { request } from "@/plugins";
import {
  AccountCreateInfo,
  AccountEditInfo,
  IPMapRecord,
  AccountInfo,
  AccountOnlineRecord,
  AccountRecord,
  PaginationData,
  PaginationParam,
  IPMapCreateInfo,
  IPMapEditInfo,
  IPMapInfo,
  AccountPolicyInfo,
  AccountPolicyCreateInfo,
  AccountPolicyEditInfo,
  AccountPolicyRecord,
} from "@/types";

// 获取账号列表参数
export interface QueryAccountListParam {
  keyword?: string; // 关键词
}

/**
 * @description: 获取账户列表
 * @param {QueryAccountListParam} param 参数
 * @returns {Promise<PaginationData<AccountRecord>>}
 */
export const queryAccountList = ({
  pageNo,
  keyword,
}: PaginationParam<QueryAccountListParam>): Promise<PaginationData<AccountRecord>> =>
  request.get<PaginationData<AccountRecord>>("/user/list", {
    page: pageNo,
    prefix: keyword,
  });

/**
 * @description: 获取账号信息
 * @param {number} id 账号 id
 * @returns {Promise<AccountInfo>}
 */
export const queryAccountInfo = (id: number): Promise<AccountInfo> =>
  request.get<AccountInfo>("/user/detail", {
    id,
  });

/**
 * @description: 获取账号 OTP 图片
 * @param {number} id 账号 id
 * @returns {Promise<string>}
 */
export const queryAccountOTPImage = (id: number): Promise<string> =>
  request.get<string>(
    "/user/otp_qr",
    {
      id,
      b64: 1,
    },
    undefined,
    true,
  );

/**
 * @description: 更新账号信息
 * @param {AccountCreateInfo|AccountEditInfo} account 账号信息
 * @returns
 */
export const updateAccount = (account: AccountCreateInfo | AccountEditInfo): Promise<void> =>
  request.post<void>("/user/set", {
    ...account,
    limittime: account.limittime ? date.formate(account.limittime, "yyyy-MM-ddT00:00:00Z") : null,
  });

/**
 * @description: 通过 Excel 导入账户
 * @param {File} file 文件
 * @returns {Promise<string>}
 */
export const importAccountByExcel = (file: File): Promise<string> => {
  const data = new FormData();
  data.append("file", file);
  return request.post<string>("/user/uploaduser", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * @description: 删除账号
 * @param {number} id 账号 id
 * @returns {Promise<void>}
 */
export const deleteAccount = (id: number): Promise<void> =>
  request.post<void>("/user/del", undefined, {
    params: {
      id,
    },
  });

/**
 * @description: 获取账号策略列表
 * @param {number} pageNo 分页大小
 * @returns {Promise<PaginationData<AccountPolicyRecord>>}
 */
export const queryAccountPolicyList = (
  pageNo: number,
): Promise<PaginationData<AccountPolicyRecord>> =>
  request.get<PaginationData<AccountPolicyRecord>>("/user/policy/list", {
    page: pageNo,
  });

/**
 * @description: 获取账号策略
 * @param {number} id 账号策略 id
 * @returns {Promise<AccountPolicyInfo>}
 */
export const queryAccountPolicyInfo = (id: number): Promise<AccountPolicyInfo> =>
  request.get<AccountPolicyInfo>("/user/policy/detail", {
    id,
  });

/**
 * @description: 更新账号策略
 * @param {AccountPolicyCreateInfo|AccountPolicyEditInfo} accountPolicy 账号策略系
 * @returns
 */
export const updateAccountPolicy = (
  accountPolicy: AccountPolicyCreateInfo | AccountPolicyEditInfo,
): Promise<void> =>
  request.post<void>("/user/policy/set", {
    ...accountPolicy,
    ds_exclude_domains: Array.from(
      new Set(
        accountPolicy.ds_exclude_domains
          .split(/[,，]+/g)
          .filter((domain) => !!domain)
          .map((domain) => domain.toLocaleLowerCase()),
      ),
    ).join(","),
    ds_include_domains: Array.from(
      new Set(
        accountPolicy.ds_include_domains
          .split(/[,，]+/g)
          .filter((domain) => !!domain)
          .map((domain) => domain.toLocaleLowerCase()),
      ),
    ).join(","),
    route_exclude: accountPolicy.route_exclude
      .filter(({ val }) => !!val)
      .map(({ val, note }) => {
        if (val === "all") {
          return { val, ip_mask: "", note };
        }

        const { ip, net: length, netmask } = net.parseRoute(val);

        return { val: `${ip}/${length}`, ip_mask: `${ip}/${netmask}`, note };
      }),
    route_include: accountPolicy.route_include
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
 * @description: 删除账号策略关系
 * @param {number} id 账号 id
 * @returns {Promise<void>}
 */
export const deleteAccountPolicy = (id: number): Promise<void> =>
  request.post<void>("/user/policy/del", undefined, {
    params: {
      id,
    },
  });

/**
 * @description: 查询在线账号列表
 * @returns {Promise<PaginationData<AccountOnlineRecord>>}
 */
export const queryOnlineAccountList = (): Promise<PaginationData<AccountOnlineRecord>> =>
  request.get<PaginationData<AccountOnlineRecord>>("/user/online");

/**
 * @description: 踢出账号
 * @param {string} token 认证凭据
 * @returns {Promise<void>}
 */
export const kickAccount = (token: string): Promise<void> =>
  request.post<void>("/user/offline", undefined, {
    params: {
      token,
    },
  });

/**
 * @description: 重连账号
 * @param {string} token 认证凭据
 * @returns {Promise<void>}
 */
export const reconnectAccount = (token: string): Promise<void> =>
  request.post<void>("/user/reline", undefined, {
    params: {
      token,
    },
  });

/**
 * @description: 获取 IP 映射列表
 * @param {number} pageNo 分页大小
 * @returns {Promise<PaginationData<IPMapRecord>>}
 */
export const queryIPMapList = (pageNo: number): Promise<PaginationData<IPMapRecord>> =>
  request.get<PaginationData<IPMapRecord>>("/user/ip_map/list", {
    page: pageNo,
  });

/**
 * @description: 获取 IP 映射关系信息
 * @param {number} id IP 映射关系 id
 * @returns {Promise<IPMapInfo>}
 */
export const queryIPMapInfo = (id: number): Promise<IPMapInfo> =>
  request.get<IPMapInfo>("/user/ip_map/detail", {
    id,
  });

/**
 * @description: 更新 IP 映射关系
 * @param {IPMapCreateInfo|IPMapEditInfo} ipMap IP 映射关系
 * @returns
 */
export const updateIPMap = (ipMap: IPMapCreateInfo | IPMapEditInfo): Promise<void> =>
  request.post<void>("/user/ip_map/set", {
    ...ipMap,
    mac_addr: ipMap.mac_addr.toLocaleLowerCase(),
  });

/**
 * @description: 删除 IP 映射关系
 * @param {number} id 账号 id
 * @returns {Promise<void>}
 */
export const deleteIPMap = (id: number): Promise<void> =>
  request.post<void>("/user/ip_map/del", undefined, {
    params: {
      id,
    },
  });
