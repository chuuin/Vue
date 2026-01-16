/**
 * 檔案用途：提供簡易 i18n（中/英/日）與語系持久化邏輯。
 * 依賴：Vue `ref/watch`、`localStorage`、`document.documentElement.lang`。
 * 輸入/輸出：輸出 `locale`/`availableLocales`/`t()`；副作用為寫入 localStorage 與更新 `<html lang>`。
 */
import { ref, watch } from 'vue'

export type Locale = 'en' | 'zh' | 'ja'

const STORAGE_KEY = 'kanban-flow.locale'

/*
 * 複雜邏輯：初始語系推斷
 * 動機：優先尊重使用者設定，其次才依瀏覽器語系。
 * 流程：
 * 1) SSR 環境直接回傳英文，避免使用 window。
 * 2) 檢查 localStorage 是否已有合法語系。
 * 3) 取 navigator.language 前綴判斷 zh/ja，其餘回英文。
 * 例外：無資料時回英文作為安全預設。
 */
const resolveInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return 'en'

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'en' || saved === 'zh' || saved === 'ja') return saved

  const browser = navigator.language.toLowerCase()
  if (browser.startsWith('zh')) return 'zh'
  if (browser.startsWith('ja')) return 'ja'
  return 'en'
}

// 翻譯字典：以 key 對應文案，供 t() 查找
const messages: Record<Locale, Record<string, string>> = {
  en: {
    'app.name': 'Kanban Flow',
    'app.tagline': 'Ship tasks with clarity and momentum.',
    'badge.local': 'Local-first',
    'badge.tech': 'Vue 3 + TS',
    'nav.board': 'Board',
    'nav.insights': 'Insights',
    'nav.guide': 'Guide',
    'nav.settings': 'Settings',
    'board.title': 'Kanban board',
    'board.subtitle': 'Track the work that matters. Drag tasks to keep momentum.',
    'board.resetFilters': 'Reset filters',
    'board.newTask': 'New task',
    'board.loading': 'Loading your board...',
    'board.emptyColumn': 'Drop a task here or create a new one.',
    'board.confirmDelete': 'Delete this task?',
    'board.toast.updated': 'Task updated',
    'board.toast.created': 'Task created',
    'board.toast.deleted': 'Task deleted',
    'board.toast.moved': 'Moved to {status}',
    'filters.search': 'Search',
    'filters.searchPlaceholder': 'Title, description, or tag',
    'filters.priority': 'Priority',
    'filters.priorityAll': 'All',
    'filters.priorityLow': 'Low',
    'filters.priorityMedium': 'Medium',
    'filters.priorityHigh': 'High',
    'filters.clear': 'Clear ({count})',
    'filters.tags': 'Tags',
    'filters.noTags': 'No tags yet',
    'task.noTags': 'No tags',
    'task.noDue': 'No due date',
    'task.due': 'Due {date}',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.close': 'Close',
    'action.cancel': 'Cancel',
    'modal.createTitle': 'Create a task',
    'modal.editTitle': 'Edit task',
    'modal.createSubtitle': 'Capture a task with clear intent.',
    'modal.editSubtitle': 'Update details and keep momentum.',
    'form.title': 'Title',
    'form.titlePlaceholder': 'What needs to be done?',
    'form.description': 'Description',
    'form.descriptionPlaceholder': 'Add context or next steps',
    'form.priority': 'Priority',
    'form.dueDate': 'Due date',
    'form.tags': 'Tags',
    'form.tagsPlaceholder': 'design, api, urgent',
    'form.tagsHint': 'Separate with commas. Up to 6 tags.',
    'form.save': 'Save changes',
    'form.create': 'Create task',
    'status.todo': 'Todo',
    'status.doing': 'Doing',
    'status.done': 'Done',
    'priority.low': 'Low',
    'priority.medium': 'Medium',
    'priority.high': 'High',
    'insights.title': 'Insights',
    'insights.subtitle': 'A quick pulse check on your workload.',
    'insights.total': 'Total tasks',
    'insights.doing': 'In progress',
    'insights.done': 'Completed',
    'insights.priorityMix': 'Priority mix',
    'insights.dueSoon': 'Due soon',
    'insights.dueSoonHint': 'Tasks due in the next 7 days.',
    'insights.noDueSoon': 'No upcoming deadlines.',
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage local data and project preferences.',
    'settings.storageTitle': 'Storage',
    'settings.storageDesc':
      'Tasks are stored locally in your browser for privacy and instant startup.',
    'settings.export': 'Export JSON',
    'settings.import': 'Import JSON',
    'settings.clear': 'Clear board',
    'settings.profileTitle': 'Project profile',
    'settings.profileDesc':
      'This project showcases a scalable Vue 3 architecture with Pinia, composables, and testable domain logic.',
    'settings.profileItem1': 'Feature-based structure for tasks and filters.',
    'settings.profileItem2': 'Local-first persistence with schema validation.',
    'settings.profileItem3': 'Strict typing on all task models.',
    'settings.confirmClear': 'Clear all tasks? This cannot be undone.',
    'settings.toast.export': 'Export ready',
    'settings.toast.invalid': 'Invalid task format',
    'settings.toast.imported': 'Tasks imported',
    'settings.toast.importFailed': 'Unable to import file',
    'settings.toast.cleared': 'Board cleared',
    'settings.languageTitle': 'Language',
    'settings.languageDesc': 'Switch the interface language.',
    'guide.title': 'Usage guide',
    'guide.subtitle': 'A quick walkthrough to get the most out of the board.',
    'guide.quickStart.title': 'Quick start',
    'guide.quickStart.item1': 'Click New task and capture the essential details.',
    'guide.quickStart.item2': 'Use tags and priorities to highlight the work that matters.',
    'guide.drag.title': 'Drag & drop',
    'guide.drag.item1': 'Drag cards between columns to update status.',
    'guide.drag.item2': 'Hover a column to see a highlighted drop zone.',
    'guide.filters.title': 'Search & filters',
    'guide.filters.item1': 'Search matches title, description, and tags.',
    'guide.filters.item2': 'Combine priority and tag filters for focus.',
    'guide.data.title': 'Data management',
    'guide.data.item1': 'Export JSON to back up or share your board.',
    'guide.data.item2': 'Import JSON to restore tasks instantly.',
    'guide.tip': 'Tip: keep descriptions concise and set due dates for visibility.',
    'persist.corrupt': 'Saved data was corrupted. Starting with a clean board.',
    'persist.unreadable': 'Unable to read saved tasks. Your board may reset.'
  },
  zh: {
    'app.name': 'Kanban Flow',
    'app.tagline': '以清晰節奏推進任務。',
    'badge.local': '本機優先',
    'badge.tech': 'Vue 3 + TS',
    'nav.board': '看板',
    'nav.insights': '洞察',
    'nav.guide': '操作說明',
    'nav.settings': '設定',
    'board.title': '看板',
    'board.subtitle': '追蹤重要工作，透過拖曳維持節奏。',
    'board.resetFilters': '重置篩選',
    'board.newTask': '新增任務',
    'board.loading': '載入看板中...',
    'board.emptyColumn': '拖曳任務到此或新增任務。',
    'board.confirmDelete': '要刪除此任務嗎？',
    'board.toast.updated': '任務已更新',
    'board.toast.created': '任務已新增',
    'board.toast.deleted': '任務已刪除',
    'board.toast.moved': '已移至{status}',
    'filters.search': '搜尋',
    'filters.searchPlaceholder': '標題、描述或標籤',
    'filters.priority': '優先級',
    'filters.priorityAll': '全部',
    'filters.priorityLow': '低',
    'filters.priorityMedium': '中',
    'filters.priorityHigh': '高',
    'filters.clear': '清除（{count}）',
    'filters.tags': '標籤',
    'filters.noTags': '尚無標籤',
    'task.noTags': '無標籤',
    'task.noDue': '無截止日期',
    'task.due': '截止 {date}',
    'action.edit': '編輯',
    'action.delete': '刪除',
    'action.close': '關閉',
    'action.cancel': '取消',
    'modal.createTitle': '新增任務',
    'modal.editTitle': '編輯任務',
    'modal.createSubtitle': '以清楚的目標記錄任務。',
    'modal.editSubtitle': '更新細節並保持節奏。',
    'form.title': '標題',
    'form.titlePlaceholder': '要完成什麼？',
    'form.description': '描述',
    'form.descriptionPlaceholder': '補充背景或下一步',
    'form.priority': '優先級',
    'form.dueDate': '截止日期',
    'form.tags': '標籤',
    'form.tagsPlaceholder': '設計, API, 緊急',
    'form.tagsHint': '以逗號分隔，最多 6 個標籤。',
    'form.save': '儲存變更',
    'form.create': '新增任務',
    'status.todo': '待辦',
    'status.doing': '進行中',
    'status.done': '已完成',
    'priority.low': '低',
    'priority.medium': '中',
    'priority.high': '高',
    'insights.title': '洞察',
    'insights.subtitle': '快速檢視工作負載。',
    'insights.total': '總任務數',
    'insights.doing': '進行中',
    'insights.done': '已完成',
    'insights.priorityMix': '優先級分佈',
    'insights.dueSoon': '即將到期',
    'insights.dueSoonHint': '未來 7 天到期的任務。',
    'insights.noDueSoon': '近期沒有截止日期。',
    'settings.title': '設定',
    'settings.subtitle': '管理本機資料與專案偏好。',
    'settings.storageTitle': '儲存',
    'settings.storageDesc': '任務保存在瀏覽器本機，兼顧隱私與啟動速度。',
    'settings.export': '匯出 JSON',
    'settings.import': '匯入 JSON',
    'settings.clear': '清空看板',
    'settings.profileTitle': '專案概述',
    'settings.profileDesc': '本專案展示以 Pinia、composables 與可測試領域邏輯組成的 Vue 3 架構。',
    'settings.profileItem1': '以功能為單位的資料夾結構。',
    'settings.profileItem2': '本機優先保存並具備資料驗證。',
    'settings.profileItem3': '任務模型具嚴格型別。',
    'settings.confirmClear': '要清空所有任務嗎？此操作無法復原。',
    'settings.toast.export': '匯出完成',
    'settings.toast.invalid': '任務格式無效',
    'settings.toast.imported': '已匯入任務',
    'settings.toast.importFailed': '無法匯入檔案',
    'settings.toast.cleared': '看板已清空',
    'settings.languageTitle': '語言',
    'settings.languageDesc': '切換介面語言。',
    'guide.title': '操作說明',
    'guide.subtitle': '快速上手並掌握看板。',
    'guide.quickStart.title': '快速開始',
    'guide.quickStart.item1': '點擊「新增任務」填寫必要資訊。',
    'guide.quickStart.item2': '使用標籤與優先級凸顯重點工作。',
    'guide.drag.title': '拖曳與狀態',
    'guide.drag.item1': '拖曳任務卡到不同欄位即可更新狀態。',
    'guide.drag.item2': '欄位高亮時即可放下任務。',
    'guide.filters.title': '搜尋與篩選',
    'guide.filters.item1': '搜尋會比對標題、描述與標籤。',
    'guide.filters.item2': '可組合優先級與標籤來聚焦。',
    'guide.data.title': '資料管理',
    'guide.data.item1': '匯出 JSON 以備份或分享。',
    'guide.data.item2': '匯入 JSON 可快速復原任務。',
    'guide.tip': '小提示：描述保持精簡，並設定截止日期提升可見度。',
    'persist.corrupt': '已儲存的資料已損毀，已重置看板。',
    'persist.unreadable': '無法讀取已儲存的任務，看板可能會重置。'
  },
  ja: {
    'app.name': 'Kanban Flow',
    'app.tagline': '明快?????????進??。',
    'badge.local': '????優先',
    'badge.tech': 'Vue 3 + TS',
    'nav.board': '???',
    'nav.insights': '?????',
    'nav.guide': '使?方',
    'nav.settings': '設定',
    'board.title': '???????',
    'board.subtitle': '重要?仕事?追跡?、?????流??保?。',
    'board.resetFilters': '??????????',
    'board.newTask': '新規???',
    'board.loading': '????????中...',
    'board.emptyColumn': '??????????新規作成??????。',
    'board.confirmDelete': '??????削除????？',
    'board.toast.updated': '????更新????',
    'board.toast.created': '????作成????',
    'board.toast.deleted': '????削除????',
    'board.toast.moved': '「{status}」?移動????',
    'filters.search': '?索',
    'filters.searchPlaceholder': '????、?明、??',
    'filters.priority': '優先度',
    'filters.priorityAll': '???',
    'filters.priorityLow': '低',
    'filters.priorityMedium': '中',
    'filters.priorityHigh': '高',
    'filters.clear': '???（{count}）',
    'filters.tags': '??',
    'filters.noTags': '????',
    'task.noTags': '????',
    'task.noDue': '期限??',
    'task.due': '期限 {date}',
    'action.edit': '編集',
    'action.delete': '削除',
    'action.close': '閉??',
    'action.cancel': '?????',
    'modal.createTitle': '????作成',
    'modal.editTitle': '????編集',
    'modal.createSubtitle': '目的?明確???????記?。',
    'modal.editSubtitle': '詳細?更新??流??維持。',
    'form.title': '????',
    'form.titlePlaceholder': '何???？',
    'form.description': '?明',
    'form.descriptionPlaceholder': '背景?次??????追加',
    'form.priority': '優先度',
    'form.dueDate': '期限日',
    'form.tags': '??',
    'form.tagsPlaceholder': 'design, api, urgent',
    'form.tagsHint': '????切?、最大 6 ??。',
    'form.save': '?更?保存',
    'form.create': '????作成',
    'status.todo': '未?手',
    'status.doing': '進行中',
    'status.done': '完了',
    'priority.low': '低',
    'priority.medium': '中',
    'priority.high': '高',
    'insights.title': '?????',
    'insights.subtitle': '作業負荷?素早?確認。',
    'insights.total': '?????',
    'insights.doing': '進行中',
    'insights.done': '完了',
    'insights.priorityMix': '優先度???',
    'insights.dueSoon': '期限間近',
    'insights.dueSoonHint': '今後 7 日以?????。',
    'insights.noDueSoon': '直近?期限??????。',
    'settings.title': '設定',
    'settings.subtitle': '????????設定?管理。',
    'settings.storageTitle': '?????',
    'settings.storageDesc': '?????????保存??、???????起動速度?確保。',
    'settings.export': 'JSON ??????',
    'settings.import': 'JSON ?????',
    'settings.clear': '???????',
    'settings.profileTitle': '??????概要',
    'settings.profileDesc': 'Pinia ? composables、???可能??????????備?? Vue 3 構成?紹介。',
    'settings.profileItem1': '機能?位?????構成。',
    'settings.profileItem2': '????優先?永?化??????証。',
    'settings.profileItem3': '????????格?型付?。',
    'settings.confirmClear': '????????削除????？元??????。',
    'settings.toast.export': '??????準備完了',
    'settings.toast.invalid': '???形式?不正??',
    'settings.toast.imported': '?????????????',
    'settings.toast.importFailed': '???????????????',
    'settings.toast.cleared': '???????????',
    'settings.languageTitle': '言語',
    'settings.languageDesc': '表示言語?切?替???。',
    'guide.title': '使?方',
    'guide.subtitle': '???活用????????。',
    'guide.quickStart.title': '????????',
    'guide.quickStart.item1': '「新規???」??必要情報?入力。',
    'guide.quickStart.item2': '???優先度?重要度?可視化。',
    'guide.drag.title': '???? & ????',
    'guide.drag.item1': '????列間????????態?更新。',
    'guide.drag.item2': '列??????????????可能。',
    'guide.filters.title': '?索??????',
    'guide.filters.item1': '?索???????明?????象。',
    'guide.filters.item2': '優先度????絞???可能。',
    'guide.data.title': '???管理',
    'guide.data.item1': 'JSON ???????????????。',
    'guide.data.item2': 'JSON ????????即復元。',
    'guide.tip': '???：?明?簡潔??、期限日?設定??可視化。',
    'persist.corrupt': '保存????破損??????????????。',
    'persist.unreadable': '保存????????取???????。???????????可能性?????。'
  }
}

const availableLocales = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' }
] as const

// 目前語系狀態：由 Settings 內的選單切換
const locale = ref<Locale>(resolveInitialLocale())

/*
 * 複雜邏輯：字串插值
 * 動機：支援像 "Moved to {status}" 的動態文案。
 * 流程：
 * 1) 比對 `{key}`
 * 2) 使用 params 替換
 * 例外：參數不存在時回空字串，避免顯示 undefined。
 */
const interpolate = (template: string, params?: Record<string, string | number>) => {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, key) => `${params[key] ?? ''}`)
}

// 取得翻譯文字：缺 key 時回英文，再回傳 key 方便除錯
const t = (key: string, params?: Record<string, string | number>) => {
  const template = messages[locale.value][key] ?? messages.en[key] ?? key
  return interpolate(template, params)
}

let initialized = false

// 將語系同步到 HTML lang 屬性
const applyLocale = (value: Locale) => {
  if (typeof document === 'undefined') return

  const lang = value === 'zh' ? 'zh-Hant' : value === 'ja' ? 'ja' : 'en'
  document.documentElement.lang = lang
}

/**
 * 對外 API：提供語系狀態與翻譯函式
 * 輸出：`locale`/`availableLocales`/`t()`
 */
export const useI18n = () => {
  if (!initialized) {
    initialized = true
    /*
     * watch：語系變動時持久化並同步 HTML lang
     * - 寫入 localStorage 讓重整後仍保留語系
     * - 立即執行以套用初始語系
     */
    watch(
      locale,
      (value) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, value)
        }
        applyLocale(value)
      },
      { immediate: true }
    )
  }

  return {
    locale,
    availableLocales,
    t
  }
}
