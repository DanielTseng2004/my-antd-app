# my-antd-app

一個以 **Vue 3**、**Vite**、**Vue Router** 與 **Ant Design Vue** 建立的多頁面 Demo 專案，結合個人部落格展示與後台管理介面，適合練習常見的企業級前端開發場景。

---

## 專案特色

- 左側 Sider 選單 + 上方 Header 的管理系統版型
- 亮色 / 暗色主題切換，54 個 CSS 變數統一管理，30+ 個 Ant Design 元件完整支援
- 部落格首頁輪播、最新文章、快速導覽與訂閱互動
- 文章列表的搜尋、分類、熱門標籤與分頁展示
- 技術人才查詢頁：多條件搜尋、連動下拉、表格 CRUD
- 統計儀表板：跨部門人才分布矩陣，可點擊格子即時篩選明細
- 互動超能力展示館：3D 視差、逃跑按鈕、粒子爆裂、影像濾鏡等 6 個互動實驗
- 系統設定頁：個人資料、偏好設定與安全日誌

---

## 技術棧

| 項目                  | 版本       |
| --------------------- | ---------- |
| Vue 3                 | 3.5.32     |
| Vite                  | 最新       |
| Vue Router            | 最新       |
| Ant Design Vue        | 4.0.0-rc.6 |
| @ant-design/icons-vue | 最新       |
| dayjs                 | 最新       |

---

## 頁面總覽

| 路由                    | 頁面元件              | 說明                                           |
| ----------------------- | --------------------- | ---------------------------------------------- |
| `/`                     | `HomeView`            | 首頁看板，含輪播、文章統計、快速導覽與訂閱抽屜 |
| `/posts`                | `PostsView`           | 文章列表，支援搜尋、分類、標籤篩選與分頁       |
| `/posts/:id`            | `PostDetail`          | 文章詳情頁                                     |
| `/about`                | `AboutView`           | 關於作者、技能進度、聯絡合作資訊               |
| `/form`                 | `FormView`            | 技術人才查詢與 CRUD 管理頁                     |
| `/statistics-dashboard` | `StatisticsDashboard` | 統計數據儀表板                                 |
| `/interactive-lab`      | `InteractiveLab`      | Vue 3 互動超能力展示館                         |
| `/system-settings`      | `SystemSettings`      | 系統設定頁                                     |

---

## 專案結構

```text
my-antd-app/
├── public/
├── src/
│   ├── assets/                  # 圖片與靜態資源
│   ├── components/              # 共用元件
│   │   └── ThemeToggle.vue      # 主題切換按鈕
│   ├── composables/
│   │   └── useTheme.js          # 主題狀態管理（isDarkMode、toggleTheme、antdTheme）
│   ├── data/
│   │   ├── posts.js             # 部落格文章資料
│   │   └── mockData.js          # 人才與組織架構 mock data
│   ├── router/
│   │   └── index.js             # 路由設定
│   ├── styles/
│   │   ├── variables.css        # 全域 CSS 變數（亮色 / 暗色）
│   │   └── antd-overrides.css   # Ant Design 元件樣式覆寫
│   ├── views/                   # 各頁面元件
│   ├── App.vue                  # 主版型與側邊選單
│   ├── main.js                  # 應用入口
│   └── style.css                # 全域樣式
├── index.html
├── package.json
└── README.md
```

---

## 安裝與啟動

請先確認本機已安裝 Node.js。

```bash
npm install
npm run dev
```

開發伺服器預設在 `http://localhost:5173` 啟動。

```bash
npm run dev      # 啟動開發環境
npm run build    # 建置正式版本
npm run preview  # 預覽建置結果
```

---

## 頁面功能說明

### FormView — 技術人才管理

多條件搜尋（單位 / 部門 / 科別三層聯動、姓名、職能、角色、等級、技術技能），前端全量過濾加手動分頁，Modal 表單支援新增與編輯，刪除前彈出確認對話框。詳見 [FormView 技術介紹](docs/FormView-介紹.md)。

### StatisticsDashboard — 統計儀表板

角色人力分布與技術人才庫兩大維度，以部門為欄的交叉矩陣呈現。點擊格子即時篩選下方明細清單，每列可展開子表查看次維度（等級分布 / 職能應用）。子表採預建 Map 索引加速查詢。詳見 [StatisticsDashboard 技術介紹](docs/StatisticsDashboard-介紹.md)。

### InteractiveLab — 互動展示館

6 個互動場景：3D 視差卡片（含光澤反射與翻轉）、逃跑按鈕（計時挑戰、難度升級、連擊偵測）、粒子爆裂（4 種主題、速度感應、重力拋物線）、影像實驗室（5 種濾鏡滑桿、自訂上傳、一鍵複製 CSS）、氛圍控制（自訂雙色漸層、呼吸燈動畫）、數字噴泉（自訂步進、目標挑戰、操作紀錄）。詳見 [InteractiveLab 技術介紹](docs/InteractiveLab-介紹.md)。

---

## 資料來源說明

- 部落格文章資料位於 `src/data/posts.js`
- 人才資料與組織架構 mock data 位於 `src/data/mockData.js`
- 所有新增、編輯、刪除與統計皆為前端本地模擬，尚未串接後端 API

---
