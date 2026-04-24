<template>
  <div class="posts">
    <a-typography-title :level="2">
      <unordered-list-outlined
        style="margin-right: 12px; color: var(--icon-info-color)"
      />
      文章列表
    </a-typography-title>

    <a-alert
      message="篩選小技巧"
      description="可以搭配搜尋、分類與推薦標籤快速縮小結果；若找不到文章，也會顯示空狀態提示。"
      type="warning"
      show-icon
      closable
      style="margin-bottom: 20px"
    />

    <a-card style="margin-bottom: 24px; border-radius: 8px">
      <a-row
        :gutter="[16, 16]"
        align="middle"
      >
        <a-col
          :xs="24"
          :sm="12"
        >
          <a-input-search
            v-model:value="searchText"
            placeholder="搜尋文章標題、內容或標籤..."
            enter-button
            @search="onSearch"
          >
            <template #prefix>
              <search-outlined style="color: var(--icon-info-color)" />
            </template>
          </a-input-search>
        </a-col>
        <a-col
          :xs="24"
          :sm="12"
        >
          <a-radio-group
            v-model:value="selectedCategory"
            button-style="solid"
          >
            <a-radio-button value="全部">全部</a-radio-button>
            <a-radio-button
              v-for="cat in categories"
              :key="cat"
              :value="cat"
              >{{ cat }}</a-radio-button
            >
          </a-radio-group>
        </a-col>
      </a-row>

      <a-tabs
        v-model:activeKey="activeTab"
        style="margin-top: 20px"
      >
        <a-tab-pane
          key="filters"
          tab="篩選摘要"
        >
          <div
            v-if="searchText || selectedCategory !== '全部'"
            :style="{ color: textColor }"
          >
            <filter-outlined
              style="margin-right: 8px; color: var(--icon-warning-color)"
            />
            找到 {{ filteredPosts.length }} 篇文章
            <a-button
              type="link"
              size="small"
              @click="resetFilters"
              >重置篩選</a-button
            >
          </div>
          <div
            v-else
            :style="{ color: textColor }"
          >
            目前顯示全部文章，共 {{ filteredPosts.length }} 篇。
          </div>
        </a-tab-pane>
        <a-tab-pane
          key="tags"
          tab="熱門標籤"
        >
          <a-space wrap>
            <a-tag
              v-for="tag in popularTags"
              :key="tag"
              color="blue"
              class="clickable-tag"
              @click="applyTag(tag)"
            >
              {{ tag }}
            </a-tag>
          </a-space>
        </a-tab-pane>
      </a-tabs>

      <div style="margin-top: 16px">
        <a-button @click="drawerOpen = true">開啟進階篩選說明</a-button>
      </div>
    </a-card>

    <a-list
      v-if="filteredPosts.length"
      item-layout="vertical"
      size="large"
      :pagination="pagination"
      :data-source="filteredPosts"
    >
      <template #renderItem="{ item }">
        <a-list-item :key="item.id">
          <template #actions>
            <span>
              <calendar-outlined
                style="margin-right: 8px; color: var(--icon-info-color)"
              />
              {{ item.date }}
            </span>
            <span>
              <tag-outlined
                style="margin-right: 8px; color: var(--icon-warning-color)"
              />
              <a-tag color="orange">{{ item.category }}</a-tag>
            </span>
            <span>
              <clock-circle-outlined
                style="margin-right: 8px; color: var(--stat-visitors-color)"
              />
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
                <router-link
                  :to="'/blog/posts/' + item.id"
                  style="font-size: 1.3rem; font-weight: bold"
                >
                  {{ item.title }}
                </router-link>
              </div>
              <a-space wrap>
                <a-tag
                  v-for="tag in item.tags"
                  :key="tag"
                  color="blue"
                >
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

    <a-empty
      v-else
      description="沒有符合條件的文章"
    >
      <a-button
        type="primary"
        @click="resetFilters"
        >重新查看全部文章</a-button
      >
    </a-empty>

    <a-drawer
      v-model:open="drawerOpen"
      title="進階篩選說明"
      placement="right"
      width="360"
    >
      <a-steps
        direction="vertical"
        size="small"
        :current="1"
      >
        <a-step
          title="先選分類"
          description="先縮小內容範圍，閱讀更有效率。"
        />
        <a-step
          title="再用關鍵字"
          description="可搜尋標題、摘要、內容與標籤。"
        />
        <a-step
          title="點熱門標籤"
          description="快速回到常見主題組合。"
        />
      </a-steps>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { message } from "ant-design-vue";
import { posts } from "../data/posts";
import { useTheme } from "../composables/useTheme";
import {
  CalendarOutlined,
  TagOutlined,
  SearchOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  CodeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons-vue";

const { isDarkMode } = useTheme();

const searchText = ref("");
const selectedCategory = ref("全部");
const activeTab = ref("filters");
const drawerOpen = ref(false);

const textColor = computed(() => (isDarkMode.value ? "var(--text)" : "#666"));
const contentColor = computed(() =>
  isDarkMode.value ? "var(--text)" : "#555",
);

const categories = computed(() => {
  const cats = new Set();
  posts.forEach((p) => cats.add(p.category));
  return Array.from(cats);
});

const popularTags = computed(() => {
  const tagMap = new Map();
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    });
  });
  return [...tagMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag]) => tag);
});

const pagination = {
  pageSize: 5,
  showSizeChanger: false,
  showTotal: (total) => `共 ${total} 篇文章`,
};

const filteredPosts = computed(() => {
  let result = posts;

  if (selectedCategory.value !== "全部") {
    result = result.filter((post) => post.category === selectedCategory.value);
  }

  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    result = result.filter(
      (post) =>
        post.title.toLowerCase().includes(search) ||
        post.summary.toLowerCase().includes(search) ||
        post.content.toLowerCase().includes(search) ||
        post.tags.some((tag) => tag.toLowerCase().includes(search)),
    );
  }

  return [...result].sort((a, b) => new Date(b.date) - new Date(a.date));
});

const onSearch = (value) => {
  searchText.value = value;
};

const applyTag = (tag) => {
  searchText.value = tag;
  activeTab.value = "filters";
  message.success(`已套用標籤：${tag}`);
};

const resetFilters = () => {
  searchText.value = "";
  selectedCategory.value = "全部";
  activeTab.value = "filters";
};
</script>

<style scoped>
.posts {
  max-width: 1000px;
  margin: 0 auto;
}

.post-preview-content {
  color: v-bind(contentColor);
  line-height: 1.6;
  margin-top: 12px;
}

.clickable-tag {
  cursor: pointer;
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
