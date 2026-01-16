<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-semibold text-white">Kanban board</h1>
        <p class="text-sm text-slate-300">
          Track the work that matters. Drag tasks to keep momentum.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
          type="button"
          @click="clearFilters"
        >
          Reset filters
        </button>
        <button
          class="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-brand-400"
          type="button"
          @click="openCreate"
        >
          New task
        </button>
      </div>
    </div>

    <FiltersBar
      v-model="filters"
      :available-tags="availableTags"
      :active-count="activeCount"
      @clear="clearFilters"
    />

    <div
      v-if="!store.hydrated"
      class="rounded-3xl border border-white/10 bg-white/5 p-10 text-center"
    >
      <p class="text-sm text-slate-300">Loading your board...</p>
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <TaskColumn
        v-for="(column, index) in columns"
        :key="column.status"
        :status="column.status"
        :title="column.title"
        :tasks="tasksByStatus[column.status]"
        class="animate-rise"
        :style="{ animationDelay: `${index * 120}ms` }"
        @edit="openEdit"
        @remove="removeTask"
        @move="moveTask"
      />
    </div>

    <TaskFormModal v-model:open="isModalOpen" :task="editingTask" @submit="handleSubmit" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { useFilters } from '@/composables/useFilters'
import { useTasks } from '@/composables/useTasks'
import { useToast } from '@/composables/useToast'
import TaskColumn from '@/features/tasks/components/TaskColumn.vue'
import TaskFormModal from '@/features/tasks/components/TaskFormModal.vue'
import FiltersBar from '@/features/tasks/components/FiltersBar.vue'
import type { Task, TaskDraft, TaskInput, TaskStatus } from '@/features/tasks/model/task'
import { applyTaskFilters } from '@/features/tasks/utils/filters'

const { store } = useTasks()
const { pushToast } = useToast()

const { filters, availableTags, clearFilters, activeCount } = useFilters(() => store.tasks)

const filteredTasks = computed(() => applyTaskFilters(store.tasks, filters.value))

const tasksByStatus = computed(() => ({
  todo: filteredTasks.value.filter((task) => task.status === 'todo'),
  doing: filteredTasks.value.filter((task) => task.status === 'doing'),
  done: filteredTasks.value.filter((task) => task.status === 'done')
}))

const columns: { title: string; status: TaskStatus }[] = [
  { title: 'Todo', status: 'todo' },
  { title: 'Doing', status: 'doing' },
  { title: 'Done', status: 'done' }
]

const isModalOpen = ref(false)
const editingTask = ref<Task | null>(null)

const openCreate = () => {
  editingTask.value = null
  isModalOpen.value = true
}

const openEdit = (task: Task) => {
  editingTask.value = task
  isModalOpen.value = true
}

const handleSubmit = (input: TaskInput) => {
  if (editingTask.value) {
    const updated = store.updateTask(editingTask.value.id, input)
    if (updated) {
      pushToast('Task updated', 'success')
    }
    return
  }

  const draft: TaskDraft = {
    ...input,
    status: 'todo'
  }
  store.addTask(draft)
  pushToast('Task created', 'success')
}

const removeTask = (id: string) => {
  const confirmed = window.confirm('Delete this task?')
  if (!confirmed) return
  store.removeTask(id)
  pushToast('Task deleted', 'info')
}

const moveTask = ({ id, status }: { id: string; status: TaskStatus }) => {
  const moved = store.moveTask(id, status)
  if (moved) {
    pushToast(`Moved to ${status}`, 'info')
  }
}
</script>
