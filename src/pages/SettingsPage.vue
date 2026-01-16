<template>
  <section class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-semibold text-white">
        {{ t('settings.title') }}
      </h1>
      <p class="text-sm text-slate-300">
        {{ t('settings.subtitle') }}
      </p>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 class="font-display text-lg text-white">
          {{ t('settings.storageTitle') }}
        </h2>
        <p class="mt-2 text-sm text-slate-300">
          {{ t('settings.storageDesc') }}
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <button
            class="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
            type="button"
            @click="exportTasks"
          >
            {{ t('settings.export') }}
          </button>
          <label
            class="cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
          >
            {{ t('settings.import') }}
            <input
              class="hidden"
              type="file"
              accept="application/json"
              @change="importTasks"
            >
          </label>
          <button
            class="rounded-full border border-rose-400/40 px-4 py-2 text-sm text-rose-200 transition hover:border-rose-300"
            type="button"
            @click="clearBoard"
          >
            {{ t('settings.clear') }}
          </button>
        </div>
      </div>

      <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 class="font-display text-lg text-white">
          {{ t('settings.languageTitle') }}
        </h2>
        <p class="mt-2 text-sm text-slate-300">
          {{ t('settings.languageDesc') }}
        </p>
        <div class="mt-4">
          <select
            v-model="locale"
            class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-brand-500/50 focus:outline-none"
          >
            <option
              v-for="option in availableLocales"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="rounded-3xl border border-white/10 bg-white/5 p-5 lg:col-span-2">
        <h2 class="font-display text-lg text-white">
          {{ t('settings.profileTitle') }}
        </h2>
        <p class="mt-2 text-sm text-slate-300">
          {{ t('settings.profileDesc') }}
        </p>
        <ul class="mt-4 space-y-2 text-sm text-slate-200">
          <li>{{ t('settings.profileItem1') }}</li>
          <li>{{ t('settings.profileItem2') }}</li>
          <li>{{ t('settings.profileItem3') }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'
import { taskListSchema } from '@/features/tasks/model/task'
import { useTasksStore } from '@/features/tasks/store/tasksStore'

const store = useTasksStore()
const { pushToast } = useToast()
const { locale, availableLocales, t } = useI18n()

const exportTasks = () => {
  const blob = new Blob([JSON.stringify(store.tasks, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'kanban-tasks.json'
  anchor.click()
  URL.revokeObjectURL(url)
  pushToast(t('settings.toast.export'), 'success')
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
      pushToast(t('settings.toast.invalid'), 'error')
      return
    }
    store.hydrate(result.data)
    pushToast(t('settings.toast.imported'), 'success')
  } catch (err) {
    pushToast(t('settings.toast.importFailed'), 'error')
  } finally {
    input.value = ''
  }
}

const clearBoard = () => {
  const confirmed = window.confirm(t('settings.confirmClear'))
  if (!confirmed) return
  store.hydrate([])
  pushToast(t('settings.toast.cleared'), 'info')
}
</script>
