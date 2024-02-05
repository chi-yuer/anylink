<!--
 * @Author: Quarter
 * @Date: 2024-01-27 15:22:41
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-01 17:37:07
 * @FilePath: /anylink/web/src/pages/user/account-list.vue
 * @Description: 账号管理页面
-->
<script lang="ts" setup>
import { date } from "@/lib";
import { frameworkStore } from "@/plugins";
import {
  deleteAccount,
  importAccountByExcel,
  queryAccountList,
  queryAccountOTPImage,
  updateAccount,
} from "@/request/user";
import { AccountRecord } from "@/types";
import {
  BaseTableCol,
  Icon,
  MessagePlugin,
  PageInfo,
  RequestMethodResponse,
  UploadFile,
} from "tdesign-vue-next";
import { reactive, ref } from "vue";
import AccountForm from "./components/account-form.vue";

// 页码
const pageNo = ref(1);
// 分页大小
const pageSize = 10;
// 总条数
const total = ref(0);
// 搜索关键词
const keyword = ref("");
// 搜索关键词
let _keyword = "";
// 框架状态
const framework = frameworkStore();
// 账号列
const accountColumns: BaseTableCol<AccountRecord>[] = [
  { colKey: "id", title: "#", width: 80 },
  { colKey: "username", title: "用户名", width: 160 },
  { colKey: "nickname", title: "姓名", width: 160 },
  { colKey: "email", title: "电子邮箱" },
  { colKey: "groups", title: "授权权限组" },
  { colKey: "disable_otp", title: "动态密码", width: 100 },
  { colKey: "status", title: "账户状态", width: 100 },
  {
    colKey: "updated_at",
    title: "更新时间",
    width: 180,
    render: (_, { row }) => {
      if (row.updated_at) {
        return date.formate(row.updated_at, "yyyy-MM-dd hh:mm:ss");
      }
      return "";
    },
  },
  { colKey: "operation", title: "操作", width: 320 },
];
// 账号列表
const accountList = ref<AccountRecord[]>([]);
// 创建账号弹窗是否可见
const createAccountVisible = ref(false);
// 编辑账号弹窗是否可见
const editAccountVisible = ref(false);
// 编辑确认弹窗是否可见
const confirmEditVisible = ref(false);
// 删除确认弹窗是否可见
const confirmDeleteVisible = ref(false);
// OTP 账号信息
const otp = reactive({
  visible: false,
  username: "",
  nickname: "",
  image: undefined as string | undefined,
});
// 模板下载链接
const templateURL =
  location.origin + (__APP__.base + "/批量添加用户模版.xlsx").replace(/\/{2,}/g, "/");
// 编辑账号信息
const accountIdFocused = ref<number | null>(null);
// 创建账号表单
const createAccountForm = ref<InstanceType<typeof AccountForm> | null>(null);
// 编辑账号表单
const editAccountForm = ref<InstanceType<typeof AccountForm> | null>(null);

/**
 * @description: 处理搜索
 * @returns
 */
const handleSearch = (): void => {
  _keyword = keyword.value;
  pageNo.value = 1;
  fetchAccountList();
};

/**
 * @description: 处理重置搜索
 * @returns
 */
const handleResetSearch = (): void => {
  keyword.value = "";
  handleSearch();
};

/**
 * @description: 获取账号列表
 * @returns
 */
const fetchAccountList = (): void => {
  framework.loading();
  queryAccountList({
    pageNo: pageNo.value,
    keyword: _keyword,
  })
    .then(({ count, datas }) => {
      total.value = count || 0;
      accountList.value = datas || [];
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
  fetchAccountList();
};

/**
 * @description: 处理创建账号
 * @returns
 */
const handleAccountCreate = (): void => {
  if (!createAccountForm.value) {
    return;
  }
  framework.start();
  createAccountForm.value
    .validate()
    .then((account) => updateAccount(account))
    .then(() => {
      confirmEditVisible.value = false;
      createAccountVisible.value = false;
      MessagePlugin.success("账号创建成功");
      fetchAccountList();
    })
    .finally(() => {
      framework.end();
    });
};

/**
 * @description: 处理上传导入文件
 * @param {UploadFile|UploadFile[]} files 选中文件列表
 * @returns {Promise<RequestMethodResponse>}
 */
const handleUploadImportFile = (files: UploadFile | UploadFile[]): Promise<RequestMethodResponse> =>
  new Promise<RequestMethodResponse>((resolve, reject) => {
    if (!files || (Array.isArray(files) && files.length === 0)) {
      reject();
      return;
    }
    const file = Array.isArray(files) ? files[0] : files;
    if (!file.raw) {
      reject();
      return;
    }
    framework.loading();
    importAccountByExcel(file.raw)
      .then((result) => {
        resolve({ status: "success", response: {} });
        MessagePlugin.success(result);
        fetchAccountList();
      })
      .finally(() => {
        framework.loaded();
      });
  });

/**
 * @description: 处理显示 OTP 信息
 * @param {AccountRecord} accountRecord 账户信息
 * @returns
 */
const handleShowOTP = ({ id, username, nickname }: AccountRecord): void => {
  otp.username = username;
  otp.nickname = nickname;
  framework.loading();
  queryAccountOTPImage(id)
    .then((image) => {
      otp.image = `data:image/png;base64,${image}`;
      otp.visible = true;
    })
    .finally(() => {
      framework.loaded();
    });
};

/**
 * @description: 处理显示编辑弹窗
 * @param {number} id 账号 id
 * @returns
 */
const handleShowEditDialog = (id: number): void => {
  accountIdFocused.value = id;
  editAccountVisible.value = true;
};

/**
 * @description: 处理编辑账号信息
 * @returns
 */
const handleAccountEdit = (): void => {
  if (!editAccountForm.value) {
    return;
  }
  framework.start();
  editAccountForm.value
    .validate()
    .then((account) => updateAccount(account))
    .then(() => {
      confirmEditVisible.value = false;
      editAccountVisible.value = false;
      MessagePlugin.success("账号更新成功");
      fetchAccountList();
    })
    .finally(() => {
      framework.end();
    });
};

/**
 * @description: 处理现实删除弹窗
 * @param {number} id 账号 id
 * @returns
 */
const handleShowDeleteDialog = (id: number): void => {
  accountIdFocused.value = id;
  confirmDeleteVisible.value = true;
};

/**
 * @description: 确认删除账号
 * @returns
 */
const handleAccountDelete = (): void => {
  if (typeof accountIdFocused.value !== "number") {
    return;
  }
  framework.start();
  deleteAccount(accountIdFocused.value)
    .then(() => {
      confirmDeleteVisible.value = false;
      MessagePlugin.success("账号删除成功");
      if (accountList.value.length <= 1 && pageNo.value > 1) {
        pageNo.value -= 1;
        fetchAccountList();
      } else {
        fetchAccountList();
      }
    })
    .finally(() => {
      framework.end();
    });
};

// 获取账号列表
fetchAccountList();
</script>

<template>
  <!-- 搜索条件 -->
  <div class="account-list__condition-panel">
    <div class="account-list__condition-search">
      <t-space :size="8">
        <t-input
          placeholder="请输入用户名关键词"
          v-model="keyword"
          clearable
          :style="{ width: '240px' }"
          @enter="handleSearch"
        ></t-input>
        <t-button @click="handleSearch">搜索</t-button>
        <t-button variant="outline" @click="handleResetSearch">重置</t-button>
      </t-space>
    </div>
    <div class="account-list__condition-operation">
      <t-space :size="8" align="center">
        <t-button @click="createAccountVisible = true">
          <template #icon>
            <icon name="user-add"></icon>
          </template>
          <template #default>创建账号</template>
        </t-button>
        <t-upload
          accept=".xlsx"
          :show-upload-progress="false"
          :files="[]"
          :max="1"
          :request-method="handleUploadImportFile"
        >
          <template #default>
            <t-button>
              <template #icon>
                <icon name="upload"></icon>
              </template>
              <template #default>批量导入</template>
            </t-button>
          </template>
          <template #file-list-display></template>
        </t-upload>
        <t-link theme="primary" target="_blanket" :href="templateURL">
          <template #prefix-icon>
            <icon name="download"></icon>
          </template>
          <template #default>模板下载</template>
        </t-link>
      </t-space>
    </div>
  </div>
  <!-- 账号表格 -->
  <t-table
    row-key="id"
    :columns="accountColumns"
    :data="accountList"
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
    <template #groups="{ row }">
      <template v-if="Array.isArray(row.groups) && row.groups.length > 0">
        <template v-if="row.groups.length > 3">
          <t-space :size="4" break-line>
            <t-tag v-for="group of row.groups.slice(0, 3)">{{ group }}</t-tag>
            <t-popup
              trigger="click"
              :overlay-style="{ maxWidth: '320px' }"
              :overlay-inner-style="{ padding: '8px' }"
            >
              <template #default>
                <t-link
                  hover="color"
                  size="small"
                  theme="primary"
                  v-text="`等共&nbsp;${row.groups.length}&nbsp;个组`"
                ></t-link>
              </template>
              <template #content>
                <t-space
                  :size="8"
                  direction="vertical"
                  :style="{ maxHeight: '200px', overflowY: 'auto' }"
                >
                  <span v-for="group of row.groups">{{ group }}</span>
                </t-space>
              </template>
            </t-popup>
          </t-space>
        </template>
        <template v-else>
          <t-space :size="4" break-line>
            <t-tag v-for="group of row.groups">{{ group }}</t-tag>
          </t-space>
        </template>
      </template>
      <template v-else>无</template>
    </template>
    <template #disable_otp="{ row }">
      <t-tag v-if="row.disable_otp" variant="light" theme="danger">停用</t-tag>
      <t-tag v-else variant="light" theme="success">启用</t-tag>
    </template>
    <template #status="{ row }">
      <t-tag v-if="row.status === 1" variant="light" theme="success">启用</t-tag>
      <t-tag v-else-if="row.status === 2" variant="light" theme="danger">过期</t-tag>
      <t-tag v-else variant="light" theme="danger">停用</t-tag>
    </template>
    <template #operation="{ row }">
      <t-space :size="12">
        <t-button variant="text" theme="primary" @click="handleShowOTP(row)">密钥</t-button>
        <t-button variant="text" theme="warning" @click="handleShowEditDialog(row.id)"
          >编辑</t-button
        >
        <t-button variant="text" theme="danger" @click="handleShowDeleteDialog(row.id)"
          >删除</t-button
        >
      </t-space>
    </template>
  </t-table>
  <!-- 创建账号弹窗 -->
  <t-dialog
    :visible="createAccountVisible"
    width="500px"
    placement="center"
    header="创建账号"
    :confirm-loading="framework.processing"
    :confirm-btn="{
      default: '创建',
    }"
    destroy-on-close
    :close-on-overlay-click="false"
    @close="createAccountVisible = false"
    @esc-keydown="createAccountVisible = false"
    @cancel="createAccountVisible = false"
    @confirm="handleAccountCreate"
  >
    <account-form ref="createAccountForm"></account-form>
  </t-dialog>
  <!-- 查看OTP信息弹窗 -->
  <t-dialog
    :visible="otp.visible"
    width="400px"
    placement="center"
    header="OTP 密钥"
    :footer="false"
    :close-on-overlay-click="false"
    @close="otp.visible = false"
    @esc-keydown="otp.visible = false"
  >
    <t-space
      direction="vertical"
      align="center"
      :size="8"
      :style="{ width: '100%', textAlign: 'center' }"
    >
      <span>{{ otp.username }}：{{ otp.nickname }}</span>
      <img :src="otp.image" alt="OTP 密钥" />
    </t-space>
  </t-dialog>
  <!-- 编辑账号弹窗 -->
  <t-dialog
    :visible="editAccountVisible"
    width="500px"
    placement="center"
    header="编辑账号"
    :confirm-btn="{
      theme: 'warning',
      default: '保存',
    }"
    destroy-on-close
    :close-on-overlay-click="false"
    @close="editAccountVisible = false"
    @esc-keydown="editAccountVisible = false"
    @cancel="editAccountVisible = false"
    @confirm="confirmEditVisible = true"
  >
    <account-form ref="editAccountForm" :id="accountIdFocused"></account-form>
  </t-dialog>
  <!-- 编辑账号确认弹窗 -->
  <t-dialog
    :visible="confirmEditVisible"
    width="320px"
    placement="center"
    header="保存账号"
    default="确认保存当前修改？"
    :confirm-loading="framework.processing"
    :confirm-btn="{ theme: 'warning', default: '保存' }"
    :close-on-overlay-click="false"
    @close="confirmEditVisible = false"
    @esc-keydown="confirmEditVisible = false"
    @cancel="confirmEditVisible = false"
    @confirm="handleAccountEdit"
  ></t-dialog>
  <!-- 删除账号确认弹窗 -->
  <t-dialog
    :visible="confirmDeleteVisible"
    width="320px"
    placement="center"
    header="删除账号"
    default="确认删除当前选中的账号？"
    :confirm-loading="framework.processing"
    :confirm-btn="{ theme: 'danger', default: '删除' }"
    :close-on-overlay-click="false"
    @close="confirmDeleteVisible = false"
    @esc-keydown="confirmDeleteVisible = false"
    @cancel="confirmDeleteVisible = false"
    @confirm="handleAccountDelete"
  ></t-dialog>
</template>

<style lang="scss">
.account-list__condition-panel {
  padding: 12px;
  background-color: var(--td-bg-color-container);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.acount-item__group-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
