<template>
  <div class="home">
    <a-typography>
      <a-typography-title>
        <smile-outlined style="margin-right: 12px; color: #1890ff" />
        歡迎來到我的個人部落格
      </a-typography-title>
      <a-typography-paragraph>
        <rocket-outlined style="margin-right: 8px; color: #faad14" />
        這裡是我分享技術心得、生活點滴與開發日誌的地方。
      </a-typography-paragraph>
    </a-typography>

    <a-divider>
      <star-outlined style="margin: 0 8px; color: #faad14" />
      最新文章
      <star-outlined style="margin: 0 8px; color: #faad14" />
    </a-divider>

    <a-list
      item-layout="vertical"
      size="large"
      :data-source="latestPosts"
    >
      <template #renderItem="{ item }">
        <a-list-item key="item.title">
          <template #actions>
            <span>
              <calendar-outlined style="margin-right: 8px; color: #1890ff" />
              {{ item.date }}
            </span>
            <span>
              <user-outlined style="margin-right: 8px; color: #52c41a" />
              {{ item.author }}
            </span>
          </template>
          <a-list-item-meta :description="item.summary">
            <template #title>
              <file-outlined style="margin-right: 8px; color: #722ed1" />
              <router-link :to="'/posts/' + item.id">{{ item.title }}</router-link>
            </template>
          </a-list-item-meta>
          <read-outlined style="margin-right: 8px; color: #eb2f96" />
          {{ item.content.substring(0, 100) }}...
        </a-list-item>
      </template>
    </a-list>

    <div style="text-align: center; margin-top: 20px">
      <a-button type="primary" @click="$router.push('/posts')">
        <arrow-right-outlined style="margin-right: 8px" />
        查看所有文章
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { posts } from '../data/posts';
import { 
  CalendarOutlined, 
  UserOutlined, 
  FileOutlined,
  ReadOutlined,
  SmileOutlined,
  RocketOutlined,
  StarOutlined,
  ArrowRightOutlined
} from '@ant-design/icons-vue';

const latestPosts = computed(() => {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
});
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
}
</style>
