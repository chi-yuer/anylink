<!--
 * @Author: Quarter
 * @Date: 2024-01-29 15:35:52
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-01 11:19:29
 * @FilePath: /anylink/web/src/pages/user/components/account-form.vue
 * @Description: 账号表单
-->
<script lang="ts" setup>
import { ACCOUNT_CREATE_INFO } from "@/data";
import { date, object } from "@/lib";
import { getAllGroupList } from "@/request/group";
import { queryAccountInfo } from "@/request/user";
import { AccountCreateInfo, AccountEditInfo } from "@/types";
import { FormInstanceFunctions, FormRules } from "tdesign-vue-next";
import { PropType, computed, reactive, ref } from "vue";

// 参数
const props = defineProps({
  id: Number as PropType<Number | null>, // 账号 id
});
// 加载动画
const loading = ref(false);
// 群组列表加载动画
const groupLoading = ref(false);
// 群组列表
const groupList = ref<string[]>([]);
// 账号表单
const accountForm = ref<FormInstanceFunctions | null>(null);
// 账号表单信息
let accountInfo = reactive<AccountCreateInfo | AccountEditInfo>(object.copy(ACCOUNT_CREATE_INFO));
// 验证规则
const accountRules: FormRules<typeof accountInfo> = {
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
  nickname: [
    { required: true, trigger: "change", message: "姓名为必填项" },
    {
      pattern: /^[a-zA-Z\u4e00-\u9fa5]/,
      trigger: "change",
      message: "请填写以中文、字母开头的姓名",
    },
    { pattern: /^.{2,}$/, trigger: "change", message: "姓名不能少于 2 个字符" },
    { pattern: /^.{2,30}$/, trigger: "change", message: "姓名不能超过 30 个字符" },
    {
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5（）()_-\s]+$/,
      trigger: "change",
      message: "姓名由中文、字母、数字、空格、（）()_-构成",
    },
  ],
  email: [
    { required: true, trigger: "change", message: "电子邮箱为必填项" },
    { pattern: /^.{3,50}$/, trigger: "change", message: "电子邮箱不能超过 50 个字符" },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
      trigger: "change",
      message: "邮箱格式不受支持，请检查或更换其他邮箱",
    },
  ],
  groups: [{ required: true, trigger: "change", message: "请选择至少一个权限组" }],
  pin_code: [
    { pattern: /^[a-zA-Z0-9]+$/, trigger: "change", message: "PIN 码由数字和字母构成" },
    { pattern: /^.{6,}$/, trigger: "change", message: "PIN 码至少为 6 位" },
    { pattern: /^.{6,20}$/, trigger: "change", message: "PIN 码不能超过 20 个字符" },
  ],
};
// 过期时间开始
const limitDateStart = date.formate(Date.now(), "yyyy-MM-dd");

// 权限群组选项
const groupOptions = computed(() =>
  groupList.value.map((group) => ({ label: group, value: group })),
);

// 是否为编辑
const isEdit = computed(() => !!props.id);

/**
 * @description: 获取群组列表
 * @returns
 */
const fetchGroupList = (): void => {
  groupLoading.value = true;
  getAllGroupList()
    .then(({ datas }) => {
      groupList.value = datas;
    })
    .finally(() => {
      groupLoading.value = false;
    });
};

/**
 * @description: 获取账号详情
 * @returns
 */
const fetchAccountDetail = (): void => {
  if (typeof props.id !== "number") {
    return;
  }
  loading.value = true;
  queryAccountInfo(props.id)
    .then((account) => {
      Object.assign(accountInfo, account, {
        send_email: false,
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

/**
 * @description: 表单验证
 * @returns {Promise<AccountCreateInfo|AccountEditInfo>}
 */
const validate = (): Promise<AccountCreateInfo | AccountEditInfo> =>
  new Promise<AccountCreateInfo | AccountEditInfo>((resolve, reject) => {
    if (accountForm.value) {
      accountForm.value
        .validate()
        .then((result) => {
          if (result === true) {
            resolve(accountInfo);
          } else {
            reject();
          }
        })
        .catch((e) => reject(e));
    } else {
      reject();
    }
  });

// 加载群组列表
fetchGroupList();
// 判定是否查询详情
if (props.id) {
  fetchAccountDetail();
}

// 暴露方法
defineExpose({
  validate,
});
</script>

<template>
  <t-form ref="accountForm" v-loading="loading" :data="accountInfo" :rules="accountRules">
    <t-form-item label="用户名" name="username">
      <t-input
        placeholder="请输入账号用户名"
        v-model="accountInfo.username"
        maxlength="30"
        :readonly="isEdit"
        clearable
      ></t-input>
    </t-form-item>
    <t-form-item label="姓名" name="nickname">
      <t-input
        placeholder="请输入姓名"
        v-model="accountInfo.nickname"
        maxlength="30"
        clearable
      ></t-input>
    </t-form-item>
    <t-form-item label="电子邮箱" name="email">
      <t-input
        placeholder="请输入电子邮箱"
        v-model="accountInfo.email"
        maxlength="50"
        clearable
      ></t-input>
    </t-form-item>
    <t-form-item label="权限组" name="groups" clearable>
      <t-select
        placeholder="请选择授权的权限组"
        :loading="groupLoading"
        v-model="accountInfo.groups"
        :options="groupOptions"
        multiple
      ></t-select>
    </t-form-item>
    <t-form-item label="PIN码" name="pin_code" clearable>
      <t-input
        placeholder="请输入 PIN 码，留空由系统自动生成"
        v-model="accountInfo.pin_code"
        maxlength="20"
      ></t-input>
    </t-form-item>
    <t-form-item label="过期时间" name="limittime" clearable>
      <t-date-picker
        :disable-date="{ before: limitDateStart }"
        placeholder="请选择账号过期时间"
        v-model="accountInfo.limittime"
      ></t-date-picker>
    </t-form-item>
    <t-form-item label="禁用OTP" name="disable_otp">
      <t-switch v-model="accountInfo.disable_otp"></t-switch>
    </t-form-item>
    <t-form-item label="发送邮件" name="send_email">
      <t-switch v-model="accountInfo.send_email"></t-switch>
    </t-form-item>
    <t-form-item label="状态" name="status">
      <t-radio-group :default-value="accountInfo.status" v-model="accountInfo.status">
        <t-radio :value="1">启用</t-radio>
        <t-radio :value="0">停用</t-radio>
        <t-radio :value="2">过期</t-radio>
      </t-radio-group>
    </t-form-item>
  </t-form>
</template>
