<!--
 * @Author: Quarter
 * @Date: 2024-01-26 10:53:26
 * @LastEditors: Quarter
 * @LastEditTime: 2024-01-30 10:23:26
 * @FilePath: /anylink/web/src/layout/admin-layout.vue
 * @Description: 管理员后台布局
-->
<script lang="ts" setup>
import Logo from "@/assets/logo.svg";
import { frameworkStore, userStore } from "@/plugins";
import { Icon, MenuValue } from "tdesign-vue-next";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

// 路由实例
const router = useRouter();
// 当前路由
const route = useRoute();
// 用户全局状态
const user = userStore();
// 加载动画
const framework = frameworkStore();

// 默认展开菜单
const defaultExpanded = computed(() => {
  const pathArray = route.path.split(/\/+/g).filter((path) => path.length > 0);
  return new Array(pathArray.length - 1).fill("").map((_, index) => "/" + pathArray.slice(0, index + 1).join("/"));
});

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
          :default-value="route.path"
          :default-expanded="defaultExpanded"
          @change="handleMenuChange"
        >
          <t-menu-item value="/admin/dashboard">
            <template #icon>
              <icon name="dashboard"></icon>
            </template>
            <template #default>仪表盘</template>
          </t-menu-item>
          <t-submenu value="/admin/user" title="用户管理">
            <template #icon>
              <icon name="user"></icon>
            </template>
            <template #default>
              <t-menu-item value="/admin/user/account">
                <template #icon>
                  <icon name="user-list"></icon>
                </template>
                <template #default>用户管理</template>
              </t-menu-item>
              <t-menu-item value="/admin/user/policy">
                <template #icon>
                  <icon name="verify"></icon>
                </template>
                <template #default>用户策略</template>
              </t-menu-item>
              <t-menu-item value="/admin/user/online">
                <template #icon>
                  <icon name="internet"></icon>
                </template>
                <template #default>在线用户</template>
              </t-menu-item>
              <t-menu-item value="/admin/user/ip">
                <template #icon>
                  <icon name="link"></icon>
                </template>
                <template #default>IP&nbsp;映射</template>
              </t-menu-item>
            </template>
          </t-submenu>
          <t-submenu value="/admin/group" title="权限组管理">
            <template #icon>
              <icon name="usergroup"></icon>
            </template>
            <template #default>
              <t-menu-item value="/admin/group/manage">
                <template #icon>
                  <icon name="tree-round-dot-vertical"></icon>
                </template>
                <template #default>权限组配置</template>
              </t-menu-item>
            </template>
          </t-submenu>
          <t-submenu value="/admin/system" title="系统配置">
            <template #icon>
              <icon name="coordinate-system"></icon>
            </template>
            <template #default>
              <t-menu-item value="/admin/system/state">
                <template #icon>
                  <icon name="system-application"></icon>
                </template>
                <template #default>运行状态</template>
              </t-menu-item>
              <t-menu-item value="/admin/system/config">
                <template #icon>
                  <icon name="setting"></icon>
                </template>
                <template #default>系统配置</template>
              </t-menu-item>
              <t-menu-item value="/admin/system/log">
                <template #icon>
                  <icon name="system-log"></icon>
                </template>
                <template #default>日志审计</template>
              </t-menu-item>
            </template>
          </t-submenu>
        </t-menu>
      </t-aside>
      <!-- 页面内容 -->
      <t-content v-loading="framework.isLoading" :style="{ height: '100%', overflow: 'auto' }">
        <div class="admin-layout__content">
          <router-view></router-view>
        </div>
      </t-content>
    </t-layout>
  </t-layout>
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
