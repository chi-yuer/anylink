<!--
 * @Author: Quarter
 * @Date: 2024-02-21 14:45:51
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-21 14:55:11
 * @FilePath: /anylink/web/src/components/menu-item.vue
 * @Description: 菜单项组件
-->
<script lang="ts" setup>
import { MenuItemConfig } from "@/types";
import { Icon } from "tdesign-vue-next";
import { PropType, computed } from "vue";
import MenuItem from "./menu-item.vue";

// 组件入参
const props = defineProps({
  config: {
    type: Object as PropType<MenuItemConfig>,
    required: true,
  },
});

// 是否为叶子菜单
const isLeaf = computed(() => {
  if (Array.isArray(props.config.children) && props.config.children.length > 0) {
    return false;
  }
  return true;
});
</script>

<template>
  <template v-if="isLeaf">
    <t-menu-item :value="props.config.path">
      <template v-if="props.config.icon" #icon>
        <icon :name="props.config.icon"></icon>
      </template>
      <template #default>{{ props.config.title }}</template>
    </t-menu-item>
  </template>
  <template v-else>
    <t-submenu :value="props.config.path" :title="props.config.title">
      <template #icon>
        <icon :name="props.config.icon"></icon>
      </template>
      <template #default>
        <menu-item v-for="config of props.config.children" :config="config"></menu-item>
      </template>
    </t-submenu>
  </template>
</template>
