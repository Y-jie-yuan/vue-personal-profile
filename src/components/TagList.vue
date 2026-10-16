<!-- ============================================================
     标签列表组件 TagList（可复用组件 · 作用域插槽）
     ------------------------------------------------------------
     · props：
         tags     标签数组
         size     尺寸：sm / md
         variant  风格：plain（浅底）/ outline（描边）
     · 作用域插槽（默认插槽）：把子组件遍历得到的 tag、index 交给父组件，
       父组件可以决定每个标签长什么样、要不要加小图标；
       不传插槽时用组件内置的默认样式。

     复用价值：项目卡片、项目详情、技术栈展示都是「一排小标签」，
     结构完全一样，只是内容样式略有差别，用一个组件 + 作用域插槽解决。
     ============================================================ -->
<script setup>
defineProps({
  tags: { type: Array, default: () => [] },
  size: { type: String, default: 'sm' },      // sm | md
  variant: { type: String, default: 'plain' } // plain | outline
})
</script>

<template>
  <div class="tag-list" v-if="tags.length">
    <!-- 作用域插槽：每个标签都把 tag / index 暴露出去 -->
    <template v-for="(tag, index) in tags" :key="index">
      <slot :tag="tag" :index="index">
        <!-- 默认渲染：父组件没有自定义时使用 -->
        <span class="tag" :class="[`size-${size}`, `variant-${variant}`]">{{ tag }}</span>
      </slot>
    </template>
  </div>
  <span v-else class="tag-empty">暂无标签</span>
</template>

<style scoped>
.tag-list { display: flex; flex-wrap: wrap; gap: 8px; }

.tag {
  display: inline-flex; align-items: center; gap: 4px;
  border-radius: 999px; white-space: nowrap;
}
.size-sm { font-size: 11px; padding: 2px 9px; }
.size-md { font-size: 13px; padding: 5px 12px; }

.variant-plain {
  background: var(--chip); color: var(--muted);
  border: 1px solid var(--border);
}
.variant-outline {
  background: transparent; color: var(--primary);
  border: 1px dashed var(--primary);
}

.tag-empty { font-size: 12px; color: var(--muted); }
</style>
