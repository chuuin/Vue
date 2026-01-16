<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div class="absolute inset-0 bg-slate-950/70" @click="close" />
      <div
        class="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl backdrop-blur"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-display text-xl font-semibold text-white">
              {{ isEditing ? 'Edit task' : 'Create a task' }}
            </h3>
            <p class="text-sm text-slate-300">
              {{
                isEditing
                  ? 'Update details and keep momentum.'
                  : 'Capture a task with clear intent.'
              }}
            </p>
          </div>
          <button
            class="text-sm text-slate-300 transition hover:text-white"
            type="button"
            @click="close"
          >
            Close
          </button>
        </div>

        <form class="mt-6 grid gap-4" @submit.prevent="handleSubmit">
          <div>
            <label class="text-xs uppercase tracking-wide text-slate-300" for="task-title"
              >Title</label
            >
            <input
              id="task-title"
              v-model="form.title"
              class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-brand-500/50 focus:outline-none"
              placeholder="What needs to be done?"
              type="text"
            />
            <p v-if="errors.title" class="mt-1 text-xs text-rose-200">
              {{ errors.title }}
            </p>
          </div>

          <div>
            <label class="text-xs uppercase tracking-wide text-slate-300" for="task-description"
              >Description</label
            >
            <textarea
              id="task-description"
              v-model="form.description"
              class="mt-2 min-h-[120px] w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-brand-500/50 focus:outline-none"
              placeholder="Add context or next steps"
            />
            <p v-if="errors.description" class="mt-1 text-xs text-rose-200">
              {{ errors.description }}
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="text-xs uppercase tracking-wide text-slate-300" for="task-priority"
                >Priority</label
              >
              <select
                id="task-priority"
                v-model="form.priority"
                class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-brand-500/50 focus:outline-none"
              >
                <option v-for="level in priorityOptions" :key="level" :value="level">
                  {{ level }}
                </option>
              </select>
            </div>
            <div>
              <label class="text-xs uppercase tracking-wide text-slate-300" for="task-due"
                >Due date</label
              >
              <input
                id="task-due"
                v-model="form.dueDate"
                class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-brand-500/50 focus:outline-none"
                type="date"
              />
              <p v-if="errors.dueDate" class="mt-1 text-xs text-rose-200">
                {{ errors.dueDate }}
              </p>
            </div>
          </div>

          <div>
            <label class="text-xs uppercase tracking-wide text-slate-300" for="task-tags"
              >Tags</label
            >
            <input
              id="task-tags"
              v-model="form.tags"
              class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-brand-500/50 focus:outline-none"
              placeholder="design, api, urgent"
              type="text"
            />
            <p class="mt-1 text-xs text-slate-400">Separate with commas. Up to 6 tags.</p>
            <p v-if="errors.tags" class="mt-1 text-xs text-rose-200">
              {{ errors.tags }}
            </p>
          </div>

          <div class="flex flex-wrap items-center justify-end gap-3 pt-4">
            <button
              class="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30 hover:text-white"
              type="button"
              @click="close"
            >
              Cancel
            </button>
            <button
              class="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-brand-400"
              type="submit"
            >
              {{ isEditing ? 'Save changes' : 'Create task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

import type { Task, TaskInput, TaskPriority } from '../model/task'
import { taskInputSchema, taskPriorityValues } from '../model/task'
import { normalizeTags } from '../utils/filters'

const props = defineProps<{ open: boolean; task?: Task | null }>()
const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'submit', value: TaskInput): void
}>()

const priorityOptions = taskPriorityValues as TaskPriority[]

const emptyForm = () => ({
  title: '',
  description: '',
  priority: 'medium' as TaskPriority,
  dueDate: '',
  tags: ''
})

const form = reactive(emptyForm())
const errors = reactive<Record<string, string>>({})

const isEditing = computed(() => Boolean(props.task))

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
