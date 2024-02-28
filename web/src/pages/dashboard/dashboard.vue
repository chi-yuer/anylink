<!--
 * @Author: Quarter
 * @Date: 2024-01-26 10:52:05
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-28 15:00:00
 * @FilePath: /anylink/web/src/pages/dashboard/dashboard.vue
 * @Description: 管理员首页
-->
<script lang="ts" setup>
import { STATISTICS_COUNT } from "@/data";
import { date, object } from "@/lib";
import { frameworkStore } from "@/plugins";
import { getAllGroupList } from "@/request/group";
import {
  TimeScopeOption,
  queryCPUChartData,
  queryOnlineChartData,
  queryRAMChartData,
  queryStatistics,
  queryTrafficChartData,
} from "@/request/statistics";
import { StatisticsCount } from "@/types";
import * as echarts from "echarts";
import { onMounted, reactive, ref, watch } from "vue";

// 在线人数图表容器
const onlineChartContainer = ref<HTMLDivElement | null>(null);
// 网络吞吐图表容器
const trafficChartContainer = ref<HTMLDivElement | null>(null);
// CPU 负载图表容器
const cpuChartContainer = ref<HTMLDivElement | null>(null);
// 内存图表容器
const ramChartContainer = ref<HTMLDivElement | null>(null);
// 框架状态
const framework = frameworkStore();
// 自动刷新计时器
let timeout: ReturnType<typeof setTimeout> | null = null;
// 自动刷新间隔时间
const autoRefreshTime = 10 * 1000;
// 范围选项列表
const rangeOptions = [
  { label: "实时", value: "rt" },
  { label: "1小时", value: "1h" },
  { label: "24小时", value: "24h" },
  { label: "7天", value: "7d" },
];
// 权限组列表
const groupOptions = ref<Array<{ label: string; value: string | number | null }>>([
  { label: "全部", value: null },
]);
// 图表时间范围
const chartTimeScope = reactive<{ [key: string]: TimeScopeOption }>({
  cpu: "rt",
  ram: "rt",
  online: "rt",
  traffic: "rt",
});
// echarts 图表实例
const chartInstance: { [key: string]: echarts.ECharts | null } = {
  cpu: null,
  ram: null,
  online: null,
  traffic: null,
};
// 统计信息
const statisticsCount = reactive<StatisticsCount>(object.copy(STATISTICS_COUNT));

/**
 * @description: 获取权限组列表
 * @returns
 */
const fetchGroupList = (): void => {
  getAllGroupList().then(({ datas }) => {
    groupOptions.value = [
      { label: "全部", value: null },
      ...datas.map((label) => ({ label, value: label })),
    ];
  });
};

/**
 * @description: 获取统计计数信息
 * @param {boolean} loading 是否显示加载动画
 * @returns {Promise<void>}
 */
const fetchStatisticsCount = (loading = true): Promise<void> =>
  new Promise<void>((resolve) => {
    if (loading) {
      framework.loading();
    }
    queryStatistics()
      .then(({ counts }) => {
        Object.assign(statisticsCount, counts);
      })
      .finally(() => {
        if (loading) {
          framework.loaded();
        }
        resolve();
      });
  });

/**
 * @description: 获取在线数图表数据
 * @param {boolean} loading 是否显示加载动画
 * @returns {Promise<void>}
 */
const fetchOnlineChartData = (loading = true): Promise<void> =>
  new Promise<void>((resolve) => {
    if (loading) {
      framework.loading();
    }
    queryOnlineChartData(chartTimeScope.online)
      .then(({ datas }) => {
        const max = Math.max(...datas.map(({ num }) => num));
        createOrUpdateChart("online", {
          legend: {
            show: false,
          },
          grid: {
            top: 40,
            left: 40,
            right: 20,
            bottom: 40,
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            data: datas.map(({ created_at }) => date.formate(created_at, "MM/dd hh:mm:ss")),
          },
          yAxis: {
            name: "人数",
            min: 0,
            max: max <= 5 ? 5 : undefined,
            minInterval: 1,
          },
          series: [
            {
              type: "line",
              name: "在线数",
              symbol: "none",
              color: "#0052d9",
              data: datas.map(({ num }) => num),
            },
          ],
        });
      })
      .finally(() => {
        if (loading) {
          framework.loaded();
        }
        resolve();
      });
  });

/**
 * @description: 获取流量图表数据
 * @param {boolean} loading 是否显示加载动画
 * @returns {Promise<void>}
 */
const fetchTrafficChartData = (loading = true): Promise<void> =>
  new Promise<void>((resolve) => {
    if (loading) {
      framework.loading();
    }
    queryTrafficChartData(chartTimeScope.traffic)
      .then(({ datas }) => {
        createOrUpdateChart("traffic", {
          legend: {
            show: false,
          },
          grid: {
            top: 40,
            left: 40,
            right: 20,
            bottom: 40,
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            data: datas.map(({ created_at }) => date.formate(created_at, "MM/dd hh:mm:ss")),
          },
          yAxis: {
            name: "Mbps",
            min: 0,
          },
          series: [
            {
              type: "line",
              name: "上行带宽",
              symbol: "none",
              color: "#008858",
              data: datas.map(({ up }) => Math.round((up / 1024) * 100) / 100),
            },
            {
              type: "line",
              name: "下行带宽",
              symbol: "none",
              color: "#0052d9",
              data: datas.map(({ down }) => Math.round((down / 1024) * 100) / 100),
            },
          ],
        });
      })
      .finally(() => {
        if (loading) {
          framework.loaded();
        }
        resolve();
      });
  });

/**
 * @description: 获取流量图表数据
 * @param {boolean} loading 是否显示加载动画
 * @returns {Promise<void>}
 */
const fetchCPUChartData = (loading = true): Promise<void> =>
  new Promise<void>((resolve) => {
    if (loading) {
      framework.loading();
    }
    queryCPUChartData(chartTimeScope.cpu)
      .then(({ datas }) => {
        createOrUpdateChart("cpu", {
          legend: {
            show: false,
          },
          grid: {
            top: 40,
            left: 40,
            right: 20,
            bottom: 40,
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            data: datas.map(({ created_at }) => date.formate(created_at, "MM/dd hh:mm:ss")),
          },
          yAxis: {
            name: "%",
            min: 0,
            max: 100,
          },
          series: [
            {
              type: "line",
              name: "CPU 占用率",
              symbol: "none",
              color: "#0052d9",
              data: datas.map(({ percent }) => percent),
            },
          ],
        });
      })
      .finally(() => {
        if (loading) {
          framework.loaded();
        }
        resolve();
      });
  });

/**
 * @description: 获取流量图表数据
 * @param {boolean} loading 是否显示加载动画
 * @returns {Promise<void>}
 */
const fetchRAMChartData = (loading = true): Promise<void> =>
  new Promise<void>((resolve) => {
    if (loading) {
      framework.loading();
    }
    queryRAMChartData(chartTimeScope.ram)
      .then(({ datas }) => {
        createOrUpdateChart("ram", {
          legend: {
            show: false,
          },
          grid: {
            top: 40,
            left: 40,
            right: 20,
            bottom: 40,
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            data: datas.map(({ created_at }) => date.formate(created_at, "MM/dd hh:mm:ss")),
          },
          yAxis: {
            name: "%",
            min: 0,
            max: 100,
          },
          series: [
            {
              type: "line",
              name: "内存占用率",
              symbol: "none",
              color: "#0052d9",
              data: datas.map(({ percent }) => percent),
            },
          ],
        });
      })
      .finally(() => {
        if (loading) {
          framework.loaded();
        }
        resolve();
      });
  });

/**
 * @description: 创建获取更新图表
 * @param {string} name 图表名
 * @param {Array} option 图表数据
 * @returns
 */
const createOrUpdateChart = (name: string, option: echarts.EChartsOption): void => {
  const instance = Reflect.get(chartInstance, name);
  if (instance) {
    instance.setOption(option);
  } else {
    let container: HTMLDivElement | null = null;
    switch (name) {
      case "online":
        container = onlineChartContainer.value;
        break;
      case "traffic":
        container = trafficChartContainer.value;
        break;
      case "cpu":
        container = cpuChartContainer.value;
        break;
      case "ram":
        container = ramChartContainer.value;
        break;
    }
    if (container instanceof HTMLDivElement) {
      const instance = echarts.init(container);
      instance.setOption(option);
      Reflect.set(chartInstance, name, instance);
    }
  }
};

/**
 * @description: 获取统计信息
 * @param {boolean} loading 是否显示加载动画
 * @returns
 */
const fetchStatisticsInfo = (loading = true): void => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  if (loading) {
    framework.loading();
  }
  Promise.all([
    fetchStatisticsCount(false),
    fetchOnlineChartData(false),
    fetchTrafficChartData(false),
    fetchCPUChartData(false),
    fetchRAMChartData(false),
  ]).finally(() => {
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
  timeout = setTimeout(() => fetchStatisticsInfo(false), autoRefreshTime);
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

// 获取分组列表
fetchGroupList();

// 生命周期钩子
onMounted(() => {
  fetchStatisticsInfo();
});
</script>

<template>
  <t-space :size="16" direction="vertical" :style="{ width: '100%' }">
    <t-space :size="16" :style="{ width: '100%' }">
      <t-card :bordered="false">
        <t-statistic
          title="用户数"
          :value="statisticsCount.user"
          unit="个"
          color="black"
        ></t-statistic>
      </t-card>
      <t-card :bordered="false">
        <t-statistic
          title="在线数"
          :value="statisticsCount.online"
          unit="个"
          color="black"
        ></t-statistic>
      </t-card>
      <t-card :bordered="false">
        <t-statistic
          title="权限组数"
          :value="statisticsCount.group"
          unit="个"
          color="black"
        ></t-statistic>
      </t-card>
      <t-card :bordered="false">
        <t-statistic
          title="IP 映射数"
          :value="statisticsCount.ip_map"
          unit="个"
          color="black"
        ></t-statistic>
      </t-card>
    </t-space>
    <div :style="{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '16px' }">
      <t-card title="用户在线数" :bordered="false" :style="{ width: 'calc((100% - 16px) / 2)' }">
        <template #actions>
          <t-radio-group
            v-model="chartTimeScope.online"
            variant="primary-filled"
            @change="fetchOnlineChartData"
          >
            <t-radio-button
              v-for="range of rangeOptions"
              :value="range.value"
              v-text="range.label"
            ></t-radio-button>
          </t-radio-group>
        </template>
        <template #default>
          <div ref="onlineChartContainer" class="chart-container"></div>
        </template>
      </t-card>
      <t-card title="网络吞吐量" :bordered="false" :style="{ width: 'calc((100% - 16px) / 2)' }">
        <template #actions>
          <t-radio-group
            v-model="chartTimeScope.traffic"
            variant="primary-filled"
            @change="fetchTrafficChartData"
          >
            <t-radio-button
              v-for="range of rangeOptions"
              :value="range.value"
              v-text="range.label"
            ></t-radio-button>
          </t-radio-group>
        </template>
        <template #default>
          <div ref="trafficChartContainer" class="chart-container"></div>
        </template>
      </t-card>
      <t-card title="CPU 占用率" :bordered="false" :style="{ width: 'calc((100% - 16px) / 2)' }">
        <template #actions>
          <t-radio-group
            v-model="chartTimeScope.cpu"
            variant="primary-filled"
            @change="fetchCPUChartData"
          >
            <t-radio-button
              v-for="range of rangeOptions"
              :value="range.value"
              v-text="range.label"
            ></t-radio-button>
          </t-radio-group>
        </template>
        <template #default>
          <div ref="cpuChartContainer" class="chart-container"></div>
        </template>
      </t-card>
      <t-card title="内存占用率" :bordered="false" :style="{ width: 'calc((100% - 16px) / 2)' }">
        <template #actions>
          <t-radio-group
            v-model="chartTimeScope.ram"
            variant="primary-filled"
            @change="fetchRAMChartData"
          >
            <t-radio-button
              v-for="range of rangeOptions"
              :value="range.value"
              v-text="range.label"
            ></t-radio-button>
          </t-radio-group>
        </template>
        <template #default>
          <div ref="ramChartContainer" class="chart-container"></div>
        </template>
      </t-card>
    </div>
  </t-space>
</template>

<style lang="scss" scoped>
.chart-operation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 320px;
}
</style>
