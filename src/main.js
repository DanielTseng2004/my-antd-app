import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

// 導入全域樣式
import './styles/variables.css';
import './styles/antd-overrides.css';
import './style.css';

const app = createApp(App);
app.use(router);
app.use(Antd);
app.mount('#app');
