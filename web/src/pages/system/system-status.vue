<!--
 * @Author: Quarter
 * @Date: 2024-02-05 17:02:20
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-27 14:12:38
 * @FilePath: /anylink/web/src/pages/system/system-status.vue
 * @Description: 系统状态
-->
<script lang="ts" setup>
import { SYSTEM_INFO } from "@/data";
import { object, string } from "@/lib";
import { frameworkStore } from "@/plugins";
import { querySystemInfo } from "@/request/system";
import { ref, watch } from "vue";

// 列表项配置
interface ListItemConfig {
  label: string; // 项名
  prop?: string; // 参数名
  render?: () => void; // 自定义渲染函数
}

// 框架状态
const framework = frameworkStore();
// 系统信息
const systemInfo = ref(object.copy(SYSTEM_INFO));
// 自动刷新计时器
let timeout: ReturnType<typeof setTimeout> | null = null;
// 自动刷新间隔时间
const autoRefreshTime = 10 * 1000;
// CPU 信息
const cpuItems: ListItemConfig[] = [
  { label: "主频", prop: "cpu.ghz" },
  { label: "负载", prop: "sys.load" },
];
// RAM 信息
const ramItems: ListItemConfig[] = [
  { label: "总量", prop: "mem.total" },
  { label: "余量", prop: "mem.free" },
];
// ROM 信息
const romItems: ListItemConfig[] = [
  { label: "总量", prop: "disk.total" },
  { label: "余量", prop: "disk.free" },
];
// 运行环境信息
const envItems: ListItemConfig[] = [
  { label: "应用版本", prop: "sys.appVersion" },
  { label: "Go 系统", prop: "sys.goOs" },
  { label: "Go 架构", prop: "sys.goArch" },
  { label: "Go 版本", prop: "sys.goVersion" },
  { label: "Go Routine", prop: "sys.goroutine" },
];
// 服务器信息
const serverItems: ListItemConfig[] = [
  { label: "主机名", prop: "sys.hostname" },
  { label: "操作系统", prop: "sys.platform" },
  { label: "内核版本", prop: "sys.kernel" },
  { label: "CPU", render: () => `${systemInfo.value.cpu.modelName} x${systemInfo.value.cpu.core}` },
];

/**
 * @description: 获取系统信息
 * @param {boolean} loading 加载动画
 * @returns
 */
const fetchSystemInfo = (loading = true): void => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  if (loading) {
    framework.loading();
  }
  querySystemInfo()
    .then((data) => {
      systemInfo.value = data;
    })
    .finally(() => {
      if (loading) {
        framework.loaded();
      }
      autoRefresh();
    });
};

/**
 * @description: 自动刷新
 * @returns
 */
const autoRefresh = (): void => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  timeout = setTimeout(() => fetchSystemInfo(false), autoRefreshTime);
};

/**
 * @description: 列表行渲染器
 * @param {Object} obj 对象
 * @param {ListItemConfig} config 配置
 * @returns {string}
 */
const listItemRenderer = (obj: any, { render, prop }: ListItemConfig): string => {
  if (typeof render === "function") {
    const result = render();
    if (typeof result === "string") {
      return result;
    }
  } else if (typeof obj === "object") {
    if (typeof prop === "string") {
      let result = obj;
      prop
        .split(/\.+/g)
        .filter((str) => string.clean(str).length > 0)
        .forEach((key) => {
          if (Reflect.has(result, key)) {
            result = Reflect.get(result, key);
          }
        });
      if (typeof result === "string" || typeof result === "number") {
        return String(result);
      }
    }
  }
  return "";
};

// 侦听当前页面的可见性
watch(
  () => framework.visibility,
  (visibility: boolean) => {
    if (visibility) {
      autoRefresh();
    } else {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    }
  },
);

// 获取系统信息
fetchSystemInfo();
</script>

<template>
  <t-space :size="16" direction="vertical" :style="{ width: '100%' }">
    <t-space :size="16" :style="{ width: '100%' }">
      <t-card title="CPU 使用率" :bordered="false">
        <t-space direction="vertical" :style="{ width: '100%' }">
          <t-progress
            theme="circle"
            :size="200"
            :stroke-width="10"
            :percentage="systemInfo.cpu.percent"
          ></t-progress>
          <ul class="status-list">
            <li class="status-item" v-for="item of cpuItems">
              <div class="status-label" v-text="item.label"></div>
              <div class="status-value" v-text="listItemRenderer(systemInfo, item)"></div>
            </li>
          </ul>
        </t-space>
      </t-card>
      <t-card title="RAM 使用率" :bordered="false">
        <t-space direction="vertical" :style="{ width: '100%' }">
          <t-progress
            theme="circle"
            :size="200"
            :stroke-width="10"
            :percentage="systemInfo.mem.percent"
          ></t-progress>
          <ul class="status-list">
            <li class="status-item" v-for="item of ramItems">
              <div class="status-label" v-text="item.label"></div>
              <div class="status-value" v-text="listItemRenderer(systemInfo, item)"></div>
            </li>
          </ul>
        </t-space>
      </t-card>
      <t-card title="ROM 使用率" :bordered="false">
        <t-space direction="vertical" :style="{ width: '100%' }">
          <t-progress
            theme="circle"
            :size="200"
            :stroke-width="10"
            :percentage="systemInfo.disk.percent"
          ></t-progress>
          <ul class="status-list">
            <li class="status-item" v-for="item of romItems">
              <div class="status-label" v-text="item.label"></div>
              <div class="status-value" v-text="listItemRenderer(systemInfo, item)"></div>
            </li>
          </ul>
        </t-space>
      </t-card>
    </t-space>
    <t-card title="运行环境" :bordered="false">
      <ul class="status-list">
        <li class="status-item" v-for="item of envItems">
          <div class="status-label" v-text="item.label"></div>
          <div class="status-value" v-text="listItemRenderer(systemInfo, item)"></div>
        </li>
      </ul>
    </t-card>
    <t-card title="服务器信息" :bordered="false">
      <ul class="status-list">
        <li class="status-item" v-for="item of serverItems">
          <div class="status-label" v-text="item.label"></div>
          <div class="status-value" v-text="listItemRenderer(systemInfo, item)"></div>
        </li>
      </ul>
    </t-card>
  </t-space>
</template>

<style lang="scss" scoped>
.t-progress {
  display: flex;
  justify-content: center;
}

.status-list {
  width: 100%;
  padding: 0;
  color: var(--td-text-color-primary);
  list-style: none;
  display: flex;
  flex-direction: column;
  margin: 0;
}

.status-item {
  padding: 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:not(:last-of-type) {
    border-bottom: 1px solid var(--td-border-level-1-color);
  }
}

.status-value {
  color: var(--td-text-color-secondary);
}
</style>
