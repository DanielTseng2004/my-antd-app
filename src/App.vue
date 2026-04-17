<template>
  <a-layout class="layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      breakpoint="lg"
      theme="dark"
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
        theme="dark"
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
          <a-menu-item key="SystemSettings">
            <template #icon><setting-outlined /></template>
            <router-link to="/systemsettings">系統設定</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header
        style="
          background: #007bff;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 4px rgb(255, 255, 255);
        "
      >
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
                  style="background-color: #87d068; margin-right: 8px"
                >
                  <template #icon><UserOutlined /></template>
                </a-avatar>
                <span class="username">Manus Admin</span>
                <down-outlined style="margin-left: 8px; font-size: 10px" />
              </span>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="0"><user-outlined /> 個人資料</a-menu-item>
                  <a-menu-item key="1"
                    ><setting-outlined /> 系統設定</a-menu-item
                  >
                  <a-menu-divider />
                  <a-menu-item key="3"><logout-outlined /> 登出</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </a-layout-header>

      <a-layout-content style="margin: 16px">
        <a-breadcrumb style="margin: 12px 0">
          <a-breadcrumb-item>首頁</a-breadcrumb-item>
          <a-breadcrumb-item>{{ route.name }}</a-breadcrumb-item>
        </a-breadcrumb>

        <div
          :style="{
            background: '#fff',
            padding: '24px',
            minHeight: 'calc(100vh - 180px)',
            borderRadius: '4px',
          }"
        >
          <router-view />
        </div>
      </a-layout-content>

      <a-layout-footer style="text-align: center; font-size: 12px; color: #999">
        Personal Management System ©2026 Created by Manus
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
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

const route = useRoute();
const collapsed = ref(false);
const selectedKeys = ref(["Home"]);
const openKeys = ref(["sub1"]); // 預設展開第一個資料夾

watchEffect(() => {
  if (route.name) {
    selectedKeys.value = [route.name];
    // 當路由切換時，自動根據名稱展開對應的資料夾
    if (["Home", "Posts", "About"].includes(route.name)) {
      openKeys.value = ["sub1"];
    } else if (["Form"].includes(route.name)) {
      openKeys.value = ["sub2"];
    }
  }
});
</script>

<style scoped>
.logo {
  height: 32px;
  margin: 20px;
  color: white;
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
}

/* 修正側欄文字與圖示間距 */
:deep(.ant-menu-inline-collapsed) .ant-menu-submenu-title {
  padding: 0 32px;
}
</style>
