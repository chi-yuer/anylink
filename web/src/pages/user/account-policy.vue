<!--
 * @Author: Quarter
 * @Date: 2024-01-27 15:25:02
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-01 19:15:22
 * @FilePath: /anylink/web/src/pages/user/account-policy.vue
 * @Description: 用户策略
-->
<script lang="ts" setup>
import { date } from "@/lib";
import { frameworkStore } from "@/plugins";
import { deleteAccountPolicy, queryAccountPolicyList, updateAccountPolicy } from "@/request/user";
import { AccountPolicyRecord } from "@/types";
import { BaseTableCol, Icon, MessagePlugin, PageInfo } from "tdesign-vue-next";
import { ref } from "vue";
import AccountPolicyForm from "./components/account-policy-form.vue";
import AccountPolicy from "./components/account-policy.vue";

// 页码
const pageNo = ref(1);
// 分页大小
const pageSize = 10;
// 总数据量
const total = ref(0);
// 框架状态
const framework = frameworkStore();
//账户策略列
const accountColumns: BaseTableCol<AccountPolicyRecord>[] = [
  { colKey: "id", title: "#", width: 80 },
  { colKey: "username", title: "用户名" },
  { colKey: "client_dns", title: "客户端 DNS" },
  { colKey: "allow_lan", title: "本地网络" },
  { colKey: "status", title: "策略状态" },
  {
    colKey: "updated_at",
    title: "更新时间",
    render: (_, { row }) => {
      if (row.updated_at) {
        return date.formate(row.updated_at, "yyyy-MM-dd hh:mm:ss");
      }
      return "";
    },
  },
  { colKey: "operation", title: "操作" },
];
// 账号列表
const accountPolicyList = ref<AccountPolicyRecord[]>([]);
// 当前操作的唯一识别码
const idFocused = ref<number | null>(null);
// 创建账号弹窗是否可见
const createAccountPolicyVisible = ref(false);
// 访问策略详情弹窗是否可见
const accountPolicyVisible = ref(false);
// 编辑账号弹窗是否可见
const editAccountPolicyVisible = ref(false);
// 编辑确认弹窗是否可见
const confirmEditVisible = ref(false);
// 下线确认弹窗是否可见
const confirmDeleteVisible = ref(false);
// 创建账户策略表单
const createAccountPolicyForm = ref<InstanceType<typeof AccountPolicyForm> | null>(null);
// 编辑账户策略表单
const editAccountPolicyForm = ref<InstanceType<typeof AccountPolicyForm> | null>(null);

/**
 * @description: 获取 IP 映射列表
 * @returns
 */
const fetchAccountPolicyList = (): void => {
  framework.loading();
  queryAccountPolicyList(pageNo.value)
    .then(({ count, datas }) => {
      total.value = count || 0;
      accountPolicyList.value = datas || [];
    })
    .finally(() => {
      framework.loaded();
    });
};

/**
 * @description: 处理页面切换
 * @param {PageInfo} PageInfo 分页信息
 * @returns
 */
const handlePageChange = ({ current }: PageInfo): void => {
  pageNo.value = current;
  fetchAccountPolicyList();
};

/**
 * @description: 处理创建账户策略
 * @returns
 */
const handleCreateAccountPolicy = (): void => {
  if (!createAccountPolicyForm.value) {
    return;
  }
  framework.start();
  createAccountPolicyForm.value
    .validate()
    .then((userPolicy) => updateAccountPolicy(userPolicy))
    .then(() => {
      confirmEditVisible.value = false;
      createAccountPolicyVisible.value = false;
      MessagePlugin.success("账号创建成功");
      fetchAccountPolicyList();
    })
    .finally(() => {
      framework.end();
    });
};

/**
 * @description: 处理显示编辑弹窗
 * @param {number} id 唯一识别码
 * @returns
 */
const handleShowPolicyDialog = (id: number): void => {
  idFocused.value = id;
  accountPolicyVisible.value = true;
};

/**
 * @description: 处理显示编辑弹窗
 * @param {number} id 唯一识别码
 * @returns
 */
const handleShowEditDialog = (id: number): void => {
  idFocused.value = id;
  editAccountPolicyVisible.value = true;
};

/**
 * @description: 处理编辑账户策略
 * @returns
 */
const handleEditAccountPolicy = (): void => {
  if (!editAccountPolicyForm.value) {
    return;
  }
  framework.start();
  editAccountPolicyForm.value
    .validate()
    .then((userPolicy) => updateAccountPolicy(userPolicy))
    .then(() => {
      confirmEditVisible.value = false;
      editAccountPolicyVisible.value = false;
      MessagePlugin.success("账号更新成功");
      fetchAccountPolicyList();
    })
    .finally(() => {
      framework.end();
    });
};

/**
 * @description: 处理显示删除确认弹窗
 * @param {number} id 唯一识别码
 * @returns
 */
const handleShowDeleteConfirmDialog = (id: number): void => {
  idFocused.value = id;
  confirmDeleteVisible.value = true;
};

/**
 * @description: 处理删除账户策略
 * @returns
 */
const handleDeleteAccountPolicy = (): void => {
  if (!idFocused.value) {
    return;
  }
  framework.start();
  deleteAccountPolicy(idFocused.value)
    .then(() => {
      MessagePlugin.success("账号重连成功");
      fetchAccountPolicyList();
    })
    .finally(() => {
      framework.end();
    });
};

// 获取 IP 映射列表
fetchAccountPolicyList();
</script>

<template>
  <!-- 搜索条件 -->
  <div class="user-policy__condition-panel">
    <div class="user-policy__condition-search"></div>
    <div class="user-policy__condition-operation">
      <t-space :size="8" align="center">
        <t-button @click="createAccountPolicyVisible = true">
          <template #icon>
            <icon name="indicator"></icon>
          </template>
          <template #default>创建策略</template>
        </t-button>
      </t-space>
    </div>
  </div>
  <!-- 用户策略表格 -->
  <t-table
    row-key="ip"
    :columns="accountColumns"
    :data="accountPolicyList"
    :pagination="{
      current: pageNo,
      pageSize,
      total,
      showPageSize: false,
    }"
    :style="{ marginTop: '16px' }"
    @page-change="handlePageChange"
  >
    <template #id="{ rowIndex }">{{ (pageNo - 1) * pageSize + rowIndex + 1 }}</template>
    <template #client_dns="{ row }">
      <template v-if="Array.isArray(row.client_dns) && row.client_dns.length > 0">
        <template v-if="row.client_dns.length > 2">
          <t-space :size="4" direction="vertical">
            <span v-for="dns of row.client_dns.slice(0, 2)" v-text="dns.val"></span>
            <t-popup
              trigger="click"
              :overlay-style="{ maxWidth: '320px' }"
              :overlay-inner-style="{ padding: '8px' }"
            >
              <template #default>
                <t-link
                  hover="color"
                  size="small"
                  theme="primary"
                  v-text="`等共&nbsp;${row.client_dns.length}&nbsp;个 DNS`"
                ></t-link>
              </template>
              <template #content>
                <t-space :size="8" direction="vertical">
                  <span v-for="dns of row.client_dns" v-text="dns.val"></span>
                </t-space>
              </template>
            </t-popup>
          </t-space>
        </template>
        <template v-else>
          <t-space :size="4" direction="vertical">
            <span v-for="dns of row.client_dns" v-text="dns.val"></span>
          </t-space>
        </template>
      </template>
      <template v-else>本地DNS</template>
    </template>
    <template #allow_lan="{ row }">
      <t-tag v-if="row.allow_lan" variant="light" theme="danger">排除</t-tag>
      <t-tag v-else variant="light" theme="success">启用</t-tag>
    </template>
    <template #status="{ row }">
      <t-tag v-if="row.status === 1" variant="light" theme="success">启用</t-tag>
      <t-tag v-else variant="light" theme="danger">停用</t-tag>
    </template>
    <template #operation="{ row }">
      <t-space :size="12">
        <t-button variant="text" theme="primary" @click="handleShowPolicyDialog(row.id)"
          >策略</t-button
        >
        <t-button variant="text" theme="warning" @click="handleShowEditDialog(row.id)"
          >编辑</t-button
        >
        <t-button variant="text" theme="danger" @click="handleShowDeleteConfirmDialog(row.id)"
          >删除</t-button
        >
      </t-space>
    </template>
  </t-table>
  <!-- 创建用户策略弹窗 -->
  <t-dialog
    :visible="createAccountPolicyVisible"
    width="600px"
    placement="center"
    header="创建用户策略"
    :confirm-loading="framework.processing"
    :confirm-btn="{
      default: '创建',
    }"
    destroy-on-close
    :close-on-overlay-click="false"
    @close="createAccountPolicyVisible = false"
    @esc-keydown="createAccountPolicyVisible = false"
    @cancel="createAccountPolicyVisible = false"
    @confirm="handleCreateAccountPolicy"
  >
    <account-policy-form ref="createAccountPolicyForm"></account-policy-form>
  </t-dialog>
  <!-- 用户策略详情弹窗 -->
  <t-dialog
    :visible="accountPolicyVisible"
    width="600px"
    placement="center"
    header="用户策略"
    :footer="false"
    destroy-on-close
    :close-on-overlay-click="false"
    @close="accountPolicyVisible = false"
    @esc-keydown="accountPolicyVisible = false"
  >
    <account-policy :id="idFocused"></account-policy>
  </t-dialog>
  <!-- 编辑用户策略弹窗 -->
  <t-dialog
    :visible="editAccountPolicyVisible"
    width="600px"
    placement="center"
    header="编辑用户策略"
    :confirm-btn="{
      theme: 'warning',
      default: '保存',
    }"
    destroy-on-close
    :close-on-overlay-click="false"
    @close="editAccountPolicyVisible = false"
    @esc-keydown="editAccountPolicyVisible = false"
    @cancel="editAccountPolicyVisible = false"
    @confirm="confirmEditVisible = true"
  >
    <account-policy-form ref="editAccountPolicyForm" :id="idFocused"></account-policy-form>
  </t-dialog>
  <!-- 编辑确认弹窗 -->
  <t-dialog
    :visible="confirmEditVisible"
    width="320px"
    placement="center"
    header="确认保存"
    default="确认保存当前修改吗？"
    :confirm-loading="framework.processing"
    :confirm-btn="{ theme: 'warning', default: '保存' }"
    :close-on-overlay-click="false"
    @close="confirmEditVisible = false"
    @esc-keydown="confirmEditVisible = false"
    @cancel="confirmEditVisible = false"
    @confirm="handleEditAccountPolicy"
  ></t-dialog>
  <!-- 删除确认弹窗 -->
  <t-dialog
    :visible="confirmDeleteVisible"
    width="320px"
    placement="center"
    header="删除账户策略"
    default="确认删除当前账户策略吗？"
    :confirm-loading="framework.processing"
    :confirm-btn="{ theme: 'danger', default: '删除' }"
    :close-on-overlay-click="false"
    @close="confirmDeleteVisible = false"
    @esc-keydown="confirmDeleteVisible = false"
    @cancel="confirmDeleteVisible = false"
    @confirm="handleDeleteAccountPolicy"
  ></t-dialog>
</template>

<style lang="scss">
.user-policy__condition-panel {
  padding: 12px;
  background-color: var(--td-bg-color-container);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
</style>
