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
    hydrate(tasks: Task[]) {
      this.tasks = tasks
    },
    setHydrated(value: boolean) {
      this.hydrated = value
    },
    addTask(draft: TaskDraft) {
      const task = createTask(draft)
      this.tasks = [task, ...this.tasks]
      return task
    },
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
    removeTask(id: string) {
      this.tasks = this.tasks.filter((task) => task.id !== id)
    },
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
