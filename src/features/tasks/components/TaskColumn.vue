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
        Drop a task here or create a new one.
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { Task, TaskStatus } from '../model/task'
import TaskCard from './TaskCard.vue'

const props = defineProps<{ title: string; status: TaskStatus; tasks: Task[] }>()
const emit = defineEmits<{
  (event: 'edit', task: Task): void
  (event: 'remove', id: string): void
  (event: 'move', payload: { id: string; status: TaskStatus }): void
}>()

const isDragOver = ref(false)

const onDragOver = () => {
  isDragOver.value = true
}

const onDragLeave = () => {
  isDragOver.value = false
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  const id = event.dataTransfer?.getData('text/plain')
  if (!id) return

  emit('move', { id, status: props.status })
  isDragOver.value = false
}
</script>
