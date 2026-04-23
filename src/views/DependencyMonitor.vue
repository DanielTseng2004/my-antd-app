<template>
  <div class="dependency-monitor">
    <a-row
      :gutter="[16, 16]"
      class="stat-row"
    >
      <a-col
        :xs="24"
        :sm="12"
        :md="6"
      >
        <a-card hoverable>
          <a-statistic
            title="總套件數量"
            :value="dependencies.length + devDependencies.length"
          />
        </a-card>
      </a-col>
      <a-col
        :xs="24"
        :sm="12"
        :md="6"
      >
        <a-card hoverable>
          <a-statistic
            title="待更新"
            :value="outdatedCount"
            :value-style="{ color: '#cf1322' }"
          />
        </a-card>
      </a-col>
      <a-col
        :xs="24"
        :sm="12"
        :md="6"
      >
        <a-card hoverable>
          <a-statistic
            title="專案健康度"
            :value="98"
            suffix="%"
            :value-style="{ color: '#3f51b5' }"
          />
        </a-card>
      </a-col>
      <a-col
        :xs="24"
        :sm="12"
        :md="6"
      >
        <a-card hoverable>
          <div class="ant-statistic-title">核心框架版本</div>
          <div class="core-version">Vue 3.4.x</div>
        </a-card>
      </a-col>
    </a-row>

    <a-card
      title="核心技術棧 (Core Stack)"
      class="info-card"
    >
      <a-descriptions
        bordered
        :column="{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }"
      >
        <a-descriptions-item label="前端框架"
          >Vue 3 (Composition API)</a-descriptions-item
        >
        <a-descriptions-item label="UI 組件庫"
          >Ant Design Vue v4.x</a-descriptions-item
        >
        <a-descriptions-item label="構建工具">Vite v5.x</a-descriptions-item>
        <a-descriptions-item label="路由管理">Vue Router</a-descriptions-item>
        <a-descriptions-item label="狀態管理">Pinia</a-descriptions-item>
        <a-descriptions-item label="開發環境"
          >Node.js v20.x</a-descriptions-item
        >
      </a-descriptions>
    </a-card>

    <a-card
      title="依賴清單 (Dependencies)"
      class="table-card"
    >
      <template #extra>
        <a-radio-group v-model:value="tableTab">
          <a-radio-button value="prod">生產依賴</a-radio-button>
          <a-radio-button value="dev">開發依賴</a-radio-button>
        </a-radio-group>
      </template>

      <a-table
        :dataSource="tableTab === 'prod' ? dependencies : devDependencies"
        :columns="columns"
        :pagination="{ pageSize: 8 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag
              :color="record.current === record.latest ? 'green' : 'orange'"
            >
              {{ record.current === record.latest ? "最新" : "可更新" }}
            </a-tag>
          </template>
          <template v-if="column.key === 'name'">
            <span class="package-name">{{ record.name }}</span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const tableTab = ref("prod");

// 模擬數據 (實際應用中可從 package.json 導入或透過 API 獲取)
const dependencies = ref([
  { key: "1", name: "vue", current: "3.4.21", latest: "3.4.21", type: "Core" },
  { key: "2", name: "antd", current: "6.3.6", latest: "6.3.6", type: "UI" },
  {
    key: "3",
    name: "@ant-design/icons-vue",
    current: "7.0.1",
    latest: "7.0.1",
    type: "UI",
  },
  {
    key: "4",
    name: "vue-router",
    current: "5.0.6",
    latest: "5.0.6",
    type: "Routing",
  }, // 已升級至 5.x
  {
    key: "5",
    name: "axios",
    current: "1.15.2",
    latest: "1.15.2",
    type: "Network",
  },
  { key: "6", name: "pinia", current: "3.0.4", latest: "3.0.4", type: "Store" }, // 已升級至 3.x
]);

const devDependencies = ref([
  {
    key: "1",
    name: "vite",
    current: "8.0.10",
    latest: "8.0.10",
    type: "Build",
  },
  {
    key: "2",
    name: "@vitejs/plugin-vue",
    current: "6.0.6",
    latest: "6.0.6",
    type: "Build",
  },
  // ESLint 相關的項目已移除
]);

const columns = [
  { title: "套件名稱", dataIndex: "name", key: "name" },
  { title: "分類", dataIndex: "type", key: "type" },
  { title: "當前版本", dataIndex: "current", key: "current" },
  { title: "最新版本", dataIndex: "latest", key: "latest" },
  { title: "狀態", key: "status" },
];

const outdatedCount = computed(() => {
  const all = [...dependencies.value, ...devDependencies.value];
  return all.filter((d) => d.current !== d.latest).length;
});
</script>

<style scoped>
.dependency-monitor {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-row :deep(.ant-card) {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.core-version {
  font-size: 24px;
  font-weight: bold;
  color: var(--ant-primary-color);
  margin-top: 4px;
}

.info-card,
.table-card {
  border-radius: 8px;
  overflow: hidden;
}

.package-name {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-weight: 600;
  color: #1890ff;
}

/* 配合你的 Dark Mode 變數 */
:deep(.theme-dark) .package-name {
  color: #40a9ff;
}

:deep(.ant-table) {
  background: transparent;
}
</style>
