import { z } from 'zod'

export const taskStatusValues = ['todo', 'doing', 'done'] as const
export type TaskStatus = (typeof taskStatusValues)[number]

export const taskPriorityValues = ['low', 'medium', 'high'] as const
export type TaskPriority = (typeof taskPriorityValues)[number]

const dueDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format')
  .nullable()

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

export const taskSchema = taskInputSchema.extend({
  id: z.string(),
  status: z.enum(taskStatusValues),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const taskListSchema = z.array(taskSchema)

export const createTask = (draft: TaskDraft): Task => {
  const timestamp = new Date().toISOString()

  return {
    ...draft,
    id: crypto.randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp
  }
}
