<!-- ============================================================
     进度条组件 ProgressBar（可复用组件）
     ------------------------------------------------------------
     · props：
         value     当前值
         max       最大值，默认 100
         label     左侧说明文字，例如「掌握程度」
         showText  是否在右侧显示百分比，默认 true
         height    进度条高度（px），默认 7
         tone      配色：brand（品牌渐变）/ success（绿色）/ warn（橙色）
     · 默认插槽：替换右侧的百分比文案，可以放更复杂的内容

     复用价值：原来「技能掌握程度」和「项目完成进度」各写了一套
     进度条样式，这里统一成一个组件，两处共用。
     ============================================================ -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  label: { type: String, default: '' },
  showText: { type: Boolean, default: true },
  height: { type: Number, default: 7 },
  tone: { type: String, default: 'brand' } // brand | success | warn
})

/** 百分比：限制在 0-100，避免数据异常导致进度条溢出 */
const percent = computed(() => {
  if (!props.max) return 0
  return Math.min(100, Math.max(0, Math.round((props.value / props.max) * 100)))
})
</script>

<template>
  <div class="bar-row" :class="`tone-${tone}`">
    <span v-if="label" class="bar-label">{{ label }}</span>

    <div class="bar" :style="{ height: height + 'px' }">
      <!-- 宽度由数据驱动，数值变化时 CSS transition 负责动画 -->
      <span class="bar-fill" :style="{ width: percent + '%' }"></span>
    </div>

    <!-- 默认插槽：可以自定义右侧内容；不传时显示百分比 -->
    <span v-if="showText" class="bar-text">
      <slot>{{ percent }}%</slot>
    </span>
  </div>
</template>

<style scoped>
.bar-row { display: flex; align-items: center; gap: 10px; }
.bar-label { font-size: 12px; color: var(--muted); white-space: nowrap; }

.bar {
  flex: 1; min-width: 60px;
  border-radius: 999px; background: var(--chip); overflow: hidden;
}
.bar-fill {
  display: block; height: 100%; border-radius: 999px;
  transition: width .5s ease;
}

.bar-text {
  font-size: 12px; color: var(--muted);
  min-width: 38px; text-align: right;
  font-variant-numeric: tabular-nums;
}

/* 三种配色 */
.tone-brand   .bar-fill { background: linear-gradient(90deg, var(--primary), var(--primary-2)); }
.tone-success .bar-fill { background: linear-gradient(90deg, #10b981, #34d399); }
.tone-warn    .bar-fill { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
</style>
