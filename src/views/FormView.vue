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
        <a-row :gutter="[16, 12]">
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
              />
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item label="職能(Job)">
              <a-select
                v-model:value="searchForm.role"
                placeholder="職能篩選"
                allow-clear
              >
                <a-select-option value="前端">前端</a-select-option>
                <a-select-option value="後端">後端</a-select-option>
                <a-select-option value="測試">測試</a-select-option>
                <a-select-option value="維運">維運</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="腳色(Project)">
              <a-select
                v-model:value="searchForm.projectRole"
                placeholder="腳色篩選"
                allow-clear
              >
                <a-select-option
                  v-for="p in projectRoles"
                  :key="p.value"
                  :value="p.value"
                  >{{ p.label }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="等級">
              <a-select
                v-model:value="searchForm.level"
                placeholder="等級篩選"
                allow-clear
              >
                <a-select-option value="Junior">Junior</a-select-option>
                <a-select-option value="Senior">Senior</a-select-option>
                <a-select-option value="Expert">Expert</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="技術技能">
              <a-select
                v-model:value="searchForm.tech"
                mode="multiple"
                placeholder="技術篩選 (多選)"
                allow-clear
                :options="techOptions"
                max-tag-count="responsive"
              />
            </a-form-item>
          </a-col>
          <a-col
            :span="24"
            style="text-align: right; margin-top: 12px"
          >
            <a-space>
              <a-button
                type="default"
                @click="handleAdd"
                style="
                  background-color: var(--color-success);
                  color: white;
                  border-color: var(--color-success);
                "
              >
                <plus-outlined />新增人才資料
              </a-button>
              <a-button
                type="primary"
                @click="onSearch"
              >
                <search-outlined />查詢
              </a-button>
              <a-button @click="onReset"> <reload-outlined />重置 </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        row-key="id"
        :scroll="{ x: 1300 }"
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
          <template v-else-if="column.key === 'projectRole'">
            <a-badge
              status="processing"
              :text="record.projectRole"
            />
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)"><edit-outlined />編輯</a>
              <a-divider type="vertical" />
              <a
                :style="{ color: deleteLinkColor }"
                @click="confirmDelete(record)"
                ><delete-outlined />刪除</a
              >
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
      width="700px"
    >
      <a-form
        :model="formState"
        layout="vertical"
        ref="formRef"
      >
        <a-row :gutter="16">
          <a-col :span="8"
            ><a-form-item
              label="姓名"
              name="name"
              :rules="[{ required: true }]"
              ><a-input v-model:value="formState.name" /></a-form-item
          ></a-col>
          <a-col :span="8">
            <a-form-item
              label="職能"
              name="role"
              :rules="[{ required: true }]"
            >
              <a-select v-model:value="formState.role">
                <a-select-option value="前端">前端</a-select-option>
                <a-select-option value="後端">後端</a-select-option>
                <a-select-option value="測試">測試</a-select-option>
                <a-select-option value="維運">維運</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="專案腳色"
              name="projectRole"
              :rules="[{ required: true }]"
            >
              <a-select v-model:value="formState.projectRole">
                <a-select-option
                  v-for="p in projectRoles"
                  :key="p.value"
                  :value="p.value"
                  >{{ p.label }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item
              label="單位/處"
              name="division"
              :rules="[{ required: true }]"
            >
              <a-select
                v-model:value="formState.division"
                @change="onModalDivChange"
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
              :rules="[{ required: true }]"
            >
              <a-select
                v-model:value="formState.department"
                :disabled="!formState.division"
                @change="onModalDeptChange"
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
              label="等級"
              name="level"
            >
              <a-radio-group
                v-model:value="formState.level"
                button-style="solid"
              >
                <a-radio-button value="Junior">Jr</a-radio-button>
                <a-radio-button value="Senior">Sr</a-radio-button>
                <a-radio-button value="Expert">Exp</a-radio-button>
              </a-radio-group>
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
            :options="techOptions"
            placeholder="選擇技術 stack"
          />
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
import {
  hierarchy,
  techOptions,
  projectRoles,
  generateMockList,
} from "../data/mockData";
import { useTheme } from "../composables/useTheme";

const { isDarkMode } = useTheme();

// 欄位定義：拆分職能與腳色
const columns = [
  { title: "姓名", dataIndex: "name", key: "name", fixed: "left", width: 100 },
  { title: "部門", dataIndex: "department", width: 120 },
  { title: "職能(Job)", dataIndex: "role", width: 100 },
  {
    title: "專案腳色",
    dataIndex: "projectRole",
    key: "projectRole",
    width: 120,
  },
  { title: "等級", dataIndex: "level", width: 100 },
  { title: "技術", dataIndex: "tech", key: "tech", width: 200 },
  { title: "操作", key: "action", fixed: "right", width: 150 },
];

const allRawData = ref([]);
const dataSource = ref([]);
const loading = ref(false);
const formRef = ref(null);

const searchForm = reactive({
  division: undefined,
  department: undefined,
  section: undefined,
  name: "",
  role: undefined,
  projectRole: undefined,
  level: undefined,
  tech: [],
});

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
});

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
  role: undefined,
  projectRole: undefined,
});

// 連動邏輯
const searchDepts = computed(() =>
  searchForm.division ? Object.keys(hierarchy[searchForm.division]) : [],
);
const searchSecs = computed(() =>
  searchForm.division && searchForm.department
    ? hierarchy[searchForm.division][searchForm.department]
    : [],
);
const modalDepts = computed(() =>
  formState.division ? Object.keys(hierarchy[formState.division]) : [],
);

const deleteLinkColor = computed(() =>
  isDarkMode.value ? "var(--color-error)" : "var(--color-error)",
);
const pageBackground = computed(() =>
  isDarkMode.value ? "var(--bg-app)" : "var(--bg-secondary)",
);

const fetchData = () => {
  loading.value = true;
  setTimeout(() => {
    const filtered = allRawData.value.filter((item) => {
      return (
        (!searchForm.name || item.name.includes(searchForm.name)) &&
        (!searchForm.division || item.division === searchForm.division) &&
        (!searchForm.department || item.department === searchForm.department) &&
        (!searchForm.role || item.role === searchForm.role) &&
        (!searchForm.projectRole ||
          item.projectRole === searchForm.projectRole) &&
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
    projectRole: undefined,
    level: undefined,
    tech: [], // 確保重置為空陣列
  });
  onSearch();
};

const handleTableChange = (pag) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
};

const handleAdd = () => {
  modalTitle.value = "新增人才資料";
  Object.assign(formState, {
    id: null,
    name: "",
    division: undefined,
    department: undefined,
    section: undefined,
    level: "Junior",
    role: undefined,
    projectRole: undefined,
    tech: [],
  });
  modalVisible.value = true;
  nextTick(() => formRef.value?.clearValidate());
};

const handleEdit = (record) => {
  modalTitle.value = "編輯人才資料";
  Object.assign(formState, JSON.parse(JSON.stringify(record)));
  modalVisible.value = true;
};

const handleModalOk = () => {
  formRef.value.validate().then(() => {
    confirmLoading.value = true;
    setTimeout(() => {
      if (formState.id) {
        const index = allRawData.value.findIndex(
          (item) => item.id === formState.id,
        );
        if (index !== -1) allRawData.value[index] = { ...formState };
      } else {
        allRawData.value.unshift({ ...formState, id: Date.now() });
      }
      modalVisible.value = false;
      confirmLoading.value = false;
      fetchData();
      message.success("儲存成功");
    }, 600);
  });
};

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

onMounted(() => {
  allRawData.value = generateMockList(100);
  fetchData();
});
</script>
