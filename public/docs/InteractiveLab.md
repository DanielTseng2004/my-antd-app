# Vue 3 互動超能力展示館 — 技術與功能介紹

> 一個以 Vue 3 Composition API 搭配 Ant Design Vue 打造的互動展示元件，涵蓋 6 個獨立實驗場景，展示 CSS 3D 變換、物理動畫、即時濾鏡、氛圍視覺等前端互動技術。

---

## 技術棧

| 項目      | 技術                                        |
| --------- | ------------------------------------------- |
| 框架      | Vue 3（Composition API / `<script setup>`） |
| UI 元件庫 | Ant Design Vue                              |
| 圖示      | `@ant-design/icons-vue`                     |
| 樣式      | Scoped CSS + CSS `@keyframes` 動畫          |
| 狀態管理  | `ref` / `reactive` / `computed` / `watch`   |
| 動畫驅動  | `requestAnimationFrame`                     |

---

## 元件架構

```
InteractiveLab.vue
├── Template
│   └── <a-tabs>（6 個分頁）
│       ├── Tab 1：3D 視差卡片
│       ├── Tab 2：逃跑按鈕
│       ├── Tab 3：粒子爆裂
│       ├── Tab 4：影像實驗室
│       ├── Tab 5：氛圍控制
│       └── Tab 6：數字噴泉
├── Script Setup
│   ├── 各分頁獨立狀態與邏輯
│   └── onUnmounted 清理計時器
└── Style (Scoped)
    └── 各分頁獨立 CSS 規則
```

---

## 功能詳解

### Tab 1 — 3D 視差卡片

**互動方式：** 滑鼠懸停移動 / 點擊翻轉

**技術實作：**
- 使用 CSS `perspective` + `rotateX` / `rotateY` 產生 3D 立體感，旋轉角度根據滑鼠在元素內的相對位置即時計算
- 高光反射層（Shine Effect）：疊加一層 `radial-gradient` 的透明 div，圓心跟隨滑鼠座標移動，模擬光澤材質反射
- 卡片翻轉：正面與背面分別設定 `backface-visibility: hidden`，背面預設 `rotateY(180deg)`，點擊時切換整體旋轉角度實現翻面

**關鍵 computed：**
```js
cardStyle  // transform: perspective + rotateX + rotateY
shineStyle // radial-gradient 圓心跟隨滑鼠
```

---

### Tab 2 — 逃跑按鈕

**互動方式：** 嘗試點擊一個會逃跑的按鈕，挑戰 10 秒計時模式

**功能清單：**
- **難度升級**：隨捕獲次數自動調整按鈕尺寸（最小縮至 28px）並顯示難度標籤（新手 / 普通 / 困難 / 地獄）
- **計時挑戰**：10 秒倒計時，結束後顯示本次得分與最高紀錄比較
- **連擊偵測**：前後兩次點中間隔小於 1 秒累計連擊數，達 3 連擊以上顯示提示
- **移動殘影**：每次按鈕位移時在舊座標留下淡出圓形殘影
- **最高分紀錄**：跨次記錄最佳成績

**關鍵技術：**
- `setInterval` 驅動倒數計時，`onUnmounted` 清除防止記憶體洩漏
- 殘影元素使用 `setTimeout` 觸發 CSS `opacity` transition 淡出後移除

---

### Tab 3 — 粒子爆裂

**互動方式：** 點擊畫面任意位置產生粒子噴射

**功能清單：**
- **4 種粒子主題**：火焰（暖色圓點）、冰晶（冷色幾何）、星光（金色星形）、彩虹（隨機 emoji），各自有獨立的顏色陣列與形狀池
- **速度感應**：追蹤滑鼠移動速度（`dx / dt`），移動越快爆炸粒子數越多、飛行距離越遠（最多約 30 顆）
- **重力拋物線**：Y 軸飛行距離加入重力偏移量，軌跡呈自然拋物線而非等距放射
- **隨機旋轉**：每顆粒子帶有隨機旋轉角度（0–720°），配合縮放消失
- **累計計數器**：全程統計產生過的粒子總數

**關鍵技術：**
- 粒子以 `position: fixed` 定位到點擊的視口座標，確保不受容器 offset 影響
- 兩段 `setTimeout`（30ms / 900ms）分別觸發飛出動畫與 DOM 移除，避免大量節點堆積

---

### Tab 4 — 影像實驗室

**互動方式：** 滑桿即時調整圖片 CSS 濾鏡效果

**功能清單：**
- **5 個濾鏡滑桿**：模糊（blur）、色相旋轉（hue-rotate）、亮度（brightness）、飽和度（saturate）、對比度（contrast）
- **2 個開關**：懷舊（sepia）、反色（invert）
- **4 種快速預設**：賽博龐克、懷舊底片、夢幻粉、負片，一鍵套用
- **自訂圖片上傳**：透過 `FileReader` 將本地圖片轉為 Base64 即時替換預覽
- **CSS 輸出與複製**：底部即時顯示當前完整 `filter` CSS 字串，一鍵複製至剪貼簿

> ⚠️ **注意**：濾鏡套用在 `<img>` 標籤本身而非外層容器，預設圖片為彩色圖（已移除舊版 `?grayscale` 參數），確保色相調整可見效果。

**關鍵 computed：**
```js
filterStyle      // 組合所有濾鏡參數為 CSS filter 字串
filterCSSOutput  // 供使用者複製的完整 CSS 宣告
```

---

### Tab 5 — 氛圍控制

**互動方式：** 選色、調整燈光氛圍

**功能清單：**
- **4 個預設色票**：科技藍、活力綠、警戒紅、幻影紫
- **雙色自訂**：兩個原生 `<input type="color">` 分別設定主色與第二色
- **漸層模式**：開啟後背景切換為 135° 雙色線性漸層
- **呼吸燈動畫**：開啟後燈泡以 CSS `@keyframes` 週期性縮放（2 秒一循環），模擬呼吸燈效果
- **Tab 6 聯動**：氛圍顏色同步套用至數字噴泉的數字顏色

---

### Tab 6 — 數字噴泉

**互動方式：** 操作數字，觀察動態計數動畫

**功能清單：**
- **自訂步進值**：可輸入 1–10000 的任意步進量，加減按鈕依此操作
- **減少按鈕**：支援數字遞減，低於 0 時自動禁用防止負數
- **目標值挑戰**：設定目標後顯示進度條，達標時觸發成功提示
- **操作紀錄**：保留最近 10 筆操作，以色標 tag（綠色為增加、紅色為減少）顯示每次 delta 與結果值
- **緩動動畫**：數字變化透過 `requestAnimationFrame` 逐幀插值，呈現平滑的跳動效果

**關鍵技術：**
```js
// 每幀向目標值靠近 1/8，產生緩出效果
displayCount.value += (newVal - displayCount.value) / 8;
```

---

## 資料流概覽

```
使用者互動
    │
    ▼
Event Handler（@click / @mousemove / @mouseenter）
    │
    ▼
修改 ref / reactive 狀態
    │
    ▼
computed 自動重新計算（cardStyle / filterStyle / ambientBgGradient…）
    │
    ▼
Vue 響應式系統更新 DOM / :style 綁定
```

---

## 注意事項

- 粒子元素使用 `position: fixed`，若頁面有 `transform` 的祖先容器可能造成定位偏移
- 計時器（`setInterval`）在 `onUnmounted` 中統一清除，避免元件銷毀後繼續執行
- 圖片上傳透過 `before-upload` 回傳 `false` 阻止 Ant Design 的自動上傳行為，改由 `FileReader` 本地處理
