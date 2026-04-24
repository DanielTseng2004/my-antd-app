<template>
  <div class="home-container">
    <div class="welcome-header">
      <h1 class="welcome-title">歡迎回來，管理者</h1>
      <p class="welcome-subtitle">
        這裡是您的個人數位空間，目前系統運行狀況良好。
      </p>
    </div>

    <a-row
      :gutter="16"
      class="stat-row"
    >
      <a-col
        :xs="12"
        :sm="6"
      >
        <a-card hoverable>
          <a-statistic
            title="部落格文章"
            :value="42"
            suffix="篇"
          >
            <template #prefix><file-text-outlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col
        :xs="12"
        :sm="6"
      >
        <a-card hoverable>
          <a-statistic
            title="數據看板"
            :value="12"
            suffix="個"
          >
            <template #prefix><pie-chart-outlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col
        :xs="12"
        :sm="6"
      >
        <a-card hoverable>
          <a-statistic
            title="知識庫條目"
            :value="128"
            suffix="條"
          >
            <template #prefix><read-outlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col
        :xs="12"
        :sm="6"
      >
        <a-card hoverable>
          <a-statistic
            title="系統依賴"
            :value="24"
            suffix="項"
          >
            <template #prefix><file-search-outlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-row
      :gutter="16"
      style="margin-top: 24px"
    >
      <a-col
        :xs="24"
        :md="16"
      >
        <a-card
          title="快速導覽"
          :bordered="false"
          class="main-card"
        >
          <a-list
            item-layout="horizontal"
            :data-source="quickLinks"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :description="item.desc">
                  <template #title>
                    <router-link :to="item.path">{{ item.title }}</router-link>
                  </template>
                  <template #avatar>
                    <a-avatar :style="{ backgroundColor: item.color }">
                      <template #icon>
                        <component :is="item.icon" />
                      </template>
                    </a-avatar>
                  </template>
                </a-list-item-meta>
                <template #actions>
                  <router-link :to="item.path"
                    >進入 <right-outlined
                  /></router-link>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <a-col
        :xs="24"
        :md="8"
      >
        <a-card
          title="最新動態"
          :bordered="false"
          class="side-card"
        >
          <a-timeline>
            <a-timeline-item color="green"
              >發布 Vue 3 實戰指南 2024-06-01</a-timeline-item
            >
            <a-timeline-item>完成數據看板升級 2024-05-15</a-timeline-item>
            <a-timeline-item color="blue"
              >更新個人技能樹 2024-04-30</a-timeline-item
            >
            <a-timeline-item color="gray"
              >系統初步框架搭件 2024-04-01</a-timeline-item
            >
          </a-timeline>
        </a-card>

        <a-card
          title="系統狀態"
          size="small"
          style="margin-top: 16px"
        >
          <p>前端版本：<a-tag color="blue">v2.1.0-stable</a-tag></p>
          <p>
            API 狀態：<a-badge
              status="processing"
              text="正常連線中"
            />
          </p>
          <p>
            儲存空間：<a-progress
              :percent="65"
              size="small"
              status="active"
            />
          </p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import {
  FileTextOutlined,
  PieChartOutlined,
  ReadOutlined,
  FileSearchOutlined,
  RightOutlined,
  RocketOutlined,
  DatabaseOutlined,
  BulbOutlined,
} from "@ant-design/icons-vue";

const quickLinks = [
  {
    title: "個人部落格",
    desc: "查看最新的技術分享與生活日誌",
    path: "/blog/home",
    icon: RocketOutlined,
    color: "#1890ff",
  },
  {
    title: "數據分析中心",
    desc: "即時視覺化看板與人才數據管理",
    path: "/data/statistics",
    icon: DatabaseOutlined,
    color: "#52c41a",
  },
  {
    title: "知識庫與 Wiki",
    desc: "整理結構化的開發筆記與專案文件",
    path: "/knowledge/wiki",
    icon: BulbOutlined,
    color: "#722ed1",
  },
];
</script>

<style scoped>
.home-container {
  padding-bottom: 24px;
}

.welcome-header {
  margin-bottom: 32px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.welcome-subtitle {
  color: var(--text-color-secondary, #8c8c8c);
  font-size: 16px;
}

.stat-row .ant-card {
  border-radius: 8px;
  transition: all 0.3s;
}

.stat-row .ant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.main-card,
.side-card {
  border-radius: 8px;
  min-height: 400px;
}

/* 讓列表連結更好看 */
:deep(.ant-list-item-meta-title a) {
  font-size: 16px;
  color: inherit;
}

:deep(.ant-list-item-meta-title a:hover) {
  color: #1890ff;
}
</style>
