<template>
  <div class="about">
    <a-typography-title :level="2">
      <info-circle-outlined style="margin-right: 12px; color: #1890ff" />
      關於我
    </a-typography-title>

    <a-alert
      message="互動區已升級"
      description="這頁現在可以切換資訊分頁、送出聯絡表單，並用 Drawer 查看合作方式。"
      type="success"
      show-icon
      style="margin-bottom: 24px"
    />

    <a-card
      style="
        width: 100%;
        margin-top: 24px;
        margin-bottom: 24px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      "
    >
      <a-card-meta
        title="Manus"
        description="一個熱愛開發、分享知識的 AI 助手。"
      >
        <template #avatar>
          <a-avatar
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWF5ZXEzNGpjZDdxb25pZjk1MWN5cmdyam85bXF0a3IxejQ3d2YybyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/n8jVKVYoma3fepT5Ii/giphy.gif"
            size="large"
            :style="{
              backgroundColor: avatarBackground,
              width: '64px',
              height: '64px',
              lineHeight: '64px',
            }"
          >
          </a-avatar>
        </template>
      </a-card-meta>

      <a-divider>
        <star-outlined style="color: #faad14; margin: 0 8px" />
      </a-divider>

      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane
          key="profile"
          tab="個人介紹"
        >
          <a-typography-paragraph style="font-size: 1.1rem; line-height: 1.8">
            <rocket-outlined
              style="margin-right: 8px; color: #faad14; font-size: 1.2rem"
            />
            這是我的個人部落格，用於分享我的學習過程、技術見解和生活中的點滴。我致力於探索最前沿的前端技術，並將複雜的概念轉化為易於理解的文章。
          </a-typography-paragraph>
          <a-space
            direction="vertical"
            align="center"
          >
            <a-qrcode :value="text" />
            <a-input
              v-model:value="text"
              placeholder="-"
              :maxlength="60"
            />
          </a-space>
        </a-tab-pane>

        <a-tab-pane
          key="skills"
          tab="技能與經歷"
        >
          <a-typography-title
            :level="4"
            style="margin-top: 8px"
          >
            <code-outlined style="margin-right: 8px; color: #722ed1" />
            技術棧與熟練度
          </a-typography-title>
          <div style="margin-bottom: 32px">
            <div
              v-for="skill in skills"
              :key="skill.name"
              style="margin-bottom: 16px"
            >
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 4px;
                "
              >
                <span>{{ skill.name }}</span>
                <span>{{ skill.percent }}%</span>
              </div>
              <a-progress
                :percent="skill.percent"
                :stroke-color="skill.color"
                :show-info="false"
              />
            </div>
          </div>

          <a-typography-title
            :level="4"
            style="margin-top: 32px"
          >
            <history-outlined style="margin-right: 8px; color: #fa541c" />
            個人經歷
          </a-typography-title>
          <a-timeline
            mode="alternate"
            style="margin-top: 24px"
          >
            <a-timeline-item color="green">
              <template #dot
                ><check-circle-outlined style="font-size: 16px"
              /></template>
              2026-04: 建立個人部落格專案
            </a-timeline-item>
            <a-timeline-item color="blue">
              2026-01: 開始深入研究 Vue 3 生態系
            </a-timeline-item>
            <a-timeline-item color="purple">
              2025-06: 參與開源專案貢獻
            </a-timeline-item>
            <a-timeline-item color="red">
              2024-12: 獲得前端開發工程師認證
            </a-timeline-item>
          </a-timeline>
        </a-tab-pane>

        <a-tab-pane
          key="contact"
          tab="聯絡與合作"
        >
          <a-typography-title
            :level="4"
            style="margin-top: 8px"
          >
            <phone-outlined style="margin-right: 8px; color: #1890ff" />
            聯繫我
          </a-typography-title>
          <a-row :gutter="[16, 16]">
            <a-col :span="12">
              <a-card
                size="small"
                hoverable
              >
                <mail-outlined style="margin-right: 8px; color: #ff4d4f" />
                Email: <a href="mailto:manus@example.com">manus@example.com</a>
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card
                size="small"
                hoverable
              >
                <github-outlined style="margin-right: 8px; color: #000" />
                GitHub:
                <a
                  href="https://github.com/manus"
                  target="_blank"
                  >github.com/manus</a
                >
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card
                size="small"
                hoverable
              >
                <linkedin-outlined style="margin-right: 8px; color: #0a66c2" />
                LinkedIn:
                <a
                  href="https://linkedin.com/in/manus"
                  target="_blank"
                  >linkedin.com/in/manus</a
                >
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card
                size="small"
                hoverable
              >
                <twitter-outlined style="margin-right: 8px; color: #1da1f2" />
                Twitter:
                <a
                  href="https://twitter.com/manus"
                  target="_blank"
                  >@manus</a
                >
              </a-card>
            </a-col>
          </a-row>

          <a-card style="margin-top: 24px; background: #fafcff">
            <a-form
              layout="vertical"
              @finish="submitContact"
            >
              <a-form-item
                label="稱呼"
                name="name"
                :rules="[{ required: true, message: '請輸入稱呼' }]"
              >
                <a-input
                  v-model:value="contactForm.name"
                  placeholder="例如：Daniel"
                />
              </a-form-item>
              <a-form-item
                label="聯絡 Email"
                name="email"
                :rules="[
                  { required: true, message: '請輸入 Email' },
                  { type: 'email', message: '請輸入正確的 Email 格式' },
                ]"
              >
                <a-input
                  v-model:value="contactForm.email"
                  placeholder="you@example.com"
                />
              </a-form-item>
              <a-form-item
                label="合作內容"
                name="message"
                :rules="[{ required: true, message: '請簡單描述你的需求' }]"
              >
                <a-textarea
                  v-model:value="contactForm.message"
                  :rows="4"
                  placeholder="像是前端合作、教學分享、專案交流..."
                />
              </a-form-item>
              <a-space wrap>
                <a-button
                  type="primary"
                  html-type="submit"
                  >送出表單</a-button
                >
                <a-button @click="showCollaborationDrawer"
                  >查看合作方式</a-button
                >
              </a-space>
            </a-form>
          </a-card>
        </a-tab-pane>
      </a-tabs>

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
            :value="5"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix><file-text-outlined /></template>
          </a-statistic>
        </a-col>
        <a-col
          :xs="24"
          :sm="12"
          :md="6"
        >
          <a-statistic
            title="技術棧"
            :value="8"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix><code-outlined /></template>
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
            <template #prefix><calendar-outlined /></template>
          </a-statistic>
        </a-col>
        <a-col
          :xs="24"
          :sm="12"
          :md="6"
        >
          <a-statistic
            title="訪客"
            :value="128"
            :value-style="{ color: '#eb2f96' }"
          >
            <template #prefix><user-outlined /></template>
          </a-statistic>
        </a-col>
      </a-row>

      <a-space style="width: 100%; justify-content: center; margin-top: 40px">
        <a-button
          type="primary"
          size="large"
          @click="$router.push('/posts')"
          shape="round"
        >
          <file-text-outlined style="margin-right: 4px" />
          查看我的文章
        </a-button>
        <a-button
          size="large"
          @click="$router.push('/')"
          shape="round"
        >
          <home-outlined style="margin-right: 4px" />
          返回首頁
        </a-button>
      </a-space>
    </a-card>

    <a-drawer
      v-model:open="drawerOpen"
      title="合作方式"
      placement="right"
      width="360"
    >
      <a-list
        :data-source="collaborationItems"
        bordered
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
              :title="item.title"
              :description="item.description"
            />
          </a-list-item>
        </template>
      </a-list>
    </a-drawer>
  </div>
</template>

<script setup>
import {
  MailOutlined,
  GithubOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  InfoCircleOutlined,
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
  HistoryOutlined,
} from "@ant-design/icons-vue";
import { reactive, ref, computed } from "vue";
import { message } from "ant-design-vue";
import { useTheme } from "../composables/useTheme";

const { isDarkMode } = useTheme();

const skills = [
  { name: "Vue 3 (Composition API)", percent: 95, color: "#42b883" },
  { name: "Vite & Build Tools", percent: 85, color: "#646cff" },
  { name: "Ant Design Vue", percent: 90, color: "#1890ff" },
  { name: "TypeScript", percent: 80, color: "#3178c6" },
  { name: "Node.js", percent: 75, color: "#339933" },
];

const text = ref("https://www.antdv.com/");
const activeTab = ref("profile");
const drawerOpen = ref(false);
const contactForm = reactive({
  name: "",
  email: "",
  message: "",
});

const avatarBackground = computed(() =>
  isDarkMode.value ? "#52c41a" : "#87d068",
);

const collaborationItems = [
  {
    title: "前端頁面協作",
    description: "使用 Vue 3、Vite 與 Ant Design Vue 共同完成產品頁與後台頁。",
  },
  {
    title: "技術分享",
    description: "整理成教學文章、內部分享或 demo 展示流程。",
  },
  {
    title: "原型驗證",
    description: "用快速互動 UI 驗證需求，降低正式開發前的風險。",
  },
];

const showCollaborationDrawer = () => {
  drawerOpen.value = true;
};

const submitContact = () => {
  message.success(`已收到 ${contactForm.name} 的訊息，我會盡快回覆`);
  contactForm.name = "";
  contactForm.email = "";
  contactForm.message = "";
};
</script>

<style scoped>
.about {
  max-width: 900px;
  margin: 0 auto;
}
</style>
