import { computed } from 'vue'

import { taskStatusValues } from '@/features/tasks/model/task'
import { useTasksStore } from '@/features/tasks/store/tasksStore'

export const useTasks = () => {
  const store = useTasksStore()

  const tasksByStatus = computed(() =>
    taskStatusValues.reduce(
      (grouped, status) => {
        grouped[status] = store.tasks.filter((task) => task.status === status)
        return grouped
      },
      {} as Record<(typeof taskStatusValues)[number], typeof store.tasks>
    )
  )

  const taskCount = computed(() => store.tasks.length)

  return {
    store,
    tasksByStatus,
    taskCount
  }
}
