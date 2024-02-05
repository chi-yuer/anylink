/*
 * @Author: Quarter
 * @Date: 2024-02-01 16:34:52
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-01 16:34:54
 * @FilePath: /anylink/web/src/lib/string.ts
 * @Description: 字符串相关
 */

/**
 * @description: 去除字符串前后空白
 * @param {string} str 字符串
 * @returns {string}
 */
export const trim = (str: string): string => {
  if (typeof str === "string") {
    return str.replace(/^[\s\t\n]+/g, "").replace(/[\s\t\n]+$/g, "");
  }
  return str;
};

/**
 * @description: 去除字符串中所有空白
 * @param {string} str 字符串
 * @returns {string}
 */
export const clean = (str: string): string => {
  if (typeof str === "string") {
    return str.replace(/[\s\t\n]+/g, "");
  }
  return str;
};
