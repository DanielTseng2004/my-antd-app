<template>
  <div class="posts">
    <a-typography-title :level="2">
      <unordered-list-outlined style="margin-right: 12px; color: #1890ff" />
      文章列表
    </a-typography-title>
    
    <a-space direction="vertical" style="width: 100%; margin-bottom: 20px">
      <a-input-search
        v-model:value="searchText"
        placeholder="搜尋文章..."
        style="width: 300px"
        @search="onSearch"
      >
        <template #prefix>
          <search-outlined style="color: #1890ff" />
        </template>
      </a-input-search>
      <div v-if="searchText" style="color: #666">
        <filter-outlined style="margin-right: 8px; color: #faad14" />
        找到 {{ filteredPosts.length }} 篇文章
      </div>
    </a-space>

    <a-list
      item-layout="vertical"
      size="large"
      :pagination="pagination"
      :data-source="filteredPosts"
    >
      <template #renderItem="{ item, index }">
        <a-list-item key="item.title">
          <template #actions>
            <span>
              <calendar-outlined style="margin-right: 8px; color: #1890ff" />
              {{ item.date }}
            </span>
            <span>
              <tag-outlined style="margin-right: 8px; color: #52c41a" />
              <a-tag v-for="tag in item.tags" :key="tag" color="blue">
                <template #icon>
                  <code-outlined />
                </template>
                {{ tag }}
              </a-tag>
            </span>
          </template>
          <a-list-item-meta :description="item.summary">
            <template #title>
              <span style="display: flex; align-items: center">
                <a-badge :count="index + 1" style="margin-right: 12px" />
                <file-text-outlined style="margin-right: 8px; color: #722ed1; font-size: 1.1rem" />
                <router-link :to="'/posts/' + item.id">{{ item.title }}</router-link>
              </span>
            </template>
          </a-list-item-meta>
          <read-outlined style="margin-right: 8px; color: #eb2f96" />
          {{ item.content.substring(0, 150) }}...
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { posts } from '../data/posts';
import { 
  CalendarOutlined, 
  TagOutlined,
  ReadOutlined,
  SearchOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  CodeOutlined
} from '@ant-design/icons-vue';

const searchText = ref('');
const pagination = {
  onChange: (page) => {
    console.log(page);
  },
  pageSize: 5,
};

const filteredPosts = computed(() => {
  if (!searchText.value) return posts;
  const search = searchText.value.toLowerCase();
  return posts.filter(post => 
    post.title.toLowerCase().includes(search) || 
    post.summary.toLowerCase().includes(search) ||
    post.tags.some(tag => tag.toLowerCase().includes(search))
  );
});

const onSearch = (value) => {
  searchText.value = value;
};
</script>

<style scoped>
.posts {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
