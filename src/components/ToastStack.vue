<!--
  檔案用途：全域 Toast 區塊，顯示短暫通知訊息。
  依賴：useToast、useI18n、TransitionGroup。
  輸入/輸出：無 props/emits；透過 composable 讀取 toasts 並可關閉。
-->
<template>
  <div class="pointer-events-none fixed right-6 top-6 z-50 flex w-72 flex-col gap-3">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto rounded-2xl border px-4 py-3 text-sm shadow-xl backdrop-blur"
        :class="toastClass(toast.type)"
      >
        <div class="flex items-start justify-between gap-3">
          <p class="text-white">
            {{ toast.message }}
          </p>
          <button
            class="text-xs text-slate-200/70 transition hover:text-white"
            type="button"
            @click="removeToast(toast.id)"
          >
            {{ t('action.close') }}
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
/**
 * 這個元件不接受 props/emits。
 * 使用 `useToast` 提供的 reactive list 來顯示訊息。
 */
import { useI18n } from '@/composables/useI18n'
import { useToast, type ToastType } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
const { t } = useI18n()

// method：依通知類型決定顏色，方便快速辨識狀態。
const toastClass = (type: ToastType) => {
  if (type === 'success') {
    return 'border-emerald-400/40 bg-emerald-500/20'
  }

  if (type === 'error') {
    return 'border-rose-400/40 bg-rose-500/20'
  }

  return 'border-brand-500/40 bg-brand-500/20'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
