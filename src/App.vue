<template>
  <a-layout class="layout">
    <a-layout-header>
      <div class="logo">
        <book-outlined style="margin-right: 8px; font-size: 1.5rem" />
        我的個人部落格
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="Home">
          <template #icon>
            <home-outlined />
          </template>
          <router-link to="/">首頁</router-link>
        </a-menu-item>
        <a-menu-item key="Posts">
          <template #icon>
            <file-text-outlined />
          </template>
          <router-link to="/posts">文章列表</router-link>
        </a-menu-item>
        <a-menu-item key="About">
          <template #icon>
            <user-outlined />
          </template>
          <router-link to="/about">關於我</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <div :style="{ background: '#fff', padding: '24px', minHeight: 'calc(100vh - 128px)' }">
        <router-view />
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      <heart-outlined style="color: #ff4d4f; margin-right: 8px" />
      Personal Blog ©2026 Created by Manus
      <heart-outlined style="color: #ff4d4f; margin-left: 8px" />
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { 
  HomeOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  BookOutlined,
  HeartOutlined 
} from '@ant-design/icons-vue';

const route = useRoute();
const selectedKeys = ref(['Home']);

watchEffect(() => {
  if (route.name) {
    selectedKeys.value = [route.name];
  }
});
</script>

<style scoped>
.logo {
  float: left;
  width: 200px;
  height: 31px;
  margin: 16px 24px 16px 0;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 31px;
  display: flex;
  align-items: center;
}

.layout {
  min-height: 100vh;
}
</style>
