<template>
  <a-config-provider :theme="antdTheme">
    <a-layout :class="['layout', { 'theme-dark': isDarkMode }]">
      <a-layout-sider
        v-model:collapsed="collapsed"
        collapsible
        breakpoint="lg"
        :theme="isDarkMode ? 'dark' : 'light'"
        width="220"
      >
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          :theme="isDarkMode ? 'dark' : 'light'"
          mode="inline"
        >
          <div class="logo"></div>
          <a-sub-menu key="sub1">
            <template #icon><FolderOutlined /></template>
            <template #title>個人部落格</template>
            <a-menu-item key="Home">
              <template #icon><HomeOutlined /></template>
              <router-link to="/">首頁看板</router-link>
            </a-menu-item>
            <a-menu-item key="Posts">
              <template #icon><FileTextOutlined /></template>
              <router-link to="/posts">文章內容</router-link>
            </a-menu-item>
            <a-menu-item key="About">
              <template #icon><UserOutlined /></template>
              <router-link to="/about">關於作者</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #icon><AppstoreOutlined /></template>
            <template #title>表單管理</template>
            <a-menu-item key="Form">
              <template #icon><FileSearchOutlined /></template>
              <router-link to="/form">技術人才查詢</router-link>
            </a-menu-item>
            <a-menu-item key="Statistics">
              <template #icon><PieChartOutlined /></template>
              <router-link to="/staticdashboard">統計數據</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item key="SystemSettings">
            <template #icon><SettingOutlined /></template>
            <router-link to="/systemsettings">系統設定</router-link>
          </a-menu-item>
          <a-menu-item key="ProjectTimeline">
            <template #icon><HistoryOutlined /></template>
            <router-link to="/timeline">專案時間軸</router-link>
          </a-menu-item>
          <a-menu-item key="InteractiveLab">
            <template #icon><ExperimentOutlined /></template>
            <router-link to="/interactiveLab">互動實驗室</router-link>
          </a-menu-item>
          <a-menu-item key="dependencyMonitor">
            <template #icon><FileSearchOutlined /></template>
            <router-link to="/dependencyMonitor">依賴監控</router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-layout>
        <a-layout-header class="app-header">
          <div class="header-left">
            <div
              class="trigger-btn"
              @click="() => (collapsed = !collapsed)"
            >
              <MenuUnfoldOutlined v-if="collapsed" />
              <MenuFoldOutlined v-else />
            </div>
            <div class="logo-area">
              <BookOutlined style="font-size: 1.5rem" />
              <span class="logo-text">管理系統</span>
            </div>
          </div>

          <div class="user-info">
            <a-space
              size="middle"
              align="center"
            >
              <a-button
                type="text"
                shape="circle"
                class="theme-switch-btn"
                :title="isDarkMode ? '切換到亮色模式' : '切換到暗色模式'"
                @click="toggleTheme"
              >
                <template #icon>
                  <BulbOutlined v-if="isDarkMode" />
                  <BulbFilled v-else />
                </template>
              </a-button>

              <BellOutlined class="header-icon-btn" />

              <a-dropdown>
                <span class="user-dropdown-link">
                  <a-avatar
                    size="small"
                    :style="{
                      backgroundColor: avatarBackground,
                      marginRight: '8px',
                    }"
                  >
                    <template #icon><UserOutlined /></template>
                  </a-avatar>
                  <span class="username">Manus Admin</span>
                  <DownOutlined style="margin-left: 8px; font-size: 10px" />
                </span>
                <template #overlay>
                  <a-menu class="user-dropdown-menu">
                    <a-menu-item key="0">
                      <div class="menu-item-content">
                        <UserOutlined />
                        <span>個人資料</span>
                      </div>
                    </a-menu-item>

                    <a-menu-item key="1">
                      <router-link
                        to="/systemsettings"
                        class="menu-item-content"
                      >
                        <SettingOutlined />
                        <span>系統設定</span>
                      </router-link>
                    </a-menu-item>

                    <a-menu-divider />

                    <a-menu-item
                      key="3"
                      @click="showLogoutConfirm"
                      danger
                    >
                      <div class="menu-item-content">
                        <LogoutOutlined />
                        <span>登出系統</span>
                      </div>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </div>
        </a-layout-header>

        <a-layout-content class="app-content">
          <a-breadcrumb style="margin: 12px 0">
            <a-breadcrumb-item>首頁</a-breadcrumb-item>
            <a-breadcrumb-item>{{ route.name }}</a-breadcrumb-item>
          </a-breadcrumb>
          <div
            class="content-shell"
            :style="{ padding: '24px', minHeight: '280px' }"
          >
            <router-view />
          </div>
        </a-layout-content>
      </a-layout>

      <ChatRobot />
    </a-layout>
  </a-config-provider>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { Modal, message } from "ant-design-vue";
import ChatRobot from "./components/ChatBot.vue";
import {
  HomeOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  UserOutlined,
  BookOutlined,
  DownOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FolderOutlined,
  AppstoreOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  PieChartOutlined,
  BulbOutlined,
  BulbFilled,
  HistoryOutlined,
  ExperimentOutlined,
} from "@ant-design/icons-vue";
import { useTheme } from "./composables/useTheme";

const route = useRoute();
const collapsed = ref(false);
const selectedKeys = ref(["Home"]);
const openKeys = ref(["sub1"]);

const { isDarkMode, toggleTheme, antdTheme } = useTheme();

const avatarBackground = computed(() =>
  isDarkMode.value ? "var(--avatar-dark-bg)" : "var(--avatar-light-bg)",
);

const showLogoutConfirm = () => {
  Modal.confirm({
    title: "確認登出",
    content: "您確定要登出個人管理系統嗎？",
    okText: "確認登出",
    cancelText: "我再想想",
    okType: "danger",
    onOk() {
      const hide = message.loading("正在登出...", 0);
      setTimeout(() => {
        hide();
        message.success("登出成功！");
      }, 1000);
    },
  });
};

watchEffect(() => {
  if (route.name) {
    selectedKeys.value = [route.name];
  }
});
</script>

<style scoped>
/* Header 樣式 */
.app-header {
  background: var(--header-bg);
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--header-shadow);
  color: var(--header-text);
}
.app-content {
  margin: 16px 24px 0 24px;
  background: transparent;
}

.breadcrumb-container {
  margin: 12px 0 16px 8px; /* 增加左邊距 8px */
}
.header-left,
.user-info {
  display: flex;
  align-items: center;
}

/* 主題切換按鈕：置中與放大效果 */
.theme-switch-btn {
  font-size: 20px;
  width: 36px;
  height: 36px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-switch-btn:hover {
  transform: scale(1.2);
}

.theme-switch-btn :deep(.anticon) {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 選單樣式統一修正 */
.user-dropdown-menu :deep(.ant-dropdown-menu-item) {
  padding: 0; /* 移除內部預設間距以利 router-link 撐滿 */
}

.menu-link-item,
.user-dropdown-menu :deep(.ant-dropdown-menu-item > span) {
  display: flex;
  align-items: center;
  padding: 5px 12px;
  color: inherit !important;
  text-decoration: none !important;
  width: 100%;
}
.menu-item-content {
  display: flex !important;
  align-items: center;
  width: 100%;
  padding: 5px 12px; /* 這裡的 padding 控制選單間距 */
  color: inherit !important; /* 強制繼承文字顏色，避免連結變藍色 */
  text-decoration: none !important; /* 移除下劃線 */
  transition: all 0.3s;
}
.user-dropdown-menu :deep(.ant-dropdown-menu-item) {
  padding: 0 !important;
}
.menu-item-content :deep(.anticon) {
  margin-right: 10px;
  font-size: 14px;
}
.user-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.menu-item-content:hover {
  background-color: var(--ant-primary-1); /* 或者使用透明黑 rgba(0,0,0,0.04) */
}

/* 側邊欄樣式 */
.logo-area {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.logo-text {
  margin-left: 12px;
  font-size: 1.1rem;
  font-weight: bold;
}

.trigger-btn {
  font-size: 18px;
  cursor: pointer;
}
/* App.vue */
/* 使用全域變數替代本地定義 */

/* 強制修正所有元件的卡片 */
.theme-dark .ant-card,
.theme-dark .ant-layout-header,
.theme-dark .content-shell {
  background-color: var(--surface-bg) !important;
  border-color: var(--border-color) !important;
}

/* 修正文字顏色 */
.theme-dark h1,
.theme-dark h2,
.theme-dark h3,
.theme-dark span {
  color: rgba(255, 255, 255, 0.85) !important;
}
</style>
