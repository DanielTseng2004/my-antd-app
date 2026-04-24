# StatisticsDashboard.vue — 技術與功能介紹

> 人才統計儀表板，以跨部門交叉矩陣的形式呈現「專案角色人力分布」與「技術人才庫」兩大維度，支援展開子表與點擊格子即時篩選下方明細清單。

---

## 技術棧

| 項目 | 技術 |
|------|------|
| 框架 | Vue 3（Composition API / `<script setup>`） |
| UI 元件庫 | Ant Design Vue |
| 樣式 | Scoped CSS + CSS 變數（主題適配） |
| 資料 | `../data/mockData`（`generateMockList`、`hierarchy`、`projectRoles`、`techOptions`） |
| 狀態管理 | `ref` / `computed` |

---

## 元件架構

```
StatisticsDashboard.vue
├── 主 Card（a-tabs，兩個分頁）
│   ├── Tab 1：專案角色人力分布
│   │   ├── 主表（角色 × 部門 矩陣）
│   │   │   └── 展開子表：各角色的 Jr/Sr/Exp 階層分布
│   │   └── 可點擊格子 → 更新明細清單
│   └── Tab 2：技術人才庫
│       ├── 主表（技術 × 部門 矩陣）
│       │   └── 展開子表：各技術的職能應用分布（前端/後端/測試/維運）
│       └── 可點擊格子 → 更新明細清單
└── 明細 Card（篩選人才清單）
    ├── 篩選標籤（顯示目前條件）
    ├── 重置按鈕
    └── 明細表（姓名、部門、專案角色、等級、技術技能）
```

---

## 功能詳解

### 動態欄位生成（矩陣表格）

表格欄位不寫死，而是根據 `hierarchy` 中的所有部門動態產生，確保新增部門時自動反映：

```js
const allDepartments = computed(() => {
  const depts = [];
  Object.values(hierarchy).forEach((div) => depts.push(...Object.keys(div)));
  return depts;
});

// 通用欄位生成器：固定左側標籤欄 + 所有部門欄
const createCols = (title, key, width = 160) => {
  const c = [{ title, dataIndex: key, key, width, fixed: "left" }];
  allDepartments.value.forEach((d) =>
    c.push({ title: d, dataIndex: d, key: d, align: "center" })
  );
  return c;
};
```

主表、子表均呼叫同一個 `createCols`，減少重複程式碼。

---

### 交叉矩陣資料計算

每個格子的數值透過對 `allRawData` 即時 filter + count 計算：

**角色人力分布（roleData）：**
```js
// 以每個專案角色為列，各部門人數為欄
projectRoles.map((r) => {
  const row = { roleValue: r.value, roleLabel: r.label };
  allDepartments.value.forEach((d) =>
    (row[d] = allRawData.filter(
      (i) => i.department === d && i.projectRole === r.value
    ).length)
  );
  return row;
});
```

**技術人才庫（techData）：** 邏輯相同，改為判斷 `i.tech.includes(t.value)`，因為一名人才可持有多項技術。

---

### 可展開子表（兩層巢狀）

主表的每一列都可展開，呈現更細緻的第二維度分析：

| 分頁 | 主表維度 | 子表維度 |
|------|----------|----------|
| 專案角色 | 角色 × 部門 | 同角色下 Junior / Senior / Expert 分布 |
| 技術人才庫 | 技術 × 部門 | 同技術下 前端 / 後端 / 測試 / 維運 分布 |

子表資料由 `getRoleLevelData(roleValue)` / `getTechJobData(techValue)` 即時計算，不預先快取。

---

### 點擊格子篩選明細

表格中有數值的格子（`has-value` / `active` class）可點擊，觸發 `handleMainClick` 或 `handleSubClick`，將 `allRawData` 過濾後寫入 `detailList`：

```js
// 主表點擊：部門 + 角色（或技術）
const handleMainClick = (type, val, dept) => {
  detailList.value = allRawData.filter(
    (i) => i.department === dept &&
    (type === "role" ? i.projectRole === val : i.tech.includes(val))
  );
  activeFilterText.value = `${dept} > ${label}`;
};

// 子表點擊：部門 + 角色（或技術）+ 等級（或職能）三層條件
const handleSubClick = (type, mVal, dept, subF, subV) => {
  detailList.value = allRawData.filter(
    (i) => i.department === dept && ... && i[subF] === subV
  );
  activeFilterText.value = `${dept} > ${label} > ${subV}`;
};
```

切換 Tab 時呼叫 `clearDetail` 清空明細，避免顯示與當前 Tab 無關的篩選結果。

---

### 明細卡片

明細卡片始終渲染於頁面下方（`v-if="detailList.length >= 0"` 實際上永遠為 true），標題列顯示當前篩選條件文字，包含：姓名、部門、專案角色、等級、技術技能（以 `a-tag` 陣列呈現）。每頁顯示 5 筆。

---

### 視覺設計

**角色色標（role-indicator）：** 每個專案角色左側顯示 4px 色條，顏色由 CSS 變數定義（`--role-indicator-pm`、`--role-indicator-sa` 等），便於主題切換。

**等級色標：** 子表的等級欄使用 `getLevelColor` 對應不同 `a-tag` 顏色：

```js
const getLevelColor = (lv) =>
  ({ Expert: "purple", Senior: "orange", Junior: "blue" })[lv];
```

**可點擊格子：** 值為零顯示「-」並不可互動，值大於零加粗顯示並 hover 有底色，清楚引導使用者操作。

---

## 資料流概覽

```
generateMockList(100) → allRawData（模組層級常數，不含響應式）
          │
          ▼
    computed（roleData / techData / levelSubData / jobSubData）
    ── 每次渲染時對 allRawData 即時計算格子數值
          │
          ▼
     a-table 矩陣呈現

使用者點擊格子
          │
     handleMainClick / handleSubClick
          │
     Array.filter → detailList（ref）
          │
          ▼
     明細卡片更新
```

---

## CSS 變數依賴

元件樣式全部透過 CSS 變數控制，配合外部主題系統做深淺色切換：

| 變數名稱 | 用途 |
|----------|------|
| `--role-indicator-*` | 各角色左側色條顏色 |
| `--role-text-color` | 角色名稱文字色 |
| `--tech-text-color` | 技術名稱文字色 |
| `--clickable-disabled-color` | 值為零時的格子文字色 |
| `--clickable-hover-bg` | 主表格子 hover 背景 |
| `--clickable-active-color` | 子表有值格子文字色 |
| `--clickable-active-hover-bg` | 子表格子 hover 背景 |
| `--expand-level-bg` / `--expand-job-bg` | 展開子表背景色 |
| `--filter-tag-bg` | 篩選標籤背景色 |
