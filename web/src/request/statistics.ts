/*
 * @Author: Quarter
 * @Date: 2024-01-26 10:59:28
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-27 19:49:06
 * @FilePath: /anylink/web/src/request/statsinfo.ts
 * @Description: 统计分析相关
 */

import { request } from "@/plugins";
import {
  OnlineStatisticsItem,
  PercentageStatisticsItem,
  StatisticsCount,
  TrafficStatisticsItem,
} from "@/types";

// 时间范围选项
export type TimeScopeOption = "rt" | "1h" | "24h" | "7d";

/**
 * @description: 获取统计计数信息
 * @returns {Promise<Object>}
 */
export const queryStatistics = (): Promise<{ counts: StatisticsCount }> =>
  request.get<{ counts: StatisticsCount }>("/set/home");

/**
 * @description: 获取在线数图表信息
 * @returns {Promise<Object>}
 */
export const queryOnlineChartData = (
  scope: TimeScopeOption,
): Promise<{ datas: OnlineStatisticsItem[] }> =>
  request.get<{ datas: OnlineStatisticsItem[] }>("/statsinfo/list", {
    action: "online",
    scope,
  });

/**
 * @description: 获取流量图表信息
 * @returns {Promise<Object>}
 */
export const queryTrafficChartData = (
  scope: TimeScopeOption,
): Promise<{ datas: TrafficStatisticsItem[] }> =>
  request.get<{ datas: TrafficStatisticsItem[] }>("/statsinfo/list", {
    action: "network",
    scope,
  });

/**
 * @description: 获取 CPU 图表信息
 * @returns {Promise<Object>}
 */
export const queryCPUChartData = (
  scope: TimeScopeOption,
): Promise<{ datas: PercentageStatisticsItem[] }> =>
  request.get<{ datas: PercentageStatisticsItem[] }>("/statsinfo/list", {
    action: "cpu",
    scope,
  });

/**
 * @description: 获取内存图表信息
 * @returns {Promise<Object>}
 */
export const queryRAMChartData = (
  scope: TimeScopeOption,
): Promise<{ datas: PercentageStatisticsItem[] }> =>
  request.get<{ datas: PercentageStatisticsItem[] }>("/statsinfo/list", {
    action: "mem",
    scope,
  });
