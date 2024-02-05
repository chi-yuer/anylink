<!--
 * @Author: Quarter
 * @Date: 2024-01-29 21:24:11
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-05 15:03:16
 * @FilePath: /anylink/web/src/pages/group/components/group-policy.vue
 * @Description: 权限组表单
-->
<script lang="ts" setup>
import { GROUP_INFO } from "@/data";
import { object } from "@/lib";
import { queryGroupInfo } from "@/request/group";
import { GroupInfo } from "@/types";
import { PropType, computed, reactive, ref } from "vue";
import { Icon } from "tdesign-vue-next";

// 参数
const props = defineProps({
  id: Number as PropType<Number | null>, // 账号 id
});
// 加载动画
const loading = ref(false);
// 权限组信息
const groupInfo = reactive<GroupInfo>(object.copy(GROUP_INFO));

// 包含域名列表
const includeDomains = computed<string[]>(() =>
  groupInfo.ds_include_domains.split(",").filter((domain) => !!domain),
);

// 排除域名列表
const excludeDomains = computed<string[]>(() =>
  groupInfo.ds_exclude_domains.split(",").filter((domain) => !!domain),
);

/**
 * @description: 获取 权限组详情
 * @returns
 */
const fetchGroupDetail = (): void => {
  if (typeof props.id !== "number") {
    return;
  }
  loading.value = true;
  queryGroupInfo(props.id)
    .then((group) => {
      Object.assign(groupInfo, group);
    })
    .finally(() => {
      loading.value = false;
    });
};

// 判定是否查询详情
if (props.id) {
  fetchGroupDetail();
}
</script>

<template>
  <t-tabs v-loading="loading" :default-value="1">
    <!-- 包含路由 -->
    <t-tab-panel :value="1" label="包含路由" :destroy-on-hide="false">
      <template v-if="groupInfo.route_include.length > 0">
        <t-list size="small">
          <t-list-item v-for="route of groupInfo.route_include">{{ route.val }}</t-list-item>
        </t-list>
      </template>
      <template v-else>
        <div class="no-records">尚未配置此项策略</div>
      </template>
    </t-tab-panel>
    <!-- 排除路由 -->
    <t-tab-panel
      v-if="groupInfo.route_exclude.length > 0"
      :value="2"
      label="排除路由"
      :destroy-on-hide="false"
    >
      <t-list size="small">
        <t-list-item v-for="route of groupInfo.route_exclude">{{ route.val }}</t-list-item>
      </t-list>
    </t-tab-panel>
    <!-- 访问控制 -->
    <t-tab-panel
      v-if="groupInfo.link_acl.length > 0"
      :value="3"
      label="访问控制"
      :destroy-on-hide="false"
    >
      <t-list size="small">
        <t-list-item v-for="route of groupInfo.link_acl">
          <div
            :style="{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '8px',
            }"
          >
            <div v-if="route.action === 'allow'" class="policy-action policy-action--allow">
              <icon size="14px" name="check"></icon>
            </div>
            <div v-else-if="route.action === 'deny'" class="policy-action policy-action--deny">
              <icon size="14px" name="close"></icon>
            </div>
            <div>{{ route.val }}（{{ route.port }}）</div>
          </div>
        </t-list-item>
      </t-list>
    </t-tab-panel>
    <!-- 包含域名 -->
    <t-tab-panel
      v-if="includeDomains.length > 0"
      :value="4"
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
      :value="5"
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

.policy-action {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.policy-action--allow {
  color: var(--td-success-color);
  background-color: var(--td-success-color-light);
}

.policy-action--deny {
  color: var(--td-error-color);
  background-color: var(--td-error-color-light);
}
</style>
