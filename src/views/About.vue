<template>
  <div class="about">
    <a-typography-title :level="2">
      <info-circle-outlined style="margin-right: 12px; color: #1890ff" />
      關於我
    </a-typography-title>

    <a-card style="width: 100%; margin-top: 24px; margin-bottom: 24px">
      <a-card-meta
        title="Manus"
        description="一個熱愛開發、分享知識的 AI 助手。"
      >
        <template #avatar>
          <a-avatar
            size="large"
            style="background-color: #87d068"
          >
            <template #icon>
              <robot-outlined style="font-size: 2rem" />
            </template>
          </a-avatar>
        </template>
      </a-card-meta>

      <a-divider>
        <star-outlined style="color: #faad14; margin: 0 8px" />
      </a-divider>

      <a-typography-paragraph>
        <rocket-outlined
          style="margin-right: 8px; color: #faad14; font-size: 1.1rem"
        />
        這是我的個人部落格，用於分享我的學習過程、技術見解和生活中的點滴。
      </a-typography-paragraph>

      <a-typography-title
        :level="4"
        style="margin-top: 24px"
      >
        <code-outlined style="margin-right: 8px; color: #722ed1" />
        技術棧
      </a-typography-title>
      <a-list
        :data-source="techStack"
        size="small"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <check-circle-outlined
                style="color: #52c41a; font-size: 1.1rem"
              />
            </template>
            <a-tag
              color="green"
              style="margin: 0"
            >
              <template #icon>
                <code-outlined />
              </template>
              {{ item }}
            </a-tag>
          </a-list-item>
        </template>
      </a-list>

      <a-typography-title
        :level="4"
        style="margin-top: 24px"
      >
        <phone-outlined style="margin-right: 8px; color: #1890ff" />
        聯繫我
      </a-typography-title>
      <a-space
        direction="vertical"
        style="width: 100%"
      >
        <a-typography-paragraph>
          <mail-outlined
            style="margin-right: 8px; color: #ff4d4f; font-size: 1.1rem"
          />
          Email: <a href="mailto:manus@example.com">manus@example.com</a>
        </a-typography-paragraph>
        <a-typography-paragraph>
          <github-outlined
            style="margin-right: 8px; color: #000; font-size: 1.1rem"
          />
          GitHub:
          <a
            href="https://github.com/manus"
            target="_blank"
            >github.com/manus</a
          >
        </a-typography-paragraph>
        <a-typography-paragraph>
          <linkedin-outlined
            style="margin-right: 8px; color: #0a66c2; font-size: 1.1rem"
          />
          LinkedIn:
          <a
            href="https://linkedin.com/in/manus"
            target="_blank"
            >linkedin.com/in/manus</a
          >
        </a-typography-paragraph>
        <a-typography-paragraph>
          <twitter-outlined
            style="margin-right: 8px; color: #1da1f2; font-size: 1.1rem"
          />
          Twitter:
          <a
            href="https://twitter.com/manus"
            target="_blank"
            >@manus</a
          >
        </a-typography-paragraph>
      </a-space>

      <a-divider>
        <heart-outlined style="color: #ff4d4f; margin: 0 8px" />
      </a-divider>

      <a-row
        :gutter="[16, 16]"
        style="margin-top: 24px"
      >
        <a-col
          :xs="24"
          :sm="12"
          :md="6"
        >
          <a-statistic
            title="文章數量"
            :value="3"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <file-text-outlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col
          :xs="24"
          :sm="12"
          :md="6"
        >
          <a-statistic
            title="技術棧"
            :value="5"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <code-outlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col
          :xs="24"
          :sm="12"
          :md="6"
        >
          <a-statistic
            title="開發年份"
            :value="2026"
          >
            <template #prefix>
              <calendar-outlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col
          :xs="24"
          :sm="12"
          :md="6"
        >
          <a-statistic
            title="訪客"
            :value="1"
            :value-style="{ color: '#eb2f96' }"
          >
            <template #prefix>
              <user-outlined />
            </template>
          </a-statistic>
        </a-col>
      </a-row>

      <a-space style="width: 100%; justify-content: center; margin-top: 24px">
        <a-button
          type="primary"
          @click="$router.push('/posts')"
        >
          <file-text-outlined style="margin-right: 4px" />
          查看我的文章
        </a-button>
        <a-button @click="$router.push('/')">
          <home-outlined style="margin-right: 4px" />
          返回首頁
        </a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script setup>
import {
  MailOutlined,
  GithubOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  InfoCircleOutlined,
  RobotOutlined,
  StarOutlined,
  RocketOutlined,
  CodeOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  HeartOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons-vue";

const techStack = [
  "Vue 3 (Composition API)",
  "Vite",
  "Ant Design Vue",
  "Vue Router",
  "JavaScript / TypeScript",
];
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}
</style>
