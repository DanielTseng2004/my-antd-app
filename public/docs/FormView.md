# FormView.vue — 技術與功能介紹

> 人才資料管理頁面，提供多條件組合搜尋、分頁資料表，以及新增／編輯人才資料的 Modal 表單，資料來源為 mock 資料，並整合主題色系切換。

---

## 技術棧

| 項目 | 技術 |
|------|------|
| 框架 | Vue 3（Composition API / `<script setup>`） |
| UI 元件庫 | Ant Design Vue |
| 圖示 | `@ant-design/icons-vue` |
| 資料 | `../data/mockData`（`generateMockList`、`hierarchy`、`techOptions`、`projectRoles`） |
| 主題 | `../composables/useTheme`（`isDarkMode`） |
| 狀態管理 | `ref` / `reactive` / `computed` |

---

## 元件架構

```
FormView.vue
├── 搜尋列（a-form + a-card）
│   ├── 三層聯動下拉：單位/處 → 部門 → 科別
│   ├── 姓名輸入
│   ├── 職能、專案角色、等級、技術技能（多選）篩選
│   └── 查詢 / 重置 / 新增 按鈕
├── 資料表（a-table + a-card）
│   ├── 技術欄位：a-tag 陣列呈現
│   ├── 專案角色欄位：a-badge 狀態標示
│   └── 操作欄位：編輯 / 刪除 行內連結
└── 新增／編輯 Modal（a-modal + a-form）
    ├── 姓名、職能、專案角色
    ├── 單位/處 → 部門（聯動）、等級（radio-button）
    └── 技術技能（多選下拉）
```

---

## 功能詳解

### 多條件搜尋

搜尋列共 8 個篩選欄位，全部為非必填、支援任意組合：

| 欄位 | 類型 | 說明 |
|------|------|------|
| 單位/處 | 下拉 | 來自 `hierarchy` 的第一層 key |
| 部門 | 下拉 | 依所選單位動態產生，未選單位時禁用 |
| 科別 | 下拉 | 依所選部門動態產生，未選部門時禁用 |
| 姓名 | 文字輸入 | 包含搜尋（`includes`） |
| 職能(Job) | 下拉 | 前端 / 後端 / 測試 / 維運 |
| 角色(Project) | 下拉 | 來自 `projectRoles` 靜態清單 |
| 等級 | 下拉 | Junior / Senior / Expert |
| 技術技能 | 多選下拉 | 來自 `techOptions`，任一符合即列入結果 |

三層下拉的聯動邏輯透過 `computed` 實現：

```js
const searchDepts = computed(() =>
  searchForm.division ? Object.keys(hierarchy[searchForm.division]) : []
);
const searchSecs = computed(() =>
  searchForm.division && searchForm.department
    ? hierarchy[searchForm.division][searchForm.department]
    : []
);
```

切換上層時呼叫對應 handler 清空下層選值，確保資料一致性。

---

### 資料過濾與分頁

前端全量過濾：`allRawData` 保存完整 100 筆 mock 資料，每次查詢在前端以 `Array.filter` 逐條比對所有條件，再手動切片實現分頁。

```js
const filtered = allRawData.value.filter((item) => {
  return (
    (!searchForm.name || item.name.includes(searchForm.name)) &&
    (!searchForm.division || item.division === searchForm.division) &&
    // ... 其他條件
    (searchForm.tech.length === 0 ||
      searchForm.tech.some((t) => item.tech.includes(t)))  // 技術為 OR 邏輯
  );
});
```

技術技能採用「任一符合」（OR）的比對策略，與其他欄位的精確比對不同。分頁狀態（`current`、`pageSize`、`total`）以 `reactive` 管理，`handleTableChange` 在換頁或改每頁筆數時重新觸發 `fetchData`。

---

### 新增／編輯 Modal

新增與編輯共用同一個 `a-modal`，透過 `modalTitle` 與 `formState.id` 的有無來區分模式：

- **新增**：`handleAdd` 清空 `formState`、重置驗證狀態，開啟 Modal
- **編輯**：`handleEdit` 透過 `JSON.parse(JSON.stringify(record))` 深拷貝資料進 `formState`，防止直接修改原始資料

儲存時呼叫 `formRef.value.validate()` 觸發 Ant Design Form 驗證，通過後再寫回 `allRawData`：

```js
if (formState.id) {
  // 編輯：找到對應索引並替換
  allRawData.value[index] = { ...formState };
} else {
  // 新增：插入到陣列最前端，id 用 Date.now() 生成
  allRawData.value.unshift({ ...formState, id: Date.now() });
}
```

---

### 刪除確認

刪除使用 Ant Design 的 `Modal.confirm` 呼叫，點擊操作欄的「刪除」連結後彈出確認對話框，確認後從 `allRawData` 移除並重新查詢。

---

### 主題整合

透過 `useTheme` composable 取得 `isDarkMode`，並用於計算頁面背景色與刪除連結顏色，實際色值由 CSS 變數（`var(--bg-app)`、`var(--color-error)` 等）統一管理：

```js
const pageBackground = computed(() =>
  isDarkMode.value ? "var(--bg-app)" : "var(--bg-secondary)"
);
```

---

## 資料流概覽

```
onMounted
  └─ generateMockList(100) → allRawData
          │
          ▼
      fetchData()
          │
     Array.filter（前端過濾）
          │
     手動切片（分頁）
          │
          ▼
      dataSource → a-table 渲染

使用者操作（新增/編輯/刪除）
          │
          ▼
   直接修改 allRawData
          │
          ▼
      fetchData() 重新過濾
```

---

## 依賴的外部模組

| 模組 | 用途 |
|------|------|
| `../data/mockData` | 提供 `hierarchy`（組織架構）、`techOptions`、`projectRoles`、`generateMockList` |
| `../composables/useTheme` | 提供 `isDarkMode` 響應式狀態 |
