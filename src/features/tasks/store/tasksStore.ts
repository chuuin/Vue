/**
 * 檔案用途：Pinia store，集中管理任務 CRUD 與狀態更新。
 * 依賴：Pinia、task model。
 * 輸入/輸出：actions 接收任務資料並更新 state；state 由頁面/composables 讀取。
 */
import { defineStore } from 'pinia'

import {
  createTask,
  type Task,
  type TaskDraft,
  type TaskInput,
  type TaskStatus
} from '../model/task'

interface TasksState {
  tasks: Task[]
  hydrated: boolean
}

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    tasks: [],
    hydrated: false
  }),
  actions: {
    // 將外部資料寫入 store（通常來自 localStorage）
    hydrate(tasks: Task[]) {
      this.tasks = tasks
    },
    // 標記是否已完成第一次載入
    setHydrated(value: boolean) {
      this.hydrated = value
    },
    // 新增任務：由 TaskDraft 產生完整 Task
    addTask(draft: TaskDraft) {
      const task = createTask(draft)
      this.tasks = [task, ...this.tasks]
      return task
    },
    // 更新任務：找不到則回 null 交由 UI 判斷
    updateTask(id: string, input: TaskInput) {
      const index = this.tasks.findIndex((task) => task.id === id)
      if (index === -1) return null

      const existing = this.tasks[index]
      const updated: Task = {
        ...existing,
        ...input,
        updatedAt: new Date().toISOString()
      }

      this.tasks = [...this.tasks.slice(0, index), updated, ...this.tasks.slice(index + 1)]

      return updated
    },
    // 刪除任務：直接過濾 id
    removeTask(id: string) {
      this.tasks = this.tasks.filter((task) => task.id !== id)
    },
    /*
     * 移動任務：更新狀態並回傳是否有變動
     * - 回傳 false 代表無此任務或狀態相同
     */
    moveTask(id: string, status: TaskStatus) {
      const task = this.tasks.find((item) => item.id === id)
      if (!task || task.status === status) return false

      task.status = status
      task.updatedAt = new Date().toISOString()
      this.tasks = [...this.tasks]
      return true
    }
  }
})
