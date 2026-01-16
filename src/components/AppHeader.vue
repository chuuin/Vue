<!--
  檔案用途：頁首導覽與品牌區，提供路由切換入口。
  依賴：Vue Router、useI18n。
  輸入/輸出：無 props/emits；輸出為 RouterLink 列表。
-->
<template>
  <header class="mx-auto w-full max-w-6xl px-6 pt-8 sm:px-10">
    <div
      class="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div
            class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500/80 to-emerald-400/70 text-slate-900 shadow-glow"
          >
            <span class="font-display text-lg font-semibold">KF</span>
          </div>
          <div>
            <p class="font-display text-xl font-semibold text-white">
              {{ t('app.name') }}
            </p>
            <p class="text-sm text-slate-300">
              {{ t('app.tagline') }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span
            class="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"
          >
            {{ t('badge.local') }}
          </span>
          <span
            class="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-100"
          >
            {{ t('badge.tech') }}
          </span>
        </div>
      </div>
      <nav class="flex flex-wrap items-center gap-3 text-sm">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="rounded-full px-4 py-2 transition"
          :class="linkClass(link.to)"
        >
          {{ t(link.labelKey) }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * 這個元件沒有 props/emits。
 * 主要邏輯：根據目前路由決定導覽高亮樣式。
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useI18n } from '@/composables/useI18n'

const route = useRoute()
const { t } = useI18n()

// 導覽設定：只包含 label key 與對應路徑。
const links = [
  { labelKey: 'nav.board', to: '/' },
  { labelKey: 'nav.insights', to: '/insights' },
  { labelKey: 'nav.guide', to: '/guide' },
  { labelKey: 'nav.settings', to: '/settings' }
]

// computed：當路由改變時，自動更新目前路徑。
const currentPath = computed(() => route.path)

// method：依目前路徑給予不同樣式，讓使用者辨識所在頁。
const linkClass = (path: string) => {
  if (currentPath.value === path) {
    return 'bg-white/15 text-white'
  }

  return 'text-slate-300 hover:text-white hover:bg-white/10'
}
</script>
