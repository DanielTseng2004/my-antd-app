import { createRouter, createWebHistory } from "vue-router";

const routes = [
  // --- 1. 全站入口 (唯一網站首頁) ---
  {
    path: "/",
    name: "SiteHome",
    component: () => import("../views/Home.vue"),
  },

  // --- 2. 個人部落格維度 ---
  {
    path: "/blog",
    name: "BlogBase",
    redirect: "/blog/home",
    children: [
      {
        path: "home",
        name: "BlogHome",
        component: () => import("../views/BlogHome.vue"),
      },
      {
        path: "posts",
        name: "BlogPosts",
        component: () => import("../views/BlogPosts.vue"),
      },
      {
        path: "posts/:id",
        name: "BlogPostDetail",
        component: () => import("../views/BlogPostDetail.vue"),
        props: true,
      },
      {
        path: "about",
        name: "BlogAbout",
        component: () => import("../views/BlogAbout.vue"),
      },
    ],
  },

  // --- 3. 數據管理維度 ---
  {
    path: "/data",
    name: "DataManagement",
    redirect: "/data/statistics", // 修正原先 redirect: "/data" 可能導致的死循環
    children: [
      {
        path: "form",
        name: "Form",
        component: () => import("../views/FormView.vue"),
      },
      {
        path: "statistics",
        name: "Statistics",
        component: () => import("../views/StatisticsDashboard.vue"),
      },
    ],
  },

  // --- 4. 知識管理維度 ---
  {
    path: "/knowledge",
    name: "KnowledgeBase",
    redirect: "/knowledge/timeline",
    children: [
      {
        path: "timeline",
        name: "ProjectTimeline",
        component: () => import("../views/ProjectTimeline.vue"),
      },
      {
        path: "wiki",
        name: "KnowledgeWiki",
        component: () => import("../views/knowledge.vue"),
      },
    ],
  },

  // --- 5. 系統功能與實驗室 ---
  {
    path: "/interactiveLab",
    name: "InteractiveLab",
    component: () => import("../views/InteractiveLab.vue"),
  },
  {
    path: "/dependencyMonitor",
    name: "DependencyMonitor",
    component: () => import("../views/DependencyMonitor.vue"),
  },
  {
    path: "/systemsettings",
    name: "SystemSettings",
    component: () => import("../views/SystemSettings.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
