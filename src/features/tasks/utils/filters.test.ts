/**
 * 檔案用途：filters 工具的單元測試，確保搜尋/標籤邏輯正確。
 * 依賴：Vitest、filters 工具與 Task 型別。
 * 輸入/輸出：輸入假資料，驗證輸出陣列結果。
 */
import { describe, expect, it } from 'vitest'

import type { Task } from '../model/task'
import { applyTaskFilters, extractTags, normalizeTags } from './filters'

// 測試用任務工廠：讓案例更容易閱讀與維護
const baseTask = (overrides: Partial<Task>): Task => ({
  id: 'task-1',
  title: 'Design system',
  description: 'Create tokens',
  tags: ['design'],
  priority: 'medium',
  dueDate: null,
  status: 'todo',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides
})

describe('normalizeTags', () => {
  it('deduplicates and trims tags', () => {
    expect(normalizeTags('Design, api, design , , UX')).toEqual(['design', 'api', 'ux'])
  })
})

describe('extractTags', () => {
  it('returns sorted unique tags', () => {
    const tasks = [
      baseTask({ id: 'a', tags: ['design', 'api'] }),
      baseTask({ id: 'b', tags: ['api', 'ops'] })
    ]

    expect(extractTags(tasks)).toEqual(['api', 'design', 'ops'])
  })
})

describe('applyTaskFilters', () => {
  const tasks = [
    baseTask({ id: 'a', title: 'Design system', tags: ['design', 'ux'], priority: 'high' }),
    baseTask({ id: 'b', title: 'API review', tags: ['api'], priority: 'low', status: 'doing' }),
    baseTask({
      id: 'c',
      title: 'Write tests',
      tags: ['quality'],
      priority: 'medium',
      status: 'done'
    })
  ]

  it('filters by query text', () => {
    const result = applyTaskFilters(tasks, { query: 'api', priority: 'all', tags: [] })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('b')
  })

  it('filters by priority', () => {
    const result = applyTaskFilters(tasks, { query: '', priority: 'high', tags: [] })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('filters by tags', () => {
    const result = applyTaskFilters(tasks, { query: '', priority: 'all', tags: ['design'] })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })
})
