<!--
  檔案用途：看板欄位容器，顯示任務清單並處理拖曳落點。
  依賴：TaskCard、useI18n、HTML Drag & Drop API。
  輸入/輸出：props: title/status/tasks；emits: edit/remove/move。
-->
<template>
  <section
    class="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-900/40 p-4 shadow-lg"
    :class="isDragOver ? 'border-brand-500/50 bg-brand-500/5' : ''"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <header class="flex items-center justify-between">
      <h2 class="font-display text-base font-semibold text-white">
        {{ title }}
      </h2>
      <span class="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200">
        {{ tasks.length }}
      </span>
    </header>

    <div class="scrollbar-slim mt-4 flex flex-1 flex-col gap-3 overflow-y-auto">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @edit="emit('edit', $event)"
        @remove="emit('remove', $event)"
      />

      <div
        v-if="tasks.length === 0"
        class="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-slate-400"
      >
        {{ t('board.emptyColumn') }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * props：
 * - title：欄位標題（已翻譯）
 * - status：欄位狀態（todo/doing/done）
 * - tasks：此欄位的任務清單
 * emits：
 * - edit(task)：編輯任務
 * - remove(id)：刪除任務
 * - move({ id, status })：拖曳到此欄位時更新狀態
 */
import { ref } from 'vue'

import { useI18n } from '@/composables/useI18n'
import type { Task, TaskStatus } from '../model/task'
import TaskCard from './TaskCard.vue'

const props = defineProps<{ title: string; status: TaskStatus; tasks: Task[] }>()
const emit = defineEmits<{
  (event: 'edit', task: Task): void
  (event: 'remove', id: string): void
  (event: 'move', payload: { id: string; status: TaskStatus }): void
}>()

const { t } = useI18n()

// reactive：控制拖曳 hover 樣式
const isDragOver = ref(false)

const onDragOver = () => {
  isDragOver.value = true
}

const onDragLeave = () => {
  isDragOver.value = false
}

/*
 * 複雜邏輯：Drop 處理
 * 動機：將拖曳任務更新到目前欄位狀態。
 * 流程：
 * 1) 從 dataTransfer 讀取任務 id
 * 2) emit move 讓父層更新 store
 * 3) 關閉拖曳樣式
 * 例外：沒有 id 時直接返回（避免錯誤更新）
 */
const onDrop = (event: DragEvent) => {
  event.preventDefault()
  const id = event.dataTransfer?.getData('text/plain')
  if (!id) return

  emit('move', { id, status: props.status })
  isDragOver.value = false
}
</script>
