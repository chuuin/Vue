/**
 * 檔案用途：任務搜尋與篩選的純函式工具。
 * 依賴：Task 型別（無 Vue 依賴）。
 * 輸入/輸出：輸入 tasks/filters，輸出新陣列（不改動原資料）。
 */
import type { Task, TaskPriority } from '../model/task'

export interface TaskFilters {
  query: string
  priority: TaskPriority | 'all'
  tags: string[]
}

export const defaultFilters: TaskFilters = {
  query: '',
  priority: 'all',
  tags: []
}

// 將輸入的標籤字串標準化（去空白/小寫/去重）
export const normalizeTags = (raw: string) => {
  const tokens = raw
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)

  return Array.from(new Set(tokens)).slice(0, 6)
}

// 從任務清單中整理出可用標籤
export const extractTags = (tasks: Task[]) => {
  const tags = new Set<string>()
  tasks.forEach((task) => {
    task.tags.forEach((tag) => tags.add(tag))
  })

  return Array.from(tags).sort((a, b) => a.localeCompare(b))
}

/*
 * 複雜邏輯：依多條件過濾任務
 * 動機：使用者可以同時設定關鍵字、優先度、標籤。
 * 流程：
 * 1) 先檢查優先度是否符合
 * 2) 再檢查是否包含所有選取標籤
 * 3) 最後做關鍵字比對（標題/描述/標籤）
 * 例外：沒有條件時直接回傳所有任務。
 */
export const applyTaskFilters = (tasks: Task[], filters: TaskFilters) => {
  const normalizedQuery = filters.query.trim().toLowerCase()
  const selectedTags = filters.tags.map((tag) => tag.toLowerCase())

  return tasks.filter((task) => {
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false
    }

    if (selectedTags.length > 0) {
      const taskTags = task.tags.map((tag) => tag.toLowerCase())
      const hasAllTags = selectedTags.every((tag) => taskTags.includes(tag))
      if (!hasAllTags) return false
    }

    if (normalizedQuery) {
      const haystack =
        `${task.title} ${task.description ?? ''} ${task.tags.join(' ')}`.toLowerCase()
      if (!haystack.includes(normalizedQuery)) return false
    }

    return true
  })
}
