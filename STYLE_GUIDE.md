# 樣式系統指南

## 概述

本專案採用 **Ant Design Vue v4** 的最新深色模式實作方式，結合 **CSS 變數系統**，實現全域統一的主題管理。

## 架構

### 1. 主題系統層級

```
App.vue (ConfigProvider)
    ↓
useTheme() 組合式函數
    ↓
CSS 變數 (variables.css)
    ↓
Ant Design 組件樣式覆蓋 (antd-overrides.css)
    ↓
業務組件樣式
```

### 2. 文件結構

```
src/
├── styles/
│   ├── variables.css          # CSS 變數定義（亮色/暗色）
│   └── antd-overrides.css     # Ant Design 組件樣式覆蓋
├── composables/
│   └── useTheme.js            # 主題管理組合式函數
├── components/
│   └── ThemeToggle.vue        # 主題切換按鈕組件
├── App.vue                     # 根組件（ConfigProvider）
├── main.js                     # 應用入口
└── style.css                   # 原有全域樣式
```

## CSS 變數系統

### 亮色模式變數 (`:root`)

```css
--color-primary: #1677ff;
--text-primary: #000000;
--bg-primary: #ffffff;
--border-color: #d9d9d9;
--shadow-md: 0 3px 6px rgba(0, 0, 0, 0.12), ...;
```

### 暗色模式變數 (`:root[data-theme='dark']`)

```css
--color-primary: #177ddc;
--text-primary: #e2e8f0;
--bg-primary: #141414;
--border-color: #434343;
--shadow-md: 0 3px 6px rgba(0, 0, 0, 0.3), ...;
```

### 可用變數列表

#### 顏色系統
- `--color-primary` - 主品牌色
- `--color-primary-light` - 淡色主色
- `--color-primary-dark` - 深色主色
- `--color-success` - 成功色
- `--color-warning` - 警告色
- `--color-error` - 錯誤色
- `--color-info` - 信息色

#### 文字色系
- `--text-primary` - 主文字色
- `--text-secondary` - 次要文字色
- `--text-tertiary` - 三級文字色
- `--text-disabled` - 禁用文字色

#### 背景色系
- `--bg-primary` - 主背景色
- `--bg-secondary` - 次要背景色
- `--bg-tertiary` - 三級背景色
- `--bg-app` - 應用背景色

#### 邊框與陰影
- `--border-color` - 邊框色
- `--border-light` - 淡邊框色
- `--border-dark` - 深邊框色
- `--shadow-sm` - 小陰影
- `--shadow-md` - 中陰影
- `--shadow-lg` - 大陰影
- `--shadow-xl` - 超大陰影

#### 尺寸與間距
- `--radius-sm` - 4px
- `--radius-md` - 8px
- `--radius-lg` - 12px
- `--radius-xl` - 16px
- `--spacing-xs` - 4px
- `--spacing-sm` - 8px
- `--spacing-md` - 12px
- `--spacing-lg` - 16px
- `--spacing-xl` - 24px
- `--spacing-2xl` - 32px
- `--spacing-3xl` - 48px

#### 字體與排版
- `--font-sans` - 無襯線字體
- `--font-mono` - 等寬字體
- `--font-size-xs` - 12px
- `--font-size-sm` - 14px
- `--font-size-base` - 16px
- `--font-size-lg` - 18px
- `--font-size-xl` - 20px
- `--font-size-2xl` - 24px
- `--font-size-3xl` - 32px
- `--line-height-tight` - 1.25
- `--line-height-normal` - 1.5
- `--line-height-relaxed` - 1.75
- `--line-height-loose` - 2

#### 過渡與動畫
- `--transition-fast` - 0.15s
- `--transition-base` - 0.3s
- `--transition-slow` - 0.5s

#### 玻璃態效果
- `--glass-blur` - blur(8px)
- `--glass-bg` - 玻璃背景色
- `--glass-border` - 玻璃邊框

## 主題切換實作

### 1. 使用 `useTheme()` 組合式函數

```javascript
import { useTheme } from '@/composables/useTheme';

const { isDarkMode, toggleTheme, antdTheme } = useTheme();

// isDarkMode - 計算屬性，當前是否為暗色模式
// toggleTheme() - 切換主題
// antdTheme - Ant Design 主題配置對象
```

### 2. 在組件中使用

```vue
<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <button @click="toggleTheme">切換主題</button>
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme';
const { isDarkMode, toggleTheme } = useTheme();
</script>
```

### 3. 使用 CSS 變數

```css
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}
```

## Ant Design 組件樣式覆蓋

所有 Ant Design 組件的樣式已在 `antd-overrides.css` 中進行覆蓋，確保：

1. **一致性** - 所有組件使用相同的 CSS 變數
2. **深色模式支援** - 自動適應亮色/暗色模式
3. **可維護性** - 集中管理所有組件樣式

### 支援的組件

- Button (按鈕)
- Input (輸入框)
- Select (選擇器)
- Card (卡片)
- Table (表格)
- Menu (菜單)
- Layout (佈局)
- Tag (標籤)
- Alert (提示)
- Modal (對話框)
- Notification (通知)
- Tooltip (工具提示)
- Dropdown (下拉菜單)
- Breadcrumb (麵包屑)
- Pagination (分頁)
- Tabs (標籤頁)
- Collapse (摺疊)
- Form (表單)
- 及其他 30+ 組件

## 最佳實踐

### 1. 新增組件樣式

```css
/* ✅ 推薦：使用 CSS 變數 */
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

/* ❌ 不推薦：硬編碼顏色 */
.my-component {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #d9d9d9;
}
```

### 2. 深色模式適配

```css
/* ✅ 推薦：自動適配 */
.my-component {
  background-color: var(--bg-primary);
  transition: background-color var(--transition-base);
}

/* ❌ 不推薦：手動定義 */
.my-component {
  background-color: #ffffff;
}
:root[data-theme='dark'] .my-component {
  background-color: #141414;
}
```

### 3. 過渡效果

```css
/* ✅ 推薦：使用預定義過渡 */
.my-component {
  transition: all var(--transition-base);
}

/* ❌ 不推薦：硬編碼時間 */
.my-component {
  transition: all 0.3s ease-in-out;
}
```

### 4. 間距與尺寸

```css
/* ✅ 推薦：使用 CSS 變數 */
.my-component {
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
}

/* ❌ 不推薦：硬編碼值 */
.my-component {
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  font-size: 16px;
}
```

## 響應式設計

CSS 變數系統已包含響應式設計支援：

```css
/* 平板設備 (≤768px) */
@media (max-width: 768px) {
  /* 調整樣式 */
}

/* 手機設備 (≤576px) */
@media (max-width: 576px) {
  /* 調整樣式 */
}
```

## 玻璃態效果

使用預定義的玻璃態效果：

```html
<div class="glass-effect">
  <!-- 內容 -->
</div>
```

```css
.glass-effect {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  border-radius: var(--radius-md);
}
```

## 主題持久化

主題選擇會自動保存到 `localStorage`，使用 `app-theme` 作為 key：

```javascript
// 主題會自動保存
localStorage.getItem('app-theme'); // 'light' 或 'dark'
```

## 調試主題

### 1. 檢查當前主題

```javascript
const theme = document.documentElement.getAttribute('data-theme');
console.log(theme); // 'light' 或 'dark'
```

### 2. 檢查 CSS 變數

```javascript
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary');
console.log(primaryColor); // '#1677ff' 或 '#177ddc'
```

### 3. 強制切換主題

```javascript
document.documentElement.setAttribute('data-theme', 'dark');
```

## 性能優化

1. **CSS 變數** - 原生支援，無需編譯
2. **過渡效果** - 使用 GPU 加速的屬性（transform, opacity）
3. **媒體查詢** - 響應式設計最小化重排
4. **深色模式** - 使用 `prefers-color-scheme` 檢測系統偏好

## 常見問題

### Q: 如何自定義主色？

A: 在 `useTheme.js` 中修改 `colorPrimary` 值：

```javascript
const antdTheme = computed(() => ({
  token: {
    colorPrimary: '#your-color',
  },
}));
```

### Q: 如何新增自定義 CSS 變數？

A: 在 `variables.css` 中的 `:root` 和 `:root[data-theme='dark']` 中新增：

```css
:root {
  --my-custom-color: #ffffff;
}

:root[data-theme='dark'] {
  --my-custom-color: #141414;
}
```

### Q: 為什麼某些組件沒有暗色模式？

A: 檢查 `antd-overrides.css` 中是否有該組件的樣式覆蓋。如果沒有，請新增相應的樣式規則。

### Q: 如何禁用深色模式？

A: 移除 `ThemeToggle` 組件或註解掉 `useTheme()` 的初始化。

## 更新日誌

### v1.0.0 (2026-04-20)

- ✅ 實作 Ant Design Vue v4 深色模式
- ✅ 建立 CSS 變數系統
- ✅ 新增主題切換組件
- ✅ 覆蓋 30+ Ant Design 組件樣式
- ✅ 新增玻璃態效果支援
- ✅ 實現主題持久化

## 參考資源

- [Ant Design Vue 主題自定義](https://www.antdv.com/docs/vue/customize-theme)
- [CSS 變數文檔](https://developer.mozilla.org/zh-CN/docs/Web/CSS/--*)
- [深色模式最佳實踐](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-color-scheme)
