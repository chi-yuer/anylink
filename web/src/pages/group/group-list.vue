<!--
 * @Author: Quarter
 * @Date: 2024-01-27 15:28:21
 * @LastEditors: Quarter
 * @LastEditTime: 2024-05-23 18:51:53
 * @FilePath: /anylink/web/src/pages/group/group-list.vue
 * @Description: 群组管理
-->
<script lang="ts" setup>
import * as definintion from "@/definition";
import { date } from "@/lib";
import { frameworkStore } from "@/plugins";
import { deleteGroup, queryGroupList, updateGroup } from "@/request/group";
import { GroupRecord } from "@/types";
import { BaseTableCol, Icon, MessagePlugin, PageInfo } from "tdesign-vue-next";
import { ref } from "vue";
import GroupForm from "./components/group-form.vue";
import GroupPolicy from "./components/group-policy.vue";

// 页码
const pageNo = ref(1);
// 分页大小
const pageSize = 10;
// 总条数
const total = ref(0);
// 框架状态
const framework = frameworkStore();
// 权限组列
const groupColumns: BaseTableCol<GroupRecord>[] = [
  { colKey: "id", title: "#", width: 80 },
  { colKey: "name", title: "权限组名" },
  {
    colKey: "bandwidth",
    title: "带宽限制",
    width: 160,
    render: (_, { row }) => {
      if (typeof row.bandwidth === "number") {
        if (row.bandwidth === 0) {
          return "无限制";
        }
        return `${row.bandwidth / 125000}Mbps`;
      }
      return "";
    },
  },
  { colKey: "auth", title: "认证方式", width: 160 },
  { colKey: "client_dns", title: "客户端 DNS" },
  { colKey: "allow_lan", title: "本地网络", width: 100 },
  { colKey: "status", title: "状态", width: 100 },
  {
    colKey: "updated_at",
    title: "更新时间",
    width: 180,
    render: (_, { row }) => {
      if (row.updated_at) {
        return date.formate(row.updated_at, "yyyy-MM-dd hh:mm:ss");
      }
      return "";
    },
  },
  { colKey: "note", title: "备注" },
  { colKey: "operation", title: "操作", width: 260 },
];
// 权限组列表
const groupList = ref<GroupRecord[]>([]);
// 当前操作的唯一识别码
const idFocused = ref<number | null>(null);
// 创建权限组弹窗是否可见
const createGroupVisible = ref(false);
// 访问策略详情弹窗是否可见
const accountPolicyVisible = ref(false);
// 编辑权限组弹窗是否可见
const editGroupVisible = ref(false);
// 编辑确认弹窗是否可见
const confirmEditVisible = ref(false);
// 下线确认弹窗是否可见
const confirmDeleteVisible = ref(false);
// 创建权限组表单
const createGroupForm = ref<InstanceType<typeof GroupForm> | null>(null);
// 编辑权限组表单
const editGroupForm = ref<InstanceType<typeof GroupForm> | null>(null);

/**
 * @description: 获取权限组列表
 * @returns
 */
const fetchGroupList = (): void => {
  framework.loading();
  queryGroupList({
    pageNo: pageNo.value,
  })
    .then(({ count, datas }) => {
      total.value = count || 0;
      groupList.value = datas || [];
    })
    .finally(() => {
      framework.loaded();
    });
};

/**
 * @description: 处理页码切换
 * @param {PageInfo} PageInfo 分页信息
 * @returns
 */
const handlePageChange = ({ current }: PageInfo): void => {
  pageNo.value = current;
  fetchGroupList();
};

/**
 * @description: 处理创建权限组
 * @returns
 */
const handleCreateGroup = (): void => {
  if (!createGroupForm.value) {
    return;
  }
  framework.start();
  createGroupForm.value
    .validate()
    .then((group) => updateGroup(group))
    .then(() => {
      createGroupVisible.value = false;
      MessagePlugin.success("权限组创建成功");
      fetchGroupList();
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
 * @param {number} id 权限组 id
 * @returns
 */
const handleShowEditDialog = (id: number): void => {
  idFocused.value = id;
  editGroupVisible.value = true;
};

/**
 * @description: 处理编辑权限组信息
 * @returns
 */
const handleEditGroup = (): void => {
  if (!editGroupForm.value) {
    return;
  }
  framework.start();
  editGroupForm.value
    .validate()
    .then((group) => updateGroup(group))
    .then(() => {
      confirmEditVisible.value = false;
      editGroupVisible.value = false;
      MessagePlugin.success("权限组更新成功");
      fetchGroupList();
    })
    .finally(() => {
      framework.end();
    });
};

/**
 * @description: 处理现实删除弹窗
 * @param {number} id 权限组 id
 * @returns
 */
const handleShowDeleteDialog = (id: number): void => {
  idFocused.value = id;
  confirmDeleteVisible.value = true;
};

/**
 * @description: 确认删除权限组
 * @returns
 */
const handleDeleteGroup = (): void => {
  if (typeof idFocused.value !== "number") {
    return;
  }
  framework.start();
  deleteGroup(idFocused.value)
    .then(() => {
      confirmDeleteVisible.value = false;
      MessagePlugin.success("权限组删除成功");
      if (groupList.value.length <= 1 && pageNo.value > 1) {
        pageNo.value -= 1;
        fetchGroupList();
      } else {
        fetchGroupList();
      }
    })
    .finally(() => {
      framework.end();
    });
};

// 获取权限组列表
fetchGroupList();
</script>

<template>
  <!-- 搜索条件 -->
  <div class="group-list__condition-panel">
    <div class="group-list__condition-search"></div>
    <div class="group-list__condition-operation">
      <t-space :size="8" align="center">
        <t-button @click="createGroupVisible = true">
          <template #icon>
            <icon name="usergroup-add"></icon>
          </template>
          <template #default>创建权限组</template>
        </t-button>
      </t-space>
    </div>
  </div>
  <!-- 权限组表格 -->
  <t-table
    row-key="id"
    :columns="groupColumns"
    :data="groupList"
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
    <template #auth="{ row }">
      <template v-if="definintion.GROUP_AUTH_LABEL.has(row.auth.type)">{{
        definintion.GROUP_AUTH_LABEL.get(row.auth.type)
      }}</template>
      <template v-else>未知</template>
    </template>
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
      <t-tag v-else-if="row.status === 2" variant="light" theme="danger">过期</t-tag>
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
        <t-button variant="text" theme="danger" @click="handleShowDeleteDialog(row.id)"
          >删除</t-button
        >
      </t-space>
    </template>
  </t-table>
  <!-- 创建权限组弹窗 -->
  <t-dialog
    :visible="createGroupVisible"
    width="800px"
    placement="center"
    header="创建权限组"
    :confirm-loading="framework.processing"
    :confirm-btn="{
      default: '创建',
    }"
    destroy-on-close
    :close-on-overlay-click="false"
    @close="createGroupVisible = false"
    @esc-keydown="createGroupVisible = false"
    @cancel="createGroupVisible = false"
    @confirm="handleCreateGroup"
  >
    <group-form ref="createGroupForm"></group-form>
  </t-dialog>
  <!-- 权限组详情弹窗 -->
  <t-dialog
    :visible="accountPolicyVisible"
    width="600px"
    placement="center"
    header="权限组"
    :footer="false"
    destroy-on-close
    :close-on-overlay-click="false"
    @close="accountPolicyVisible = false"
    @esc-keydown="accountPolicyVisible = false"
  >
    <group-policy :id="idFocused"></group-policy>
  </t-dialog>
  <!-- 编辑权限组弹窗 -->
  <t-dialog
    :visible="editGroupVisible"
    width="800px"
    placement="center"
    header="编辑权限组"
    :confirm-btn="{
      theme: 'warning',
      default: '保存',
    }"
    destroy-on-close
    :close-on-overlay-click="false"
    @close="editGroupVisible = false"
    @esc-keydown="editGroupVisible = false"
    @cancel="editGroupVisible = false"
    @confirm="confirmEditVisible = true"
  >
    <group-form ref="editGroupForm" :id="idFocused"></group-form>
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
    @confirm="handleEditGroup"
  ></t-dialog>
  <!-- 删除权限组确认弹窗 -->
  <t-dialog
    :visible="confirmDeleteVisible"
    width="320px"
    placement="center"
    header="删除权限组"
    default="确认删除当前选中的权限组？"
    :confirm-loading="framework.processing"
    :confirm-btn="{ theme: 'danger', default: '删除' }"
    :close-on-overlay-click="false"
    @close="confirmDeleteVisible = false"
    @esc-keydown="confirmDeleteVisible = false"
    @cancel="confirmDeleteVisible = false"
    @confirm="handleDeleteGroup"
  ></t-dialog>
</template>

<style lang="scss">
.group-list__condition-panel {
  padding: 12px;
  background-color: var(--td-bg-color-container);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
</style>
