import { createRouter, createWebHistory } from "vue-router";

const routes = [
  // --- 1. 個人部落格維度 (加上 /blog 前綴) ---
  {
    path: "/blog",
    name: "BlogBase",
    redirect: "/blog/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("../views/BlogHome.vue"),
      },
      {
        path: "posts",
        name: "Posts",
        component: () => import("../views/BlogPosts.vue"),
      },
      {
        path: "posts/:id",
        name: "PostDetail",
        component: () => import("../views/BlogPostDetail.vue"),
        props: true,
      },
      {
        path: "about",
        name: "About",
        component: () => import("../views/BlogAbout.vue"),
      },
    ],
  },
  // --- 2. 數據管理維度 ---
  {
    path: "/data",
    name: "DataManagement",
    redirect: "/data",
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
  {
    path: "/form",
    redirect: "/data/form",
  },
  {
    path: "/staticdashboard",
    redirect: "/data/statistics",
  },

  // --- 3. 知識管理維度 ---
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
  {
    path: "/knowledge/wiki",
    redirect: "/knowledge/timeline",
  },

  // --- 4. 系統與實驗室 ---
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
