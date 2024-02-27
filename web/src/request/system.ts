/*
 * @Author: Quarter
 * @Date: 2024-02-19 11:33:25
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-27 10:31:08
 * @FilePath: /anylink/web/src/request/system.ts
 * @Description: 系统配置相关
 */

import { form } from "@/lib";
import { request } from "@/plugins";
import {
  AuditConfig,
  BaseConfigRecord,
  MailConfig,
  OtherConfig,
  SSLApplyConfig,
  SSLCustomConfig,
  SystemInfo,
} from "@/types";

/**
 * @description: 获取系统信息
 * @returns {Promise<SystemInfo>}
 */
export const querySystemInfo = (): Promise<SystemInfo> => request.get<SystemInfo>("/set/system");

/**
 * @description: 获取基本配置列表
 * @returns {Promise<BaseConfigRecord[]>}
 */
export const queryBaseConfigList = (): Promise<BaseConfigRecord[]> =>
  request.get<BaseConfigRecord[]>("/set/soft");

/**
 * @description: 获取邮件配置
 * @returns {Promise<MailConfig>}
 */
export const queryMailConfig = (): Promise<MailConfig> =>
  request.get<MailConfig>("/set/other/smtp");

/**
 * @description: 更新邮件配置
 * @param {MailConfig} config 邮件配置
 * @returns {Promise<void>}
 */
export const updateMailConfig = (config: MailConfig): Promise<void> =>
  request.post("/set/other/smtp/edit", config);

/**
 * @description: 获取审计配置
 * @returns {Promise<AuditConfig>}
 */
export const queryAuditConfig = (): Promise<AuditConfig> =>
  request.get<AuditConfig>("/set/other/audit_log");

/**
 * @description: 更新审计配置
 * @param {AuditConfig} config 审计配置
 * @returns {Promise<void>}
 */
export const updateAuditConfig = (config: AuditConfig): Promise<void> =>
  request.post("/set/other/audit_log/edit", config);

/**
 * @description: 更新自定义 SSL 配置
 * @param {SSLCustomConfig} config 自定义 SSL 配置
 * @returns {Promise<void>}
 */
export const updateSSLCustomConfig = (config: SSLCustomConfig): Promise<void> =>
  request.post("/set/other/customcert", form.toFormData(config));

/**
 * @description: 获取 SSL 申请配置
 * @returns {Promise<SSLApplyConfig>}
 */
export const querySSLApplyConfig = (): Promise<void> => request.get("/set/other/getcertset");

/**
 * @description: 更新 Let's Encrypt 配置
 * @param {SSLApplyConfig} config Let's Encrypt 配置
 * @returns {Promise<void>}
 */
export const updateSSLApplyConfig = (config: SSLApplyConfig): Promise<void> =>
  request.post("/set/other/createcert", config);

/**
 * @description: 获取其它配置
 * @returns {Promise<OtherConfig>}
 */
export const queryOtherConfig = (): Promise<OtherConfig> => request.get<OtherConfig>("/set/other");

/**
 * @description: 更新其它配置
 * @param {OtherConfig} config
 * @returns {Promise<void>}
 */
export const updateOtherConfig = (config: OtherConfig): Promise<void> =>
  request.post("/set/other/edit", config);
