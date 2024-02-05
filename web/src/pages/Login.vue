<!--
 * @Author: Quarter
 * @Date: 2024-01-26 10:39:48
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-01 11:43:30
 * @FilePath: /anylink/web/src/pages/login.vue
 * @Description: 登录页面
-->
<script lang="ts" setup>
import { auth } from "@/lib";
import { login } from "@/request/base";
import { FormInstanceFunctions, FormRules, Icon } from "tdesign-vue-next";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

// APP 版本
const version = __APP__.version;
// 表单
const loginForm = ref<FormInstanceFunctions | null>(null);
// 登录加载动画
const loading = ref(false);
// 路由实例
const router = useRouter();

// 账号信息
const account = reactive({
  admin_user: "",
  admin_pass: "",
});

// 表单验证规则
const validateRules: FormRules<typeof account> = {
  admin_user: [
    { required: true, trigger: "change", message: "请输入管理员账户" },
    { pattern: /^.{2,}$/, trigger: "change", message: "用户名不能少于 2 位" },
    { pattern: /^.{2,30}$/, trigger: "change", message: "用户名不能超过 30 位" },
  ],
  admin_pass: [
    { required: true, trigger: "change", message: "请输入管理员密码" },
    { pattern: /^.{2,}$/, trigger: "change", message: "密码不能少于 2 位" },
    { pattern: /^.{2,30}$/, trigger: "change", message: "密码不能超过 30 位" },
  ],
};

/**
 * @description: 处理校验
 * @returns
 */
const handleValidate = () => {
  loginForm.value?.validate().then((result) => {
    if (result === true) {
      handleSubmit();
    }
  });
};

/**
 * @description: 处理提交
 * @returns
 */
const handleSubmit = (): void => {
  loading.value = true;
  login(account)
    .then(({ admin_user, token }) => {
      auth.login({ username: admin_user, token });
      router.replace({ path: "/admin" });
    })
    .catch((e) => {
      loading.value = false;
      throw e;
    });
};
</script>

<template>
  <div class="page-login">
    <div class="page-login__login-box">
      <div class="page-login__login-header">
        <div class="page-login__login-title">AnyLink&nbsp;管理后台</div>
        <div class="page-login__login-description">
          一个企业级远程办公&nbsp;SSL&nbsp;VPN&nbsp;的软件
        </div>
      </div>
      <div class="page-login__login-form">
        <t-form ref="loginForm" :data="account" :rules="validateRules" label-width="0">
          <t-form-item name="admin_user">
            <t-input
              placeholder="管理员账号"
              name="admin_user"
              v-model="account.admin_user"
              size="large"
              maxlength="30"
              clearable
              @enter="handleValidate"
            ></t-input>
          </t-form-item>
          <t-form-item name="admin_pass">
            <t-input
              placeholder="管理员密码"
              type="password"
              name="admin_pass"
              v-model="account.admin_pass"
              size="large"
              maxlength="30"
              clearable
              @enter="handleValidate"
            ></t-input>
          </t-form-item>
        </t-form>
      </div>
      <div class="page-login__login-operation">
        <t-button :loading="loading" size="large" block @click="handleValidate">
          <template #icon><icon name="login"></icon></template>
          <template #default>登录</template>
        </t-button>
      </div>
      <div class="page-login__login-footer">
        <span>Powered&nbsp;by&nbsp;</span>
        <t-link theme="primary" target="__blanket" href="https://github.com/chi-yuer/anylink"
          >AnyLink</t-link
        >
        <span>&nbsp;-&nbsp;App&nbsp;Version&nbsp;{{ version }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.page-login {
  width: 100%;
  height: 100%;
  color: var(--td-font-gray-1);
  background-color: #f0f3f8;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-login__login-box {
  width: 480px;
  padding: 24px;
  border-radius: var(--td-radius-medium);
  background-color: rgba($color: #ffffff, $alpha: 0.8);
  box-shadow: var(--td-shadow-3);
  backdrop-filter: blur(10px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.page-login__login-header {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-login__login-title {
  width: 100%;
  font-size: var(--td-font-size-headline-medium);
}

.page-login__login-description {
  width: 100%;
  color: var(--td-text-color-secondary);
  font-size: var(--td-font-size-title-medium);
}

.page-login__login-form {
  width: 100%;
}

.page-login__login-operation {
  width: 100%;
}

.page-login__login-footer {
  width: calc(100% + 24px * 2);
  padding: 16px 24px;
  color: var(--td-text-color-placeholder);
  text-align: center;
  user-select: none;
  background-color: var(--td-gray-color-1);
  margin-bottom: -24px;

  .t-link--theme-primary {
    color: inherit;

    &:hover {
      color: var(--td-brand-color-hover);
    }
  }
}
</style>
