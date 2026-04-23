<template>
  <div
    class="knowledge-container"
    style="padding: 24px; background: #f0f2f5; min-height: 100vh"
  >
    <a-row :gutter="24">
      <a-col
        :xs="24"
        :md="6"
      >
        <a-card
          title="知識庫目錄"
          :bordered="false"
          style="border-radius: 8px"
        >
          <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            @select="onMenuSelect"
            style="border: none"
          >
            <a-menu-item
              v-for="item in docList"
              :key="item.file"
            >
              <template #icon>
                <component :is="item.icon" />
              </template>
              {{ item.name }}
            </a-menu-item>
          </a-menu>
        </a-card>
      </a-col>

      <a-col
        :xs="24"
        :md="18"
      >
        <a-card
          :bordered="false"
          style="border-radius: 8px; min-height: 500px"
        >
          <template #title>
            <a-breadcrumb>
              <a-breadcrumb-item>知識庫</a-breadcrumb-item>
              <a-breadcrumb-item>{{ currentDocName }}</a-breadcrumb-item>
            </a-breadcrumb>
          </template>

          <div
            v-if="loading"
            style="text-align: center; padding: 50px"
          >
            <a-spin tip="正在載入文檔..." />
          </div>

          <div
            v-else
            class="markdown-content"
            v-html="renderedHtml"
          ></div>

          <a-empty
            v-if="!loading && !renderedHtml"
            description="尚無內容"
          />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import MarkdownIt from "markdown-it";
import {
  HomeOutlined,
  FileTextOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  ExperimentOutlined,
} from "@ant-design/icons-vue";

// 初始化 Markdown 解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const loading = ref(false);
const renderedHtml = ref("");
const selectedKeys = ref(["home.md"]);

// 定義文件列表 (對應 public/docs/ 下的檔名)
const docList = [
  { name: "首頁功能說明", file: "home.md", icon: "HomeOutlined" },
  { name: "文章管理系統", file: "posts.md", icon: "FileTextOutlined" },
  { name: "關於與人才庫", file: "about.md", icon: "UserOutlined" },
  { name: "數據看板分析", file: "statistics.md", icon: "BarChartOutlined" },
  { name: "互動實驗室", file: "lab.md", icon: "ExperimentOutlined" },
  { name: "系統偏好設置", file: "settings.md", icon: "SettingOutlined" },
];

const currentDocName = computed(() => {
  return docList.find((d) => d.file === selectedKeys.value[0])?.name || "";
});

// 核心函數：讀取外部 MD 檔案
const fetchMarkdown = async (fileName) => {
  loading.value = true;
  try {
    // 預設路徑為 public/docs/
    const response = await fetch(`/docs/${fileName}`);
    if (!response.ok) throw new Error("找不到該文檔檔案");
    const rawText = await response.text();
    renderedHtml.value = md.render(rawText);
  } catch (error) {
    console.error("載入 MD 失敗:", error);
    renderedHtml.value = `<div style="color: red;">載入失敗：${error.message}</div>`;
  } finally {
    loading.value = false;
  }
};

// 切換選單時觸發
const onMenuSelect = ({ key }) => {
  fetchMarkdown(key);
};

onMounted(() => {
  // 初始載入第一個
  fetchMarkdown(selectedKeys.value[0]);
});
</script>

<style scoped>
/* Markdown 樣式優化 */
.markdown-content :deep(h1) {
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-top: 20px;
}
.markdown-content :deep(h2) {
  margin-top: 24px;
  border-left: 4px solid #1890ff;
  padding-left: 12px;
}
.markdown-content :deep(code) {
  background: #fff5f5;
  color: #ff4d4f;
  padding: 2px 4px;
  border-radius: 4px;
}
.markdown-content :deep(ul) {
  padding-left: 20px;
}
.markdown-content :deep(li) {
  margin-bottom: 8px;
  line-height: 1.6;
}
.markdown-content :deep(strong) {
  color: #000;
  font-weight: 600;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
}
</style>
