/**
 * 檔案用途：提供全域 toast 狀態與操作方法。
 * 依賴：Vue `ref`。
 * 輸入/輸出：`pushToast(message, type, timeout)`、`removeToast(id)`；輸出 reactive `toasts`。
 */
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

// 全域 toast 清單：由任何頁面可讀取
const toasts = ref<ToastItem[]>([])

// method：移除指定 toast
const removeToast = (id: string) => {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

/*
 * method：新增 toast
 * - timeout > 0 時自動移除
 * - 最多保留 5 筆，避免畫面擁擠
 */
const pushToast = (message: string, type: ToastType = 'info', timeout = 3200) => {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
  toasts.value = [{ id, message, type }, ...toasts.value].slice(0, 5)

  if (timeout > 0) {
    window.setTimeout(() => removeToast(id), timeout)
  }
}

export const useToast = () => ({
  toasts,
  pushToast,
  removeToast
})
