<template>
  <div class="post-detail" v-if="post">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240); margin-bottom: 24px; padding: 16px"
      :title="post.title"
      :sub-title="post.date"
      @back="() => $router.go(-1)"
    >
      <template #backIcon>
        <arrow-left-outlined style="font-size: 1.2rem" />
      </template>
      <template #extra>
        <a-space>
          <a-tag v-for="tag in post.tags" :key="tag" color="blue">
            <template #icon>
              <code-outlined />
            </template>
            {{ tag }}
          </a-tag>
          <a-button type="primary" @click="copyLink">
            <link-outlined style="margin-right: 4px" />
            分享
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-card style="margin-bottom: 24px">
      <a-space direction="vertical" style="width: 100%">
        <a-space>
          <calendar-outlined style="color: #1890ff; font-size: 1.1rem" />
          <span>發佈於 {{ post.date }}</span>
        </a-space>
        <a-space>
          <user-outlined style="color: #52c41a; font-size: 1.1rem" />
          <span>作者：{{ post.author }}</span>
        </a-space>
        <a-space>
          <file-text-outlined style="color: #722ed1; font-size: 1.1rem" />
          <span>標籤：</span>
          <a-tag v-for="tag in post.tags" :key="tag" color="cyan">{{ tag }}</a-tag>
        </a-space>
      </a-space>
    </a-card>

    <a-card title="文章內容" :bordered="true" style="margin-bottom: 24px">
      <template #extra>
        <read-outlined style="margin-right: 8px; color: #eb2f96" />
      </template>
      <div class="content">
        <a-typography>
          <a-typography-paragraph>
            {{ post.content }}
          </a-typography-paragraph>
        </a-typography>
      </div>
    </a-card>

    <a-divider>
      <heart-outlined style="color: #ff4d4f; margin: 0 8px" />
    </a-divider>

    <a-space style="width: 100%; justify-content: center; margin-top: 24px">
      <a-button @click="$router.push('/posts')">
        <arrow-left-outlined style="margin-right: 4px" />
        返回文章列表
      </a-button>
      <a-button type="primary" @click="$router.push('/')">
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
  ReadOutlined,
  HeartOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
  LinkOutlined,
  CodeOutlined
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
  max-width: 800px;
  margin: 0 auto;
}
.content {
  line-height: 1.8;
  font-size: 1.1rem;
  white-space: pre-wrap;
}
</style>
