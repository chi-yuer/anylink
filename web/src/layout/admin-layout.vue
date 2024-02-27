<!--
 * @Author: Quarter
 * @Date: 2024-01-26 10:53:26
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-27 14:27:32
 * @FilePath: /anylink/web/src/layout/admin-layout.vue
 * @Description: 管理员后台布局
-->
<script lang="ts" setup>
import Logo from "@/assets/logo.svg";
import { MenuItem } from "@/components";
import { MENU_LIST } from "@/data/menu";
import { frameworkStore, userStore } from "@/plugins";
import { MenuItemConfig } from "@/types";
import { Icon, MenuValue, MessagePlugin } from "tdesign-vue-next";
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// 路由实例
const router = useRouter();
// 当前路由
const route = useRoute();
// 用户全局状态
const user = userStore();
// 框架
const framework = frameworkStore();
// 加载动画
let loadingInstance: ReturnType<typeof MessagePlugin> | null = null;

// 当前激活菜单
const activeMenu = computed(() => {
  const { result } = findLeafMenu(MENU_LIST, route.path);
  if (result) {
    return result;
  }
  return undefined;
});

// 默认展开菜单
const defaultExpanded = computed(() => {
  const pathArray = route.path.split(/\/+/g).filter((path) => path.length > 0);
  return new Array(pathArray.length - 1)
    .fill("")
    .map((_, index) => "/" + pathArray.slice(0, index + 1).join("/"));
});

/**
 * @description: 查询叶子菜单
 * @param {MenuItemConfig[]} menus 菜单配置列表
 * @param {string} target 匹配目标
 * @returns {MenuItemConfig}
 */
const findLeafMenu = (
  menus: MenuItemConfig[],
  target: string,
): { result: string | undefined; level: number } => {
  let result: { result: string | undefined; level: number } = { result: undefined, level: 0 };
  menus
    .filter(({ path }) => new RegExp(`^${path}`, "g").test(target))
    .forEach(({ path, children }) => {
      const stringArr = path.split(/\/+/g);
      if (stringArr.length > result.level) {
        result = { result: path, level: stringArr.length };
      }
      if (Array.isArray(children) && children.length > 0) {
        const childrenResult = findLeafMenu(children, target);
        if (childrenResult.level > result.level) {
          result = childrenResult;
        }
      }
    });
  return result;
};

/**
 * @description: 处理菜单切换
 * @param {MenuValue} value 菜单项值
 * @returns
 */
const handleMenuChange = (value: MenuValue): void => {
  if (typeof value === "string") {
    router.push({ path: value });
  }
};

/**
 * @description: 打开加载消息框
 * @returns
 */
const openLoadingMessage = (): void => {
  if (loadingInstance) {
    return;
  }
  loadingInstance = MessagePlugin.loading({
    content: "数据正在加载，请稍候",
    duration: 0,
    zIndex: 1001,
    // attach: "body",
  });
};

/**
 * @description: 关闭加载消息框
 * @returns
 */
const closeLoadingMessage = (): void => {
  if (loadingInstance) {
    MessagePlugin.close(loadingInstance);
    loadingInstance = null;
  }
};

// 监听 loading 变化
watch(
  () => framework.isLoading,
  (loading: boolean) => {
    if (loading) {
      openLoadingMessage();
    } else {
      closeLoadingMessage();
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <t-layout :style="{ height: '100%' }">
    <!-- 顶栏 -->
    <t-header>
      <t-head-menu theme="dark">
        <template #logo>
          <img :src="Logo" alt="logo" :style="{ opacity: 0.5 }" />
          <span>AnyLink&nbsp;Console</span>
        </template>
        <template #operations>
          <t-dropdown
            placement="bottom-right"
            trigger="click"
            :min-column-width="150"
            :max-column-width="250"
          >
            <t-button variant="text" size="large" :style="{ minWidth: '150px' }">
              <template #icon>
                <icon name="user-circle"></icon>
              </template>
              <template #default>{{ user.username || "佚名" }}</template>
              <template #suffix>
                <icon name="chevron-down"></icon>
              </template>
            </t-button>
            <t-dropdown-menu>
              <t-dropdown-item theme="error" value="exit">
                <template #prefix-icon>
                  <icon name="logout"></icon>
                </template>
                <template #default>退出登录</template>
              </t-dropdown-item>
            </t-dropdown-menu>
          </t-dropdown>
        </template>
      </t-head-menu>
    </t-header>
    <!-- 主体 -->
    <t-layout :style="{ flex: 1, overflow: 'hidden' }">
      <!-- 侧边栏 -->
      <t-aside>
        <t-menu
          :expand-mutex="true"
          :value="activeMenu"
          :default-expanded="defaultExpanded"
          @change="handleMenuChange"
        >
          <menu-item v-for="menu of MENU_LIST" :config="menu"></menu-item>
        </t-menu>
      </t-aside>
      <!-- 页面内容 -->
      <t-content :style="{ height: '100%', overflow: 'auto' }">
        <div class="admin-layout__content">
          <router-view></router-view>
        </div>
      </t-content>
    </t-layout>
  </t-layout>
  <!-- 加载动画 -->
  <!-- <t-loading :loading="framework.isLoading" fullscreen prevent-scroll-through></t-loading> -->
</template>

<style lang="scss" scoped>
.t-menu--dark.t-head-menu {
  background-color: var(--td-brand-color);

  :deep(.t-menu__logo) {
    width: 232px;
    font-size: var(--td-font-size-title-large);
    text-align: center;
    background-color: rgba($color: #ffffff, $alpha: 0.1);
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    & > * {
      margin-left: 0;
    }
  }

  .t-button--variant-text {
    color: var(--td-font-white-1);

    &:hover {
      background-color: rgba($color: #000000, $alpha: 0.1);
      border-color: transparent;
      --ripple-color: #{rgba($color: #000000, $alpha: 0.15)};
    }
  }
}

.admin-layout__content {
  padding: 16px;
}
</style>
