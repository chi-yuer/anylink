<!--
 * @Author: Quarter
 * @Date: 2024-02-05 17:02:20
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-20 16:44:58
 * @FilePath: /anylink/web/src/pages/system/system-config.vue
 * @Description: 系统配置
-->
<script lang="ts" setup>
import {
  AUDIT_CONFIG,
  MAIL_CONFIG,
  OTHER_CONFIG,
  SSL_ALI_YUN_CONFIG,
  SSL_APPLY_CONFIG,
  SSL_CLOUDFLARE_CONFIG,
  SSL_CUSTOM_CONFIG,
  SSL_TENCENT_CLOUD_CONFIG,
} from "@/data";
import { object, string } from "@/lib";
import { frameworkStore } from "@/plugins";
import {
  queryAuditConfig,
  queryBaseConfigList,
  queryMailConfig,
  queryOtherConfig,
  querySSLApplyConfig,
  updateAuditConfig,
  updateMailConfig,
  updateOtherConfig,
  updateSSLApplyConfig,
  updateSSLCustomConfig,
} from "@/request/system";
import { BaseConfigRecord, SSLApplyConfig, SSLCustomConfig } from "@/types";
import {
  BaseTableCol,
  CustomValidateResolveType,
  FormInstanceFunctions,
  FormRules,
  MessagePlugin,
  UploadFile,
} from "tdesign-vue-next";
import { computed, reactive, ref } from "vue";

// 框架状态
const framework = frameworkStore();
// 当前选中标签页
const activePanel = ref(1);
// 基本配置列
const baseConfigColumns: BaseTableCol<BaseConfigRecord>[] = [
  { colKey: "info", title: "配置名" },
  { colKey: "name", title: "配置项" },
  { colKey: "env", title: "环境变量名" },
  { colKey: "data", title: "配置值" },
];
// 基本配置列表
const baseConfigLise = ref<BaseConfigRecord[]>([]);
// SMTP 加密类型
const SMTPEncryptionOptions = ["None", "SSLTLS", "STARTTLS"].map((item) => ({
  label: item,
  value: item,
}));
// 邮件配置表单
const mailConfigForm = ref<FormInstanceFunctions | null>(null);
// 邮件配置
const mailConfig = reactive(object.copy(MAIL_CONFIG));
// 邮件配置验证规则
const mailConfigRules: FormRules<typeof mailConfig> = {
  host: [
    { required: true, trigger: "blur", message: "邮件主机地址为必填项" },
    {
      pattern: /^([a-z0-9\u4e00-\u9fa5\-]+\.)+[a-z0-9\u4e00-\u9fa5]+$/,
      trigger: "change",
      message: "请输入标准域名或 IP 地址",
    },
  ],
  port: [
    { required: true, trigger: "blur", message: "邮件主机端口号为必填项" },
    { pattern: /^[1-9]{1}[0-9]{0,4}$/, trigger: "change", message: "端口号必须为正整数" },
    {
      trigger: "change",
      validator: (value: typeof mailConfig.port): CustomValidateResolveType => {
        if (string.clean(String(value)).length > 0) {
          const port = parseInt(String(value), 10);
          if (port <= 0 || port > 65535) {
            return { result: false, message: "端口号必须在 0 ~ 65535 之间" };
          }
        }
        return { result: true, message: "" };
      },
    },
  ],
  username: [{ required: true, trigger: "blur", message: "用户名为必填项" }],
  encryption: [{ required: true, trigger: "blur", message: "加密方式为必填项" }],
  from: [
    { required: true, trigger: "blur", message: "邮件 From 地址为必填项" },
    {
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5_\-]+@([a-z0-9\u4e00-\u9fa5\-]+\.)+[a-z0-9\u4e00-\u9fa5]+$/,
      trigger: "change",
      message: "邮件格式有误，请核查是否有误",
    },
  ],
};
// 审计配置表单
const auditConfigForm = ref<FormInstanceFunctions | null>(null);
// 审计配置
const auditConfig = reactive(object.copy(AUDIT_CONFIG));
// 审计配置验证规则
const auditConfigRules: FormRules<typeof auditConfig> = {};
// SSL 配置表单
const sslConfigForm = ref<FormInstanceFunctions | null>(null);
// 证书类型选项
const SSLTypeOptions = [
  { label: "自定义证书", value: 1 },
  { label: "Let's Encrypt 证书", value: 2 },
];
// 证书类型
const SSLType = ref(1);
// 自定义证书配置
const sslCustomConfig = reactive(object.copy(SSL_CUSTOM_CONFIG));
// 证书类型选项
const DomainProviderOptions = [
  { label: "阿里云", value: "aliyun" },
  { label: "腾讯云", value: "txcloud" },
  { label: "cloudflare", value: "cfcloud" },
];
// Let's Encrypt 申请配置
const sslApplyConfig = reactive(object.copy(SSL_APPLY_CONFIG));
// 自定义 SSL 证书表单规则
const sslCustomConfigRules: FormRules<typeof sslCustomConfig> = {
  cert: [{ required: true, trigger: "change", message: "SSL 证书为必填项" }],
  key: [{ required: true, trigger: "change", message: "SSL 私钥为必填项" }],
};
//  Let's Encrypt 申请配置表单规则
const sslApplyConfigRules: FormRules<typeof sslApplyConfig> = {
  domain: [
    { required: true, trigger: "blur", message: "域名为必填项" },
    {
      pattern: /^([a-z0-9\u4e00-\u9fa5\-]+\.)+[a-z0-9\u4e00-\u9fa5]$/,
      trigger: "change",
      message: "域名不符合规范，请核查是否有误",
    },
  ],
  legomail: [
    { required: true, trigger: "blur", message: "申请邮箱为必填项" },
    {
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5_\-]+@([a-z0-9\u4e00-\u9fa5\-]+\.)+[a-z0-9\u4e00-\u9fa5]+$/,
      trigger: "change",
      message: "邮件格式有误，请核查是否有误",
    },
  ],
  name: [{ required: true, trigger: "change", message: "域名提供商为必填项" }],
};
// SSL 阿里云验证规则
const sslALiCloudConfigRules: FormRules = {
  "aliyun.apiKey": [{ required: true, trigger: "blur", message: "API Key 为必填项" }],
  "aliyun.secretKey": [{ required: true, trigger: "blur", message: "Secret Key 为必填项" }],
};
// SSL Cloudflare 验证规则
const sslCloudflareConfigRules: FormRules = {
  "cfcloud.authToken": [{ required: true, trigger: "blur", message: "token 为必填项" }],
};
// SSL 腾讯云验证规则
const sslTencentCloudConfigRules: FormRules = {
  "txcloud.secretId": [{ required: true, trigger: "blur", message: "Secret ID 为必填项" }],
  "txcloud.secretKey": [{ required: true, trigger: "blur", message: "Secret Key 为必填项" }],
};
// 其它配置表单
const otherConfigForm = ref<FormInstanceFunctions | null>(null);
// 其它配置
const otherConfig = reactive(object.copy(OTHER_CONFIG));
// 其它配置验证规则
const otherConfigRules: FormRules<typeof otherConfig> = {
  link_addr: [
    {
      pattern: /^([a-z0-9\u4e00-\u9fa5\-]+\.)+[a-z0-9\u4e00-\u9fa5]+(:[0-9]{1,5})?$/,
      trigger: "change",
      message: "请输入标准域名或 IP 地址的格式",
    },
  ],
};

// SSL 证书文件
const SSLCertFile = computed<UploadFile[]>({
  get: (): UploadFile[] => {
    if (sslCustomConfig.cert instanceof File) {
      return [
        {
          name: sslCustomConfig.cert.name,
          percent: 0,
          raw: sslCustomConfig.cert,
          size: sslCustomConfig.cert.size,
          type: "",
        },
      ];
    }
    return [];
  },
  set: (files): void => {
    if (Array.isArray(files) && files[0]?.raw instanceof File) {
      sslCustomConfig.cert = files[0].raw;
    } else {
      sslCustomConfig.cert = null;
    }
  },
});

// SSL 私钥文件
const SSLKeyFile = computed<UploadFile[]>({
  get: (): UploadFile[] => {
    if (sslCustomConfig.key instanceof File) {
      return [
        {
          name: sslCustomConfig.key.name,
          percent: 0,
          raw: sslCustomConfig.key,
          size: sslCustomConfig.key.size,
          type: "",
        },
      ];
    }
    return [];
  },
  set: (files): void => {
    if (Array.isArray(files) && files[0]?.raw instanceof File) {
      sslCustomConfig.key = files[0].raw;
    } else {
      sslCustomConfig.key = null;
    }
  },
});

// SSL 配置
const sslConfig = computed<SSLCustomConfig | SSLApplyConfig>(() =>
  SSLType.value === 1 ? sslCustomConfig : sslApplyConfig,
);

// SSL 配置验证规则
const sslConfigRules = computed<FormRules>(() => {
  if (SSLType.value === 1) {
    return sslCustomConfigRules;
  } else {
    if (sslApplyConfig.name === "aliyun") {
      return { ...sslApplyConfigRules, ...sslALiCloudConfigRules };
    } else if (sslApplyConfig.name === "txcloud") {
      return { ...sslApplyConfigRules, ...sslTencentCloudConfigRules };
    } else {
      return { ...sslApplyConfigRules, ...sslCloudflareConfigRules };
    }
  }
});

/**
 * @description: 获取权限组列表
 * @returns
 */
const fetchBaseConfigList = (): void => {
  framework.loading();
  queryBaseConfigList()
    .then((data) => {
      baseConfigLise.value = data || [];
    })
    .finally(() => {
      framework.loaded();
    });
};

/**
 * @description: 获取邮件配置
 * @returns
 */
const fetchMailConfig = (): void => {
  framework.loading();
  queryMailConfig()
    .then((data) => {
      Object.assign(mailConfig, object.copy(data));
    })
    .finally(() => {
      framework.loaded();
    });
};

/**
 * @description: 处理更新邮件配置
 * @returns
 */
const handleUpdateMailConfig = (): void => {
  if (mailConfigForm.value) {
    mailConfigForm.value.validate().then((result) => {
      if (result === true) {
        framework.loading();
        updateMailConfig(mailConfig)
          .then(() => {
            MessagePlugin.success("邮件配置已更新");
            fetchMailConfig();
          })
          .finally(() => {
            framework.loaded();
          });
      }
    });
  }
};

/**
 * @description: 获取审计配置
 * @returns
 */
const fetchAuditConfig = (): void => {
  framework.loading();
  queryAuditConfig()
    .then((data) => {
      Object.assign(auditConfig, object.copy(data));
    })
    .finally(() => {
      framework.loaded();
    });
};

/**
 * @description: 处理更新审计配置
 * @returns
 */
const handleUpdateAuditConfig = (): void => {
  if (auditConfigForm.value) {
    auditConfigForm.value.validate().then((result) => {
      if (result === true) {
        framework.loading();
        updateAuditConfig(auditConfig)
          .then(() => {
            MessagePlugin.success("审计配置已更新");
            fetchAuditConfig();
          })
          .finally(() => {
            framework.loaded();
          });
      }
    });
  }
};

/**
 * @description: 处理 SSL 证书类型切换
 * @returns
 */
const handleSSLTypeChange = (): void => {
  Object.assign(sslCustomConfig, object.copy(SSL_CUSTOM_CONFIG));
  Object.assign(sslApplyConfig, object.copy(SSL_APPLY_CONFIG));
  if (SSLType.value === 2) {
    fetchSSLApplyConfig();
  }
};

/**
 * @description: 获取 SSL 申请配置
 * @returns
 */
const fetchSSLApplyConfig = (): void => {
  framework.loading();
  querySSLApplyConfig()
    .then((data) => {
      Object.assign(sslApplyConfig, object.copy(data));
    })
    .finally(() => {
      framework.loaded();
    });
};

/**
 * @description: 处理域名提供商切换
 * @returns
 */
const handleDomainProviderChange = (): void => {
  Object.assign(sslApplyConfig.aliyun, object.copy(SSL_ALI_YUN_CONFIG));
  Object.assign(sslApplyConfig.cfcloud, object.copy(SSL_CLOUDFLARE_CONFIG));
  Object.assign(sslApplyConfig.txcloud, object.copy(SSL_TENCENT_CLOUD_CONFIG));
};

/**
 * @description: 处理更新 SSL 自定义配置
 * @returns
 */
const handleUpdateSSLCustomConfig = (): void => {
  if (sslConfigForm.value) {
    sslConfigForm.value.validate().then((result) => {
      if (result === true) {
        framework.loading();
        updateSSLCustomConfig(sslCustomConfig)
          .then(() => {
            MessagePlugin.success("SSL 配置已更新");
          })
          .finally(() => {
            framework.loaded();
          });
      }
    });
  }
};

/**
 * @description: 处理更新 SSL 申请配置
 * @returns
 */
const handleUpdateSSLApplyConfig = (): void => {
  if (sslConfigForm.value) {
    sslConfigForm.value.validate().then((result) => {
      if (result === true) {
        framework.loading();
        updateSSLApplyConfig(sslApplyConfig)
          .then(() => {
            MessagePlugin.success("SSL 配置已更新");
            fetchSSLApplyConfig();
          })
          .finally(() => {
            framework.loaded();
          });
      }
    });
  }
};

/**
 * @description: 获取其它配置
 * @returns
 */
const fetchOtherConfig = (): void => {
  framework.loading();
  queryOtherConfig()
    .then((data) => {
      Object.assign(otherConfig, object.copy(data));
    })
    .finally(() => {
      framework.loaded();
    });
};

/**
 * @description: 处理更新其它配置
 * @returns
 */
const handleUpdateOtherConfig = (): void => {
  if (otherConfigForm.value) {
    otherConfigForm.value.validate().then((result) => {
      if (result === true) {
        framework.loading();
        updateOtherConfig(otherConfig)
          .then(() => {
            MessagePlugin.success("其它配置已更新");
            fetchOtherConfig();
          })
          .finally(() => {
            framework.loaded();
          });
      }
    });
  }
};

/**
 * @description: 获取配置内容
 * @returns
 */
const fetchConfig = (): void => {
  switch (activePanel.value) {
    case 1:
      fetchBaseConfigList();
      break;
    case 2:
      fetchMailConfig();
      break;
    case 3:
      fetchAuditConfig();
      break;
    case 4:
      if (SSLType.value === 2) {
        fetchSSLApplyConfig();
      }
      break;
    case 5:
      fetchOtherConfig();
      break;
  }
};

// 获取配置内容
fetchConfig();
</script>

<template>
  <t-tabs :default-value="1" v-model="activePanel" @change="fetchConfig">
    <!-- 基本配置 -->
    <t-tab-panel :value="1" label="基本配置">
      <!-- 基本配置表格 -->
      <t-table row-key="id" :columns="baseConfigColumns" :data="baseConfigLise" bordered></t-table>
    </t-tab-panel>
    <!-- 邮件配置 -->
    <t-tab-panel :value="2" label="邮件配置">
      <t-form ref="mailConfigForm" :data="mailConfig" :rules="mailConfigRules">
        <t-form-item label="服务器地址" name="host">
          <t-input
            placeholder="请输入邮件服务器地址"
            v-model="mailConfig.host"
            :style="{ width: '500px' }"
          ></t-input>
        </t-form-item>
        <t-form-item label="服务器端口" name="port">
          <t-input
            placeholder="请输入邮件服务器端口"
            v-model="mailConfig.port"
            maxlength="5"
            :style="{ width: '500px' }"
          ></t-input>
        </t-form-item>
        <t-form-item label="用户名" name="username">
          <t-input
            placeholder="请输入用户名"
            v-model="mailConfig.username"
            :style="{ width: '500px' }"
          ></t-input>
        </t-form-item>
        <t-form-item label="密码" name="password">
          <t-input
            placeholder="请输入密码，如不修改密码可留空"
            v-model="mailConfig.password"
            type="password"
            :style="{ width: '500px' }"
          ></t-input>
        </t-form-item>
        <t-form-item label="加密类型" name="encryption">
          <t-radio-group
            v-model="mailConfig.encryption"
            :options="SMTPEncryptionOptions"
          ></t-radio-group>
        </t-form-item>
        <t-form-item label="邮件 From" name="from">
          <t-input
            placeholder="请输入发送邮件时的 From 地址"
            v-model="mailConfig.from"
            :style="{ width: '500px' }"
          ></t-input>
        </t-form-item>
        <t-form-item>
          <t-space :size="8">
            <t-button theme="primary" @click="handleUpdateMailConfig">保存</t-button>
            <t-button theme="default" @click="fetchMailConfig">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-tab-panel>
    <!-- 审计日志 -->
    <t-tab-panel :value="3" label="审计日志">
      <t-form ref="auditConfigForm" :data="auditConfig" :rules="auditConfigRules">
        <t-form-item label="审计去重时间" name="audit_interval">
          <template #default>
            <t-input-number
              v-model="auditConfig.audit_interval"
              :decimal-places="0"
              readonly
            ></t-input-number>
          </template>
          <template #tips>
            <span>请手动修改配置文件中的 audit_interval 参数后，再重启服务,</span>
            <b :style="{ color: 'var(--td-error-color)' }"> -1 代表关闭审计日志</b>
          </template>
        </t-form-item>
        <t-form-item label="日志保留时间" name="life_day">
          <template #default>
            <t-input-number
              v-model="auditConfig.life_day"
              :decimal-places="0"
              min="0"
              max="365"
            ></t-input-number>
          </template>
          <template #tips>
            <span>范围: 0 ~ 365天 ,</span>
            <b :style="{ color: 'var(--td-error-color)' }"> 0 代表永久保存</b>
          </template>
        </t-form-item>
        <t-form-item label="清理时间" name="clear_time">
          <t-time-picker format="mm:ss" v-model="auditConfig.clear_time"></t-time-picker>
        </t-form-item>
        <t-form-item>
          <t-space :size="8">
            <t-button theme="primary" @click="handleUpdateAuditConfig">保存</t-button>
            <t-button theme="default" @click="fetchAuditConfig">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-tab-panel>
    <!-- 证书配置 -->
    <t-tab-panel :value="4" label="证书配置">
      <t-form ref="sslConfigForm" :data="sslConfig" :rules="sslConfigRules">
        <t-form-item label="证书类型">
          <t-radio-group
            v-model="SSLType"
            :options="SSLTypeOptions"
            @change="handleSSLTypeChange"
          ></t-radio-group>
        </t-form-item>
        <!-- 自定义证书上传配置 -->
        <template v-if="SSLType === 1">
          <t-form-item label="证书文件" name="cert">
            <t-upload
              v-model="SSLCertFile"
              :auto-upload="false"
              :show-upload-progress="false"
              tips="请上传 .pem 格式的 cert 文件"
            ></t-upload>
          </t-form-item>
          <t-form-item label="私钥文件" name="key">
            <t-upload
              v-model="SSLKeyFile"
              :auto-upload="false"
              :show-upload-progress="false"
              tips="请上传 .pem 格式的 key 文件"
            ></t-upload>
          </t-form-item>
          <t-form-item>
            <t-space :size="8">
              <t-button theme="primary" @click="handleUpdateSSLCustomConfig">上传</t-button>
            </t-space>
          </t-form-item>
        </template>
        <!-- Let's Encrypt 证书申请配置 -->
        <template v-else-if="SSLType === 2">
          <t-form-item label="域名" name="domain">
            <t-input
              placeholder="请输入域名"
              v-model="sslApplyConfig.domain"
              :style="{ width: '480px' }"
            ></t-input>
          </t-form-item>
          <t-form-item label="申请邮箱" name="legomail">
            <t-input
              placeholder="请输入申请人邮箱"
              v-model="sslApplyConfig.legomail"
              :style="{ width: '480px' }"
            ></t-input>
          </t-form-item>
          <t-form-item label="域名服务商" name="name">
            <t-radio-group
              v-model="sslApplyConfig.name"
              :options="DomainProviderOptions"
              @change="handleDomainProviderChange"
            ></t-radio-group>
          </t-form-item>
          <!-- 阿里云配置 -->
          <template v-if="sslApplyConfig.name === 'aliyun'">
            <t-form-item label="APIKey" name="aliyun.apiKey">
              <t-input
                placeholder="请输入 API Key"
                v-model="sslApplyConfig.aliyun.apiKey"
                :style="{ width: '480px' }"
              ></t-input>
            </t-form-item>
            <t-form-item label="SecretKey" name="aliyun.secretKey">
              <t-input
                placeholder="请输入 Secret Key"
                v-model="sslApplyConfig.aliyun.secretKey"
                :style="{ width: '480px' }"
              ></t-input>
            </t-form-item>
          </template>
          <!-- 腾讯云配置 -->
          <template v-else-if="sslApplyConfig.name === 'txcloud'">
            <t-form-item label="SecretID" name="txcloud.secretId">
              <t-input
                placeholder="请输入 Secret ID"
                v-model="sslApplyConfig.txcloud.secretId"
                :style="{ width: '480px' }"
              ></t-input>
            </t-form-item>
            <t-form-item label="SecretKey" name="txcloud.secretKey">
              <t-input
                placeholder="请输入 Secret Key"
                v-model="sslApplyConfig.txcloud.secretKey"
                :style="{ width: '480px' }"
              ></t-input>
            </t-form-item>
          </template>
          <!-- Cloudflare 配置 -->
          <template v-else-if="sslApplyConfig.name === 'cfcloud'">
            <t-form-item label="AuthToken" name="cfcloud.authToken">
              <t-input
                placeholder="请输入认证 token"
                v-model="sslApplyConfig.cfcloud.authToken"
                :style="{ width: '480px' }"
              ></t-input>
            </t-form-item>
          </template>
          <t-form-item>
            <t-space :size="8">
              <t-button theme="primary" @click="handleUpdateSSLApplyConfig">保存</t-button>
              <t-button theme="default" @click="fetchSSLApplyConfig">重置</t-button>
            </t-space>
          </t-form-item>
        </template>
      </t-form>
    </t-tab-panel>
    <!-- 其它配置 -->
    <t-tab-panel :value="5" label="其它配置">
      <t-form ref="otherConfigForm" :data="otherConfig" :rules="otherConfigRules">
        <t-form-item label="VPN 对外地址" name="link_addr">
          <t-input
            placeholder="请输入 VPN 的对接连接地址"
            v-model="otherConfig.link_addr"
            :style="{ width: '480px' }"
          ></t-input>
        </t-form-item>
        <t-form-item label="Banner 信息" name="banner">
          <t-textarea
            placeholder="请输入 VPN 连接成功后的 Banner 信息"
            v-model="otherConfig.banner"
            :autosize="{ minRows: 5 }"
            :style="{ width: '480px' }"
          ></t-textarea>
        </t-form-item>
        <t-form-item label="自定义首页" name="homeindex">
          <t-textarea
            placeholder="请输入访问首页时的自定义内容"
            v-model="otherConfig.homeindex"
            :autosize="{ minRows: 5 }"
            :style="{ width: '480px' }"
          ></t-textarea>
        </t-form-item>
        <t-form-item label="账户开通邮件" name="account_mail">
          <t-textarea
            placeholder="请输入账户开通时的邮件模板内容"
            v-model="otherConfig.account_mail"
            :autosize="{ minRows: 5 }"
            :style="{ width: '480px' }"
          ></t-textarea>
        </t-form-item>
        <t-form-item>
          <t-space :size="8">
            <t-button theme="primary" @click="handleUpdateOtherConfig">保存</t-button>
            <t-button theme="default" @click="fetchOtherConfig">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-tab-panel>
  </t-tabs>
</template>

<style lang="scss" scoped>
.t-tab-panel {
  padding: 16px;
}
</style>
