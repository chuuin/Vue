<!--
  檔案用途：任務新增/編輯的表單彈窗。
  依賴：Zod schema、useI18n、normalizeTags。
  輸入/輸出：props: open/task；emits: update:open/submit。
-->
<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      <div
        class="absolute inset-0 bg-slate-950/70"
        @click="close"
      />
      <div
        class="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl backdrop-blur"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-display text-xl font-semibold text-white">
              {{ isEditing ? t('modal.editTitle') : t('modal.createTitle') }}
            </h3>
            <p class="text-sm text-slate-300">
              {{ isEditing ? t('modal.editSubtitle') : t('modal.createSubtitle') }}
            </p>
          </div>
          <button
            class="text-sm text-slate-300 transition hover:text-white"
            type="button"
            @click="close"
          >
            {{ t('action.close') }}
          </button>
        </div>

        <form
          class="mt-6 grid gap-4"
          @submit.prevent="handleSubmit"
        >
          <div>
            <label
              class="text-xs uppercase tracking-wide text-slate-300"
              for="task-title"
            >
              {{ t('form.title') }}
            </label>
            <input
              id="task-title"
              v-model="form.title"
              class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-brand-500/50 focus:outline-none"
              :placeholder="t('form.titlePlaceholder')"
              type="text"
            >
            <p
              v-if="errors.title"
              class="mt-1 text-xs text-rose-200"
            >
              {{ errors.title }}
            </p>
          </div>

          <div>
            <label
              class="text-xs uppercase tracking-wide text-slate-300"
              for="task-description"
            >
              {{ t('form.description') }}
            </label>
            <textarea
              id="task-description"
              v-model="form.description"
              class="mt-2 min-h-[120px] w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-brand-500/50 focus:outline-none"
              :placeholder="t('form.descriptionPlaceholder')"
            />
            <p
              v-if="errors.description"
              class="mt-1 text-xs text-rose-200"
            >
              {{ errors.description }}
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                class="text-xs uppercase tracking-wide text-slate-300"
                for="task-priority"
              >
                {{ t('form.priority') }}
              </label>
              <select
                id="task-priority"
                v-model="form.priority"
                class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-brand-500/50 focus:outline-none"
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
            <div>
              <label
                class="text-xs uppercase tracking-wide text-slate-300"
                for="task-due"
              >
                {{ t('form.dueDate') }}
              </label>
              <input
                id="task-due"
                v-model="form.dueDate"
                class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-brand-500/50 focus:outline-none"
                type="date"
              >
              <p
                v-if="errors.dueDate"
                class="mt-1 text-xs text-rose-200"
              >
                {{ errors.dueDate }}
              </p>
            </div>
          </div>

          <div>
            <label
              class="text-xs uppercase tracking-wide text-slate-300"
              for="task-tags"
            >
              {{ t('form.tags') }}
            </label>
            <input
              id="task-tags"
              v-model="form.tags"
              class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-brand-500/50 focus:outline-none"
              :placeholder="t('form.tagsPlaceholder')"
              type="text"
            >
            <p class="mt-1 text-xs text-slate-400">
              {{ t('form.tagsHint') }}
            </p>
            <p
              v-if="errors.tags"
              class="mt-1 text-xs text-rose-200"
            >
              {{ errors.tags }}
            </p>
          </div>

          <div class="flex flex-wrap items-center justify-end gap-3 pt-4">
            <button
              class="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30 hover:text-white"
              type="button"
              @click="close"
            >
              {{ t('action.cancel') }}
            </button>
            <button
              class="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-brand-400"
              type="submit"
            >
              {{ isEditing ? t('form.save') : t('form.create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * props：
 * - open：控制彈窗顯示
 * - task：存在代表編輯模式，不存在為新增模式
 * emits：
 * - update:open(value)：控制彈窗開關
 * - submit(value)：提交表單資料（已驗證）
 */
import { computed, reactive, watch } from 'vue'

import { useI18n } from '@/composables/useI18n'
import type { Task, TaskInput, TaskPriority } from '../model/task'
import { taskInputSchema, taskPriorityValues } from '../model/task'
import { normalizeTags } from '../utils/filters'

const props = defineProps<{ open: boolean; task?: Task | null }>()
const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'submit', value: TaskInput): void
}>()

const { t } = useI18n()

// computed：讓下拉選單顯示翻譯後的優先級文字
const priorityOptions = computed(() =>
  taskPriorityValues.map((value) => ({
    value,
    label: t(`priority.${value}`)
  }))
)

const emptyForm = () => ({
  title: '',
  description: '',
  priority: 'medium' as TaskPriority,
  dueDate: '',
  tags: ''
})

const form = reactive(emptyForm())
const errors = reactive<Record<string, string>>({})

// computed：判斷是否為編輯模式，控制標題與按鈕文案
const isEditing = computed(() => Boolean(props.task))

// method：根據 task 或空白表單同步內容
const syncForm = () => {
  Object.assign(form, emptyForm())
  if (props.task) {
    form.title = props.task.title
    form.description = props.task.description ?? ''
    form.priority = props.task.priority
    form.dueDate = props.task.dueDate ?? ''
    form.tags = props.task.tags.join(', ')
  }
  Object.keys(errors).forEach((key) => delete errors[key])
}

/*
 * watch：
 * - open 變成 true 時重置表單
 * - task 變動時同步內容（編輯不同任務）
 */
watch(
  () => props.open,
  (value) => {
    if (value) syncForm()
  }
)

watch(
  () => props.task,
  () => {
    if (props.open) syncForm()
  }
)

const close = () => emit('update:open', false)

/*
 * 複雜邏輯：送出表單
 * 動機：統一表單輸入、驗證與錯誤顯示。
 * 流程：
 * 1) 組合 TaskInput（含 tags 正規化）
 * 2) 用 Zod 驗證，失敗就寫入錯誤訊息
 * 3) 成功則 emit submit 並關閉彈窗
 * 例外：驗證失敗時不送出。
 */
const handleSubmit = () => {
  const input: TaskInput = {
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
    dueDate: form.dueDate ? form.dueDate : null,
    tags: normalizeTags(form.tags)
  }

  const result = taskInputSchema.safeParse(input)
  if (!result.success) {
    Object.keys(errors).forEach((key) => delete errors[key])
    result.error.issues.forEach((issue) => {
      const field = issue.path[0]
      if (field) {
        errors[field.toString()] = issue.message
      }
    })
    return
  }

  emit('submit', result.data)
  close()
}
</script>
