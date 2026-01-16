import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

const toasts = ref<ToastItem[]>([])

const removeToast = (id: string) => {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

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
