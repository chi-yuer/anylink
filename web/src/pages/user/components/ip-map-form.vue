<!--
 * @Author: Quarter
 * @Date: 2024-01-31 15:02:15
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-01 16:13:44
 * @FilePath: /anylink/web/src/pages/user/components/ip-map-form.vue
 * @Description: IP 映射关系表单
-->
<script lang="ts" setup>
import { IP_MAP_CREATE_INFO } from "@/data";
import { net, object } from "@/lib";
import { queryIPMapInfo } from "@/request/user";
import { IPMapCreateInfo, IPMapEditInfo } from "@/types";
import { CustomValidateResolveType, FormInstanceFunctions, FormRules } from "tdesign-vue-next";
import { PropType, reactive, ref } from "vue";

// 参数
const props = defineProps({
  id: Number as PropType<Number | null>, // 账号 id
});
// 加载动画
const loading = ref(false);
// IP 映射关系表单
const ipMapForm = ref<FormInstanceFunctions | null>(null);
// IP 映射关系信息
const ipMapInfo = reactive<IPMapCreateInfo | IPMapEditInfo>(object.copy(IP_MAP_CREATE_INFO));
// IP 映射关系验证规则
const ipMapRules: FormRules<typeof ipMapInfo> = {
  ip_addr: [
    { required: true, trigger: "change", message: "IP 地址为必填项" },
    {
      trigger: "change",
      validator: (value: string): CustomValidateResolveType => {
        const err = net.validateIPAddress(value);
        if (err instanceof Error) {
          return { result: false, message: err.message, type: "error" };
        }
        return { result: true, message: "" };
      },
    },
  ],
  mac_addr: [
    { required: true, trigger: "change", message: "MAC 地址为必填项" },
    {
      pattern: /^([a-fA-F0-9]{2}\:){5}[a-fA-F0-9]{2}$/,
      trigger: "change",
      message: "MAC 地址格式不符合要求",
    },
  ],
  username: [
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
};

/**
 * @description: 获取 IP 映射关系详情
 * @returns
 */
const fetchIPMapDetail = (): void => {
  if (typeof props.id !== "number") {
    return;
  }
  loading.value = true;
  queryIPMapInfo(props.id)
    .then((ipMap) => {
      Object.assign(ipMapInfo, ipMap);
    })
    .finally(() => {
      loading.value = false;
    });
};

/**
 * @description: 表单验证
 * @returns {Promise<IPMapCreateInfo|IPMapEditInfo>}
 */
const validate = (): Promise<IPMapCreateInfo | IPMapEditInfo> =>
  new Promise<IPMapCreateInfo | IPMapEditInfo>((resolve, reject) => {
    if (ipMapForm.value) {
      ipMapForm.value
        .validate()
        .then((result) => {
          if (result === true) {
            resolve(ipMapInfo);
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
  fetchIPMapDetail();
}

defineExpose({
  validate,
});
</script>

<template>
  <t-form ref="ipMapForm" v-loading="loading" :data="ipMapInfo" :rules="ipMapRules">
    <t-form-item label="IP 地址" name="ip_addr">
      <t-input
        placeholder="请输入分配 IP 地址"
        v-model="ipMapInfo.ip_addr"
        maxlength="15"
        clearable
      ></t-input>
    </t-form-item>
    <t-form-item label="MAC 地址" name="mac_addr">
      <t-input
        placeholder="请输入设备 MAC 地址"
        v-model="ipMapInfo.mac_addr"
        maxlength="17"
        clearable
      ></t-input>
    </t-form-item>
    <t-form-item label="用户名" name="username">
      <t-input
        placeholder="请输入绑定用户名"
        v-model="ipMapInfo.username"
        maxlength="30"
        clearable
      ></t-input>
    </t-form-item>
    <t-form-item label="备注" name="note">
      <t-input placeholder="请输入备注" v-model="ipMapInfo.note" maxlength="50" clearable></t-input>
    </t-form-item>
    <t-form-item label="IP 保留" name="keep">
      <t-switch v-model="ipMapInfo.keep"></t-switch>
    </t-form-item>
  </t-form>
</template>
