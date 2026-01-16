<template>
  <article
    class="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur transition hover:border-brand-500/40"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="font-display text-base font-semibold text-white">
          {{ task.title }}
        </h3>
        <p
          v-if="task.description"
          class="mt-1 text-sm text-slate-300"
        >
          {{ task.description }}
        </p>
      </div>
      <span
        class="rounded-full px-2 py-1 text-xs font-semibold"
        :class="priorityClass(task.priority)"
      >
        {{ priorityLabel(task.priority) }}
      </span>
    </div>

    <div class="flex flex-wrap gap-2">
      <span
        v-for="tag in task.tags"
        :key="tag"
        class="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[11px] uppercase tracking-wide text-slate-200"
      >
        {{ tag }}
      </span>
      <span
        v-if="task.tags.length === 0"
        class="text-xs text-slate-400"
      >
        {{ t('task.noTags') }}
      </span>
    </div>

    <div class="flex items-center justify-between text-xs text-slate-300">
      <span
        class="rounded-full border border-white/10 px-2 py-1"
        :class="isOverdue ? 'border-rose-400/40 text-rose-200' : 'text-slate-300'"
      >
        {{ dueLabel }}
      </span>
      <div class="flex items-center gap-2">
        <button
          class="text-xs text-slate-300 transition hover:text-white"
          type="button"
          @click="emit('edit', task)"
        >
          {{ t('action.edit') }}
        </button>
        <button
          class="text-xs text-rose-200 transition hover:text-rose-100"
          type="button"
          @click="emit('remove', task.id)"
        >
          {{ t('action.delete') }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useI18n } from '@/composables/useI18n'
import type { Task, TaskPriority } from '../model/task'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
  (event: 'edit', task: Task): void
  (event: 'remove', id: string): void
}>()

const { t } = useI18n()

const priorityClass = (priority: TaskPriority) => {
  if (priority === 'high') return 'bg-rose-500/20 text-rose-100'
  if (priority === 'medium') return 'bg-amber-400/20 text-amber-100'
  return 'bg-emerald-400/20 text-emerald-100'
}

const priorityLabel = (priority: TaskPriority) => t(`priority.${priority}`)

const dueLabel = computed(() => {
  if (!props.task.dueDate) return t('task.noDue')
  return t('task.due', { date: props.task.dueDate })
})

const isOverdue = computed(() => {
  if (!props.task.dueDate) return false
  const now = new Date()
  const due = new Date(`${props.task.dueDate}T23:59:59`)
  return due.getTime() < now.getTime()
})

const onDragStart = (event: DragEvent) => {
  event.dataTransfer?.setData('text/plain', props.task.id)
  event.dataTransfer?.setData('application/x-kanban-status', props.task.status)
  event.dataTransfer?.setData('application/x-kanban-task', JSON.stringify(props.task))
  event.dataTransfer?.setDragImage?.(event.currentTarget as Element, 20, 20)
}
</script>
