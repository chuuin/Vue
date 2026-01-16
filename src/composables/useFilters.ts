import { computed, ref } from 'vue'

import type { Task } from '@/features/tasks/model/task'
import { defaultFilters, extractTags, type TaskFilters } from '@/features/tasks/utils/filters'

export const useFilters = (tasks: () => Task[]) => {
  const filters = ref<TaskFilters>({ ...defaultFilters })

  const availableTags = computed(() => extractTags(tasks()))

  const toggleTag = (tag: string) => {
    const next = new Set(filters.value.tags)
    if (next.has(tag)) {
      next.delete(tag)
    } else {
      next.add(tag)
    }
    filters.value = { ...filters.value, tags: Array.from(next) }
  }

  const clearFilters = () => {
    filters.value = { ...defaultFilters }
  }

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
