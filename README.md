# my-antd-app

一個以 **Vue 3**、**Vite**、**Vue Router** 與 **Ant Design Vue** 建立的多頁面 Demo 專案，結合個人部落格展示與後台管理介面，適合練習常見的企業級前端開發場景。

---

## 專案特色

- **響應式佈局**：左側 Sider 選單 + 上方 Header 的管理系統版型，提供一致且直觀的使用者體驗。
- **主題切換**：支援亮色 / 暗色主題切換，透過 54 個 CSS 變數統一管理，並完整支援 30+ 個 Ant Design 元件。
- **部落格模組**：包含首頁輪播、最新文章、快速導覽與訂閱互動功能，提供豐富的內容展示。
- **文章管理**：文章列表支援搜尋、分類、熱門標籤與分頁展示，便於內容查找與管理。
- **技術人才查詢**：提供多條件搜尋（單位 / 部門 / 科別三層聯動、姓名、職能、角色、等級、技術技能）、連動下拉、表格 CRUD (Create, Read, Update, Delete) 功能。
- **統計儀表板**：展示跨部門人才分布矩陣，可點擊格子即時篩選明細，可點擊格子即時篩選明細，提供數據分析視圖。
- **互動實驗室**：包含 3D 視差、逃跑按鈕、粒子爆裂、影像濾鏡等 6 個互動實驗，展示前端技術的趣味應用。
- **系統設定**：提供個人資料、偏好設定與安全日誌等功能，方便使用者管理個人帳戶。

---

## 技術棧

本專案主要採用以下技術棧：

| 項目                  | 版本       | 說明                                         |
| :-------------------- | :--------- | :------------------------------------------- |
| Vue 3                 | `^3.5.33`  | 漸進式 JavaScript 框架，用於構建使用者介面。 |
| Vite                  | `^8.0.10`  | 極速的下一代前端開發與打包工具。             |
| Vue Router            | `^5.0.6`   | Vue.js 的官方路由管理器。                    |
| Ant Design Vue        | `^4.2.6`   | Ant Design 規範的 Vue UI 組件庫。            |
| @ant-design/icons-vue | `^7.0.1`   | Ant Design 官方圖標庫的 Vue 版本。           |
| Pinia                 | `^3.0.4`   | Vue 的輕量級狀態管理庫。                     |
| Axios                 | `^1.15.2`  | 基於 Promise 的 HTTP 客戶端，用於發送請求。  |
| Day.js                | `^1.11.20` | 輕量級 JavaScript 日期處理庫。               |
| Markdown-it           | `^14.1.1`  | 快速且易於擴展的 Markdown 解析器。           |
| Matter.js             | `^0.20.0`  | 2D 物理引擎，用於互動實驗室。                |

---

## 專案結構

```text
my-antd-app/
├── public/                  # 靜態資源
├── src/
│   ├── assets/              # 圖片與靜態資源
│   ├── components/          # 共用元件 (e.g., ChatBot.vue, HelloWorld.vue)
│   ├── composables/         # 可組合函數 (e.g., useTheme.js)
│   ├── data/                # 模擬資料 (e.g., posts.js, mockData.js, botResponses.js)
│   ├── router/              # 路由設定 (index.js)
│   ├── styles/              # 全域樣式 (variables.css, antd-overrides.css)
│   ├── views/               # 各頁面元件 (e.g., Home.vue, BlogHome.vue, FormView.vue)
│   ├── App.vue              # 主版型與側邊選單
│   ├── main.js              # 應用入口
│   └── style.css            # 全域樣式
├── index.html               # HTML 模板
├── package.json             # 專案依賴與腳本配置
├── pnpm-lock.yaml           # pnpm 鎖定檔案
├── README.md                # 專案說明文件
├── STYLE_GUIDE.md           # 樣式指南
├── STYLES_REFACTORING_SUMMARY.md # 樣式重構總結
└── vite.config.js           # Vite 配置檔案
```

---

## 頁面總覽與路由

本專案包含以下主要頁面及其對應路由：

| 路由                  | 頁面元件                  | 說明                                               |
| :-------------------- | :------------------------ | :------------------------------------------------- |
| `/`                   | `Home.vue`                | 網站首頁，作為全站入口。                           |
| `/blog/home`          | `BlogHome.vue`            | 部落格首頁，含輪播、文章統計、快速導覽與訂閱抽屜。 |
| `/blog/posts`         | `BlogPosts.vue`           | 文章列表，支援搜尋、分類、標籤篩選與分頁。         |
| `/blog/posts/:id`     | `BlogPostDetail.vue`      | 文章詳情頁。                                       |
| `/blog/about`         | `BlogAbout.vue`           | 關於作者、技能進度、聯絡合作資訊。                 |
| `/data/form`          | `FormView.vue`            | 技術人才查詢與 CRUD 管理頁。                       |
| `/data/statistics`    | `StatisticsDashboard.vue` | 統計數據儀表板。                                   |
| `/knowledge/timeline` | `ProjectTimeline.vue`     | 專案時間軸。                                       |
| `/knowledge/wiki`     | `knowledge.vue`           | 知識庫維基頁面。                                   |
| `/interactiveLab`     | `InteractiveLab.vue`      | Vue 3 互動超能力展示館。                           |
| `/dependencyMonitor`  | `DependencyMonitor.vue`   | 依賴監控頁面。                                     |
| `/systemsettings`     | `SystemSettings.vue`      | 系統設定頁。                                       |

---

## 安裝與啟動

請先確認本機已安裝 [Node.js](https://nodejs.org/)。

1. **安裝依賴**：

   ```bash
   pnpm install
   ```

   或使用 npm/yarn：

   ```bash
   npm install
   # 或 yarn install
   ```

2. **啟動開發伺服器**：

   ```bash
   pnpm run dev
   ```

   開發伺服器預設在 `http://localhost:5173` 啟動。

3. **常用腳本**：

   ```bash
   pnpm run dev      # 啟動開發環境
   pnpm run build    # 建置正式版本
   pnpm run preview  # 預覽建置結果
   ```

---

## 頁面功能說明

### FormView — 技術人才管理

提供多條件搜尋（單位 / 部門 / 科別三層聯動、姓名、職能、角色、等級、技術技能），前端全量過濾加手動分頁，Modal 表單支援新增與編輯，刪除前彈出確認對話框。詳見 [FormView 技術介紹](docs/FormView-介紹.md)。

### StatisticsDashboard — 統計儀表板

展示角色人力分布與技術人才庫兩大維度，以部門為欄的交叉矩陣呈現。點擊格子即時篩選下方明細清單，每列可展開子表查看次維度（等級分布 / 職能應用）。子表採預建 Map 索引加速查詢。詳見 [StatisticsDashboard 技術介紹](docs/StatisticsDashboard-介紹.md)。

### InteractiveLab — 互動展示館

包含 6 個互動場景：3D 視差卡片（含光澤反射與翻轉）、逃跑按鈕（計時挑戰、難度升級、連擊偵測）、粒子爆裂（4 種主題、速度感應、重力拋物線）、影像實驗室（5 種濾鏡滑桿、自訂上傳、一鍵複製 CSS）、氛圍控制（自訂雙色漸層、呼吸燈動畫）、數字噴泉（自訂步進、目標挑戰、操作紀錄）。詳見 [InteractiveLab 技術介紹](docs/InteractiveLab-介紹.md)。

---

## 資料來源說明

- 部落格文章資料位於 `src/data/posts.js`。
- 人才資料與組織架構 mock data 位於 `src/data/mockData.js`。
- 聊天機器人回覆資料位於 `src/data/botResponses.js`。
- 所有新增、編輯、刪除與統計皆為前端本地模擬，尚未串接後端 API。

---

**作者**：Manus AI

**日期**：2026 年 4 月 24 日
