<!--
 * @Author: Quarter
 * @Date: 2024-02-05 17:02:20
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-21 15:58:57
 * @FilePath: /anylink/web/src/pages/system/log-audit.vue
 * @Description: 日志审计
-->
<script lang="ts" setup>
import { ACCESS_LOG_LIST_PARAM, ACTION_LOG_LIST_PARAM } from "@/data";
import { date, object } from "@/lib";
import { frameworkStore } from "@/plugins";
import { queryAccessLogList, queryActionLogList } from "@/request/log";
import { AccessLogRecord, ActionLogRecord, ActionTypeOption } from "@/types/log";
import { BaseTableCol, DateRangeValue, PageInfo } from "tdesign-vue-next";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";

// 入参
const props = defineProps({
  category: {
    type: String,
    required: true,
  },
});
// 框架状态
const framework = frameworkStore();
// 路由实例
const router = useRouter();
// 当前选中的标签页
const activePanel = ref("action");
// 页码
const pageNo = ref(1);
// 分页大小
const pageSize = 10;
// 总条数
const total = ref(0);
// 客户端列表
const clientOptions = ref<string[]>([]);
// 操作类型列表
const _actionTypeOptions = ref<ActionTypeOption[]>([]);
// 操作系统列表
const _operationSystemOptions = ref<string[]>([]);
// 行为日志列表参数
const actionLogListParam = reactive(object.copy(ACTION_LOG_LIST_PARAM));
// 行为日志列表参数
const _actionLogListParam = object.copy(ACTION_LOG_LIST_PARAM);
// 行为日志表格列
const actionLogColumns: BaseTableCol<ActionLogRecord>[] = [
  { colKey: "id", title: "#", width: 80 },
  { colKey: "username", title: "用户名", width: 160 },
  { colKey: "group_name", title: "权限组", width: 160 },
  {
    colKey: "status",
    title: "活动类型",
    width: 120,
    render: (_, { row }) => actionTypeMap.value.get(row.status)?.value || "",
  },
  { colKey: "os", title: "操作系统", width: 280 },
  {
    colKey: "client",
    title: "客户端",
    width: 240,
    render: (_, { row }) => {
      if (row.client && row.version) {
        return `${clientOptions.value[row.client] || "Unknown"} ${row.version}`;
      }
      return "";
    },
  },
  {
    colKey: "created_at",
    title: "活动时间",
    width: 200,
    render: (_, { row }) => {
      if (row.created_at) {
        return date.formate(row.created_at, "yyyy-MM-dd hh:mm:ss");
      }
      return "";
    },
  },
  { colKey: "info", title: "活动详情" },
];
// 行为日志列表
const actionLogList = ref<ActionLogRecord[]>([]);
// 访问协议
const accessProtocalList = ["", "UDP", "TCP", "HTTPS", "HTTP"];
// 访问协议选项列表
const accessProtocalOptions = [
  { label: "UDP", value: "1" },
  { label: "TCP", value: "2" },
  { label: "HTTPS", value: "3" },
  { label: "HTTP", value: "4" },
];
// 访问日志列表参数
const accessLogListParam = reactive(object.copy(ACCESS_LOG_LIST_PARAM));
// 访问日志列表参数
const _accessLogListParam = object.copy(ACCESS_LOG_LIST_PARAM);
// 访问日志表格列
const accessLogColumns: BaseTableCol<AccessLogRecord>[] = [
  { colKey: "id", title: "#", width: 80 },
  { colKey: "username", title: "用户名", width: 160 },
  {
    colKey: "src",
    title: "源地址",
    width: 240,
    render: (_, { row }) => {
      if (typeof row.src_port === "number" && row.src_port > 0) {
        return `${row.src}:${row.src_port}`;
      }
      return row.src;
    },
  },
  {
    colKey: "dst",
    title: "目的地址",
    width: 240,
    render: (_, { row }) => {
      if (typeof row.dst_port === "number" && row.dst_port > 0) {
        return `${row.dst}:${row.dst_port}`;
      }
      return row.dst;
    },
  },
  {
    colKey: "access_proto",
    title: "访问协议",
    width: 160,
    render: (_, { row }) => {
      if (typeof row.access_proto === "number") {
        let { access_proto } = row;
        const { protocol } = row;
        if (access_proto == 0) {
          switch (protocol) {
            case 6:
              access_proto = 2;
              break;
            case 17:
              access_proto = 1;
              break;
          }
        }
        return accessProtocalList[access_proto] || "未知";
      }
      return "";
    },
  },
  {
    colKey: "created_at",
    title: "访问时间",
    width: 240,
    render: (_, { row }) => {
      if (row.created_at) {
        return date.formate(row.created_at, "yyyy-MM-dd hh:mm:ss");
      }
      return "";
    },
  },
  { colKey: "info", title: "详情" },
];
// 访问日志列表
const accessLogList = ref<AccessLogRecord[]>([]);

// 活动类型选项列表
const actionTypeOptions = computed(() =>
  _actionTypeOptions.value.map(({ value }, index) => ({ label: value, value: index + 1 })),
);

// 操作系统选项列表
const operationSystemOptions = computed(() =>
  _operationSystemOptions.value.map((name, index) => ({ label: name, value: index + 1 })),
);

// 活动类型映射关系
const actionTypeMap = computed(() => {
  const map = new Map<number, ActionTypeOption>();
  _actionTypeOptions.value.forEach((item) => map.set(item.key, item));
  return map;
});

// 活动时间范围
const actionTimeRange = computed<DateRangeValue>({
  get: () => {
    return [actionLogListParam.sdate, actionLogListParam.edate];
  },
  set: ([start, end]) => {
    if (start) {
      actionLogListParam.sdate = date.formate(start, "yyyy-MM-dd");
    } else {
      actionLogListParam.sdate = "";
    }
    if (end) {
      actionLogListParam.edate = date.formate(end, "yyyy-MM-dd");
    } else {
      actionLogListParam.edate = "";
    }
  },
});

/**
 * @description: 处理搜索
 * @returns
 */
const handleSearch = (): void => {
  Object.assign(_actionLogListParam, actionLogListParam);
  Object.assign(_accessLogListParam, accessLogListParam);
  pageNo.value = 1;
  switch (activePanel.value) {
    case "action":
      fetchActionLogList();
      break;
    case "access":
      fetchAccessLogList();
      break;
  }
};

/**
 * @description: 处理重置搜索
 * @returns
 */
const handleResetSearch = (): void => {
  Object.assign(actionLogListParam, object.copy(ACTION_LOG_LIST_PARAM));
  Object.assign(accessLogListParam, object.copy(ACCESS_LOG_LIST_PARAM));
  pageNo.value = 1;
  if (props.category !== activePanel.value) {
    router.push({ path: `/admin/system/log/${activePanel.value}` });
  }
  handleSearch();
};

/**
 * @description: 获取用户活动日志列表
 * @returns
 */
const fetchActionLogList = (): void => {
  framework.loading();
  queryActionLogList({
    pageNo: pageNo.value,
    ..._actionLogListParam,
  })
    .then(({ clientOps, count, datas, osOps, statusOps }) => {
      total.value = count || 0;
      actionLogList.value = datas || [];
      clientOptions.value = clientOps;
      _operationSystemOptions.value = osOps;
      _actionTypeOptions.value = statusOps.map((option) => {
        if (option.tag === "info") {
          option.tag = "default";
        }
        return option;
      });
    })
    .finally(() => {
      framework.loaded();
    });
};

/**
 * @description: 获取用户访问日志列表
 * @returns
 */
const fetchAccessLogList = (): void => {
  framework.loading();
  queryAccessLogList({
    pageNo: pageNo.value,
    ..._accessLogListParam,
  })
    .then(({ count, datas }) => {
      total.value = count || 0;
      accessLogList.value = datas || [];
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
  switch (activePanel.value) {
    case "action":
      fetchActionLogList();
      break;
    case "access":
      fetchAccessLogList();
      break;
  }
};

// 获取列表数据
handleSearch();
</script>

<template>
  <t-tabs :default-value="props.category" v-model="activePanel" @change="handleResetSearch">
    <!-- 用户活动日志 -->
    <t-tab-panel value="action" label="用户活动日志">
      <!-- 搜索条件 -->
      <div class="log-list__condition-panel">
        <div class="log-list__condition-search">
          <t-space :size="8" break-line>
            <t-input
              placeholder="请输入用户名"
              v-model="actionLogListParam.username"
              clearable
              :style="{ width: '240px' }"
            ></t-input>
            <t-date-range-picker
              :placeholder="['开始时间', '结束时间']"
              v-model="actionTimeRange"
              clearable
              :style="{ width: '320px' }"
            ></t-date-range-picker>
            <t-select
              placeholder="请选择活动类型"
              v-model="actionLogListParam.status"
              clearable
              :options="actionTypeOptions"
              :style="{ width: '160px' }"
            ></t-select>
            <t-select
              placeholder="请选择操作系统"
              v-model="actionLogListParam.os"
              clearable
              :options="operationSystemOptions"
              :style="{ width: '160px' }"
            ></t-select>
            <t-button @click="handleSearch">搜索</t-button>
            <t-button variant="outline" @click="handleResetSearch">重置</t-button>
          </t-space>
        </div>
        <div class="log-list__condition-operation"></div>
      </div>
      <!-- 用户活动日志表格 -->
      <t-table
        row-key="id"
        :columns="actionLogColumns"
        :data="actionLogList"
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
        <template #os="{ row }">
          <div>{{ _operationSystemOptions[row.os] || "未知" }}</div>
          <div
            :style="{
              color: 'var(--td-text-color-placeholder)',
              fontSize: 'var(--td-font-body-small)',
            }"
          >
            设备：{{ row.device_type }} / {{ row.platform_version }}
          </div>
        </template>
        <template #status="{ row }">
          <t-tag variant="light" :theme="actionTypeMap.get(row.status)?.tag || 'primary'">{{
            actionTypeMap.get(row.status)?.value || "未知"
          }}</t-tag>
        </template>
      </t-table>
    </t-tab-panel>
    <!-- 用户访问日志 -->
    <t-tab-panel value="access" label="用户访问日志">
      <!-- 搜索条件 -->
      <div class="log-list__condition-panel">
        <div class="log-list__condition-search">
          <t-space :size="8" break-line>
            <t-input
              placeholder="请输入用户名"
              v-model="accessLogListParam.username"
              clearable
              :style="{ width: '240px' }"
            ></t-input>
            <t-input
              placeholder="请输入源地址"
              v-model="accessLogListParam.src"
              clearable
              :style="{ width: '240px' }"
            ></t-input>
            <t-input
              placeholder="请输入目的地址"
              v-model="accessLogListParam.dst"
              clearable
              :style="{ width: '240px' }"
            ></t-input>
            <t-input
              placeholder="请输入源端口"
              v-model="accessLogListParam.dst_port"
              clearable
              :style="{ width: '160px' }"
            ></t-input>
            <t-select
              placeholder="请选择协议类型"
              v-model="accessLogListParam.access_proto"
              clearable
              :options="accessProtocalOptions"
              :style="{ width: '160px' }"
            ></t-select>
            <t-date-range-picker
              :placeholder="['开始时间', '结束时间']"
              v-model="actionTimeRange"
              clearable
              :style="{ width: '320px' }"
            ></t-date-range-picker>
            <t-input
              placeholder="请输入详情关键词"
              v-model="accessLogListParam.info"
              clearable
              :style="{ width: '240px' }"
            ></t-input>
            <t-button @click="handleSearch">搜索</t-button>
            <t-button variant="outline" @click="handleResetSearch">重置</t-button>
          </t-space>
        </div>
        <div class="log-list__condition-operation"></div>
      </div>
      <!-- 用户访问日志表格 -->
      <t-table
        row-key="id"
        :columns="accessLogColumns"
        :data="accessLogList"
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
      </t-table></t-tab-panel
    >
  </t-tabs>
</template>

<style lang="scss">
.log-list__condition-panel {
  padding: 12px;
  background-color: var(--td-bg-color-container);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}
</style>
