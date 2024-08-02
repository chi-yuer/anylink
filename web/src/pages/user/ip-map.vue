<!--
 * @Author: Quarter
 * @Date: 2024-01-27 15:25:33
 * @LastEditors: Quarter
 * @LastEditTime: 2024-05-10 16:40:23
 * @FilePath: /anylink/web/src/pages/user/ip-map.vue
 * @Description: IP 映射
-->
<script lang="ts" setup>
import { date } from "@/lib";
import { frameworkStore } from "@/plugins";
import { deleteIPMap, queryIPMapList, updateIPMap } from "@/request/user";
import { IPMapRecord } from "@/types";
import { BaseTableCol, Icon, MessagePlugin, PageInfo } from "tdesign-vue-next";
import { ref } from "vue";
import IpMapForm from "./components/ip-map-form.vue";

// 页码
const pageNo = ref(1);
// 分页大小
const pageSize = 10;
// 总数据量
const total = ref(0);
// 框架状态
const framework = frameworkStore();
// IP 映射关系列
const ipMapColumns: BaseTableCol<IPMapRecord>[] = [
  { colKey: "id", title: "#", width: 80 },
  { colKey: "ip_addr", title: "分配 IP", width: 160 },
  { colKey: "username", title: "用户名", width: 240 },
  {
    colKey: "mac_addr",
    title: "MAC 地址",
    width: 180,
    render: (_, { row }) => {
      if (row.mac_addr) {
        return row.mac_addr.toLocaleUpperCase();
      }
      return "";
    },
  },
  { colKey: "unique_mac", title: "唯一MAC", width: 100 },
  { colKey: "keep", title: "IP保留", width: 100 },
  {
    colKey: "last_login",
    title: "最后上线时间",
    width: 180,
    render: (_, { row }) => {
      if (row.last_login) {
        return date.formate(row.last_login, "yyyy-MM-dd hh:mm:ss");
      }
      return "";
    },
  },
  { colKey: "note", title: "备注" },
  { colKey: "operation", title: "操作", width: 200 },
];
// 账号列表
const ipMapList = ref<IPMapRecord[]>([]);
// 当前操作的唯一识别码
const idFocused = ref<number | null>(null);
// 创建账号弹窗是否可见
const createIPMapVisible = ref(false);
// 编辑账号弹窗是否可见
const editIPMapVisible = ref(false);
// 编辑确认弹窗是否可见
const confirmEditVisible = ref(false);
// 下线确认弹窗是否可见
const confirmDeleteVisible = ref(false);
// 创建 IP 映射关系表单
const createIPMapForm = ref<InstanceType<typeof IpMapForm> | null>(null);
// 编辑 IP 映射关系表单
const editIPMapForm = ref<InstanceType<typeof IpMapForm> | null>(null);

/**
 * @description: 获取 IP 映射列表
 * @returns
 */
const fetchIPMapList = (): void => {
  framework.loading();
  queryIPMapList(pageNo.value)
    .then(({ count, datas }) => {
      total.value = count || 0;
      ipMapList.value = datas || [];
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
  fetchIPMapList();
};

/**
 * @description: 处理创建 IP 映射关系
 * @returns
 */
const handleCreateIPMap = (): void => {
  if (!createIPMapForm.value) {
    return;
  }
  framework.start();
  createIPMapForm.value
    .validate()
    .then((ipMap) => updateIPMap(ipMap))
    .then(() => {
      confirmEditVisible.value = false;
      createIPMapVisible.value = false;
      MessagePlugin.success("账号创建成功");
      fetchIPMapList();
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
const handleShowEditDialog = (id: number): void => {
  idFocused.value = id;
  editIPMapVisible.value = true;
};

/**
 * @description: 处理编辑 IP 映射关系
 * @returns
 */
const handleEditIPMap = (): void => {
  if (!editIPMapForm.value) {
    return;
  }
  framework.start();
  editIPMapForm.value
    .validate()
    .then((ipMap) => updateIPMap(ipMap))
    .then(() => {
      confirmEditVisible.value = false;
      editIPMapVisible.value = false;
      MessagePlugin.success("账号更新成功");
      fetchIPMapList();
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
 * @description: 处理删除 IP 映射关系
 * @returns
 */
const handleDeleteIPMap = (): void => {
  if (!idFocused.value) {
    return;
  }
  framework.start();
  deleteIPMap(idFocused.value)
    .then(() => {
      confirmDeleteVisible.value = false;
      MessagePlugin.success("IP 映射删除成功");
      fetchIPMapList();
      if (ipMapList.value.length <= 1 && pageNo.value > 1) {
        pageNo.value -= 1;
        fetchIPMapList();
      } else {
        fetchIPMapList();
      }
    })
    .finally(() => {
      framework.end();
    });
};

// 获取 IP 映射列表
fetchIPMapList();
</script>

<template>
  <!-- 搜索条件 -->
  <div class="ip-map__condition-panel">
    <div class="ip-map__condition-search"></div>
    <div class="ip-map__condition-operation">
      <t-space :size="8" align="center">
        <t-button @click="createIPMapVisible = true">
          <template #icon>
            <icon name="file-add"></icon>
          </template>
          <template #default>创建映射</template>
        </t-button>
      </t-space>
    </div>
  </div>
  <!-- IP映射表格 -->
  <t-table
    row-key="ip"
    :columns="ipMapColumns"
    :data="ipMapList"
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
    <template #unique_mac="{ row }">
      <template v-if="row.unique_mac">
        <t-tag variant="light" theme="success">是</t-tag>
      </template>
      <template v-else>
        <t-tag variant="light" theme="danger">否</t-tag>
      </template>
    </template>
    <template #keep="{ row }">
      <template v-if="row.keep">
        <t-tag variant="light" theme="success">是</t-tag>
      </template>
      <template v-else>
        <t-tag variant="light" theme="danger">否</t-tag>
      </template>
    </template>
    <template #operation="{ row }">
      <t-space :size="12">
        <t-button variant="text" theme="warning" @click="handleShowEditDialog(row.id)"
          >编辑</t-button
        >
        <t-button variant="text" theme="danger" @click="handleShowDeleteConfirmDialog(row.id)"
          >删除</t-button
        >
      </t-space>
    </template>
  </t-table>
  <!-- 创建 IP 映射关系弹窗 -->
  <t-dialog
    :visible="createIPMapVisible"
    width="500px"
    placement="center"
    header="创建 IP 映射关系"
    :confirm-loading="framework.processing"
    :confirm-btn="{
      default: '创建',
    }"
    destroy-on-close
    :close-on-overlay-click="false"
    @close="createIPMapVisible = false"
    @esc-keydown="createIPMapVisible = false"
    @cancel="createIPMapVisible = false"
    @confirm="handleCreateIPMap"
  >
    <ip-map-form ref="createIPMapForm"></ip-map-form>
  </t-dialog>
  <!-- 编辑 IP 映射关系弹窗 -->
  <t-dialog
    :visible="editIPMapVisible"
    width="500px"
    placement="center"
    header="编辑 IP 映射关系"
    :confirm-btn="{
      theme: 'warning',
      default: '保存',
    }"
    destroy-on-close
    :close-on-overlay-click="false"
    @close="editIPMapVisible = false"
    @esc-keydown="editIPMapVisible = false"
    @cancel="editIPMapVisible = false"
    @confirm="confirmEditVisible = true"
  >
    <ip-map-form ref="editIPMapForm" :id="idFocused"></ip-map-form>
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
    @confirm="handleEditIPMap"
  ></t-dialog>
  <!-- 删除确认弹窗 -->
  <t-dialog
    :visible="confirmDeleteVisible"
    width="320px"
    placement="center"
    header="删除 IP 映射关系"
    default="确认删除当前 IP 映射关系吗？"
    :confirm-loading="framework.processing"
    :confirm-btn="{ theme: 'danger', default: '删除' }"
    :close-on-overlay-click="false"
    @close="confirmDeleteVisible = false"
    @esc-keydown="confirmDeleteVisible = false"
    @cancel="confirmDeleteVisible = false"
    @confirm="handleDeleteIPMap"
  ></t-dialog>
</template>

<style lang="scss">
.ip-map__condition-panel {
  padding: 12px;
  background-color: var(--td-bg-color-container);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
</style>
