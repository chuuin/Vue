<template>
  <header class="mx-auto w-full max-w-6xl px-6 pt-8 sm:px-10">
    <div
      class="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div
            class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500/80 to-emerald-400/70 text-slate-900 shadow-glow"
          >
            <span class="font-display text-lg font-semibold">KF</span>
          </div>
          <div>
            <p class="font-display text-xl font-semibold text-white">
              Kanban Flow
            </p>
            <p class="text-sm text-slate-300">
              Ship tasks with clarity and momentum.
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span
            class="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"
          >
            Local-first
          </span>
          <span
            class="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-100"
          >
            Vue 3 + TS
          </span>
        </div>
      </div>
      <nav class="flex flex-wrap items-center gap-3 text-sm">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="rounded-full px-4 py-2 transition"
          :class="linkClass(link.to)"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const links = [
  { label: 'Board', to: '/' },
  { label: 'Insights', to: '/insights' },
  { label: 'Settings', to: '/settings' }
]

const currentPath = computed(() => route.path)

const linkClass = (path: string) => {
  if (currentPath.value === path) {
    return 'bg-white/15 text-white'
  }

  return 'text-slate-300 hover:text-white hover:bg-white/10'
}
</script>
