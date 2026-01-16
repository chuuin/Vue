# 新人上手指南

這份文件給剛入職 0~1 年的前端工程師，快速理解專案結構、資料流與常見操作入口。

## 專案架構速覽

```
src/
  app/                # App 外殼（背景、Header、RouterView、Toast）
  components/         # 共用 UI（AppHeader、ToastStack）
  composables/        # 可重用邏輯（useTasks / useFilters / usePersist / useI18n）
  features/
    tasks/            # 任務領域：model/store/utils/components
  pages/              # Board / Insights / Guide / Settings
  router/             # 路由定義
  styles/             # Tailwind 入口與全域樣式
```

## 主要資料流（任務）

1. 使用者在 `BoardPage` 開啟新增/編輯表單。
2. `TaskFormModal` 收集輸入 → 使用 Zod 驗證 → emit `submit`。
3. `BoardPage` 收到提交後，呼叫 `tasksStore` 更新資料。
4. `usePersist` 監聽 store 變動 → 寫入 LocalStorage。
5. 畫面透過 `useTasks` 與 `useFilters` 重新計算顯示結果。

資料讀取流程：

- App 啟動時 `usePersist` 讀取 LocalStorage → hydrate store → `store.hydrated = true`。

## 主要資料流（語系）

1. `SettingsPage` 透過 `useI18n` 切換 `locale`。
2. `useI18n` watch `locale` → 寫入 LocalStorage，並更新 `<html lang>`。
3. UI 透過 `t()` 取得當前語系文字。

## 常見功能入口

- 看板主流程：`src/pages/BoardPage.vue`
- 任務表單：`src/features/tasks/components/TaskFormModal.vue`
- 任務欄位：`src/features/tasks/components/TaskColumn.vue`
- 任務卡片：`src/features/tasks/components/TaskCard.vue`
- 篩選搜尋：`src/features/tasks/components/FiltersBar.vue`
- 設定/匯入匯出/語系：`src/pages/SettingsPage.vue`
- 操作說明頁：`src/pages/GuidePage.vue`

## 如何 Debug

- 任務資料問題：
  - 先看 `localStorage` 的 `kanban-flow.tasks.v1`。
  - 檢查 `usePersist` 是否成功 hydrate。
- 語系問題：
  - 看 `localStorage` 的 `kanban-flow.locale`。
  - `useI18n` 的 key 是否存在對應字典。
- 拖曳問題：
  - `TaskCard` 是否寫入 `dataTransfer`。
  - `TaskColumn` 的 `onDrop` 是否收到 id。
- UI 更新問題：
  - `store.tasks` 是否變動。
  - `filteredTasks`/`tasksByStatus` 是否被重新計算。

## 常見坑與提醒

- `store.hydrated` 很重要：避免讀/寫 localStorage 交錯，請先確認已完成初始化。
- Zod 驗證失敗時不會送出：若 UI 無反應，先檢查欄位錯誤訊息。
- 路由 base path：部署到 GitHub Pages 時需設定 `VITE_BASE`。
- 語系 key 缺失：`t()` 會回傳 key 本身，表示字典未補齊。
- 匯入 JSON 格式：需符合 `Task` schema，否則會被拒絕。

## 推薦的第一步

1. 先讀 `BoardPage.vue` 了解主要流程。
2. 再讀 `tasksStore.ts` 與 `task.ts` 了解資料模型與狀態更新。
3. 最後看 `usePersist.ts` 與 `useI18n.ts` 了解持久化與語系機制。
