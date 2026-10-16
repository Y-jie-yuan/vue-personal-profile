<!-- ============================================================
     状态徽章组件 StatusBadge（可复用组件）
     ------------------------------------------------------------
     · props：
         status  状态标识：doing（进行中）/ done（已完成）/ todo（规划中）
         text    自定义文案，不传则用内置的状态文案
     · 默认插槽：完全自定义徽章内容（例如加一个状态圆点 + 文字）

     复用价值：项目卡片、项目详情、列表视图都要显示状态，
     状态与配色的对应关系集中在这一个组件里，改一处全局生效。
     ============================================================ -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, default: 'todo' },
  text: { type: String, default: '' }
})

/** 状态标识 → 中文文案 */
const STATUS_TEXT = {
  doing: '进行中',
  done: '已完成',
  todo: '规划中'
}

const label = computed(() => props.text || STATUS_TEXT[props.status] || props.status)

/** 状态标识 → 配色类名，未知状态回退到 todo 样式 */
const toneClass = computed(() =>
  ['doing', 'done', 'todo'].includes(props.status) ? `is-${props.status}` : 'is-todo'
)
</script>

<template>
  <span class="status-badge" :class="toneClass">
    <slot>{{ label }}</slot>
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600;
  padding: 3px 11px; border-radius: 999px;
  border: 1px solid transparent;
  white-space: nowrap;
}
.is-doing { color: #0369a1; background: #e0f2fe; border-color: #bae6fd; }
.is-done  { color: #047857; background: #d1fae5; border-color: #a7f3d0; }
.is-todo  { color: #6b7280; background: var(--chip); border-color: var(--border); }

/* 暗色主题下换成低透明度底 + 亮色文字，保证对比度 */
html[data-theme="dark"] .is-doing { color: #7dd3fc; background: rgba(56, 189, 248, .14); border-color: rgba(56, 189, 248, .35); }
html[data-theme="dark"] .is-done  { color: #6ee7b7; background: rgba(52, 211, 153, .14); border-color: rgba(52, 211, 153, .35); }
html[data-theme="dark"] .is-todo  { color: #93a2bd; background: var(--chip); border-color: var(--border); }
</style>
