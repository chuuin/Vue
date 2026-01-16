/**
 * 檔案用途：負責 tasks 的 LocalStorage 持久化與錯誤回報。
 * 依賴：Pinia store、Zod schema、`localStorage`。
 * 輸入/輸出：輸出 `errorKey`（給 UI 顯示）；副作用為讀/寫 LocalStorage。
 */
import { ref, watch } from 'vue'

import { taskListSchema } from '@/features/tasks/model/task'
import { useTasksStore } from '@/features/tasks/store/tasksStore'

const STORAGE_KEY = 'kanban-flow.tasks.v1'

export const usePersist = () => {
  const store = useTasksStore()
  const errorKey = ref<string | null>(null)

  /*
   * 複雜邏輯：初次載入的本機資料同步
   * 動機：保留使用者的看板內容，並避免壞資料造成崩潰。
   * 流程：
   * 1) 讀取 localStorage
   * 2) JSON parse 後用 Zod 驗證結構
   * 3) 成功則 hydrate store，失敗則回報錯誤 key
   * 例外：JSON 解析失敗或格式錯誤，回傳對應錯誤 key。
   */
  if (!store.hydrated) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        const result = taskListSchema.safeParse(parsed)
        if (result.success) {
          store.hydrate(result.data)
        } else {
          errorKey.value = 'persist.corrupt'
        }
      }
    } catch (err) {
      errorKey.value = 'persist.unreadable'
    } finally {
      store.setHydrated(true)
    }
  }

  // watch：任務變動時寫回 localStorage
  watch(
    () => store.tasks,
    (tasks) => {
      if (!store.hydrated) return
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    },
    { deep: true }
  )

  return {
    errorKey
  }
}
