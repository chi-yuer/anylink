<!--
 * @Author: Quarter
 * @Date: 2024-01-26 09:58:24
 * @LastEditors: Quarter
 * @LastEditTime: 2024-01-30 11:45:39
 * @FilePath: /anylink/web/src/app.vue
 * @Description: 
-->
<script setup lang="ts">
import { frameworkStore } from "@/plugins";
import { onBeforeMount, onBeforeUnmount } from "vue";

// 框架状态
const framework = frameworkStore();

/**
 * @description: 处理可见性变化
 * @returns
 */
const handleVisibilityChange = (): void => {
  framework.updateVisibility(document.visibilityState === "hidden");
};

// 生命周期函授
onBeforeMount(() => {
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

// 生命周期函授
onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  font-size: var(--td-font-size-body-medium);
}
</style>
