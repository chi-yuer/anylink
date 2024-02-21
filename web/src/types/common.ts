/*
 * @Author: Quarter
 * @Date: 2024-01-27 15:57:34
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-05 09:24:48
 * @FilePath: /anylink/web/src/types/common.ts
 * @Description: 通用类型声明
 */

// 分页数据
export type PaginationData<T, T2 = {}> = {
  count: number; // 总数
  page_size: number; // 分页大小
  datas: T[]; // 数据列表
} & T2;

export type PaginationParam<T> = {
  pageNo: number; // 页码
} & T;

// 路由配置
export interface RouteConfig {
  val: string; // 路由值
  ip_mask: string; // IP和掩码值
  note: string; // 备注
}

// 访问控制配置
export interface ACLConfig {
  action: "allow" | "deny"; // 行为
  note: string; // 备注
  port: number; // 端口号
  val: string; // 值
}

// 菜单项配置
export interface MenuItemConfig {
  icon?: string; // 图标
  title: string; // 菜单名称
  path: string; // 路径
  children?: MenuItemConfig[]; // 子菜单配置
}
