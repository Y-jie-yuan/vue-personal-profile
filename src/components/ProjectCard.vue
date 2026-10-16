<!-- ============================================================
     项目卡片组件 ProjectCard（可复用组件 · 具名插槽 + 作用域插槽）
     ------------------------------------------------------------
     · props：
         project   项目对象（数据通过 props 传进来）
         featured  是否为精选项目，true 时卡片加一层强调边框
     · emits：open —— 点击「查看详情」时把当前项目抛给父组件
     · 具名插槽（都带作用域 :project）：
         cover   封面区
         badge   右上角状态徽章
         tags    标签区
         footer  底部操作区
     · 默认插槽（作用域 :project）：卡片主体内容

     为什么「数据用 props、界面用插槽」：
       项目名称、简介、进度是**数据**，父子组件都需要，用 props 传；
       封面长什么样、状态徽章要不要加圆点、底部放几个按钮，属于**界面内容**，
       用插槽交给使用方决定，卡片组件本身不写死。
     ============================================================ -->
<script setup>
import { computed } from 'vue'
import TagList from './TagList.vue'
import ProgressBar from './ProgressBar.vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  project: { type: Object, required: true },
  featured: { type: Boolean, default: false }
})

const emit = defineEmits(['open'])

/** 进度条配色跟随项目状态：已完成→绿，进行中→品牌色，规划中→橙 */
const progressTone = computed(() => {
  if (props.project.statusKey === 'done') return 'success'
  if (props.project.statusKey === 'doing') return 'brand'
  return 'warn'
})

/** 用做封面占位的首字 */
const coverText = computed(() => (props.project.name ? props.project.name.charAt(0) : '?'))
</script>

<template>
  <article class="pcard" :class="{ 'is-featured': featured }">
    <!-- 具名插槽 cover -->
    <div class="pcard-cover">
      <slot name="cover" :project="project">
        <span class="cover-text">{{ coverText }}</span>
      </slot>

      <!-- 具名插槽 badge -->
      <div class="cover-badge">
        <slot name="badge" :project="project">
          <StatusBadge :status="project.statusKey" />
        </slot>
      </div>
    </div>

    <h3 class="pcard-name">
      <!-- 具名插槽 title -->
      <slot name="title" :project="project">{{ project.name }}</slot>
    </h3>

    <!-- 默认插槽：主体内容 -->
    <div class="pcard-body">
      <slot :project="project">
        <p class="pcard-desc">{{ project.desc }}</p>
      </slot>
    </div>

    <div class="pcard-progress">
      <ProgressBar :value="project.progress" label="完成进度" :tone="progressTone" />
    </div>

    <!-- 具名插槽 tags：这里默认用可复用的标签组件兜底 -->
    <div class="pcard-tags">
      <slot name="tags" :project="project">
        <TagList :tags="project.tags" />
      </slot>
    </div>

    <!-- 具名插槽 footer -->
    <footer class="pcard-foot">
      <slot name="footer" :project="project">
        <button class="pcard-btn" @click="emit('open', project)">查看详情</button>
      </slot>
    </footer>
  </article>
</template>

<style scoped>
.pcard {
  display: flex; flex-direction: column; gap: 10px;
  border: 1px solid var(--border); border-radius: 14px;
  background: var(--bg);
  padding: 16px;
  transition: .2s;
}
.pcard:hover { transform: translateY(-3px); border-color: var(--primary); box-shadow: var(--shadow); }
.is-featured {
  border-color: color-mix(in srgb, var(--primary) 45%, var(--border));
  background: linear-gradient(180deg, color-mix(in srgb, var(--primary) 6%, var(--bg)), var(--bg));
}

.pcard-cover {
  position: relative;
  height: 84px; border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  overflow: hidden;
}
.cover-text { font-size: 30px; font-weight: 700; color: #fff; opacity: .92; }
.cover-badge { position: absolute; top: 8px; right: 8px; }

.pcard-name {
  font-size: 15px; font-weight: 700; color: var(--text);
  margin: 0;
  display: flex; align-items: center; gap: 6px;
}

.pcard-body { font-size: 13px; line-height: 1.7; color: var(--muted); }
.pcard-desc { margin: 0; }

.pcard-tags { margin-top: auto; }

.pcard-foot {
  display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
  padding-top: 10px; border-top: 1px dashed var(--border);
}

.pcard-btn {
  border: 1px solid var(--border); background: var(--card); color: var(--text);
  padding: 6px 13px; border-radius: 9px; font-size: 12px;
  cursor: pointer; transition: .2s; font-family: inherit;
}
.pcard-btn:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-1px); }
</style>
