<!--
  檔案用途：主看板頁，整合搜尋、欄位、任務 CRUD 與拖曳。
  依賴：useTasks/useFilters/useToast/useI18n、TaskColumn、TaskFormModal。
  輸入/輸出：無 props/emits；透過 store 讀寫資料並觸發 toast。
-->
<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-semibold text-white">
          {{ t('board.title') }}
        </h1>
        <p class="text-sm text-slate-300">
          {{ t('board.subtitle') }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
          type="button"
          @click="clearFilters"
        >
          {{ t('board.resetFilters') }}
        </button>
        <button
          class="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-brand-400"
          type="button"
          @click="openCreate"
        >
          {{ t('board.newTask') }}
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
      <p class="text-sm text-slate-300">
        {{ t('board.loading') }}
      </p>
    </div>

    <div
      v-else
      class="grid gap-6 lg:grid-cols-3"
    >
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

    <TaskFormModal
      v-model:open="isModalOpen"
      :task="editingTask"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
/**
 * 這個頁面不接受 props/emits。
 * 透過 composables 與 Pinia store 讀寫任務資料。
 */
import { computed, ref } from 'vue'

import { useFilters } from '@/composables/useFilters'
import { useI18n } from '@/composables/useI18n'
import { useTasks } from '@/composables/useTasks'
import { useToast } from '@/composables/useToast'
import TaskColumn from '@/features/tasks/components/TaskColumn.vue'
import TaskFormModal from '@/features/tasks/components/TaskFormModal.vue'
import FiltersBar from '@/features/tasks/components/FiltersBar.vue'
import type { Task, TaskDraft, TaskInput, TaskStatus } from '@/features/tasks/model/task'
import { applyTaskFilters } from '@/features/tasks/utils/filters'

const { store } = useTasks()
const { pushToast } = useToast()
const { t } = useI18n()

const { filters, availableTags, clearFilters, activeCount } = useFilters(() => store.tasks)

// computed：套用篩選條件後的任務清單
const filteredTasks = computed(() => applyTaskFilters(store.tasks, filters.value))

// computed：依狀態分組供欄位顯示
const tasksByStatus = computed(() => ({
  todo: filteredTasks.value.filter((task) => task.status === 'todo'),
  doing: filteredTasks.value.filter((task) => task.status === 'doing'),
  done: filteredTasks.value.filter((task) => task.status === 'done')
}))

const statusLabel = (status: TaskStatus) => t(`status.${status}`)

// computed：欄位設定（標題會依語系更新）
const columns = computed(() => [
  { title: statusLabel('todo'), status: 'todo' },
  { title: statusLabel('doing'), status: 'doing' },
  { title: statusLabel('done'), status: 'done' }
])

const isModalOpen = ref(false)
const editingTask = ref<Task | null>(null)

// method：開啟新增模式
const openCreate = () => {
  editingTask.value = null
  isModalOpen.value = true
}

// method：開啟編輯模式
const openEdit = (task: Task) => {
  editingTask.value = task
  isModalOpen.value = true
}

// method：表單送出後寫入 store，並提示通知
const handleSubmit = (input: TaskInput) => {
  if (editingTask.value) {
    const updated = store.updateTask(editingTask.value.id, input)
    if (updated) {
      pushToast(t('board.toast.updated'), 'success')
    }
    return
  }

  const draft: TaskDraft = {
    ...input,
    status: 'todo'
  }
  store.addTask(draft)
  pushToast(t('board.toast.created'), 'success')
}

// method：刪除任務（有確認對話框）
const removeTask = (id: string) => {
  const confirmed = window.confirm(t('board.confirmDelete'))
  if (!confirmed) return
  store.removeTask(id)
  pushToast(t('board.toast.deleted'), 'info')
}

// method：拖曳變更狀態（只有真的變動才顯示 toast）
const moveTask = ({ id, status }: { id: string; status: TaskStatus }) => {
  const moved = store.moveTask(id, status)
  if (moved) {
    pushToast(t('board.toast.moved', { status: statusLabel(status) }), 'info')
  }
}
</script>
