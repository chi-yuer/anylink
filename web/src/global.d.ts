/*
 * @Author: Quarter
 * @Date: 2024-01-26 10:17:21
 * @LastEditors: Quarter
 * @LastEditTime: 2024-01-26 10:17:27
 * @FilePath: /anylink/web/src/global.d.ts
 * @Description: 全局类型定义
 */

import { AxiosInstance } from "axios";

declare global {
  interface Window {
    axios: AxiosInstance;
  }
}
