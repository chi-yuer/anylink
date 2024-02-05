/*
 * @Author: Quarter
 * @Date: 2024-01-29 09:35:26
 * @LastEditors: Quarter
 * @LastEditTime: 2024-01-29 09:37:23
 * @FilePath: /anylink/web/src/lib/date.ts
 * @Description: 日期相关
 */

import { toFilled } from "./number";

/**
 * @description: 日期格式化
 * @param {Date|string|number} date 日期
 * @param {string} formator 格式化标准字符串
 * @return {string}
 */
export const formate = (date: Date | string | number, formator = "yyyy-MM-dd hh:mm:ss"): string => {
  const d = date instanceof Date ? date : new Date(date);
  const o: { [key: string]: number } = {
    "y+": d.getFullYear(), // 年份
    "M+": d.getMonth() + 1, // 月份
    "d+": d.getDate(), // 日
    "h+": d.getHours(), // 小时
    "m+": d.getMinutes(), // 分
    "s+": d.getSeconds(), // 秒
    "q+": Math.floor((d.getMonth() + 3) / 3), // 季度
    "S+": d.getMilliseconds(), // 毫秒
  };
  let result = formator;
  Object.keys(o).forEach((reg) => {
    result = result.replace(new RegExp(`(${reg})`, "g"), (match) => {
      if (reg === "y+") {
        const str = toFilled(o[reg], match.length);
        return str.substring(str.length - match.length);
      }
      return toFilled(o[reg], match.length);
    });
  });

  return result;
};
