<template>
  <div
    class="post-detail"
    v-if="post"
  >
    <!-- 麵包屑導航 -->
    <a-breadcrumb style="margin-bottom: 16px">
      <a-breadcrumb-item
        ><router-link to="/"
          ><home-outlined /> 首頁</router-link
        ></a-breadcrumb-item
      >
      <a-breadcrumb-item
        ><router-link to="/blog/posts">文章列表</router-link></a-breadcrumb-item
      >
      <a-breadcrumb-item>{{ post.title }}</a-breadcrumb-item>
    </a-breadcrumb>

    <a-alert
      message="文章互動功能"
      description="你可以分享文章、切換內容分頁，或留下閱讀回饋。"
      type="info"
      show-icon
      style="margin-bottom: 16px"
    />

    <a-page-header
      :style="{
        border: `1px solid var(--border-color)`,
        marginBottom: '24px',
        padding: '16px',
        borderRadius: '8px',
        background: 'var(--bg-primary)',
      }"
      :title="post.title"
      @back="() => $router.go(-1)"
    >
      <template #backIcon>
        <arrow-left-outlined style="font-size: 1.2rem" />
      </template>
      <template #extra>
        <a-space wrap>
          <a-button
            @click="drawerOpen = true"
            shape="round"
          >
            <message-outlined style="margin-right: 4px" />
            閱讀回饋
          </a-button>
          <a-button
            type="primary"
            @click="copyLink"
            shape="round"
          >
            <link-outlined style="margin-right: 4px" />
            分享文章
          </a-button>
        </a-space>
      </template>

      <a-descriptions
        size="small"
        :column="3"
      >
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
        <a-descriptions-item
          label="標籤"
          :span="2"
        >
          <a-space wrap>
            <a-tag
              v-for="tag in post.tags"
              :key="tag"
              color="cyan"
            >
              <template #icon><code-outlined /></template>
              {{ tag }}
            </a-tag>
          </a-space>
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>

    <!-- 文章封面圖 -->
    <div class="post-cover-container">
      <img
        :src="post.cover"
        alt="cover"
        class="post-cover"
      />
    </div>

    <a-card
      :bordered="false"
      class="content-card"
    >
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane
          key="content"
          tab="文章內容"
        >
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
        </a-tab-pane>
        <a-tab-pane
          key="notes"
          tab="閱讀筆記"
        >
          <a-alert
            message="閱讀建議"
            description="如果這篇文章有幫助，可以用右上角分享，或在回饋抽屜中留下你的想法。"
            type="success"
            show-icon
            style="margin-bottom: 16px"
          />
          <a-list
            :data-source="readingNotes"
            bordered
          >
            <template #renderItem="{ item }">
              <a-list-item>{{ item }}</a-list-item>
            </template>
          </a-list>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <a-divider>
      <heart-outlined :style="{ color: heartColor, margin: '0 8px' }" />
      感謝閱讀
      <heart-outlined :style="{ color: heartColor, margin: '0 8px' }" />
    </a-divider>

    <a-space
      style="
        width: 100%;
        justify-content: center;
        margin-top: 24px;
        margin-bottom: 40px;
      "
    >
      <a-button
        size="large"
        @click="$router.push('/blog/posts')"
        shape="round"
      >
        <arrow-left-outlined style="margin-right: 4px" />
        返回文章列表
      </a-button>
      <a-button
        type="primary"
        size="large"
        @click="$router.push('/blog/home')"
        shape="round"
      >
        <home-outlined style="margin-right: 4px" />
        返回首頁
      </a-button>
    </a-space>

    <a-drawer
      v-model:open="drawerOpen"
      title="留下閱讀回饋"
      placement="right"
      width="380"
    >
      <a-form
        layout="vertical"
        @finish="submitFeedback"
      >
        <a-form-item
          label="你的稱呼"
          name="name"
          :rules="[{ required: true, message: '請輸入稱呼' }]"
        >
          <a-input
            v-model:value="feedbackForm.name"
            placeholder="例如：讀者 A"
          />
        </a-form-item>
        <a-form-item
          label="這篇文章對你有幫助嗎？"
          name="rating"
          :rules="[{ required: true, message: '請選擇評價' }]"
        >
          <a-radio-group v-model:value="feedbackForm.rating">
            <a-radio value="很有幫助">很有幫助</a-radio>
            <a-radio value="還不錯">還不錯</a-radio>
            <a-radio value="想看更多案例">想看更多案例</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="回饋內容"
          name="comment"
          :rules="[{ required: true, message: '請輸入回饋內容' }]"
        >
          <a-textarea
            v-model:value="feedbackForm.comment"
            :rows="4"
            placeholder="告訴我你喜歡哪個段落，或希望補充什麼內容。"
          />
        </a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          block
          >送出回饋</a-button
        >
      </a-form>
    </a-drawer>
  </div>
  <div v-else>
    <a-result
      status="404"
      title="404"
      sub-title="抱歉，找不到這篇文章。"
    >
      <template #extra>
        <a-button
          type="primary"
          @click="$router.push('/blog/posts')"
        >
          <file-text-outlined style="margin-right: 4px" />
          返回文章列表
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { posts } from "../data/posts";
import { message } from "ant-design-vue";
import { useTheme } from "../composables/useTheme";
import {
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  HeartOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
  LinkOutlined,
  CodeOutlined,
  ClockCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons-vue";

const { isDarkMode } = useTheme();

const route = useRoute();
const drawerOpen = ref(false);
const activeTab = ref("content");
const feedbackForm = reactive({
  name: "",
  rating: "",
  comment: "",
});

const heartColor = computed(() =>
  isDarkMode.value ? "var(--color-error)" : "var(--color-error)",
);
const textColor = computed(() => (isDarkMode.value ? "var(--text)" : "#666"));
const titleColor = computed(() =>
  isDarkMode.value ? "var(--text-h)" : "#333",
);

const post = computed(() => {
  const id = parseInt(route.params.id);
  return posts.find((p) => p.id === id);
});

const readingNotes = computed(() => {
  if (!post.value) return [];
  return [
    `這篇文章分類為「${post.value.category}」，適合快速理解主題核心。`,
    `建議先看摘要，再閱讀正文，可更快抓到重點。`,
    `文中標籤包含 ${post.value.tags.join("、")}，方便延伸閱讀。`,
  ];
});

const copyLink = () => {
  const url = window.location.href;
  navigator.clipboard
    .writeText(url)
    .then(() => {
      message.success("連結已複製到剪貼板！");
    })
    .catch(() => {
      message.error("複製失敗，請重試");
    });
};

const submitFeedback = () => {
  drawerOpen.value = false;
  message.success(`感謝 ${feedbackForm.name} 的回饋`);
  feedbackForm.name = "";
  feedbackForm.rating = "";
  feedbackForm.comment = "";
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.post-summary-box {
  background: v-bind(
    isDarkMode ? "var(--surface-muted)": "var(--bg-secondary)"
  );
  padding: 16px;
  border-left: 4px solid var(--icon-info-color);
  border-radius: 4px;
  margin-bottom: 24px;
  font-style: italic;
  color: v-bind(textColor);
}

.main-content {
  line-height: 2;
  font-size: 1.15rem;
  white-space: pre-wrap;
  color: v-bind(titleColor);
}

@media (max-width: 768px) {
  .post-cover-container {
    height: 250px;
  }
}
</style>
