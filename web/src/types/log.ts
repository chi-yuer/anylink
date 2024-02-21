/*
 * @Author: Quarter
 * @Date: 2024-02-21 10:00:35
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-21 11:32:21
 * @FilePath: /anylink/web/src/types/log.ts
 * @Description: 日志相关
 */

// 活动类型选项
export interface ActionTypeOption {
  key: number; // 健
  tag: string; // 标签类型
  value: string; // 值
}

// 用户活动日志
export interface ActionLogRecord {
  client: number; // 客户端类型
  created_at: string; // 创建时间
  device_type: string; // 设备类型
  group_name: string; // 权限组
  id: number; // 唯一识别码
  info: string; // 详情
  ip_addr: string; // IP 地址
  os: number; // 操作系统
  platform_version: string; // 平台版本
  remote_addr: string; // 远端地址
  status: number; // 操作类型
  username: string; // 用户名
  version: string; // 客户端版本
}

// 用户访问日志
export interface AccessLogRecord {
  access_proto: number; // 访问协议
  created_at: string; // 访问时间
  dst: string; // 访问地址
  dst_port: number; // 访问端口
  id: number; // 唯一识别码
  info: string; // 备注
  protocol: number; // 协议
  src: string; // 源地址
  src_port: number; // 源端口
  username: string; // 用户名
}
