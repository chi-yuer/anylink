/*
 * @Author: Quarter
 * @Date: 2024-02-21 10:00:19
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-21 11:10:06
 * @FilePath: /anylink/web/src/request/log.ts
 * @Description: 日志相关
 */

import { request } from "@/plugins";
import { PaginationData, PaginationParam } from "@/types";
import { AccessLogRecord, ActionLogRecord, ActionTypeOption } from "@/types/log";

// 活动日志列表参数
export interface ActionLogListParam {
  username: string; // 用户名
  sdate: string; // 开始时间
  edate: string; // 结束时间
  status: number | string; // 操作类型
  os: number | string; // 操作系统
  sort: 1 | 2; // 排序
}

/**
 * @description: 查询用户活动日志
 * @returns {Promise<PaginationData<ActionLogRecord>>}
 */
export const queryActionLogList = (
  params: PaginationParam<ActionLogListParam>,
): Promise<
  PaginationData<
    ActionLogRecord,
    {
      clientOps: string[];
      osOps: string[];
      statusOps: ActionTypeOption[];
    }
  >
> =>
  request.get<
    PaginationData<
      ActionLogRecord,
      { clientOps: string[]; osOps: string[]; statusOps: ActionTypeOption[] }
    >
  >("/set/audit/act_log_list", {
    page: params.pageNo,
    username: params.username,
    sdate: params.sdate,
    edate: params.edate,
    status: params.status,
    os: params.os,
    sort: params.sort,
  });

// 访问日志列表参数
export interface AccessLogListParam {
  username: string; // 用户名
  src: string; // 源地址
  dst: string; // 目的地址
  dst_port: number | string; // 目的端口
  access_proto: number | string; // 访问协议
  info: string; // 详情
  date: string[]; // 日期范围
  sort: 1 | 2; // 排序
}

/**
 * @description: 查询用户访问日志
 * @returns {Promise<PaginationData<AccessLogRecord>>}
 */
export const queryAccessLogList = (
  params: PaginationParam<AccessLogListParam>,
): Promise<PaginationData<AccessLogRecord>> =>
  request.get<PaginationData<AccessLogRecord>>("/set/audit/list", {
    page: params.pageNo,
    search: JSON.stringify({
      username: params.username,
      src: params.src,
      dst: params.dst,
      dst_port: params.dst_port,
      access_proto: params.access_proto,
      info: params.info,
      date: params.date,
      sort: params.sort,
    }),
  });
