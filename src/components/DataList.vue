<!-- ============================================================
     通用数据列表组件 DataList（可复用组件 · 作用域插槽）
     ------------------------------------------------------------
     · props：
         items      数据数组
         itemKey    用哪个字段做 v-for 的 key，默认 id
         emptyText  没有数据时的兜底文案
     · 作用域插槽（默认插槽）：
         子组件只管遍历，把 item（当前项）和 index（序号）暴露出来，
         至于每一行显示什么，交给父组件模板决定。
     · 具名插槽 empty：空状态的界面内容

     为什么要用作用域插槽：
       父组件提供的插槽内容默认只能访问父组件自己的数据，
       而 item / index 是子组件遍历时才知道的。
       当父组件需要用「子组件里的当前项目、序号」来渲染界面时，
       就必须由子组件通过作用域插槽把这些数据显式传出去。
     ============================================================ -->
<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  itemKey: { type: String, default: 'id' },
  emptyText: { type: String, default: '暂无数据' }
})
</script>

<template>
  <div class="dlist">
    <div
      class="dlist-row"
      v-for="(item, index) in items"
      :key="item[itemKey] ?? index"
    >
      <!-- 作用域插槽：把 item / index 交给父组件 -->
      <slot :item="item" :index="index">
        <span class="dlist-idx">{{ index + 1 }}</span>
        <span class="dlist-text">{{ item.name ?? item }}</span>
      </slot>
    </div>

    <!-- 具名插槽 empty -->
    <div v-if="!items.length" class="dlist-empty">
      <slot name="empty" :count="items.length">{{ emptyText }}</slot>
    </div>
  </div>
</template>

<style scoped>
.dlist { display: grid; gap: 8px; }

.dlist-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--border); border-radius: 11px;
  background: var(--bg);
  transition: .2s;
}
.dlist-row:hover { border-color: var(--primary); }

.dlist-idx {
  flex: 0 0 24px; height: 24px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600;
  background: var(--chip); color: var(--muted);
}
.dlist-text { font-size: 14px; color: var(--text); }

.dlist-empty {
  text-align: center; color: var(--muted); font-size: 14px;
  padding: 32px 0;
  border: 1px dashed var(--border); border-radius: 12px;
}
</style>
