/**
 * 檔案用途：集中管理搜尋/篩選狀態，並提供常用操作。
 * 依賴：Vue `ref/computed`、filters utils。
 * 輸入/輸出：輸出 filters/availableTags/activeCount 與操作方法。
 */
import { computed, ref } from 'vue'

import type { Task } from '@/features/tasks/model/task'
import { defaultFilters, extractTags, type TaskFilters } from '@/features/tasks/utils/filters'

export const useFilters = (tasks: () => Task[]) => {
  // filters：由頁面雙向綁定（v-model）
  const filters = ref<TaskFilters>({ ...defaultFilters })

  // computed：依目前任務清單生成可用標籤
  const availableTags = computed(() => extractTags(tasks()))

  // method：切換單一標籤的選取狀態
  const toggleTag = (tag: string) => {
    const next = new Set(filters.value.tags)
    if (next.has(tag)) {
      next.delete(tag)
    } else {
      next.add(tag)
    }
    filters.value = { ...filters.value, tags: Array.from(next) }
  }

  // method：回到預設篩選條件
  const clearFilters = () => {
    filters.value = { ...defaultFilters }
  }

  // computed：顯示目前有幾個條件被啟用
  const activeCount = computed(() => {
    const { query, priority, tags } = filters.value
    return Number(Boolean(query)) + Number(priority !== 'all') + tags.length
  })

  return {
    filters,
    availableTags,
    toggleTag,
    clearFilters,
    activeCount
  }
}
