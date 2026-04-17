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
        <div class="logo">
          <book-outlined style="font-size: 1.5rem" />
          <span
            v-if="!collapsed"
            class="logo-text"
            >管理系統</span
          >
        </div>

        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          :theme="isDarkMode ? 'dark' : 'light'"
          mode="inline"
        >
          <a-sub-menu key="sub1">
            <template #icon><folder-outlined /></template>
            <template #title>個人部落格</template>
            <a-menu-item key="Home">
              <template #icon><home-outlined /></template>
              <router-link to="/">首頁看板</router-link>
            </a-menu-item>
            <a-menu-item key="Posts">
              <template #icon><file-text-outlined /></template>
              <router-link to="/posts">文章內容</router-link>
            </a-menu-item>
            <a-menu-item key="About">
              <template #icon><user-outlined /></template>
              <router-link to="/about">關於作者</router-link>
            </a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="sub2">
            <template #icon><appstore-outlined /></template>
            <template #title>表單管理</template>
            <a-menu-item key="Form">
              <template #icon><file-search-outlined /></template>
              <router-link to="/form">技術人才查詢</router-link>
            </a-menu-item>
            <a-menu-item key="Statistics">
              <template #icon><pie-chart-outlined /></template>
              <router-link to="/staticdashboard">統計數據</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item key="SystemSettings">
            <template #icon><setting-outlined /></template>
            <router-link to="/systemsettings">系統設定</router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-layout>
        <a-layout-header class="app-header">
          <div
            class="trigger-btn"
            @click="() => (collapsed = !collapsed)"
          >
            <menu-unfold-outlined v-if="collapsed" />
            <menu-fold-outlined v-else />
          </div>

          <div class="user-info">
            <a-space size="middle">
              <a-badge
                dot
                color="green"
              >
                <bell-outlined style="font-size: 18px; cursor: pointer" />
              </a-badge>
              <a-dropdown>
                <span
                  class="user-dropdown-link"
                  style="cursor: pointer"
                >
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
                  <down-outlined style="margin-left: 8px; font-size: 10px" />
                </span>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="0"
                      ><user-outlined /> 個人資料</a-menu-item
                    >
                    <a-menu-item key="1">
                      <setting-outlined />
                      <router-link to="/systemsettings"> 系統設定 </router-link>
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item
                      key="3"
                      @click="showLogoutConfirm"
                    >
                      <logout-outlined /> 登出
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

          <div class="content-shell">
            <router-view />
          </div>
        </a-layout-content>

        <a-layout-footer class="app-footer">
          Personal Management System ©2026 Created by Manus
        </a-layout-footer>
      </a-layout>

      <ChatRobot />
    </a-layout>
  </a-config-provider>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { Modal, message, theme } from "ant-design-vue";
// 1. 確保引入 AI 組件
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
} from "@ant-design/icons-vue";
import { useTheme } from "./composables/useTheme";

const route = useRoute();
const collapsed = ref(false);
const selectedKeys = ref(["Home"]);
const openKeys = ref(["sub1"]);
const { isDarkMode } = useTheme();

const antdTheme = computed(() => ({
  algorithm: isDarkMode.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: "#1677ff",
    borderRadius: 8,
  },
}));

const avatarBackground = computed(() =>
  isDarkMode.value ? "#52c41a" : "#87d068",
);

const showLogoutConfirm = () => {
  Modal.confirm({
    title: "確認登出",
    content: "您確定要登出個人管理系統嗎？",
    okText: "確認登出",
    cancelText: "我再想想",
    okType: "danger",
    onOk() {
      const hide = message.loading("正在登出系統...", 0);
      setTimeout(() => {
        hide();
        message.success("模擬登出成功！（僅供 UI 展示）");
      }, 1500);
    },
  });
};

watchEffect(() => {
  if (route.name) {
    selectedKeys.value = [route.name];
    if (["Home", "Posts", "About"].includes(route.name)) {
      openKeys.value = ["sub1"];
    } else if (["Form"].includes(route.name)) {
      openKeys.value = ["sub2"];
    }
  }
});
</script>

<style scoped>
/* 原有樣式保持不變 */
.logo {
  height: 32px;
  margin: 20px;
  color: var(--text-h);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.logo-text {
  margin-left: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  letter-spacing: 1px;
}
.trigger-btn {
  font-size: 18px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}
.trigger-btn:hover {
  color: #1890ff;
}
.user-info {
  margin-right: 24px;
}
.layout {
  min-height: 100vh;
  background: var(--app-bg);
}
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
  margin: 16px;
  background: transparent;
}
.content-shell {
  background: var(--surface-bg);
  padding: 24px;
  min-height: calc(100vh - 180px);
  border-radius: 8px;
  box-shadow: var(--surface-shadow);
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
}
.app-footer {
  text-align: center;
  font-size: 12px;
  color: var(--footer-text);
  background: var(--footer-bg);
}
:deep(.ant-menu-inline-collapsed) .ant-menu-submenu-title {
  padding: 0 32px;
}
.theme-dark :deep(.ant-breadcrumb) {
  color: rgba(255, 255, 255, 0.65);
}
</style>
