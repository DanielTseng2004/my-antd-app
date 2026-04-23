<template>
  <div class="home">
    <a-alert
      message="站點小提醒"
      description="你可以從精選內容、快速導覽與訂閱抽屜開始探索，部分操作也會有即時回饋提示。"
      type="info"
      show-icon
      closable
      style="margin-bottom: 20px"
    />

    <div class="home-toolbar">
      <a-space wrap>
        <a-button
          type="primary"
          shape="round"
          @click="openDrawer"
        >
          <notification-outlined style="margin-right: 6px" />
          開啟快速面板
        </a-button>
        <a-button
          shape="round"
          @click="showWelcome"
        >
          <smile-outlined style="margin-right: 6px" />
          互動提示
        </a-button>
      </a-space>
    </div>

    <!-- 輪播圖 -->
    <a-carousel
      autoplay
      class="home-carousel"
    >
      <div
        v-for="post in featuredPosts"
        :key="post.id"
        class="carousel-item"
      >
        <div
          class="carousel-content"
          :style="{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${post.cover})`,
          }"
        >
          <div class="carousel-text">
            <a-typography-title
              :level="2"
              style="color: white"
              >{{ post.title }}</a-typography-title
            >
            <p>{{ post.summary }}</p>
            <a-button
              type="primary"
              @click="$router.push('/posts/' + post.id)"
              >閱讀更多</a-button
            >
          </div>
        </div>
      </div>
    </a-carousel>

    <a-typography style="margin-top: 40px">
      <a-typography-title>
        <smile-outlined
          style="margin-right: 12px; color: var(--icon-info-color)"
        />
        歡迎來到我的個人部落格
      </a-typography-title>
      <a-typography-paragraph>
        <rocket-outlined
          style="margin-right: 8px; color: var(--icon-warning-color)"
        />
        這裡是我分享技術心得、生活點滴與開發日誌的地方。
      </a-typography-paragraph>
    </a-typography>

    <a-tabs
      v-model:activeKey="activeTab"
      style="margin-top: 24px"
    >
      <a-tab-pane
        key="overview"
        tab="站點總覽"
      >
        <a-row
          :gutter="16"
          style="margin: 24px 0"
        >
          <a-col :span="8">
            <a-card>
              <a-statistic
                title="文章總數"
                :value="posts.length"
                :value-style="{ color: statisticColors.total }"
              >
                <template #prefix><file-text-outlined /></template>
              </a-statistic>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card>
              <a-statistic
                title="技術文章"
                :value="techCount"
                :value-style="{ color: statisticColors.tech }"
              >
                <template #prefix><code-outlined /></template>
              </a-statistic>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card>
              <a-statistic
                title="累計標籤"
                :value="tagCount"
                :value-style="{ color: statisticColors.tags }"
              >
                <template #prefix><tags-outlined /></template>
              </a-statistic>
            </a-card>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane
        key="highlights"
        tab="快速導覽"
      >
        <a-list
          :data-source="quickActions"
          bordered
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta
                :title="item.title"
                :description="item.description"
              />
              <a-button
                type="link"
                @click="item.action"
                >前往</a-button
              >
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
    </a-tabs>

    <a-divider>
      <star-outlined style="margin: 0 8px; color: var(--icon-warning-color)" />
      最新文章
      <star-outlined style="margin: 0 8px; color: var(--icon-warning-color)" />
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
              <calendar-outlined
                style="margin-right: 8px; color: var(--icon-info-color)"
              />
              {{ item.date }}
            </span>
            <span>
              <tag-outlined
                style="margin-right: 8px; color: var(--icon-warning-color)"
              />
              {{ item.category }}
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
              width="200"
              alt="cover"
              :src="item.cover"
              style="border-radius: 8px; object-fit: cover; height: 120px"
            />
          </template>
          <a-list-item-meta :description="item.summary">
            <template #title>
              <router-link
                :to="'/blog/posts/' + item.id"
                style="font-size: 1.2rem; font-weight: bold"
              >
                {{ item.title }}
              </router-link>
              <div style="margin-top: 8px">
                <a-tag
                  v-for="tag in item.tags"
                  :key="tag"
                  color="blue"
                  >{{ tag }}</a-tag
                >
              </div>
            </template>
          </a-list-item-meta>
          {{ item.content.substring(0, 120) }}...
        </a-list-item>
      </template>
    </a-list>

    <div style="text-align: center; margin-top: 40px; margin-bottom: 40px">
      <a-button
        type="primary"
        size="large"
        @click="$router.push('/blog/posts')"
        shape="round"
      >
        <arrow-right-outlined style="margin-right: 8px" />
        查看所有文章
      </a-button>
    </div>

    <a-drawer
      v-model:open="drawerOpen"
      title="快速互動面板"
      placement="right"
      width="380"
    >
      <a-alert
        message="訂閱更新"
        description="留下你的 Email 後，我們會以互動提示模擬通知流程。"
        type="success"
        show-icon
        style="margin-bottom: 16px"
      />
      <a-form
        layout="vertical"
        @finish="submitSubscription"
      >
        <a-form-item
          label="Email"
          name="email"
          :rules="[
            { required: true, message: '請輸入 Email' },
            { type: 'email', message: 'Email 格式不正確' },
          ]"
        >
          <a-input
            v-model:value="subscriptionEmail"
            placeholder="you@example.com"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            block
            >送出訂閱</a-button
          >
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { message, notification } from "ant-design-vue";
import { posts } from "../data/posts";
import { useTheme } from "../composables/useTheme";
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
  ClockCircleOutlined,
  NotificationOutlined,
} from "@ant-design/icons-vue";

const router = useRouter();
const drawerOpen = ref(false);
const activeTab = ref("overview");
const subscriptionEmail = ref("");
const { isDarkMode } = useTheme();

const featuredPosts = computed(() => posts.slice(0, 3));
const latestPosts = computed(() =>
  [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3),
);
const techCount = computed(
  () => posts.filter((p) => p.category === "技術").length,
);
const tagCount = computed(() => {
  const tags = new Set();
  posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return tags.size;
});

const statisticColors = computed(() => ({
  total: isDarkMode.value
    ? "var(--chart-total-color)"
    : "var(--chart-total-color)",
  tech: isDarkMode.value
    ? "var(--chart-tech-color)"
    : "var(--chart-tech-color)",
  tags: isDarkMode.value
    ? "var(--chart-tags-color)"
    : "var(--chart-tags-color)",
}));

const quickActions = computed(() => [
  {
    title: "瀏覽所有文章",
    description: "快速進入文章列表查看所有內容。",
    action: () => router.push("/blog/posts"),
  },
  {
    title: "查看關於我",
    description: "前往 About 頁面看更多個人資訊與聯絡方式。",
    action: () => router.push("/blog/about"),
  },
  {
    title: "閱讀最新文章",
    description: `直接打開最新文章：${latestPosts.value[0]?.title ?? "尚無資料"}`,
    action: () => {
      if (latestPosts.value[0]) {
        router.push(`/posts/${latestPosts.value[0].id}`);
      }
    },
  },
]);

const openDrawer = () => {
  drawerOpen.value = true;
};

const showWelcome = () => {
  notification.info({
    message: "探索提示",
    description:
      "你可以切換 Tabs、打開 Drawer，或直接前往文章頁體驗更多互動元件。",
  });
};

const submitSubscription = () => {
  drawerOpen.value = false;
  message.success(`已收到 ${subscriptionEmail.value} 的訂閱申請`);
  subscriptionEmail.value = "";
};
</script>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
}

.home-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.home-carousel {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.theme-dark .carousel-content {
  color: var(--text-h);
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

.theme-dark :deep(.ant-carousel .slick-dots li button) {
  background: var(--text);
}

:deep(.ant-carousel .slick-dots li.slick-active button) {
  background: var(--icon-info-color);
}
</style>
