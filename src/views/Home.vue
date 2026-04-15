<template>
  <div class="home">
    <!-- 輪播圖 -->
    <a-carousel autoplay class="home-carousel">
      <div v-for="post in featuredPosts" :key="post.id" class="carousel-item">
        <div class="carousel-content" :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${post.cover})` }">
          <div class="carousel-text">
            <a-typography-title :level="2" style="color: white">{{ post.title }}</a-typography-title>
            <p>{{ post.summary }}</p>
            <a-button type="primary" @click="$router.push('/posts/' + post.id)">閱讀更多</a-button>
          </div>
        </div>
      </div>
    </a-carousel>

    <a-typography style="margin-top: 40px">
      <a-typography-title>
        <smile-outlined style="margin-right: 12px; color: #1890ff" />
        歡迎來到我的個人部落格
      </a-typography-title>
      <a-typography-paragraph>
        <rocket-outlined style="margin-right: 8px; color: #faad14" />
        這裡是我分享技術心得、生活點滴與開發日誌的地方。
      </a-typography-paragraph>
    </a-typography>

    <!-- 統計資訊 -->
    <a-row :gutter="16" style="margin: 24px 0">
      <a-col :span="8">
        <a-card>
          <a-statistic title="文章總數" :value="posts.length" :value-style="{ color: '#3f51b5' }">
            <template #prefix><file-text-outlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card>
          <a-statistic title="技術文章" :value="techCount" :value-style="{ color: '#4caf50' }">
            <template #prefix><code-outlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card>
          <a-statistic title="累計標籤" :value="tagCount" :value-style="{ color: '#ff9800' }">
            <template #prefix><tags-outlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

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
              <tag-outlined style="margin-right: 8px; color: #faad14" />
              {{ item.category }}
            </span>
            <span>
              <clock-circle-outlined style="margin-right: 8px; color: #eb2f96" />
              {{ item.readTime }}
            </span>
          </template>
          <template #extra>
            <img
              width="200"
              alt="cover"
              :src="item.cover"
              style="border-radius: 8px; object-fit: cover; height: 120px"
            />
          </template>
          <a-list-item-meta :description="item.summary">
            <template #title>
              <router-link :to="'/posts/' + item.id" style="font-size: 1.2rem; font-weight: bold">
                {{ item.title }}
              </router-link>
              <div style="margin-top: 8px">
                <a-tag v-for="tag in item.tags" :key="tag" color="blue">{{ tag }}</a-tag>
              </div>
            </template>
          </a-list-item-meta>
          {{ item.content.substring(0, 120) }}...
        </a-list-item>
      </template>
    </a-list>

    <div style="text-align: center; margin-top: 40px; margin-bottom: 40px">
      <a-button type="primary" size="large" @click="$router.push('/posts')" shape="round">
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
  FileTextOutlined,
  SmileOutlined,
  RocketOutlined,
  StarOutlined,
  ArrowRightOutlined,
  CodeOutlined,
  TagsOutlined,
  TagOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue';

const featuredPosts = computed(() => {
  return posts.slice(0, 3);
});

const latestPosts = computed(() => {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
});

const techCount = computed(() => {
  return posts.filter(p => p.category === '技術').length;
});

const tagCount = computed(() => {
  const tags = new Set();
  posts.forEach(p => p.tags.forEach(t => tags.add(t)));
  return tags.size;
});
</script>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
}

.home-carousel {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.carousel-item {
  height: 350px;
}

.carousel-content {
  height: 350px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.carousel-text {
  padding: 0 40px;
}

.carousel-text p {
  font-size: 1.1rem;
  margin-bottom: 20px;
}

:deep(.ant-carousel .slick-dots li button) {
  background: #fff;
}

:deep(.ant-carousel .slick-dots li.slick-active button) {
  background: #1890ff;
}
</style>
