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
import { watch } from 'vue'

import AppHeader from '@/components/AppHeader.vue'
import ToastStack from '@/components/ToastStack.vue'
import { useI18n } from '@/composables/useI18n'
import { usePersist } from '@/composables/usePersist'
import { useToast } from '@/composables/useToast'

const { errorKey } = usePersist()
const { pushToast } = useToast()
const { t } = useI18n()

watch(errorKey, (key) => {
  if (key) {
    pushToast(t(key), 'error')
  }
})
</script>
