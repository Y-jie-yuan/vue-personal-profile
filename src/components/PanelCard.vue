<!-- ============================================================
     通用面板卡片组件 PanelCard（可复用组件）
     ------------------------------------------------------------
     · props：title      标题文案（没传 title 插槽时使用）
              level      标题层级，2 或 3，决定渲染成 h2 / h3
     · 具名插槽：
         title   自定义整个标题区（比 title 属性更灵活）
         extra   右上角操作区，例如「视图切换」按钮
         footer  卡片底部区，例如统计信息、操作按钮
     · 默认插槽：面板主体内容

     复用价值：整个项目里凡是「带标题和操作区的卡片」都套这一层，
     页面只关心往插槽里塞什么内容，不再重复写卡片外壳与标题样式。

     注意 v-if="$slots.xxx" 的写法：
       插槽是否存在要判断「这次渲染时父组件有没有传」，
       所以直接写在模板里让它在每次渲染时重新求值。
       不要写成 computed(() => Boolean(useSlots().extra))：
       插槽对象（instance.slots）是普通对象，增删插槽走的是
       slots[key] = fn / delete slots[key]，不经过响应式系统，
       computed 的依赖收集不到变化，之后会一直返回第一次缓存的旧值。
     ============================================================ -->
<script setup>
defineProps({
  title: { type: String, default: '' },
  level: { type: Number, default: 2 }
})
</script>

<template>
  <section class="panel-card">
    <header class="panel-head">
      <!-- 具名插槽 title：父组件可以完全接管标题区；不传则用 title 属性兜底 -->
      <component :is="`h${level}`" class="panel-title">
        <slot name="title">{{ title }}</slot>
      </component>

      <!-- 具名插槽 extra：右上角操作区（父组件没传就不渲染这一块） -->
      <div v-if="$slots.extra" class="panel-extra">
        <slot name="extra" />
      </div>
    </header>

    <div class="panel-body">
      <!-- 默认插槽：主体内容 -->
      <slot />
    </div>

    <!-- 具名插槽 footer -->
    <footer v-if="$slots.footer" class="panel-foot">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.panel-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  padding: 22px 24px;
  transition: background .3s, border-color .3s;
}

.panel-head {
  display: flex; align-items: center; gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.panel-title {
  font-size: 16px; font-weight: 700; color: var(--text);
  display: flex; align-items: center; gap: 8px;
  margin: 0;
}
.panel-title::before {
  content: ""; width: 4px; height: 16px; border-radius: 2px;
  background: linear-gradient(180deg, var(--primary), var(--primary-2));
}

.panel-extra { margin-left: auto; display: flex; align-items: center; gap: 8px; }

.panel-foot {
  margin-top: 16px; padding-top: 14px;
  border-top: 1px dashed var(--border);
  font-size: 12px; color: var(--muted);
}
</style>
