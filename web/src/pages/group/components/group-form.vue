<!--
 * @Author: Quarter
 * @Date: 2024-01-29 21:24:11
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-05 17:12:09
 * @FilePath: /anylink/web/src/pages/group/components/group-form.vue
 * @Description: 权限组表单
-->
<script lang="ts" setup>
import { GROUP_CREATE_INFO, GROUP_LDAP_CONFIG, GROUP_RADIUS_CONFIG } from "@/data";
import { net, object, string } from "@/lib";
import { queryGroupInfo, validateAuth } from "@/request/group";
import { GroupCreateInfo, GroupEditInfo } from "@/types";
import {
  CustomValidateResolveType,
  FormInstanceFunctions,
  FormRules,
  Icon,
  MessagePlugin,
  TabValue,
} from "tdesign-vue-next";
import { PropType, computed, reactive, ref } from "vue";

// 参数
const props = defineProps({
  id: Number as PropType<Number | null>, // 账号 id
});
// 加载动画
const loading = ref(false);
// 权限组表单
const groupForm = ref<FormInstanceFunctions | null>(null);
// 登录认证表单
const loginForm = ref<FormInstanceFunctions | null>(null);
// 权限组信息
let groupInfo = reactive<GroupCreateInfo | GroupEditInfo>(object.copy(GROUP_CREATE_INFO));
// 认证账号
const accountInfo = reactive({
  username: "", // 用户名
  password: "", // 密码
});
// 权限组验证规则
const groupRules: FormRules<typeof groupInfo> = {
  name: [
    { required: true, trigger: "change", message: "组名为必填项" },
    { pattern: /^.{3,}$/, trigger: "change", message: "组名不能少于 3 个字符" },
    { pattern: /^.{3,30}$/, trigger: "change", message: "组名不能超过 30 个字符" },
    {
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/,
      trigger: "change",
      message: "组名由中文、字母、数字、_-构成",
    },
  ],
  bandwidth: [
    { required: true, trigger: "change", message: "带宽限制是必填项，0 代表不作限制" },
    { pattern: /^[0-9]+(\.[0-9]+){0,1}$/, trigger: "change", message: "带宽必须为正数" },
  ],
  client_dns: [
    {
      trigger: "change",
      validator: (value: typeof groupInfo.client_dns): CustomValidateResolveType => {
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
      validator: (value: typeof groupInfo.route_include): CustomValidateResolveType => {
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
      validator: (value: typeof groupInfo.route_exclude): CustomValidateResolveType => {
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
  link_acl: [
    {
      trigger: "change",
      validator: (value: typeof groupInfo.link_acl): CustomValidateResolveType => {
        if (Array.isArray(value)) {
          for (const acl of value) {
            const err = net.validateCIDR(acl.val);
            if (err instanceof Error) {
              return { result: false, message: err.message, type: "error" };
            }
            if (string.clean(acl.port.toString()).length === 0) {
              return { result: false, message: "端口为必填项", type: "error" };
            }
            if (!/^[0-9]+$/.test(acl.port.toString())) {
              return { result: false, message: "端口必须为正整数", type: "error" };
            }
            if (
              parseInt(acl.port.toString(), 10) < 0 ||
              parseInt(acl.port.toString(), 10) > 65535
            ) {
              return {
                result: false,
                message: "端口号必须在 0-65535 之间，0 为任意端口",
                type: "error",
              };
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
      validator: (value: typeof groupInfo.ds_include_domains): CustomValidateResolveType => {
        if (value) {
          if (
            groupInfo.ds_exclude_domains.split(/[,，]+/g).filter((domain) => !!domain).length > 0 &&
            groupInfo.ds_include_domains.split(/[,，]+/g).filter((domain) => !!domain).length > 0
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
      validator: (value: typeof groupInfo.ds_exclude_domains): CustomValidateResolveType => {
        if (value) {
          if (
            groupInfo.ds_exclude_domains.split(/[,，]+/g).filter((domain) => !!domain).length > 0 &&
            groupInfo.ds_include_domains.split(/[,，]+/g).filter((domain) => !!domain).length > 0
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
// 账号验证规则
const accountRules: FormRules<typeof accountInfo> = {
  username: [{ required: true, trigger: "change", message: "用户名为必填项" }],
  password: [{ required: true, trigger: "change", message: "密码为必填项" }],
};
// 当前选中选项卡
const activeTab = ref<TabValue>(1);
// 上一个选项卡
let lastTabValue: TabValue = 1;
// 访问控制选项
const actionList = [
  { label: "允许", value: "allow" },
  { label: "拒绝", value: "deny" },
];
// 认证测试加载动画
const authLoading = ref(false);
// 账号验证弹窗显隐
const accountValidateVisible = ref(false);

// 是否编辑
const isEdit = computed(() => !!props.id);

// 带宽限制
const bandwidth = computed<number>({
  get: () => groupInfo.bandwidth / 125000,
  set: (value) => {
    if (value && /^[0-9]+(\.[0-9]+){0,1}$/.test(value.toString())) {
      groupInfo.bandwidth = Math.floor(parseFloat(value.toString()) * 125000);
    } else {
      groupInfo.bandwidth = value;
    }
  },
});

/**
 * @description: 获取权限组详情
 * @returns
 */
const fetchGroupDetail = (): void => {
  if (typeof props.id !== "number") {
    return;
  }
  loading.value = true;
  queryGroupInfo(props.id)
    .then((group) => {
      Object.assign(groupInfo, {
        ...object.copy(group),
        auth: {
          ...group.auth,
          radius: group.auth.radius || object.copy(GROUP_RADIUS_CONFIG),
          ldap: group.auth.ldap || object.copy(GROUP_LDAP_CONFIG),
        },
      });
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
  if (index < groupInfo.client_dns.length) {
    groupInfo.client_dns.splice(index, 1);
  }
};

/**
 * @description: 处理添加 DNS 配置
 * @returns
 */
const handlePushDNS = (): void => {
  groupInfo.client_dns.push({ val: "", ip_mask: "", note: "" });
};

/**
 * @description: 处理认证类型切换事件
 * @returns
 */
const handleAuthTypeChange = (): void => {
  groupInfo.auth.radius = object.copy(GROUP_RADIUS_CONFIG);
  groupInfo.auth.ldap = object.copy(GROUP_LDAP_CONFIG);
};

/**
 * @description: 处理显示账号验证弹窗
 * @returns
 */
const handleShowAccountValidate = (): void => {
  groupForm.value?.validate().then((result) => {
    if (result === true) {
      accountInfo.username = "";
      accountInfo.password = "";
      accountValidateVisible.value = true;
    }
  });
};

/**
 * @description: 处理测试登录
 * @returns
 */
const handleValidateAuth = (): void => {
  loginForm.value?.validate().then((result) => {
    if (result === true) {
      authLoading.value = true;
      validateAuth(accountInfo, groupInfo.auth)
        .then(() => {
          MessagePlugin.success("连接成功");
        })
        .finally(() => {
          authLoading.value = false;
        });
    }
  });
};

/**
 * @description: 处理删除包含路由配置
 * @param {number} index 索引
 * @returns
 */
const handleRemoveIncludeRoute = (index: number): void => {
  if (index < groupInfo.route_include.length) {
    groupInfo.route_include.splice(index, 1);
  }
};

/**
 * @description: 处理添加包含路由配置
 * @returns
 */
const handlePushIncludeRoute = (): void => {
  groupInfo.route_include.push({ val: "", ip_mask: "", note: "" });
};

/**
 * @description: 处理删除排除路由配置
 * @param {number} index 索引
 * @returns
 */
const handleRemoveExcludeRoute = (index: number): void => {
  if (index < groupInfo.route_exclude.length) {
    groupInfo.route_exclude.splice(index, 1);
  }
};

/**
 * @description: 处理添加排除路由配置
 * @returns
 */
const handlePushExcludeRoute = (): void => {
  groupInfo.route_exclude.push({ val: "", ip_mask: "", note: "" });
};

/**
 * @description: 处理添加访问控制配置
 * @returns
 */
const handlePushLinkACL = (): void => {
  groupInfo.link_acl.push({ action: "allow", val: "", port: 0, note: "" });
};

/**
 * @description: 处理删除访问控制规则
 * @param {number} index 索引
 * @returns
 */
const handleRemoveACL = (index: number): void => {
  if (index < groupInfo.link_acl.length) {
    groupInfo.link_acl.splice(index, 1);
  }
};

/**
 * @description: 表单验证
 * @returns {Promise<GroupCreateInfo|GroupEditInfo>}
 */
const validate = (): Promise<GroupCreateInfo | GroupEditInfo> =>
  new Promise<GroupCreateInfo | GroupEditInfo>((resolve, reject) => {
    if (groupForm.value) {
      groupForm.value
        .validate()
        .then((result) => {
          if (result === true) {
            resolve(groupInfo);
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
  fetchGroupDetail();
}

defineExpose({
  validate,
});
</script>

<template>
  <t-form ref="groupForm" v-loading="loading" :data="groupInfo" :rules="groupRules">
    <t-tabs :default-value="1" v-model="activeTab" @change="handleTabChange">
      <!-- 基本信息 -->
      <t-tab-panel :value="1" label="基本信息" :destroy-on-hide="false">
        <t-form-item label="组名" name="name">
          <t-input
            placeholder="请输入权限组组名"
            v-model="groupInfo.name"
            maxlength="30"
            :readonly="isEdit"
            clearable
          ></t-input>
        </t-form-item>
        <t-form-item label="客户端 DNS" name="client_dns">
          <t-space :size="8" direction="vertical">
            <t-space v-for="(dns, index) of groupInfo.client_dns">
              <t-input
                placeholder="请输入 DNS 地址"
                v-model="dns.val"
                maxlength="15"
                clearable
                :style="{ width: '210px' }"
              ></t-input>
              <t-input
                placeholder="备注"
                v-model="dns.note"
                maxlength="30"
                clearable
                :style="{ width: '312px' }"
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
        <t-form-item label="带宽限制" name="username">
          <t-input-adornment append="Mbps">
            <t-input
              placeholder="请输入带宽限制"
              v-model="bandwidth"
              maxlength="10"
              :style="{ width: '100px' }"
            ></t-input>
          </t-input-adornment>
        </t-form-item>
        <t-form-item label="排除本地网络" name="allow_lan">
          <t-space :size="8" align="center">
            <t-switch v-model="groupInfo.allow_lan"></t-switch>
            <span>开启后用户本地所在网段将不会被加密传输</span>
          </t-space>
        </t-form-item>
        <t-form-item label="状态" name="status">
          <t-radio-group :default-value="groupInfo.status" v-model="groupInfo.status">
            <t-radio :value="1">启用</t-radio>
            <t-radio :value="0">停用</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-tab-panel>
      <!-- 用户认证 -->
      <t-tab-panel :value="2" label="用户认证" :destroy-on-hide="false">
        <t-form-item label="认证方式" name="auth.type" @change="handleAuthTypeChange">
          <t-radio-group v-model="groupInfo.auth.type">
            <t-radio value="local">本地</t-radio>
            <t-radio value="radius">Radius</t-radio>
            <t-radio value="ldap">LDAP</t-radio>
          </t-radio-group>
        </t-form-item>
        <!-- Radius 专属配置 -->
        <template v-if="groupInfo.auth.type === 'radius'">
          <t-form-item
            label="连接地址"
            name="auth.radius.addr"
            :rules="[{ required: true, trigger: 'change', message: '连接地址为必填项' }]"
            required-mark
          >
            <t-input
              placeholder="请输入连接地址，例如 127.0.0.1:1812"
              v-model="groupInfo.auth.radius.addr"
              maxlength="50"
              clearable
            ></t-input>
          </t-form-item>
          <t-form-item
            label="连接密钥"
            name="auth.radius.secret"
            :rules="[
              { required: true, trigger: 'change', message: '连接密钥为必填项' },
              { pattern: /^.{8,200}$/, trigger: 'change', message: '连接密钥的长度为 8-200 位' },
            ]"
            required-mark
          >
            <t-input
              placeholder="请输入连接密钥"
              v-model="groupInfo.auth.radius.secret"
              type="password"
              maxlength="200"
              clearable
            ></t-input>
          </t-form-item>
          <t-form-item>
            <t-button @click="handleShowAccountValidate">测试连接</t-button>
          </t-form-item>
        </template>
        <!-- LDAP 专属配置 -->
        <template v-if="groupInfo.auth.type === 'ldap'">
          <t-form-item
            label="连接地址"
            name="auth.ldap.addr"
            :rules="[{ required: true, trigger: 'change', message: '连接地址为必填项' }]"
            required-mark
          >
            <t-input
              placeholder="请输入连接地址，例如 127.0.0.1:389"
              v-model="groupInfo.auth.ldap.addr"
              maxlength="50"
              clearable
            ></t-input>
          </t-form-item>
          <t-form-item label="开启 TLS" name="auth.ldap.tls">
            <t-switch v-model="groupInfo.auth.ldap.tls"></t-switch>
          </t-form-item>
          <t-form-item
            label="管理员 DN"
            name="auth.ldap.bind_name"
            :rules="[{ required: true, trigger: 'change', message: '管理员 DN 为必填项' }]"
            required-mark
          >
            <t-input
              placeholder="请输入管理员 DN，例如 CN=bindadmin,DC=abc,DC=COM"
              v-model="groupInfo.auth.ldap.bind_name"
              maxlength="50"
              clearable
            ></t-input>
          </t-form-item>
          <t-form-item
            label="管理员密码"
            name="auth.ldap.bind_pwd"
            :rules="[{ required: true, trigger: 'change', message: '管理员密码为必填项' }]"
            required-mark
          >
            <t-input
              placeholder="请输入管理员密码"
              v-model="groupInfo.auth.ldap.bind_pwd"
              type="password"
              maxlength="50"
              clearable
            ></t-input>
          </t-form-item>
          <t-form-item
            label="Base DN"
            name="auth.ldap.base_dn"
            :rules="[{ required: true, trigger: 'change', message: 'Base DN 为必填项' }]"
            required-mark
          >
            <t-input
              placeholder="请输入Base DN，例如 DC=abc,DC=com"
              v-model="groupInfo.auth.ldap.base_dn"
              maxlength="50"
              clearable
            ></t-input>
          </t-form-item>
          <t-form-item
            label="用户对象类"
            name="auth.ldap.object_class"
            :rules="[{ required: true, trigger: 'change', message: '用户对象类为必填项' }]"
            required-mark
          >
            <t-input
              placeholder="请输入用户对象类，例如 person / user / posixAccount"
              v-model="groupInfo.auth.ldap.object_class"
              maxlength="50"
              clearable
            ></t-input>
          </t-form-item>
          <t-form-item
            label="用户唯一ID"
            name="auth.ldap.search_attr"
            :rules="[{ required: true, trigger: 'change', message: '用户唯一ID为必填项' }]"
            required-mark
          >
            <t-input
              placeholder="请输入用户唯一ID，例如 sAMAccountName / uid / cn"
              v-model="groupInfo.auth.ldap.search_attr"
              maxlength="50"
              clearable
            ></t-input>
          </t-form-item>
          <t-form-item label="受限用户组" name="auth.ldap.member_of">
            <t-input
              placeholder="请输入指定用户组, 例如 CN=HomeWork,DC=abc,DC=com"
              v-model="groupInfo.auth.ldap.member_of"
              maxlength="50"
              clearable
            ></t-input>
          </t-form-item>
          <t-form-item>
            <t-button @click="handleShowAccountValidate">测试连接</t-button>
          </t-form-item>
        </template>
      </t-tab-panel>
      <!-- 路由策略 -->
      <t-tab-panel :value="3" label="路由策略" :destroy-on-hide="false">
        <t-form-item label="包含路由" name="route_include">
          <t-space :size="8" direction="vertical">
            <t-space v-for="(route, index) of groupInfo.route_include">
              <t-input
                placeholder="请输入网络地址"
                v-model="route.val"
                maxlength="18"
                clearable
                :style="{ width: '230px' }"
              ></t-input>
              <t-input
                placeholder="备注"
                v-model="route.note"
                maxlength="30"
                clearable
                :style="{ width: '292px' }"
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
            <t-space v-for="(route, index) of groupInfo.route_exclude">
              <t-input
                placeholder="请输入网络地址"
                v-model="route.val"
                maxlength="18"
                clearable
                :style="{ width: '230px' }"
              ></t-input>
              <t-input
                placeholder="备注"
                v-model="route.note"
                maxlength="30"
                clearable
                :style="{ width: '292px' }"
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
      <!-- 访问控制 -->
      <t-tab-panel :value="4" label="访问控制" :destroy-on-hide="false">
        <t-form-item label="访问控制" name="link_acl">
          <t-space :size="8" direction="vertical">
            <t-space v-for="(acl, index) of groupInfo.link_acl">
              <t-select
                placeholder="请选择控制类型"
                v-model="acl.action"
                :options="actionList"
                :style="{ width: '80px' }"
              ></t-select>
              <t-input
                placeholder="网络地址"
                v-model="acl.val"
                maxlength="18"
                :style="{ width: '160px' }"
              ></t-input>
              <t-input
                placeholder="端口号"
                v-model="acl.port"
                maxlength="5"
                :style="{ width: '80px' }"
              ></t-input>
              <t-input
                placeholder="备注"
                v-model="acl.note"
                maxlength="30"
                clearable
                :style="{ width: '166px' }"
              ></t-input>
              <t-button variant="outline" shape="square" @click="handleRemoveACL(index)">
                <template #icon>
                  <icon name="remove"></icon>
                </template>
              </t-button>
            </t-space>
            <t-button variant="text" theme="primary" @click="handlePushLinkACL">
              <template #icon>
                <icon name="add"></icon>
              </template>
              <template #default>新增策略</template>
            </t-button>
          </t-space>
        </t-form-item>
      </t-tab-panel>
      <!-- 域名策略 -->
      <t-tab-panel :value="5" label="域名策略" :destroy-on-hide="false">
        <t-form-item label="包含域名" name="ds_include_domains">
          <t-textarea
            placeholder="请输入需要包含的域名，多个域名使用英文逗号分隔，默认匹配所有子域名，如：baidu.com,sina.cn"
            v-model="groupInfo.ds_include_domains"
            :autosize="{ minRows: 6, maxRows: 6 }"
          ></t-textarea>
        </t-form-item>
        <t-form-item label="排除域名" name="ds_exclude_domains">
          <t-textarea
            placeholder="请输入需要排除的域名，多个域名使用英文逗号分隔，默认匹配所有子域名，如：baidu.com,sina.cn"
            v-model="groupInfo.ds_exclude_domains"
            :autosize="{ minRows: 6, maxRows: 6 }"
          ></t-textarea>
        </t-form-item>
      </t-tab-panel>
    </t-tabs>
  </t-form>
  <!-- 账号验证弹窗 -->
  <t-dialog
    :visible="accountValidateVisible"
    width="500px"
    placement="center"
    header="账号验证"
    :confirm-btn="{
      theme: 'primary',
      default: '验证',
    }"
    destroy-on-close
    :close-on-overlay-click="false"
    @close="accountValidateVisible = false"
    @esc-keydown="accountValidateVisible = false"
    @cancel="accountValidateVisible = false"
    @confirm="handleValidateAuth"
  >
    <t-form ref="loginForm" :data="accountInfo" :rules="accountRules">
      <t-form-item label="账号" name="username">
        <t-input
          placeholder="请输入账号"
          v-model="accountInfo.username"
          maxlength="30"
          clearable
        ></t-input>
      </t-form-item>
      <t-form-item label="密码" name="password">
        <t-input
          placeholder="请输入密码"
          v-model="accountInfo.password"
          type="password"
          maxlength="30"
          clearable
        ></t-input>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<style lang="scss" scoped>
.t-tab-panel {
  padding: var(--td-comp-margin-xxl);
}
</style>
