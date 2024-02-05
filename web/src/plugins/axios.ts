/*
 * @Author: Quarter
 * @Date: 2024-01-26 10:16:50
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-01 11:45:06
 * @FilePath: /anylink/web/src/plugins/axios.ts
 * @Description: axios 插件配置
 */

import { auth } from "@/lib";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
  Method,
} from "axios";
import { MessagePlugin } from "tdesign-vue-next";

const baseURL = "/api";

const config: CreateAxiosDefaults = {
  baseURL,
  timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};

const instance = axios.create(config);

instance.interceptors.request.use(
  (cfg: InternalAxiosRequestConfig) => {
    const jwt = auth.getJWT();
    const { headers } = cfg;
    if (jwt) {
      headers.set("Jwt", jwt);
    }
    return {
      ...cfg,
      headers,
    };
  },
  (err: AxiosError) => {
    // Do something with instance error
    return Promise.reject(err);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  (res: AxiosResponse) => {
    return res;
  },
  (err: AxiosError) => {
    const { response } = err;
    if (response) {
      const { status } = response;
      switch (status) {
        case 401:
          auth.requestLogin();
          return Promise.reject(new Error());
        default:
        // do nothing
      }
    }
    return Promise.reject(err);
  },
);

/**
 * @description: 二次封装请求函数
 * @param {Method} method 请求方式
 * @param {string} url 请求路径
 * @param {Any} params 路径参数
 * @param {Any} data 请求体
 * @param {AxiosRequestConfig} config axios 配置
 * @param {boolean} raw 是否原始数据
 * @returns
 */
const request = <T>(
  method: Method,
  url: string,
  params: any,
  data: any,
  config: AxiosRequestConfig = {},
  raw = false,
): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    instance({
      url,
      method,
      params,
      data,
      ...config,
    })
      .then(({ data: axiosData }) => {
        if (raw) {
          resolve(axiosData);
        } else {
          const { code, msg, data } = axiosData;
          if (code === 0) {
            resolve(data);
          } else {
            MessagePlugin.error(msg);
            reject();
          }
        }
      })
      .catch((err) => {
        if (err instanceof Error) {
          if (err.message) {
            MessagePlugin.error(err.message);
          }
          reject();
        } else {
          reject(err);
        }
      });
  });

export default {
  /**
   * @description: GET 请求
   * @param {string} url 请求路径
   * @param {Any} params 请求参数
   * @param {AxiosRequestConfig} config axios 请求配置
   * @param {boolean} raw 原始数据
   * @returns {Promise}
   */
  get: <T>(url: string, params?: any, config?: AxiosRequestConfig, raw = false) =>
    request<T>("GET", url, params, undefined, config, raw),
  /**
   * @description: DELETE 请求
   * @param {string} url 请求路径
   * @param {Any} params 请求参数
   * @param {AxiosRequestConfig} config axios 请求配置
   * @param {boolean} raw 原始数据
   * @returns {Promise}
   */
  delete: <T>(url: string, params?: any, config?: AxiosRequestConfig, raw = false) =>
    request<T>("DELETE", url, params, undefined, config, raw),
  /**
   * @description: POST 请求
   * @param {string} url 请求路径
   * @param {Any} data 请求体
   * @param {AxiosRequestConfig} config axios 请求配置
   * @param {boolean} raw 原始数据
   * @returns {Promise}
   */
  post: <T>(url: string, data: any, config?: AxiosRequestConfig, raw = false) =>
    request<T>("POST", url, undefined, data, config, raw),
  /**
   * @description: PUT 请求
   * @param {string} url 请求路径
   * @param {Any} data 请求体
   * @param {AxiosRequestConfig} config axios 请求配置
   * @param {boolean} raw 原始数据
   * @returns {Promise}
   */
  put: <T>(url: string, data: any, config?: AxiosRequestConfig, raw = false) =>
    request<T>("PUT", url, undefined, data, config, raw),
};
