<template>
  <section class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-semibold text-white">Settings</h1>
      <p class="text-sm text-slate-300">Manage local data and project preferences.</p>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 class="font-display text-lg text-white">Storage</h2>
        <p class="mt-2 text-sm text-slate-300">
          Tasks are stored locally in your browser for privacy and instant startup.
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <button
            class="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
            type="button"
            @click="exportTasks"
          >
            Export JSON
          </button>
          <label
            class="cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
          >
            Import JSON
            <input class="hidden" type="file" accept="application/json" @change="importTasks" />
          </label>
          <button
            class="rounded-full border border-rose-400/40 px-4 py-2 text-sm text-rose-200 transition hover:border-rose-300"
            type="button"
            @click="clearBoard"
          >
            Clear board
          </button>
        </div>
      </div>

      <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 class="font-display text-lg text-white">Project profile</h2>
        <p class="mt-2 text-sm text-slate-300">
          This project showcases a scalable Vue 3 architecture with Pinia, composables, and testable
          domain logic.
        </p>
        <ul class="mt-4 space-y-2 text-sm text-slate-200">
          <li>Feature-based structure for tasks and filters.</li>
          <li>Local-first persistence with schema validation.</li>
          <li>Strict typing on all task models.</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { taskListSchema } from '@/features/tasks/model/task'
import { useTasksStore } from '@/features/tasks/store/tasksStore'

const store = useTasksStore()
const { pushToast } = useToast()

const exportTasks = () => {
  const blob = new Blob([JSON.stringify(store.tasks, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'kanban-tasks.json'
  anchor.click()
  URL.revokeObjectURL(url)
  pushToast('Export ready', 'success')
}

const importTasks = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const parsed = JSON.parse(text)
    const result = taskListSchema.safeParse(parsed)
    if (!result.success) {
      pushToast('Invalid task format', 'error')
      return
    }
    store.hydrate(result.data)
    pushToast('Tasks imported', 'success')
  } catch (err) {
    pushToast('Unable to import file', 'error')
  } finally {
    input.value = ''
  }
}

const clearBoard = () => {
  const confirmed = window.confirm('Clear all tasks? This cannot be undone.')
  if (!confirmed) return
  store.hydrate([])
  pushToast('Board cleared', 'info')
}
</script>
