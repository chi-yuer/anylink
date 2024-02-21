/*
 * @Author: Quarter
 * @Date: 2024-02-21 10:48:38
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-21 10:51:04
 * @FilePath: /anylink/web/src/data/log.ts
 * @Description: 日志相关
 */

import { AccessLogListParam, ActionLogListParam } from "@/request/log";

// 活动日志列表参数
export const ACTION_LOG_LIST_PARAM: ActionLogListParam = {
  username: "", // 用户名
  sdate: "", // 开始时间
  edate: "", // 结束时间
  status: "", // 操作类型
  os: "", // 操作系统
  sort: 1, // 排序
};

// 访问日志列表参数
export const ACCESS_LOG_LIST_PARAM: AccessLogListParam = {
  username: "", // 用户名
  src: "", // 源地址
  dst: "", // 目的地址
  dst_port: "", // 目的端口
  access_proto: "", // 访问协议
  info: "", // 详情
  date: ["", ""], // 日期范围
  sort: 1, // 排序
};
