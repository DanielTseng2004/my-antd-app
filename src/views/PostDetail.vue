<template>
  <div class="post-detail" v-if="post">
    <!-- 麵包屑導航 -->
    <a-breadcrumb style="margin-bottom: 16px">
      <a-breadcrumb-item><router-link to="/"><home-outlined /> 首頁</router-link></a-breadcrumb-item>
      <a-breadcrumb-item><router-link to="/posts">文章列表</router-link></a-breadcrumb-item>
      <a-breadcrumb-item>{{ post.title }}</a-breadcrumb-item>
    </a-breadcrumb>

    <a-page-header
      style="border: 1px solid rgb(235, 237, 240); margin-bottom: 24px; padding: 16px; border-radius: 8px; background: #fff"
      :title="post.title"
      @back="() => $router.go(-1)"
    >
      <template #backIcon>
        <arrow-left-outlined style="font-size: 1.2rem" />
      </template>
      <template #extra>
        <a-button type="primary" @click="copyLink" shape="round">
          <link-outlined style="margin-right: 4px" />
          分享文章
        </a-button>
      </template>
      
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="作者">
          <a-tag color="blue"><user-outlined /> {{ post.author }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="發佈日期">
          <calendar-outlined /> {{ post.date }}
        </a-descriptions-item>
        <a-descriptions-item label="閱讀時間">
          <clock-circle-outlined /> {{ post.readTime }}
        </a-descriptions-item>
        <a-descriptions-item label="分類">
          <a-tag color="orange">{{ post.category }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="標籤" :span="2">
          <a-space wrap>
            <a-tag v-for="tag in post.tags" :key="tag" color="cyan">
              <template #icon><code-outlined /></template>
              {{ tag }}
            </a-tag>
          </a-space>
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>

    <!-- 文章封面圖 -->
    <div class="post-cover-container">
      <img :src="post.cover" alt="cover" class="post-cover" />
    </div>

    <a-card :bordered="false" class="content-card">
      <div class="content">
        <a-typography>
          <a-typography-paragraph>
            <div class="post-summary-box">
              <strong>摘要：</strong>{{ post.summary }}
            </div>
          </a-typography-paragraph>
          <a-typography-paragraph class="main-content">
            {{ post.content }}
          </a-typography-paragraph>
        </a-typography>
      </div>
    </a-card>

    <a-divider>
      <heart-outlined style="color: #ff4d4f; margin: 0 8px" />
      感謝閱讀
      <heart-outlined style="color: #ff4d4f; margin: 0 8px" />
    </a-divider>

    <a-space style="width: 100%; justify-content: center; margin-top: 24px; margin-bottom: 40px">
      <a-button size="large" @click="$router.push('/posts')" shape="round">
        <arrow-left-outlined style="margin-right: 4px" />
        返回文章列表
      </a-button>
      <a-button type="primary" size="large" @click="$router.push('/')" shape="round">
        <home-outlined style="margin-right: 4px" />
        返回首頁
      </a-button>
    </a-space>
  </div>
  <div v-else>
    <a-result status="404" title="404" sub-title="抱歉，找不到這篇文章。">
      <template #extra>
        <a-button type="primary" @click="$router.push('/posts')">
          <file-text-outlined style="margin-right: 4px" />
          返回文章列表
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { posts } from '../data/posts';
import { message } from 'ant-design-vue';
import { 
  CalendarOutlined, 
  UserOutlined,
  FileTextOutlined,
  HeartOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
  LinkOutlined,
  CodeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue';

const route = useRoute();
const post = computed(() => {
  const id = parseInt(route.params.id);
  return posts.find(p => p.id === id);
});

const copyLink = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    message.success('連結已複製到剪貼板！');
  }).catch(() => {
    message.error('複製失敗，請重試');
  });
};
</script>

<style scoped>
.post-detail {
  max-width: 900px;
  margin: 0 auto;
}

.post-cover-container {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.post-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 20px;
}

.post-summary-box {
  background: #f9f9f9;
  padding: 16px;
  border-left: 4px solid #1890ff;
  border-radius: 4px;
  margin-bottom: 24px;
  font-style: italic;
  color: #666;
}

.main-content {
  line-height: 2;
  font-size: 1.15rem;
  white-space: pre-wrap;
  color: #333;
}

@media (max-width: 768px) {
  .post-cover-container {
    height: 250px;
  }
}
</style>
