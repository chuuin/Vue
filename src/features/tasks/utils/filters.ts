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

export const normalizeTags = (raw: string) => {
  const tokens = raw
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)

  return Array.from(new Set(tokens)).slice(0, 6)
}

export const extractTags = (tasks: Task[]) => {
  const tags = new Set<string>()
  tasks.forEach((task) => {
    task.tags.forEach((tag) => tags.add(tag))
  })

  return Array.from(tags).sort((a, b) => a.localeCompare(b))
}

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
