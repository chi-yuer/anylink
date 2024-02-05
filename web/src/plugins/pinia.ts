/*
 * @Author: Quarter
 * @Date: 2024-01-26 10:33:46
 * @LastEditors: Quarter
 * @LastEditTime: 2024-01-29 19:22:31
 * @FilePath: /anylink/web/src/plugins/pinia.ts
 * @Description: pinia 插件配置
 */

import * as definition from "@/definition";
import { createPinia, defineStore } from "pinia";
import { computed, ref } from "vue";

// pinia 实例
export const pinia = createPinia();

// 用户状态
export const userStore = defineStore("user", () => {
  // JWT 凭据
  const _jwt = ref<string | null>(localStorage.getItem(definition.JWT_TOKEN_KEY) || null);
  // 用户名
  const _username = ref<string | null>(localStorage.getItem(definition.LOGIN_USERNAME_KEY) || null);

  // JWT 凭据
  const jwt = computed(() => _jwt.value);
  // 用户名
  const username = computed(() => _username.value);

  /**
   * @description: 更新 JWT 凭据
   * @param {string} payload 载荷
   * @returns
   */
  const updateJWT = (payload?: string): void => {
    if (typeof payload === "string") {
      _jwt.value = payload;
      localStorage.setItem(definition.JWT_TOKEN_KEY, payload);
    } else {
      _jwt.value = null;
      localStorage.removeItem(definition.JWT_TOKEN_KEY);
    }
  };

  /**
   * @description: 更新用户名
   * @param {string} payload 载荷
   * @returns
   */
  const updateUsername = (payload?: string): void => {
    if (typeof payload === "string") {
      _username.value = payload;
      localStorage.setItem(definition.LOGIN_USERNAME_KEY, payload);
    } else {
      _username.value = null;
      localStorage.removeItem(definition.LOGIN_USERNAME_KEY);
    }
  };

  return {
    jwt,
    username,
    updateJWT,
    updateUsername,
  };
});

// 框架全局状态
export const frameworkStore = defineStore("framework", () => {
  // 加载动画
  const _loading = ref(0);
  // 是否正在处理中
  const _processing = ref(false);
  // 页面是否可见
  const _visibility = ref(false);

  // 是否正在加载
  const isLoading = computed<boolean>(() => _loading.value > 0);

  // 是否正在处理中
  const processing = computed<boolean>(() => _processing.value);

  // 页面是否可见
  const visibility = computed<boolean>(() => _visibility.value);

  /**
   * @description: 触发加载动画
   * @returns
   */
  const loading = (): void => {
    _loading.value += 1;
  };

  /**
   * @description: 结束加载动画
   * @returns
   */
  const loaded = (): void => {
    _loading.value = Math.max(_loading.value - 1, 0);
  };

  /**
   * @description: 开始执行任务
   * @returns
   */
  const start = (): void => {
    _processing.value = true;
  };

  /**
   * @description: 执行任务完成
   * @returns
   */
  const end = (): void => {
    _processing.value = false;
  };

  /**
   * @description: 更新窗口可见
   * @param {boolean} payload 是否可见
   * @returns
   */
  const updateVisibility = (payload: boolean): void => {
    _visibility.value = !!payload;
  };

  return {
    isLoading,
    loading,
    loaded,
    processing,
    start,
    end,
    visibility,
    updateVisibility,
  };
});
