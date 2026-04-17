<template>
  <div
    :style="{
      padding: '24px',
      background: pageBackground,
      'min-height': '100vh',
    }"
  >
    <a-card
      :bordered="false"
      style="margin-bottom: 16px"
    >
      <a-form
        :model="searchForm"
        layout="horizontal"
      >
        <a-row :gutter="[16, 8]">
          <a-col :span="6">
            <a-form-item label="單位/處">
              <a-select
                v-model:value="searchForm.division"
                placeholder="選擇處室"
                allow-clear
                @change="onSearchDivChange"
              >
                <a-select-option
                  v-for="div in Object.keys(hierarchy)"
                  :key="div"
                  :value="div"
                  >{{ div }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="部門">
              <a-select
                v-model:value="searchForm.department"
                placeholder="請選擇"
                allow-clear
                :disabled="!searchForm.division"
                @change="onSearchDeptChange"
              >
                <a-select-option
                  v-for="dept in searchDepts"
                  :key="dept"
                  :value="dept"
                  >{{ dept }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="科別">
              <a-select
                v-model:value="searchForm.section"
                placeholder="請選擇"
                allow-clear
                :disabled="!searchForm.department"
              >
                <a-select-option
                  v-for="sec in searchSecs"
                  :key="sec"
                  :value="sec"
                  >{{ sec }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="姓名">
              <a-input
                v-model:value="searchForm.name"
                placeholder="搜尋姓名"
                allow-clear
            /></a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item label="職能">
              <a-select
                v-model:value="searchForm.role"
                placeholder="選擇職能"
                allow-clear
              >
                <a-select-option value="前端">前端工程師</a-select-option>
                <a-select-option value="後端">後端工程師</a-select-option>
                <a-select-option value="測試">測試工程師</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="等級">
              <a-select
                v-model:value="searchForm.level"
                placeholder="選擇等級"
                allow-clear
              >
                <a-select-option value="Junior">Junior</a-select-option>
                <a-select-option value="Senior">Senior</a-select-option>
                <a-select-option value="Expert">Expert</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="技術">
              <a-select
                v-model:value="searchForm.tech"
                mode="multiple"
                placeholder="技術篩選"
                :options="techOptions"
                allow-clear
            /></a-form-item>
          </a-col>
          <a-col
            :span="6"
            style="text-align: right"
          >
            <a-space>
              <a-button
                type="primary"
                @click="onSearch"
                ><search-outlined />查詢</a-button
              >
              <a-button @click="onReset"><reload-outlined />重置</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-card :bordered="false">
      <div style="margin-bottom: 16px">
        <a-button
          type="primary"
          @click="handleAdd"
          ><plus-outlined />新增人才資料</a-button
        >
      </div>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        row-key="id"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'tech'">
            <a-tag
              v-for="t in record.tech"
              :key="t"
              color="blue"
              >{{ t }}</a-tag
            >
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)"><edit-outlined />編輯</a>
              <a-divider type="vertical" />
              <a
                :style="{ color: deleteLinkColor }"
                @click="confirmDelete(record)"
              >
                <delete-outlined />刪除
              </a>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      @ok="handleModalOk"
      :confirm-loading="confirmLoading"
      width="650px"
    >
      <a-form
        :model="formState"
        layout="vertical"
        ref="formRef"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              label="姓名"
              name="name"
              :rules="[{ required: true, message: '請輸入姓名' }]"
            >
              <a-input
                v-model:value="formState.name"
                placeholder="請輸入姓名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="等級"
              name="level"
            >
              <a-select v-model:value="formState.level">
                <a-select-option value="Junior">Junior</a-select-option>
                <a-select-option value="Senior">Senior</a-select-option>
                <a-select-option value="Expert">Expert</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item
              label="單位/處"
              name="division"
              :rules="[{ required: true, message: '請選擇單位' }]"
            >
              <a-select
                v-model:value="formState.division"
                @change="onModalDivChange"
                placeholder="選擇處室"
              >
                <a-select-option
                  v-for="div in Object.keys(hierarchy)"
                  :key="div"
                  >{{ div }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="部門"
              name="department"
              :rules="[{ required: true, message: '請選擇部門' }]"
            >
              <a-select
                v-model:value="formState.department"
                :disabled="!formState.division"
                @change="onModalDeptChange"
                placeholder="選擇部門"
              >
                <a-select-option
                  v-for="dept in modalDepts"
                  :key="dept"
                  >{{ dept }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="科別"
              name="section"
            >
              <a-select
                v-model:value="formState.section"
                :disabled="!formState.department"
                placeholder="選擇科別"
              >
                <a-select-option
                  v-for="sec in modalSecs"
                  :key="sec"
                  >{{ sec }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item
          label="技術技能 (多選)"
          name="tech"
        >
          <a-select
            v-model:value="formState.tech"
            mode="multiple"
            placeholder="請選擇技術 stack"
            :options="techOptions"
          />
        </a-form-item>

        <a-form-item
          label="職能"
          name="role"
        >
          <a-radio-group v-model:value="formState.role">
            <a-radio-button value="前端">前端</a-radio-button>
            <a-radio-button value="後端">後端</a-radio-button>
            <a-radio-button value="測試">測試</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, nextTick } from "vue";
import { Modal, message } from "ant-design-vue";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";

import { hierarchy, techOptions, generateMockList } from "../data/mockData";
import { useTheme } from "../composables/useTheme";

const { isDarkMode } = useTheme();

// --- 1. 定義表格欄位 ---
const columns = [
  { title: "姓名", dataIndex: "name", key: "name", fixed: "left", width: 100 },
  { title: "處室", dataIndex: "division", width: 120 },
  { title: "部門", dataIndex: "department", width: 120 },
  { title: "科別", dataIndex: "section", width: 120 },
  { title: "職能", dataIndex: "role", width: 120 },
  { title: "等級", dataIndex: "level", width: 100 },
  { title: "技術", dataIndex: "tech", key: "tech", width: 200 },
  { title: "操作", key: "action", fixed: "right", width: 150 },
];

// --- 2. 響應式狀態管理 ---
const allRawData = ref([]); // 原始資料池 (模擬資料庫)
const dataSource = ref([]); // 當前表格顯示資料
const loading = ref(false); // 表格載入狀態
const formRef = ref(null); // 彈窗表單引用

// 搜尋表單狀態
const searchForm = reactive({
  division: undefined,
  department: undefined,
  section: undefined,
  name: "",
  role: undefined,
  level: undefined,
  tech: [],
});

// 分頁配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total) => `共 ${total} 筆資料`,
});

// 彈窗控制
const modalVisible = ref(false);
const modalTitle = ref("新增人才資料");
const confirmLoading = ref(false);
const formState = reactive({
  id: null,
  name: "",
  division: undefined,
  department: undefined,
  section: undefined,
  level: "Junior",
  tech: [],
});

// --- 3. 計算屬性 (連動選單邏輯) ---

// 搜尋列連動
const searchDepts = computed(() =>
  searchForm.division ? Object.keys(hierarchy[searchForm.division]) : [],
);
const searchSecs = computed(() =>
  searchForm.division && searchForm.department
    ? hierarchy[searchForm.division][searchForm.department]
    : [],
);

// 彈窗連動
const modalDepts = computed(() =>
  formState.division ? Object.keys(hierarchy[formState.division]) : [],
);
const modalSecs = computed(() =>
  formState.division && formState.department
    ? hierarchy[formState.division][formState.department]
    : [],
);

// 主題相關顏色
const deleteLinkColor = computed(() =>
  isDarkMode.value ? "#ff7875" : "#ff4d4f",
);
const pageBackground = computed(() =>
  isDarkMode.value ? "var(--app-bg)" : "#f0f2f5",
);

// --- 4. 核心功能函數 ---

// 獲取/過濾數據
const fetchData = () => {
  loading.value = true;
  // 模擬網路延遲
  setTimeout(() => {
    // 執行過濾
    const filtered = allRawData.value.filter((item) => {
      return (
        (!searchForm.name || item.name.includes(searchForm.name)) &&
        (!searchForm.division || item.division === searchForm.division) &&
        (!searchForm.department || item.department === searchForm.department) &&
        (!searchForm.section || item.section === searchForm.section) &&
        (!searchForm.role || item.role === searchForm.role) &&
        (!searchForm.level || item.level === searchForm.level) &&
        (searchForm.tech.length === 0 ||
          searchForm.tech.some((t) => item.tech.includes(t)))
      );
    });

    pagination.total = filtered.length;
    const start = (pagination.current - 1) * pagination.pageSize;
    dataSource.value = filtered.slice(start, start + pagination.pageSize);
    loading.value = false;
  }, 300);
};

// 搜尋與重置
const onSearch = () => {
  pagination.current = 1;
  fetchData();
};

const onReset = () => {
  Object.assign(searchForm, {
    division: undefined,
    department: undefined,
    section: undefined,
    name: "",
    role: undefined,
    level: undefined,
    tech: [],
  });
  onSearch();
};

// 表格分頁/排序切換
const handleTableChange = (pag) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
};

// --- 5. 新增 / 編輯 / 刪除 邏輯 ---

const handleAdd = () => {
  modalTitle.value = "新增人才資料";
  Object.assign(formState, {
    id: null,
    name: "",
    division: undefined,
    department: undefined,
    section: undefined,
    level: "Junior",
    tech: [],
  });
  modalVisible.value = true;
  nextTick(() => formRef.value?.clearValidate());
};

const handleEdit = (record) => {
  modalTitle.value = "編輯人才資料";
  Object.assign(formState, JSON.parse(JSON.stringify(record))); // 深拷貝防止直接修改表格
  modalVisible.value = true;
};

const handleDelete = (id) => {
  allRawData.value = allRawData.value.filter((item) => item.id !== id);
  message.success("資料已刪除");
  fetchData();
};
const confirmDelete = (record) => {
  Modal.confirm({
    title: "確定要刪除資料嗎？",
    // 在 content 顯示具體姓名，使用者體驗更好
    content: `您確定要永久刪除「${record.name}」的技術人才資料嗎？此操作不可撤銷。`,
    okText: "確認刪除",
    okType: "danger",
    cancelText: "取消",
    onOk() {
      // 這裡直接執行你原本的功能
      handleDelete(record.id);
    },
    // onCancel 留空即可，點擊取消會自動關閉視窗
  });
};

const handleModalOk = () => {
  formRef.value.validate().then(() => {
    confirmLoading.value = true;
    setTimeout(() => {
      if (formState.id) {
        // 編輯：更新原始池
        const index = allRawData.value.findIndex(
          (item) => item.id === formState.id,
        );
        if (index !== -1) allRawData.value[index] = { ...formState };
        message.success("修改成功");
      } else {
        // 新增：插入原始池
        const newItem = { ...formState, id: Date.now() };
        allRawData.value.unshift(newItem);
        message.success("新增成功");
      }
      modalVisible.value = false;
      confirmLoading.value = false;
      fetchData(); // 重新整理當前視圖
    }, 600);
  });
};

// --- 6. 選單值變更處理 (清空下級) ---
const onSearchDivChange = () => {
  searchForm.department = undefined;
  searchForm.section = undefined;
};
const onSearchDeptChange = () => {
  searchForm.section = undefined;
};
const onModalDivChange = () => {
  formState.department = undefined;
  formState.section = undefined;
};
const onModalDeptChange = () => {
  formState.section = undefined;
};

// --- 7. 初始化 ---
onMounted(() => {
  allRawData.value = generateMockList(100);
  fetchData();
});
</script>
