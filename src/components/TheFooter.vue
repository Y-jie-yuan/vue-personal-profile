<!-- 底部信息组件（公共元素，所有路由页面共用）
     props：note   说明文字
             year   年份
             owner  版权归属文案
     插槽：默认插槽 —— 页面可以往底部补一段自己的说明，
           不传插槽时只显示 note 与版权信息。
     说明：note / year 属于「数据」，用 props 传；
           不同页面想在底部额外展示的内容属于「界面」，用默认插槽传。
           插槽是否存在用模板里的 $slots.default 判断（每次渲染重新求值），
           不要用 useSlots() + computed —— 插槽对象不是响应式的。 -->
<script setup>
defineProps({
  note: { type: String, default: '基于 Vue 3 构建的个人站点' },
  year: { type: [String, Number], default: 2026 },
  owner: { type: String, default: '杨结缘 · 计算机科学与技术' }
})
</script>

<template>
  <footer class="footer-note">
    <!-- 默认插槽：页面自定义的补充说明（没传就不渲染这一段） -->
    <p v-if="$slots.default" class="extra">
      <slot />
    </p>

    <p>{{ note }}</p>
    <p class="copyright">© {{ year }} {{ owner }}</p>
  </footer>
</template>

<style scoped>
.footer-note {
  text-align: center; font-size: 12px; color: var(--muted);
  margin: 32px auto 0; max-width: 980px; padding: 18px 20px 0;
  border-top: 1px solid var(--border);
  display: grid; gap: 6px;
}
.copyright { opacity: .8; }
.extra { color: var(--primary); }
</style>
