<!--
 * @Author: Quarter
 * @Date: 2024-01-27 15:26:13
 * @LastEditors: Quarter
 * @LastEditTime: 2024-08-02 11:10:45
 * @FilePath: /anylink/web/src/pages/user/online-user.vue
 * @Description: 在线用户
-->
<script lang="ts" setup>
import * as definition from "@/definition";
import { date } from "@/lib";
import { frameworkStore } from "@/plugins";
import { kickAccount, queryOnlineAccountList, reconnectAccount } from "@/request/user";
import { AccountOnlineRecord } from "@/types";
import { BaseTableCol, Icon, MessagePlugin } from "tdesign-vue-next";
import { onBeforeUnmount, ref, watch } from "vue";

// 框架状态
const framework = frameworkStore();
// 在线用户列
const accountColumns: BaseTableCol<AccountOnlineRecord>[] = [
  { colKey: "id", title: "#", width: 80 },
  { colKey: "username", title: "用户名" },
  { colKey: "group", title: "登录权限组" },
  {
    colKey: "mac_addr",
    title: "MAC 地址",
    render: (_, { row }) => {
      if (row.mac_addr) {
        return row.mac_addr.toLocaleUpperCase();
      }
      return "";
    },
  },
  { colKey: "ip", title: "分配 IP" },
  { colKey: "client", title: "终端类型" },
  { colKey: "bandwidth_down", title: "访问速率" },
  { colKey: "bandwidth_down_all", title: "访问总量" },
  {
    colKey: "last_login",
    title: "上线时间",
    width: 180,
    render: (_, { row }) => {
      if (row.last_login) {
        return date.formate(row.last_login, "yyyy-MM-dd hh:mm:ss");
      }
      return "";
    },
  },
  { colKey: "operation", title: "操作", width: 200 },
];
// 账号列表
const accountList = ref<AccountOnlineRecord[]>([]);
// 当前操作的 token
const tokenFocused = ref<string | null>(null);
// 重连确认弹窗是否可见
const confirmReconnectVisible = ref(false);
// 下线确认弹窗是否可见
const confirmKickVisible = ref(false);
// 自动刷新计时器
let timeout: ReturnType<typeof setTimeout> | null = null;
// 自动刷新间隔时间
const autoRefreshTime = 10 * 1000;

/**
 * @description: 获取在线账号列表
 * @param {boolean} loading 是否显示加载动画
 * @returns
 */
const fetchOnlineAccountList = (loading = true): void => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  if (loading) {
    framework.loading();
  }
  queryOnlineAccountList()
    .then(({ datas }) => {
      accountList.value = datas || [];
    })
    .finally(() => {
      if (loading) {
        framework.loaded();
      }
      autoRefresh();
    });
};

/**
 * @description: 处理显示重连确认弹窗
 * @param {string} token 认证凭据
 * @returns
 */
const handleShowReconnectConfirmDialog = (token: string): void => {
  tokenFocused.value = token;
  confirmReconnectVisible.value = true;
};

/**
 * @description: 处理重连账号
 * @returns
 */
const handleReconnectAccount = (): void => {
  if (!tokenFocused.value) {
    return;
  }
  framework.start();
  reconnectAccount(tokenFocused.value)
    .then(() => {
      confirmReconnectVisible.value = false;
      MessagePlugin.success("账号重连成功");
      fetchOnlineAccountList();
    })
    .finally(() => {
      framework.end();
    });
};

/**
 * @description: 处理显示下线确认弹窗
 * @param {string} token 认证凭据
 * @returns
 */
const handleShowKickConfirmDialog = (token: string): void => {
  tokenFocused.value = token;
  confirmKickVisible.value = true;
};

/**
 * @description: 处理下线账号
 * @returns
 */
const handleKickAccount = (): void => {
  if (!tokenFocused.value) {
    return;
  }
  framework.start();
  kickAccount(tokenFocused.value)
    .then(() => {
      confirmKickVisible.value = false;
      MessagePlugin.success("账号下线成功");
      fetchOnlineAccountList();
    })
    .finally(() => {
      framework.end();
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
  timeout = setTimeout(() => fetchOnlineAccountList(false), autoRefreshTime);
};

// 生命周期函数
onBeforeUnmount(() => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
});

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

// 获取在线账号列表
fetchOnlineAccountList();
</script>

<template>
  <!-- 搜索条件 -->
  <div class="online-user__condition-panel">
    <div class="online-user__condition-search"></div>
    <div class="online-user__condition-operation">
      <t-space :size="8" align="center">
        <t-button @click="fetchOnlineAccountList">
          <template #icon>
            <icon name="refresh"></icon>
          </template>
          <template #default>刷新</template>
        </t-button>
      </t-space>
    </div>
  </div>
  <!-- 在线用户表格 -->
  <t-table
    row-key="ip"
    :columns="accountColumns"
    :data="accountList"
    :style="{ marginTop: '16px' }"
  >
    <template #id="{ rowIndex }">{{ rowIndex + 1 }}</template>
    <template #client="{ row }">
      <t-space :size="4" align="center">
        <template v-if="definition.DEVICE_ICON_LABEL.has(row.client)">
          <icon :name="definition.DEVICE_ICON_LABEL.get(row.client)?.icon"></icon>
          <span v-text="definition.DEVICE_ICON_LABEL.get(row.client)?.label"></span>
        </template>
        <template v-else>
          <icon :name="definition.DEVICE_ICON_LABEL.get('default')?.icon"></icon>
          <span v-text="definition.DEVICE_ICON_LABEL.get('default')?.label"></span>
        </template>
      </t-space>
    </template>
    <template #bandwidth_down="{ row }">
      <t-space :size="4" direction="vertical">
        <t-space :size="4" align="center">
          <icon name="arrow-up"></icon>
          <span v-text="row.bandwidth_up"></span>
        </t-space>
        <t-space :size="4" align="center">
          <icon name="arrow-down"></icon>
          <span v-text="row.bandwidth_down"></span>
        </t-space>
      </t-space>
    </template>
    <template #bandwidth_down_all="{ row }">
      <t-space :size="4" direction="vertical">
        <t-space :size="4" align="center">
          <icon name="arrow-up"></icon>
          <span v-text="row.bandwidth_up_all"></span>
        </t-space>
        <t-space :size="4" align="center">
          <icon name="arrow-down"></icon>
          <span v-text="row.bandwidth_down_all"></span>
        </t-space>
      </t-space>
    </template>
    <template #operation="{ row }">
      <t-space :size="12">
        <t-button
          variant="text"
          theme="warning"
          @click="handleShowReconnectConfirmDialog(row.token)"
          >重连</t-button
        >
        <t-button variant="text" theme="danger" @click="handleShowKickConfirmDialog(row.token)"
          >下线</t-button
        >
      </t-space>
    </template>
  </t-table>
  <!-- 重连确认弹窗 -->
  <t-dialog
    :visible="confirmReconnectVisible"
    width="320px"
    placement="center"
    header="重连"
    default="确认重连当前选中账号？"
    :confirm-loading="framework.processing"
    :confirm-btn="{ theme: 'warning', default: '重连' }"
    :close-on-overlay-click="false"
    @close="confirmReconnectVisible = false"
    @esc-keydown="confirmReconnectVisible = false"
    @cancel="confirmReconnectVisible = false"
    @confirm="handleReconnectAccount"
  ></t-dialog>
  <!-- 下线确认弹窗 -->
  <t-dialog
    :visible="confirmKickVisible"
    width="320px"
    placement="center"
    header="下线"
    default="确认下线当前选中账号？"
    :confirm-loading="framework.processing"
    :confirm-btn="{ theme: 'danger', default: '下线' }"
    :close-on-overlay-click="false"
    @close="confirmKickVisible = false"
    @esc-keydown="confirmKickVisible = false"
    @cancel="confirmKickVisible = false"
    @confirm="handleKickAccount"
  ></t-dialog>
</template>

<style lang="scss">
.online-user__condition-panel {
  padding: 12px;
  background-color: var(--td-bg-color-container);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
</style>
