# 套件監控頁 (DependencyMonitor.md)

## 核心功能

監控專案依賴包 (Dependencies) 的版本狀態與系統健康度。

## 技術重點

- **版本比對**：定義 `dependencies` 資料結構，比對 `current` 與 `latest` 版本。
- **視覺警告**：當版本不一致時，統計數值自動變為紅色 (`#cf1322`) 提醒更新。