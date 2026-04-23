import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Posts from "../views/Posts.vue";
import PostDetail from "../views/PostDetail.vue";
import About from "../views/About.vue";
import FormView from "../views/FormView.vue";
import StatisticsDashboard from "../views/StatisticsDashboard.vue";
import SystemSettings from "../views/SystemSettings.vue";
import ProjectTimeline from "../views/ProjectTimeline.vue";
import InteractiveLab from "../views/InteractiveLab.vue";
import DependencyMonitor from "../views/DependencyMonitor.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/posts",
    name: "Posts",
    component: Posts,
  },
  {
    path: "/posts/:id",
    name: "PostDetail",
    component: PostDetail,
    props: true,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/form",
    name: "Form",
    component: FormView,
  },
  {
    path: "/staticdashboard",
    name: "StaticDashboard",
    component: StatisticsDashboard,
  },
  {
    path: "/systemsettings",
    name: "SystemSettings",
    component: SystemSettings,
  },
  {
    path: "/timeline",
    name: "ProjectTimeline",
    component: ProjectTimeline,
  },
  {
    path: "/interactiveLab",
    name: "InteractiveLab",
    component: InteractiveLab,
  },
  {
    path: "/dependencymonitor",
    name: "DependencyMonitor",
    component: DependencyMonitor,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
