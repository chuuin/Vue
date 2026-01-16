import { ref, watch } from 'vue'

import { taskListSchema } from '@/features/tasks/model/task'
import { useTasksStore } from '@/features/tasks/store/tasksStore'

const STORAGE_KEY = 'kanban-flow.tasks.v1'

export const usePersist = () => {
  const store = useTasksStore()
  const error = ref<string | null>(null)

  if (!store.hydrated) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        const result = taskListSchema.safeParse(parsed)
        if (result.success) {
          store.hydrate(result.data)
        } else {
          error.value = 'Saved data was corrupted. Starting with a clean board.'
        }
      }
    } catch (err) {
      error.value = 'Unable to read saved tasks. Your board may reset.'
    } finally {
      store.setHydrated(true)
    }
  }

  watch(
    () => store.tasks,
    (tasks) => {
      if (!store.hydrated) return
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    },
    { deep: true }
  )

  return {
    error
  }
}
