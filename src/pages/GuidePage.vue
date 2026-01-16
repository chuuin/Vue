<!--
  檔案用途：操作說明頁，提供初次使用者的導覽步驟。
  依賴：useI18n。
  輸入/輸出：無 props/emits；以文字引導為主。
-->
<template>
  <section class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-semibold text-white">
        {{ t('guide.title') }}
      </h1>
      <p class="text-sm text-slate-300">
        {{ t('guide.subtitle') }}
      </p>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div
        v-for="section in sections"
        :key="section.titleKey"
        class="rounded-3xl border border-white/10 bg-white/5 p-5"
      >
        <h2 class="font-display text-lg text-white">
          {{ t(section.titleKey) }}
        </h2>
        <ul class="mt-4 space-y-2 text-sm text-slate-200">
          <li
            v-for="item in section.items"
            :key="item"
          >
            {{ t(item) }}
          </li>
        </ul>
      </div>
    </div>

    <div
      class="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 text-sm text-emerald-100"
    >
      {{ t('guide.tip') }}
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * 本頁無 props/emits。
 * sections 為靜態設定，方便新增或調整說明區塊。
 */
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const sections = [
  {
    titleKey: 'guide.quickStart.title',
    items: ['guide.quickStart.item1', 'guide.quickStart.item2']
  },
  {
    titleKey: 'guide.drag.title',
    items: ['guide.drag.item1', 'guide.drag.item2']
  },
  {
    titleKey: 'guide.filters.title',
    items: ['guide.filters.item1', 'guide.filters.item2']
  },
  {
    titleKey: 'guide.data.title',
    items: ['guide.data.item1', 'guide.data.item2']
  }
]
</script>
