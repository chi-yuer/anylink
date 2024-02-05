<!--
 * @Author: Quarter
 * @Date: 2024-02-01 10:11:20
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-05 14:28:15
 * @FilePath: /anylink/web/src/pages/user/components/account-policy.vue
 * @Description: 用户策略表单
-->
<script lang="ts" setup>
import { ACCOUNT_POLICY_INFO } from "@/data";
import { object } from "@/lib";
import { queryAccountPolicyInfo } from "@/request/user";
import { AccountPolicyInfo } from "@/types";
import { PropType, computed, reactive, ref } from "vue";

// 参数
const props = defineProps({
  id: Number as PropType<Number | null>, // 账号 id
});
// 加载动画
const loading = ref(false);
// 用户策略信息
const accountPolicyInfo = reactive<AccountPolicyInfo>(object.copy(ACCOUNT_POLICY_INFO));

// 包含域名列表
const includeDomains = computed<string[]>(() =>
  accountPolicyInfo.ds_include_domains.split(",").filter((domain) => !!domain),
);

// 排除域名列表
const excludeDomains = computed<string[]>(() =>
  accountPolicyInfo.ds_exclude_domains.split(",").filter((domain) => !!domain),
);

/**
 * @description: 获取 用户策略详情
 * @returns
 */
const fetchAccountPolicyDetail = (): void => {
  if (typeof props.id !== "number") {
    return;
  }
  loading.value = true;
  queryAccountPolicyInfo(props.id)
    .then((accountPolicy) => {
      Object.assign(accountPolicyInfo, accountPolicy);
    })
    .finally(() => {
      loading.value = false;
    });
};

// 判定是否查询详情
if (props.id) {
  fetchAccountPolicyDetail();
}
</script>

<template>
  <t-tabs v-loading="loading" :default-value="1">
    <!-- 包含路由 -->
    <t-tab-panel :value="1" label="包含路由" :destroy-on-hide="false">
      <template v-if="accountPolicyInfo.route_include.length > 0">
        <t-list size="small">
          <t-list-item v-for="route of accountPolicyInfo.route_include">{{
            route.val
          }}</t-list-item>
        </t-list>
      </template>
      <template v-else>
        <div class="no-records">尚未配置此项策略</div>
      </template>
    </t-tab-panel>
    <!-- 排除路由 -->
    <t-tab-panel
      v-if="accountPolicyInfo.route_exclude.length > 0"
      :value="2"
      label="排除路由"
      :destroy-on-hide="false"
    >
      <t-list size="small">
        <t-list-item v-for="route of accountPolicyInfo.route_exclude">{{ route.val }}</t-list-item>
      </t-list>
    </t-tab-panel>
    <!-- 包含域名 -->
    <t-tab-panel
      v-if="includeDomains.length > 0"
      :value="3"
      label="包含域名"
      :destroy-on-hide="false"
    >
      <t-list size="small">
        <t-list-item v-for="domain of includeDomains">{{ domain }}</t-list-item>
      </t-list>
    </t-tab-panel>
    <!-- 排除域名 -->
    <t-tab-panel
      v-if="excludeDomains.length > 0"
      :value="4"
      label="排除域名"
      :destroy-on-hide="false"
    >
      <t-list size="small">
        <t-list-item v-for="domain of excludeDomains">{{ domain }}</t-list-item>
      </t-list>
    </t-tab-panel>
  </t-tabs>
</template>

<style lang="scss" scoped>
.t-tab-panel {
  padding-top: var(--td-comp-margin-m);
}

.no-records {
  padding: var(--td-comp-paddingLR-xxl);
  color: var(--td-font-gray-2);
  text-align: center;
}
</style>
