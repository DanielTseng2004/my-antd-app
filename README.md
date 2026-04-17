# My Ant Design Vue Practice

這是一個以 `Vue 3`、`Vite`、`Vue Router` 與 `Ant Design Vue` 建立的練習專案。  
目前內容不是單一部落格頁，而是結合了個人部落格展示與後台管理介面的多頁面 demo，適合拿來練習：

- `Ant Design Vue` 元件整合
- `Vue Router` 多頁路由切換
- 表單、表格、抽屜、分頁、統計卡片等常見後台 UI
- 使用本地 mock data 模擬資料查詢與 CRUD 流程

## 專案特色

- 左側 `Sider` 選單 + 上方 `Header` 的管理系統版型
- 部落格首頁輪播、最新文章、快速導覽與訂閱互動
- 文章列表的搜尋、分類、熱門標籤與分頁展示
- 文章詳情頁路由切換
- About 頁的個人介紹、技能進度、聯絡表單與合作資訊
- 技術人才查詢頁，包含：
  - 多條件搜尋
  - 連動下拉選單
  - 表格分頁
  - 新增 / 編輯 / 刪除資料
- 統計儀表板頁，顯示人才分布與技術熱點
- 系統設定頁，包含個人資料、偏好設定與安全日誌

## 技術棧

- `Vue 3`
- `Vite`
- `Vue Router`
- `Ant Design Vue`
- `@ant-design/icons-vue`
- `dayjs`

## 目前頁面

| 路由 | 說明 |
| --- | --- |
| `/` | 首頁看板，含輪播、文章統計、快速導覽與訂閱抽屜 |
| `/posts` | 文章列表，支援搜尋、分類、標籤篩選與分頁 |
| `/posts/:id` | 文章詳情頁 |
| `/about` | 關於作者、技能、聯絡合作資訊 |
| `/form` | 技術人才查詢與 CRUD 管理頁 |
| `/staticdashboard` | 統計數據儀表板 |
| `/systemsettings` | 系統設定頁 |

## 專案結構

```text
my-antd-app/
├─ public/
├─ src/
│  ├─ assets/              # 圖片與靜態資源
│  ├─ components/          # 共用元件
│  ├─ data/                # 文章資料與 mock data
│  ├─ router/              # 路由設定
│  ├─ views/               # 各頁面元件
│  ├─ App.vue              # 主版型與側邊選單
│  ├─ main.js              # 應用入口
│  └─ style.css            # 全域樣式
├─ index.html
├─ package.json
└─ README.md
```

## 安裝與啟動

請先確認本機已安裝 `Node.js`。

```bash
npm install
npm run dev
```

開發伺服器預設會在 `http://localhost:5173` 啟動。

## 可用指令

```bash
npm run dev      # 啟動開發環境
npm run build    # 建置正式版本
npm run preview  # 預覽建置結果
```

## 資料來源說明

- 部落格文章資料位於 `src/data/posts.js`
- 後台人才資料與組織結構 mock data 位於 `src/data/mockData.js`
- 目前所有新增、編輯、刪除與統計皆為前端本地模擬，尚未串接後端 API

## 後續可擴充方向

- 將文章與人才資料改為串接真實 API
- 補上登入驗證與權限控管
- 將表單頁拆分成可重用元件
- 為路由與資料操作加入單元測試
- 調整路由命名與網址結構，例如將 `/staticdashboard` 改為更一致的 `/statistics-dashboard`
