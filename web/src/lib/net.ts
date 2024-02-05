/*
 * @Author: Quarter
 * @Date: 2024-02-01 15:49:05
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-05 10:49:43
 * @FilePath: /anylink/web/src/lib/net.ts
 * @Description: 网络相关
 */

import { trim } from "./string";

// 路由配置
export interface RouteMaskConfig {
  ip: string; // IP 地址段
  net: number; // 网络位长度
  netmask: string; // 子网掩码
}

/**
 * @description: 校验 IP 地址
 * @param {string} str IP 地址
 * @returns {Error}
 */
export const validateIPAddress = (str: string): Error | undefined => {
  if (typeof str === "string" && trim(str).length > 0) {
    if (!/^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(str)) {
      return new Error("格式错误，请参考 192.168.1.1 的格式");
    }
    const numArr = str.split(".").map((item) => parseInt(item, 10));
    for (const num of numArr) {
      if (num >= 256) {
        return new Error("格式错误，数字 ${num} 应在 0-255 之间");
      }
    }
    if (numArr[0] === 0) {
      return new Error("格式错误，首位不能为 0");
    }
    if (numArr[numArr.length - 1] === 0) {
      return new Error("格式错误，末尾不能为 0");
    }
  }
};

/**
 * @description: 校验路由配置
 * @param {string} str 路由配置
 * @returns {Error}
 */
export const validateCIDR = (str: string): Error | undefined => {
  if (typeof str === "string" && trim(str).length > 0) {
    // 是否是全部
    if (str === "all") {
      return;
    }
    // 格式校验
    if (
      !/^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)\/([12]?\d|3[0-2])$/.test(
        str,
      )
    ) {
      return new Error("格式错误，请参考 192.168.1.0/24 的格式");
    }
    // 主机地址校验
    const numArr = str
      .replace(/\/[0-9]{1,2}$/g, "")
      .split(".")
      .map((str) => parseInt(str, 10));
    for (const num of numArr) {
      if (num >= 256) {
        return new Error("格式错误，数字 ${num} 应在 0-255 之间");
      }
    }
    // 网络地址校验
    const mask = parseInt(str.replace(/^[^/]+\//g, ""), 10);
    if (Number.isNaN(mask) || mask < 0 || mask > 32) {
      return new Error("格式错误，网络标记位 ${mask} 应在 0-32 之间");
    }
  }
};

/**
 * @description: 验证域名
 * @param {string} str 域名
 * @returns {Error}
 */
export const validateDomain = (str: string): Error | undefined => {
  if (typeof str === "string" && trim(str).length > 0) {
    if (!/^([a-z0-9\u4e00-\u9fa5\-]+\.)+[a-z\u4e00-\u9fa5]{2,}$/.test(str.toLocaleLowerCase())) {
      return new Error("格式错误，请参考 baike.baidu.com,sina.cn 的格式");
    }
  }
};

/**
 * @description: 格式化路由字符串
 * @param {string} str 路由字符串
 * @returns {RouteMaskConfig}
 */
export const parseRoute = (str: string): RouteMaskConfig => {
  const err = validateCIDR(str);
  if (err === undefined && str !== "all") {
    // 网络位数
    const net = parseInt(str.replace(/^[^/]+\//g, ""), 10);
    // 校准网络地址
    let numArr = str
      .replace(/\/[0-9]+$/g, "")
      .split(".")
      .map((str) => parseInt(str, 10).toString(2).split(""))
      .map((arr) => [...new Array(8 - arr.length).fill("0"), ...arr])
      .flat()
      .slice(0, net);
    numArr = [...numArr, ...new Array(32 - numArr.length).fill("0")];
    const ip = new Array(4)
      .fill(0)
      .map((_, index) => parseInt(numArr.slice(index * 8, (index + 1) * 8).join(""), 2))
      .join(".");
    // 计算子网掩码
    const maskArr = [...new Array(net).fill(1), ...new Array(32 - net).fill(0)];
    const netmask = new Array(4)
      .fill(0)
      .map((_, index) => parseInt(maskArr.slice(index * 8, (index + 1) * 8).join(""), 2))
      .join(".");

    return {
      ip,
      net,
      netmask,
    };
  }
  return {
    ip: "0.0.0.0",
    net: 0,
    netmask: "0.0.0.0",
  };
};
