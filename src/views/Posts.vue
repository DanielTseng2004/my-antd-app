<template>
  <div class="posts">
    <a-typography-title :level="2">
      <unordered-list-outlined style="margin-right: 12px; color: #1890ff" />
      文章列表
    </a-typography-title>
    
    <a-card style="margin-bottom: 24px; border-radius: 8px">
      <a-row :gutter="[16, 16]" align="middle">
        <a-col :xs="24" :sm="12">
          <a-input-search
            v-model:value="searchText"
            placeholder="搜尋文章標題、內容或標籤..."
            enter-button
            @search="onSearch"
          >
            <template #prefix>
              <search-outlined style="color: #1890ff" />
            </template>
          </a-input-search>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-radio-group v-model:value="selectedCategory" button-style="solid">
            <a-radio-button value="全部">全部</a-radio-button>
            <a-radio-button v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <div v-if="searchText || selectedCategory !== '全部'" style="margin-top: 16px; color: #666">
        <filter-outlined style="margin-right: 8px; color: #faad14" />
        找到 {{ filteredPosts.length }} 篇文章
        <a-button type="link" size="small" @click="resetFilters">重置篩選</a-button>
      </div>
    </a-card>

    <a-list
      item-layout="vertical"
      size="large"
      :pagination="pagination"
      :data-source="filteredPosts"
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
              <a-tag color="orange">{{ item.category }}</a-tag>
            </span>
            <span>
              <clock-circle-outlined style="margin-right: 8px; color: #eb2f96" />
              {{ item.readTime }}
            </span>
          </template>
          <template #extra>
            <img
              width="240"
              alt="cover"
              :src="item.cover"
              style="border-radius: 8px; object-fit: cover; height: 140px"
            />
          </template>
          <a-list-item-meta :description="item.summary">
            <template #title>
              <div style="margin-bottom: 8px">
                <router-link :to="'/posts/' + item.id" style="font-size: 1.3rem; font-weight: bold">
                  {{ item.title }}
                </router-link>
              </div>
              <a-space wrap>
                <a-tag v-for="tag in item.tags" :key="tag" color="blue">
                  <template #icon><code-outlined /></template>
                  {{ tag }}
                </a-tag>
              </a-space>
            </template>
          </a-list-item-meta>
          <div class="post-preview-content">
            {{ item.content.substring(0, 180) }}...
          </div>
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
  SearchOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  CodeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue';

const searchText = ref('');
const selectedCategory = ref('全部');

const categories = computed(() => {
  const cats = new Set();
  posts.forEach(p => cats.add(p.category));
  return Array.from(cats);
});

const pagination = {
  pageSize: 5,
  showSizeChanger: false,
  showTotal: (total) => `共 ${total} 篇文章`,
};

const filteredPosts = computed(() => {
  let result = posts;
  
  if (selectedCategory.value !== '全部') {
    result = result.filter(post => post.category === selectedCategory.value);
  }
  
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    result = result.filter(post => 
      post.title.toLowerCase().includes(search) || 
      post.summary.toLowerCase().includes(search) ||
      post.content.toLowerCase().includes(search) ||
      post.tags.some(tag => tag.toLowerCase().includes(search))
    );
  }
  
  return [...result].sort((a, b) => new Date(b.date) - new Date(a.date));
});

const onSearch = (value) => {
  searchText.value = value;
};

const resetFilters = () => {
  searchText.value = '';
  selectedCategory.value = '全部';
};
</script>

<style scoped>
.posts {
  max-width: 1000px;
  margin: 0 auto;
}

.post-preview-content {
  color: #555;
  line-height: 1.6;
  margin-top: 12px;
}

:deep(.ant-list-item-extra) {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  :deep(.ant-list-item-extra) {
    margin-top: 16px;
    justify-content: center;
  }
  :deep(.ant-list-item-extra img) {
    width: 100%;
    height: auto;
  }
}
</style>
