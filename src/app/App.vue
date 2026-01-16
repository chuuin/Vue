<!--
  檔案用途：App 外層殼，提供全站背景、Header、主內容與 Toast 區。
  依賴：AppHeader、ToastStack、usePersist/useToast/useI18n。
  輸入/輸出：無 props/emits；副作用為監聽持久化錯誤並顯示 toast。
-->
<template>
  <div class="relative min-h-screen overflow-hidden">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -top-32 right-0 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
      <div
        class="absolute bottom-0 left-0 h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-[120px]"
      />
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.6),_rgba(2,6,23,0.95))]"
      />
    </div>

    <div class="relative z-10">
      <AppHeader />
      <main class="mx-auto w-full max-w-6xl px-6 pb-16 pt-6 sm:px-10">
        <RouterView />
      </main>
      <ToastStack />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 依賴與狀態說明：
 * - usePersist：負責讀/寫 LocalStorage，並回傳可能的錯誤 key。
 * - useToast：顯示全域通知。
 * - useI18n：將錯誤 key 轉成當前語系文字。
 */
import { watch } from 'vue'

import AppHeader from '@/components/AppHeader.vue'
import ToastStack from '@/components/ToastStack.vue'
import { useI18n } from '@/composables/useI18n'
import { usePersist } from '@/composables/usePersist'
import { useToast } from '@/composables/useToast'

const { errorKey } = usePersist()
const { pushToast } = useToast()
const { t } = useI18n()

/*
 * 為什麼要 watch：
 * - 讀取 LocalStorage 可能出現錯誤（資料損毀/無法解析）。
 * - 這裡將錯誤轉成 toast，避免錯誤靜默。
 */
watch(errorKey, (key) => {
  if (key) {
    pushToast(t(key), 'error')
  }
})
</script>
