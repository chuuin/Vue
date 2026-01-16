/**
 * 檔案用途：定義任務資料模型、Zod 驗證規則與建立方法。
 * 依賴：Zod、`crypto.randomUUID`。
 * 輸入/輸出：輸出型別與 schema；`createTask` 會回傳完整 Task 物件。
 */
import { z } from 'zod'

export const taskStatusValues = ['todo', 'doing', 'done'] as const
export type TaskStatus = (typeof taskStatusValues)[number]

export const taskPriorityValues = ['low', 'medium', 'high'] as const
export type TaskPriority = (typeof taskPriorityValues)[number]

const dueDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format')
  .nullable()

// 表單輸入驗證：只處理可由使用者輸入的欄位
export const taskInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title needs at least 2 characters')
    .max(80, 'Keep it under 80 characters'),
  description: z
    .string()
    .trim()
    .max(400, 'Keep the description under 400 characters')
    .optional()
    .or(z.literal('')),
  tags: z.array(z.string().trim().min(1)).max(6, 'Use up to 6 tags'),
  priority: z.enum(taskPriorityValues),
  dueDate: dueDateSchema
})

export type TaskInput = z.infer<typeof taskInputSchema>

export interface Task extends TaskInput {
  id: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export type TaskDraft = TaskInput & { status: TaskStatus }

// 完整任務資料的 schema（含系統欄位）
export const taskSchema = taskInputSchema.extend({
  id: z.string(),
  status: z.enum(taskStatusValues),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const taskListSchema = z.array(taskSchema)

/*
 * 建立新任務：
 * - 自動補上 id 與時間戳
 * - 保留 UI 提供的 status（例如 todo）
 */
export const createTask = (draft: TaskDraft): Task => {
  const timestamp = new Date().toISOString()

  return {
    ...draft,
    id: crypto.randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp
  }
}
