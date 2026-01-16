/**
 * 檔案用途：封裝 tasks store 的常用讀取方式（分欄與總數）。
 * 依賴：Pinia store `useTasksStore`、Vue `computed`。
 * 輸入/輸出：輸出 `store`、`tasksByStatus`、`taskCount`。
 */
import { computed } from 'vue'

import { taskStatusValues } from '@/features/tasks/model/task'
import { useTasksStore } from '@/features/tasks/store/tasksStore'

export const useTasks = () => {
  const store = useTasksStore()

  /*
   * computed：依狀態分組，供看板快速渲染。
   * 來源：store.tasks
   */
  const tasksByStatus = computed(() =>
    taskStatusValues.reduce(
      (grouped, status) => {
        grouped[status] = store.tasks.filter((task) => task.status === status)
        return grouped
      },
      {} as Record<(typeof taskStatusValues)[number], typeof store.tasks>
    )
  )

  // computed：整體任務數量
  const taskCount = computed(() => store.tasks.length)

  return {
    store,
    tasksByStatus,
    taskCount
  }
}
