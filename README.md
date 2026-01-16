# Kanban Flow

一個用於面試展示的 Kanban 任務管理作品，強調可維護、可擴充與高完成度。專案以 Vue 3 + TypeScript + Vite 建構，具備完整的狀態管理、表單驗證、拖曳、測試與 CI 流程。

## 作品目標

- 展現前端工程能力：架構清晰、型別嚴格、邏輯可測試。
- 展現產品完成度：看板完整 UX、篩選、拖曳、通知與狀態提示。
- 可直接部署：支援 GitHub Pages / Vercel。

## 功能列表

- Kanban 欄位：Todo / Doing / Done
- 任務 CRUD：新增、編輯、刪除
- 拖曳移動任務（含跨欄位）
- 任務屬性：標題、描述、標籤、優先級、截止日期
- 搜尋與篩選：關鍵字、優先級、標籤
- LocalStorage 持久化
- 基本 UX：空狀態、Toast、載入狀態、錯誤提示
- 語言切換（中文 / English / 日本語）
- 操作說明頁面（Guide）

### 截圖

- 看板主頁：`docs/screenshots/board.png`
- 篩選與搜尋：`docs/screenshots/filters.png`
- 新增/編輯任務：`docs/screenshots/modal.png`
- 操作說明：`docs/screenshots/guide.png`

## 技術選型與理由

- Vue 3 + TypeScript + Vite：兼具效能與嚴格型別。
- Pinia：集中狀態管理，邏輯清晰。
- Vue Router：多頁展示與導覽。
- TailwindCSS：快速而一致的 UI 設計。
- Zod：表單輸入驗證、可擴充。
- Vitest：核心邏輯可測試。
- Playwright：最小 E2E 流程驗證。
- ESLint + Prettier + Husky + lint-staged：維持一致品質。
- GitHub Actions：push 時自動 lint + test。

## 專案架構

```
src/
  app/                # App shell
  components/         # 共用 UI
  composables/        # useTasks / useFilters / usePersist / useI18n
  features/
    tasks/            # domain + store + components
  pages/              # Board / Insights / Guide / Settings
  router/             # 路由設定
  styles/             # Tailwind 與基礎樣式
```

### 核心設計

- 任務模型集中於 `src/features/tasks/model/task.ts`，型別與驗證統一。
- 篩選邏輯抽至 `src/features/tasks/utils/filters.ts`，支援單元測試。
- LocalStorage 持久化由 `src/composables/usePersist.ts` 管理。
- 語言切換由 `src/composables/useI18n.ts` 提供並保存偏好。

## 開發指令

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

### 測試

```bash
npm run test
```

```bash
npx playwright install
npm run test:e2e
```

### Lint / Format

```bash
npm run lint
npm run format
```

## 部署

### GitHub Pages

1. 設定 base path（請改成你的 repo 名稱）：

```bash
# PowerShell
$env:VITE_BASE='/your-repo/'; npm run deploy
```

2. GitHub Pages 設定為 `gh-pages` 分支。

### Vercel

```bash
npm run build
```

直接在 Vercel 連結 repo 後即可部署。

## CI

- GitHub Actions 在 push 時自動執行 `npm run lint` 與 `npm run test`。

## 未來可擴充方向

- Undo / Redo
- 批次操作（多選刪除/移動）
- 深色模式切換
- 鍵盤快捷鍵
- 進階統計與報表頁面
