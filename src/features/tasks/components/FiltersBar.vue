<!--
  檔案用途：搜尋與篩選 UI，讓使用者調整條件。
  依賴：useI18n、TaskFilters 型別。
  輸入/輸出：props: modelValue/availableTags/activeCount；emits: update:modelValue/clear。
-->
<template>
  <section class="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex-1 min-w-[200px]">
        <label class="text-xs uppercase tracking-wide text-slate-300">{{
          t('filters.search')
        }}</label>
        <input
          class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-white focus:border-brand-500/50 focus:outline-none"
          :value="modelValue.query"
          :placeholder="t('filters.searchPlaceholder')"
          type="text"
          @input="updateQuery"
        >
      </div>
      <div class="min-w-[160px]">
        <label class="text-xs uppercase tracking-wide text-slate-300">{{
          t('filters.priority')
        }}</label>
        <select
          class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-white focus:border-brand-500/50 focus:outline-none"
          :value="modelValue.priority"
          @change="updatePriority"
        >
          <option
            v-for="option in priorityOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="ml-auto flex items-end gap-2">
        <button
          class="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200 transition hover:border-white/30"
          type="button"
          @click="emit('clear')"
        >
          {{ t('filters.clear', { count: activeCount }) }}
        </button>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <span class="text-xs uppercase tracking-wide text-slate-400">{{ t('filters.tags') }}</span>
      <button
        v-for="tag in availableTags"
        :key="tag"
        class="rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition"
        :class="tagClass(tag)"
        type="button"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
      <span
        v-if="availableTags.length === 0"
        class="text-xs text-slate-400"
      >
        {{ t('filters.noTags') }}
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * props：
 * - modelValue：目前篩選狀態（v-model）
 * - availableTags：可選標籤清單
 * - activeCount：啟用條件數量
 * emits：
 * - update:modelValue(value)：更新篩選條件
 * - clear：清空條件
 */
import { computed } from 'vue'

import { useI18n } from '@/composables/useI18n'
import type { TaskFilters } from '../utils/filters'

const props = defineProps<{
  modelValue: TaskFilters
  availableTags: string[]
  activeCount: number
}>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: TaskFilters): void
  (event: 'clear'): void
}>()

const { t } = useI18n()

// computed：依語系產生優先級選單
const priorityOptions = computed(() => [
  { value: 'all', label: t('filters.priorityAll') },
  { value: 'low', label: t('filters.priorityLow') },
  { value: 'medium', label: t('filters.priorityMedium') },
  { value: 'high', label: t('filters.priorityHigh') }
])

// method：更新關鍵字
const updateQuery = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', { ...props.modelValue, query: target.value })
}

// method：更新優先級
const updatePriority = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', {
    ...props.modelValue,
    priority: target.value as TaskFilters['priority']
  })
}

// method：切換標籤選取狀態
const toggleTag = (tag: string) => {
  const next = new Set(props.modelValue.tags)
  if (next.has(tag)) {
    next.delete(tag)
  } else {
    next.add(tag)
  }

  emit('update:modelValue', { ...props.modelValue, tags: Array.from(next) })
}

const tagClass = (tag: string) => {
  return props.modelValue.tags.includes(tag)
    ? 'border-brand-500/60 bg-brand-500/20 text-brand-100'
    : 'border-white/10 bg-white/5 text-slate-300 hover:border-brand-500/40'
}
</script>
