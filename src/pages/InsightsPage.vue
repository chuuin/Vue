<template>
  <section class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-semibold text-white">Insights</h1>
      <p class="text-sm text-slate-300">A quick pulse check on your workload.</p>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p class="text-xs uppercase tracking-wide text-slate-400">Total tasks</p>
        <p class="mt-3 font-display text-3xl text-white">
          {{ total }}
        </p>
      </div>
      <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p class="text-xs uppercase tracking-wide text-slate-400">In progress</p>
        <p class="mt-3 font-display text-3xl text-white">
          {{ doing }}
        </p>
      </div>
      <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p class="text-xs uppercase tracking-wide text-slate-400">Completed</p>
        <p class="mt-3 font-display text-3xl text-white">
          {{ done }}
        </p>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 class="font-display text-lg text-white">Priority mix</h2>
        <div class="mt-4 space-y-2 text-sm text-slate-200">
          <div class="flex items-center justify-between">
            <span>High</span>
            <span>{{ priority.high }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Medium</span>
            <span>{{ priority.medium }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Low</span>
            <span>{{ priority.low }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 class="font-display text-lg text-white">Due soon</h2>
        <p class="mt-2 text-sm text-slate-300">Tasks due in the next 7 days.</p>
        <div class="mt-4 space-y-3">
          <div
            v-for="task in dueSoon"
            :key="task.id"
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
          >
            <p class="font-medium text-white">
              {{ task.title }}
            </p>
            <p class="text-xs text-slate-400">Due {{ task.dueDate }}</p>
          </div>
          <p v-if="dueSoon.length === 0" class="text-sm text-slate-400">No upcoming deadlines.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useTasks } from '@/composables/useTasks'

const { store } = useTasks()

const total = computed(() => store.tasks.length)
const doing = computed(() => store.tasks.filter((task) => task.status === 'doing').length)
const done = computed(() => store.tasks.filter((task) => task.status === 'done').length)

const priority = computed(() => ({
  high: store.tasks.filter((task) => task.priority === 'high').length,
  medium: store.tasks.filter((task) => task.priority === 'medium').length,
  low: store.tasks.filter((task) => task.priority === 'low').length
}))

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
