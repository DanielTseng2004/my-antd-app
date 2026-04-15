# 我的個人部落格

## 專案簡介

這是一個基於 Vue 3、Vite 和 Ant Design Vue 構建的個人部落格專案。旨在提供一個簡潔、美觀且響應式的平台，用於分享技術文章、開發日誌和個人心得。專案整合了 Vue Router 進行頁面導航，並利用 Ant Design Vue 提供了豐富的 UI 元件，確保了良好的用戶體驗和開發效率。

## 功能特點

*   **響應式佈局**：適應不同尺寸的設備，提供一致的瀏覽體驗。
*   **文章列表**：顯示所有部落格文章，支援關鍵字搜尋和分頁功能。
*   **文章詳情**：展示單篇文章的完整內容，包含標題、日期、作者和標籤。
*   **關於我頁面**：介紹作者信息、技術棧和聯繫方式，並展示統計數據。
*   **導航菜單**：清晰的頂部導航欄，方便用戶快速切換頁面。
*   **Ant Design Vue**：採用企業級 UI 設計語言，提供高品質的視覺效果和交互體驗。
*   **Vue Router**：實現前端路由，提供流暢的單頁應用體驗。

## 技術棧

*   **Vue 3**: 漸進式 JavaScript 框架，用於構建用戶界面。
*   **Vite**: 下一代前端開發與構建工具，提供極速的開發體驗。
*   **Ant Design Vue**: Ant Design 官方提供的 Vue UI 庫，豐富的元件庫和設計規範。
*   **Vue Router**: Vue.js 官方路由管理器，用於構建單頁應用。
*   **JavaScript / TypeScript**: 專案主要開發語言。
*   **CSS**: 用於樣式設計，包含響應式佈局。

## 目錄結構

```
my-antd-app/
├── public/
├── src/
│   ├── assets/             # 靜態資源，如圖片
│   ├── components/         # 可重用元件
│   ├── data/               # 模擬數據，如 posts.js
│   ├── layouts/            # 佈局元件 (目前整合在 App.vue)
│   ├── router/             # Vue Router 配置
│   │   └── index.js
│   ├── views/              # 頁面級元件
│   │   ├── About.vue
│   │   ├── Home.vue
│   │   ├── PostDetail.vue
│   │   └── Posts.vue
│   ├── App.vue             # 應用主元件，包含導航和路由視圖
│   ├── main.js             # 應用入口文件
│   └── style.css           # 全局樣式文件
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

## 安裝與運行

請確保您的系統已安裝 Node.js 和 npm (或 yarn)。

1.  **克隆專案** (如果尚未克隆):

    ```bash
    git clone <您的專案倉庫地址>
    cd my-antd-app
    ```

2.  **安裝依賴**:

    ```bash
    npm install
    npm install --save @ant-design/icons-vue
    # 或者使用 yarn
    # yarn install
    ```

3.  **啟動開發伺服器**:

    ```bash
    npm run dev
    # 或者使用 yarn
    # yarn dev
    ```

    專案將會在 `http://localhost:5173` (或 Vite 提示的其他端口) 啟動。

    構建後的靜態文件將會輸出到 `dist` 目錄中。

## 未來改進

*   後端 API 整合，實現真實的文章管理。
*   用戶認證與授權。
*   評論功能。
*   文章分類與標籤雲。
*   更豐富的富文本編輯器。

## 貢獻

歡迎任何形式的貢獻！如果您有任何建議或發現 Bug，請隨時提交 Issue 或 Pull Request。

## 許可證

該專案採用 MIT 許可證。詳情請參閱 `LICENSE` 文件 (如果存在)。

---

**作者**: Manus AI
**日期**: 2026年4月15日
