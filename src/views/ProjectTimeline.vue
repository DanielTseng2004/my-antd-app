<template>
  <div class="timeline-page">
    <a-typography-title :level="2">
      <history-outlined style="margin-right: 12px; color: #1890ff" />
      專案開發里程碑
    </a-typography-title>

    <a-card
      :bordered="false"
      class="timeline-card"
    >
      <a-timeline mode="alternate">
        <a-timeline-item
          v-for="(item, index) in timelineData"
          :key="index"
          :color="item.color"
        >
          <template
            #dot
            v-if="item.icon"
          >
            <component
              :is="item.icon"
              style="font-size: 16px"
            />
          </template>

          <div class="timeline-content">
            <div class="time-tag">{{ item.date }}</div>
            <a-card
              size="small"
              :title="item.title"
              class="inner-card"
            >
              <template #extra>
                <a-tag :color="item.tagColor">{{ item.version }}</a-tag>
              </template>
              <p>{{ item.desc }}</p>
              <div class="tech-tags">
                <a-tag
                  v-for="tech in item.techs"
                  :key="tech"
                  size="small"
                  >{{ tech }}</a-tag
                >
              </div>
            </a-card>
          </div>
        </a-timeline-item>
      </a-timeline>
    </a-card>
  </div>
</template>
<script setup>
import { ref } from "vue";
import {
  HistoryOutlined,
  RocketOutlined,
  BuildOutlined,
  CheckCircleOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons-vue";

const timelineData = ref([
  {
    date: "2024-05-10",
    title: "專案啟動與基礎架構",
    desc: "確立使用 Vue 3 + Vite + Ant Design Vue 技術棧，完成路由與主題切換功能。",
    version: "v0.1.0",
    color: "blue",
    tagColor: "blue",
    icon: "BuildOutlined",
    techs: ["Vue 3", "Vite", "Vue Router"],
  },
  {
    date: "2024-05-15",
    title: "數據看板模組完成",
    desc: "實作 StatisticsDashboard，將複雜的人才分佈數據進行表格化與視覺化呈現。",
    version: "v0.5.0",
    color: "green",
    tagColor: "green",
    icon: "CheckCircleOutlined",
    techs: ["Computed", "AntD Table"],
  },
  {
    date: "2024-05-18",
    title: "AI 導遊機器人上線",
    desc: "新增 ChatBot 組件，提供本地知識庫檢索與快速頁面導覽功能。",
    version: "v0.8.0",
    color: "purple",
    tagColor: "purple",
    icon: "CustomerServiceOutlined",
    techs: ["Transition", "Composition API"],
  },
  {
    date: "2024-05-20",
    title: "正式版發佈",
    desc: "完成所有頁面整合與性能優化，正式部署測試版本。",
    version: "v1.0.0",
    color: "red",
    tagColor: "red",
    icon: "RocketOutlined",
    techs: ["Production Build", "Optimization"],
  },
]);
</script>
<style scoped>
.timeline-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.timeline-card {
  background: transparent;
}

.timeline-content {
  margin-bottom: 20px;
}

.time-tag {
  font-weight: bold;
  margin-bottom: 8px;
  color: #8c8c8c;
}

.inner-card {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  text-align: left;
}

.tech-tags {
  margin-top: 8px;
}

/* 讓 alternate 模式在手機端也好看 */
@media (max-width: 768px) {
  :deep(
    .ant-timeline.ant-timeline-alternate
      .ant-timeline-item-left
      .ant-timeline-item-content
  ) {
    left: 4px;
    width: calc(100% - 32px);
  }
}
</style>
