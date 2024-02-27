/*
 * @Author: Quarter
 * @Date: 2024-02-19 11:29:13
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-27 10:25:50
 * @FilePath: /anylink/web/src/types/system.ts
 * @Description: 系统配置
 */

// CPU 信息
export interface CPUInfo {
  core: number; // CPU 核心数
  ghz: string; // CPU 频率
  modelName: string; // CPU 型号
  percent: number; // CPU 占用百分比
}

// ROM 信息
export interface ROMInfo {
  free: string; // 剩余空间
  percent: number; // 占用百分比
  total: string; // 总空间
}

// RAM 信息
export interface RAMInfo {
  free: string; // 剩余空间
  percent: number; // 占用百分比
  total: string; // 总空间
}

// 应用信息
export interface ApplicationInfo {
  appCommitId: string; // 应用提交办办
  appVersion: string; // 应用版本
  goArch: string; // Go 架构
  goOs: string; // Go 操作系统
  goVersion: string; // Go 版本
  goroutine: number; // Go 事务数量
  hostname: string; // 主机名
  kernel: string; // 内核
  load: string; // 负载
  platform: string; // 运行平台
}

// 系统信息
export interface SystemInfo {
  cpu: CPUInfo; // CPU 信息
  disk: ROMInfo; // 硬盘信息
  mem: RAMInfo; // 内存信息
  sys: ApplicationInfo; // 应用信息
}

// 基础配置记录
export interface BaseConfigRecord {
  data: string; // 配置名
  env: string; // 配置项
  info: string; // 环境变量名
  name: string; // 配置值
}

// SMTP 加密类型
export type SMTPEncryption = "None" | "SSLTLS" | "STARTTLS";

// 邮件配置
export interface MailConfig {
  encryption: SMTPEncryption; // 加密类型
  from: string; // 来源地址
  host: string; // 主机地址
  password: string; // 密码
  port: number; // 端口号
  username: string; // 用户名
}

// 审核配置
export interface AuditConfig {
  audit_interval: number; // 审计去重间隔
  clear_time: string; // 清理时间
  life_day: number; // 存储时间
}

// 自定义 SSL 配置
export interface SSLCustomConfig {
  cert: File | null; // SSL 证书文件
  key: File | null; // SSL 私钥文件
}

// SSL 阿里云配置
export interface SSLALiYunConfig {
  apiKey: string; // APIKey
  secretKey: string; // SecretKey
}

// SSL Cloudflare 配置
export interface SSLCloudflareConfig {
  authToken: string; // 认证 token
}

// SSL 腾讯云配置
export interface SSLTencentCloudConfig {
  secretId: string; // Secret ID
  secretKey: string; // Secret Key
}

// Let's Encrypt 配置
export interface SSLApplyConfig {
  aliyun: SSLALiYunConfig; // 阿里云配置
  cfcloud: SSLCloudflareConfig; // Cloudflare 配置
  domain: string; // 域名配置
  legomail: string; // 申请邮箱
  name: string; // 域名提供商
  renew: boolean; // 是否自动续期
  txcloud: SSLTencentCloudConfig; // 腾讯云配置
}

// 其它配置
export interface OtherConfig {
  account_mail: string; // 账号邮件模板
  banner: string; // 横幅
  homeindex: string; // 主页内容
  link_addr: string; // 连接地址
}
