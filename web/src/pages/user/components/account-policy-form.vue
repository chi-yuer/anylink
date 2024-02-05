<!--
 * @Author: Quarter
 * @Date: 2024-02-01 10:11:20
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-05 16:32:47
 * @FilePath: /anylink/web/src/pages/user/components/account-policy-form.vue
 * @Description: 用户策略表单
-->
<script lang="ts" setup>
import { ACCOUNT_POLICY_CREATE_INFO } from "@/data";
import { net, object } from "@/lib";
import { queryAccountPolicyInfo } from "@/request/user";
import { AccountPolicyCreateInfo, AccountPolicyEditInfo } from "@/types";
import {
  CustomValidateResolveType,
  FormInstanceFunctions,
  FormRules,
  Icon,
  TabValue,
} from "tdesign-vue-next";
import { PropType, computed, reactive, ref } from "vue";

// 参数
const props = defineProps({
  id: Number as PropType<Number | null>, // 账号 id
});
// 加载动画
const loading = ref(false);
// 用户策略表单
const accountPolicyForm = ref<FormInstanceFunctions | null>(null);
// 用户策略信息
const accountPolicyInfo = reactive<AccountPolicyCreateInfo | AccountPolicyEditInfo>(
  object.copy(ACCOUNT_POLICY_CREATE_INFO),
);
// 用户策略验证规则
const accountPolicyRules: FormRules<typeof accountPolicyInfo> = {
  username: [
    { required: true, trigger: "change", message: "用户名为必填项" },
    {
      pattern: /^[a-zA-Z\u4e00-\u9fa5]/,
      trigger: "change",
      message: "请填写以中文、字母开头的用户名",
    },
    { pattern: /^.{3,}$/, trigger: "change", message: "用户名不能少于 3 个字符" },
    { pattern: /^.{3,30}$/, trigger: "change", message: "用户名不能超过 30 个字符" },
    {
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/,
      trigger: "change",
      message: "用户名由中文、字母、数字、_-构成",
    },
  ],
  client_dns: [
    {
      trigger: "change",
      validator: (value: typeof accountPolicyInfo.client_dns): CustomValidateResolveType => {
        if (Array.isArray(value)) {
          for (const dns of value) {
            const err = net.validateIPAddress(dns.val);
            if (err) {
              return { result: false, message: err.message, type: "error" };
            }
          }
        }
        return { result: true, message: "" };
      },
    },
  ],
  route_include: [
    {
      trigger: "change",
      validator: (value: typeof accountPolicyInfo.client_dns): CustomValidateResolveType => {
        if (Array.isArray(value)) {
          for (const route of value) {
            const err = net.validateCIDR(route.val);
            if (err instanceof Error) {
              return { result: false, message: err.message, type: "error" };
            }
          }
        }
        return { result: true, message: "" };
      },
    },
  ],
  route_exclude: [
    {
      trigger: "change",
      validator: (value: typeof accountPolicyInfo.client_dns): CustomValidateResolveType => {
        if (Array.isArray(value)) {
          for (const route of value) {
            const err = net.validateCIDR(route.val);
            if (err instanceof Error) {
              return { result: false, message: err.message, type: "error" };
            }
          }
        }
        return { result: true, message: "" };
      },
    },
  ],
  ds_include_domains: [
    {
      trigger: "change",
      validator: (
        value: typeof accountPolicyInfo.ds_include_domains,
      ): CustomValidateResolveType => {
        if (value) {
          if (
            accountPolicyInfo.ds_exclude_domains.split(/[,，]+/g).filter((domain) => !!domain)
              .length > 0 &&
            accountPolicyInfo.ds_include_domains.split(/[,，]+/g).filter((domain) => !!domain)
              .length > 0
          ) {
            return { result: false, message: "包含域名和排除域名不能同时填写", type: "error" };
          }
          for (const domain of value.split(",")) {
            const err = net.validateDomain(domain);
            if (err instanceof Error) {
              return { result: false, message: `${domain} ${err.message}`, type: "error" };
            }
          }
        }
        return { result: true, message: "" };
      },
    },
  ],
  ds_exclude_domains: [
    {
      trigger: "change",
      validator: (
        value: typeof accountPolicyInfo.ds_exclude_domains,
      ): CustomValidateResolveType => {
        if (value) {
          if (
            accountPolicyInfo.ds_exclude_domains.split(/[,，]+/g).filter((domain) => !!domain)
              .length > 0 &&
            accountPolicyInfo.ds_include_domains.split(/[,，]+/g).filter((domain) => !!domain)
              .length > 0
          ) {
            return { result: false, message: "包含域名和排除域名不能同时填写", type: "error" };
          }
          for (const domain of value.split(",")) {
            const err = net.validateDomain(domain);
            if (err instanceof Error) {
              return { result: false, message: `${domain} ${err.message}`, type: "error" };
            }
          }
        }
        return { result: true, message: "" };
      },
    },
  ],
};
// 当前选中选项卡
const activeTab = ref<TabValue>(1);
// 上一个选项卡
let lastTabValue: TabValue = 1;

// 是否编辑
const isEdit = computed(() => !!props.id);

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

/**
 * @description: 处理选项卡切换
 * @param {TabValue} value 选项卡的值
 * @returns
 */
const handleTabChange = (value: TabValue): void => {
  loading.value = true;
  validate()
    .then(() => {
      lastTabValue = value;
    })
    .catch(() => {
      activeTab.value = lastTabValue;
    })
    .finally(() => {
      loading.value = false;
    });
};

/**
 * @description: 处理删除 DNS 配置
 * @param {number} index 索引
 * @returns
 */
const handleRemoveDNS = (index: number): void => {
  if (index < accountPolicyInfo.client_dns.length) {
    accountPolicyInfo.client_dns.splice(index, 1);
  }
};

/**
 * @description: 处理添加 DNS 配置
 * @returns
 */
const handlePushDNS = (): void => {
  accountPolicyInfo.client_dns.push({ val: "", ip_mask: "", note: "" });
};

/**
 * @description: 处理删除包含路由配置
 * @param {number} index 索引
 * @returns
 */
const handleRemoveIncludeRoute = (index: number): void => {
  if (index < accountPolicyInfo.route_include.length) {
    accountPolicyInfo.route_include.splice(index, 1);
  }
};

/**
 * @description: 处理添加包含路由配置
 * @returns
 */
const handlePushIncludeRoute = (): void => {
  accountPolicyInfo.route_include.push({ val: "", ip_mask: "", note: "" });
};

/**
 * @description: 处理删除排除路由配置
 * @param {number} index 索引
 * @returns
 */
const handleRemoveExcludeRoute = (index: number): void => {
  if (index < accountPolicyInfo.route_exclude.length) {
    accountPolicyInfo.route_exclude.splice(index, 1);
  }
};

/**
 * @description: 处理添加排除路由配置
 * @returns
 */
const handlePushExcludeRoute = (): void => {
  accountPolicyInfo.route_exclude.push({ val: "", ip_mask: "", note: "" });
};

/**
 * @description: 表单验证
 * @returns {Promise<AccountPolicyCreateInfo|AccountPolicyEditInfo>}
 */
const validate = (): Promise<AccountPolicyCreateInfo | AccountPolicyEditInfo> =>
  new Promise<AccountPolicyCreateInfo | AccountPolicyEditInfo>((resolve, reject) => {
    if (accountPolicyForm.value) {
      accountPolicyForm.value
        .validate()
        .then((result) => {
          if (result === true) {
            resolve(accountPolicyInfo);
          } else {
            reject();
          }
        })
        .catch((e) => reject(e));
    } else {
      reject();
    }
  });

// 判定是否查询详情
if (props.id) {
  fetchAccountPolicyDetail();
}

defineExpose({
  validate,
});
</script>

<template>
  <t-form
    ref="accountPolicyForm"
    v-loading="loading"
    :data="accountPolicyInfo"
    :rules="accountPolicyRules"
  >
    <t-tabs :default-value="1" v-model="activeTab" @change="handleTabChange">
      <!-- 基本信息 -->
      <t-tab-panel :value="1" label="基本信息" :destroy-on-hide="false">
        <t-form-item label="用户名" name="username">
          <t-input
            placeholder="请输入用户名"
            v-model="accountPolicyInfo.username"
            maxlength="30"
            :readonly="isEdit"
            clearable
          ></t-input>
        </t-form-item>
        <t-form-item label="客户端 DNS" name="client_dns">
          <t-space :size="8" direction="vertical">
            <t-space v-for="(dns, index) of accountPolicyInfo.client_dns">
              <t-input
                placeholder="请输入 DNS 地址"
                v-model="dns.val"
                maxlength="15"
                clearable
                :style="{ width: '160px' }"
              ></t-input>
              <t-input
                placeholder="备注"
                v-model="dns.note"
                maxlength="30"
                clearable
                :style="{ width: '162px' }"
              ></t-input>
              <t-button variant="outline" shape="square" @click="handleRemoveDNS(index)">
                <template #icon>
                  <icon name="remove"></icon>
                </template>
              </t-button>
            </t-space>
            <t-button variant="text" theme="primary" @click="handlePushDNS">
              <template #icon>
                <icon name="add"></icon>
              </template>
              <template #default>新增&nbsp;DNS</template>
            </t-button>
          </t-space>
        </t-form-item>
        <t-form-item label="排除本地网络" name="allow_lan">
          <t-space :size="8">
            <t-switch v-model="accountPolicyInfo.allow_lan"></t-switch>
            <span>开启后用户本地所在网段将不会被加密传输</span>
          </t-space>
        </t-form-item>
        <t-form-item label="状态" name="status">
          <t-radio-group
            :default-value="accountPolicyInfo.status"
            v-model="accountPolicyInfo.status"
          >
            <t-radio :value="1">启用</t-radio>
            <t-radio :value="0">停用</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-tab-panel>
      <!-- 路由策略 -->
      <t-tab-panel :value="2" label="路由策略" :destroy-on-hide="false">
        <t-form-item label="包含路由" name="route_include">
          <t-space :size="8" direction="vertical">
            <t-space v-for="(route, index) of accountPolicyInfo.route_include">
              <t-input
                placeholder="请输入网络地址"
                v-model="route.val"
                maxlength="18"
                clearable
                :style="{ width: '180px' }"
              ></t-input>
              <t-input
                placeholder="备注"
                v-model="route.note"
                maxlength="30"
                clearable
                :style="{ width: '142px' }"
              ></t-input>
              <t-button variant="outline" shape="square" @click="handleRemoveIncludeRoute(index)">
                <template #icon>
                  <icon name="remove"></icon>
                </template>
              </t-button>
            </t-space>
            <t-button variant="text" theme="primary" @click="handlePushIncludeRoute">
              <template #icon>
                <icon name="add"></icon>
              </template>
              <template #default>新增路由</template>
            </t-button>
          </t-space>
        </t-form-item>
        <t-form-item label="排除路由" name="route_exclude">
          <t-space :size="8" direction="vertical">
            <t-space v-for="(route, index) of accountPolicyInfo.route_exclude">
              <t-input
                placeholder="请输入网络地址"
                v-model="route.val"
                maxlength="18"
                clearable
                :style="{ width: '180px' }"
              ></t-input>
              <t-input
                placeholder="备注"
                v-model="route.note"
                maxlength="30"
                clearable
                :style="{ width: '190px' }"
              ></t-input>
              <t-button variant="outline" shape="square" @click="handleRemoveExcludeRoute(index)">
                <template #icon>
                  <icon name="remove"></icon>
                </template>
              </t-button>
            </t-space>
            <t-button variant="text" theme="primary" @click="handlePushExcludeRoute">
              <template #icon>
                <icon name="add"></icon>
              </template>
              <template #default>新增路由</template>
            </t-button>
          </t-space>
        </t-form-item>
      </t-tab-panel>
      <!-- 域名策略 -->
      <t-tab-panel :value="3" label="域名策略" :destroy-on-hide="false">
        <t-form-item label="包含域名" name="ds_include_domains">
          <t-textarea
            placeholder="请输入需要包含的域名，多个域名使用英文逗号分隔，默认匹配所有子域名，如：baidu.com,sina.cn"
            v-model="accountPolicyInfo.ds_include_domains"
            :autosize="{ minRows: 6, maxRows: 6 }"
          ></t-textarea>
        </t-form-item>
        <t-form-item label="排除域名" name="ds_exclude_domains">
          <t-textarea
            placeholder="请输入需要排除的域名，多个域名使用英文逗号分隔，默认匹配所有子域名，如：baidu.com,sina.cn"
            v-model="accountPolicyInfo.ds_exclude_domains"
            :autosize="{ minRows: 6, maxRows: 6 }"
          ></t-textarea>
        </t-form-item>
      </t-tab-panel>
    </t-tabs>
  </t-form>
</template>

<style lang="scss" scoped>
.t-tab-panel {
  padding: var(--td-comp-margin-xxl);
}
</style>
