/*
 * @Author: Quarter
 * @Date: 2024-02-19 13:51:24
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-20 15:27:00
 * @FilePath: /anylink/web/src/data/system.ts
 * @Description: 系统配置相关
 */

import {
  ApplicationInfo,
  AuditConfig,
  CPUInfo,
  MailConfig,
  OtherConfig,
  RAMInfo,
  ROMInfo,
  SSLALiYunConfig,
  SSLApplyConfig,
  SSLCloudflareConfig,
  SSLCustomConfig,
  SSLTencentCloudConfig,
  SystemInfo,
} from "@/types";

// CPU 信息
export const CPU_INFO: CPUInfo = {
  core: 0, // CPU 核心数
  ghz: "0 GHz", // CPU 频率
  modelName: "", // CPU 型号
  percent: 0, // CPU 占用百分比
};

// ROM 信息
export const ROM_INFO: ROMInfo = {
  free: "0MB", // 剩余空间
  percent: 0, // 占用百分比
  total: "0MB", // 总空间
};

// RAM 信息
export const RAM_INFO: RAMInfo = {
  free: "0MB", // 剩余空间
  percent: 0, // 占用百分比
  total: "0MB", // 总空间
};

// 应用信息
export const APPLICATION_INFO: ApplicationInfo = {
  appCommitId: "", // 应用提交办办
  appVersion: "", // 应用版本
  goArch: "", // Go 架构
  goOs: "", // Go 操作系统
  goVersion: "", // Go 版本
  goroutine: 0, // Go 事务数量
  hostname: "", // 主机名
  kernel: "", // 内核
  load: "", // 负载
  platform: "", // 运行平台
};

// 系统信息
export const SYSTEM_INFO: SystemInfo = {
  cpu: CPU_INFO, // CPU 信息
  disk: ROM_INFO, // 硬盘信息
  mem: RAM_INFO, // 内存信息
  sys: APPLICATION_INFO, // 应用信息
};

// 邮件配置
export const MAIL_CONFIG: MailConfig = {
  encryption: "None", // 加密类型
  from: "", // 来源地址
  host: "", // 主机地址
  password: "", // 密码
  port: 25, // 端口号
  username: "", // 用户名
};

// 审计配置
export const AUDIT_CONFIG: AuditConfig = {
  audit_interval: -1, // 审计去重间隔
  clear_time: "00:00", // 清理时间
  life_day: 0, // 存储时间
};

// SSL 自定义配置
export const SSL_CUSTOM_CONFIG: SSLCustomConfig = {
  cert: null, // SSL 证书文件
  key: null, // SSL 私钥文件
};

// SSL 阿里云初始配置
export const SSL_ALI_YUN_CONFIG: SSLALiYunConfig = {
  apiKey: "", // APIKey
  secretKey: "", // SecretKey
};

// SSL Cloudflare 初始配置
export const SSL_CLOUDFLARE_CONFIG: SSLCloudflareConfig = {
  authToken: "", // 认证 token
};

// SSL 腾讯云初始配置
export const SSL_TENCENT_CLOUD_CONFIG: SSLTencentCloudConfig = {
  secretId: "", // Secret ID
  secretKey: "", // Secret Key
};

// Let's Encrypt 证书初始配置
export const SSL_APPLY_CONFIG: SSLApplyConfig = {
  aliyun: SSL_ALI_YUN_CONFIG, // 阿里云配置
  cfcloud: SSL_CLOUDFLARE_CONFIG, // Cloudflare 配置
  domain: "", // 域名配置
  legomail: "", // 申请邮箱
  name: "", // 域名提供商
  renew: false, // 是否自动续期
  txcloud: SSL_TENCENT_CLOUD_CONFIG, // 腾讯云配置
};

// 其它配置
export const OTHER_CONFIG: OtherConfig = {
  account_mail: "", // 账号邮件模板
  banner: "", // 横幅
  homeindex: "", // 主页内容
  link_addr: "", // 连接地址
};
