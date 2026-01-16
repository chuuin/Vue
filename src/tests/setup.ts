/**
 * 檔案用途：Vitest 全域設定入口（目前僅保留測試鉤子）。
 * 依賴：Vitest `afterEach`。
 * 輸入/輸出：無輸入；可在此加入全域清理。
 */
import { afterEach } from 'vitest'

afterEach(() => {
  // Reset any mocked timers/state between tests.
})
