<!--
  檔案用途：提供任務統計與即將到期清單。
  依賴：useTasks、useI18n。
  輸入/輸出：無 props/emits；輸出計算後的統計結果。
-->
<template>
  <section class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-semibold text-white">
        {{ t('insights.title') }}
      </h1>
      <p class="text-sm text-slate-300">
        {{ t('insights.subtitle') }}
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p class="text-xs uppercase tracking-wide text-slate-400">
          {{ t('insights.total') }}
        </p>
        <p class="mt-3 font-display text-3xl text-white">
          {{ total }}
        </p>
      </div>
      <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p class="text-xs uppercase tracking-wide text-slate-400">
          {{ t('insights.doing') }}
        </p>
        <p class="mt-3 font-display text-3xl text-white">
          {{ doing }}
        </p>
      </div>
      <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p class="text-xs uppercase tracking-wide text-slate-400">
          {{ t('insights.done') }}
        </p>
        <p class="mt-3 font-display text-3xl text-white">
          {{ done }}
        </p>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 class="font-display text-lg text-white">
          {{ t('insights.priorityMix') }}
        </h2>
        <div class="mt-4 space-y-2 text-sm text-slate-200">
          <div class="flex items-center justify-between">
            <span>{{ t('priority.high') }}</span>
            <span>{{ priority.high }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>{{ t('priority.medium') }}</span>
            <span>{{ priority.medium }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>{{ t('priority.low') }}</span>
            <span>{{ priority.low }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 class="font-display text-lg text-white">
          {{ t('insights.dueSoon') }}
        </h2>
        <p class="mt-2 text-sm text-slate-300">
          {{ t('insights.dueSoonHint') }}
        </p>
        <div class="mt-4 space-y-3">
          <div
            v-for="task in dueSoon"
            :key="task.id"
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
          >
            <p class="font-medium text-white">
              {{ task.title }}
            </p>
            <p class="text-xs text-slate-400">
              {{ t('task.due', { date: task.dueDate }) }}
            </p>
          </div>
          <p
            v-if="dueSoon.length === 0"
            class="text-sm text-slate-400"
          >
            {{ t('insights.noDueSoon') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * 本頁無 props/emits。
 * 使用 computed 聚合統計數據，避免重複計算。
 */
import { computed } from 'vue'

import { useI18n } from '@/composables/useI18n'
import { useTasks } from '@/composables/useTasks'

const { store } = useTasks()
const { t } = useI18n()

const total = computed(() => store.tasks.length)
const doing = computed(() => store.tasks.filter((task) => task.status === 'doing').length)
const done = computed(() => store.tasks.filter((task) => task.status === 'done').length)

const priority = computed(() => ({
  high: store.tasks.filter((task) => task.priority === 'high').length,
  medium: store.tasks.filter((task) => task.priority === 'medium').length,
  low: store.tasks.filter((task) => task.priority === 'low').length
}))

/*
 * computed：挑出 7 天內到期的任務
 * - 只顯示前 5 筆，避免清單過長
 */
const dueSoon = computed(() => {
  const now = new Date()
  const inSevenDays = new Date()
  inSevenDays.setDate(now.getDate() + 7)

  return store.tasks
    .filter((task) => task.dueDate)
    .filter((task) => {
      const due = new Date(`${task.dueDate}T00:00:00`)
      return due >= now && due <= inSevenDays
    })
    .slice(0, 5)
})
</script>
