/*
 * @Author: Quarter
 * @Date: 2024-02-27 19:34:10
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-27 19:37:55
 * @FilePath: /anylink/web/src/types/statsinfo.ts
 * @Description: 统计相关
 */

// 统计计数
export interface StatisticsCount {
  group: number; // 权限组数量
  ip_map: number; // IP 映射数量
  online: number; // 在线用户数量
  user: number; // 用户数量
}

// 在线数统计记录项
export interface OnlineStatisticsItem {
  created_at: string; // 创建时间
  id: number; // 标识
  num: number; // 数量
  num_groups: string; //
}

// 流量统计记录项
export interface TrafficStatisticsItem {
  created_at: string; // 创建时间
  down: number; // 下行
  down_groups: string; // 下行组
  id: number; // 标识
  up: number; // 上行
  up_groups: string; // 上行组
}

// 百分比统计记录项
export interface PercentageStatisticsItem {
  created_at: string; // 创建时间
  id: number; // 标识
  percent: number; // 占比
}
