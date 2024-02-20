/*
 * @Author: Quarter
 * @Date: 2024-02-19 11:29:13
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-20 15:13:01
 * @FilePath: /anylink/web/src/types/system.ts
 * @Description: 系统配置
 */

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
