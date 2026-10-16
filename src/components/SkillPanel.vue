<!-- 技能与兴趣面板组件
     props：skills（技能数组）、hobbies（兴趣数组）
     defineModel：keyword（搜索关键词，与父组件双向同步）
     内部用 computed 根据 keyword 筛选列表
     复用：掌握程度进度条改用公共组件 ProgressBar（与项目卡片共用同一套样式） -->
<script setup>
import { computed } from 'vue'
import ProgressBar from './ProgressBar.vue'

const props = defineProps({
  skills: { type: Array, default: () => [] },
  hobbies: { type: Array, default: () => [] }
})

// 搜索关键词与父组件双向同步
const keyword = defineModel('keyword', { type: String, default: '' })

// 根据关键词筛选技能/兴趣列表
const filteredSkills = computed(() => {
  const kw = keyword.value.toLowerCase()
  if (!kw) return props.skills
  return props.skills.filter(item =>
    item.name.toLowerCase().includes(kw) ||
    item.tag.toLowerCase().includes(kw)
  )
})

// 所有掌握程度的平均值
const avgLevel = computed(() => {
  if (!props.skills.length) return 0
  const total = props.skills.reduce((sum, s) => sum + s.level, 0)
  return Math.round(total / props.skills.length)
})
</script>

<template>
  <section class="card">
    <h2 class="section-title">技能与兴趣</h2>

    <div class="search-row">
      <!-- v-model 双向绑定搜索关键词 -->
      <div class="search-box">
        <span>🔍</span>
        <input v-model.trim="keyword" type="text" placeholder="输入关键词筛选，例如：Vue、设计、运动">
      </div>
      <span class="stat">
        共 <b>{{ skills.length }}</b> 项，匹配 <b>{{ filteredSkills.length }}</b> 项 · 平均掌握 <b>{{ avgLevel }}%</b>
      </span>
      <button class="btn" v-show="keyword" @click="keyword = ''">清空</button>
    </div>

    <div class="skill-list" style="margin-top:16px">
      <div class="skill" v-for="skill in filteredSkills" :key="skill.id">
        <div class="skill-top">
          <span class="skill-name">{{ skill.name }}</span>
          <span class="skill-tag">{{ skill.tag }}</span>
        </div>
        <!-- 复用公共的进度条组件：与项目卡片里的「完成进度」共用一套样式 -->
        <ProgressBar :value="skill.level" label="掌握程度" />
      </div>
    </div>

    <!-- v-if 渲染空状态 -->
    <div v-if="filteredSkills.length === 0" class="empty">
      没有找到与「{{ keyword }}」相关的技能或兴趣，换个关键词试试～
    </div>

    <!-- v-show 控制兴趣标签区（与 v-if 形成对比） -->
    <div v-show="!keyword" style="margin-top:20px">
      <div class="hint" style="margin-bottom:10px">兴趣爱好</div>
      <div class="tags">
        <span class="tag" v-for="hobby in hobbies" :key="hobby">{{ hobby }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.search-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.stat { font-size: 13px; color: var(--muted); white-space: nowrap; }
.stat b { color: var(--primary); font-size: 15px; }

.skill-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
.skill {
  border: 1px solid var(--border); border-radius: 12px;
  padding: 14px; background: var(--bg);
  transition: .2s;
}
.skill:hover { transform: translateY(-2px); border-color: var(--primary); }
.skill-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.skill-name { font-weight: 600; font-size: 14px; }
.skill-tag { font-size: 11px; color: var(--muted); background: var(--chip); padding: 2px 8px; border-radius: 999px; border: 1px solid var(--border); }
/* 进度条样式已抽到公共组件 ProgressBar.vue，这里只需要控制它与上方的间距 */
.skill :deep(.bar-row) { margin-top: 10px; }

.empty {
  text-align: center; color: var(--muted); font-size: 14px;
  padding: 30px 0; border: 1px dashed var(--border); border-radius: 12px;
}

.tags { display: flex; flex-wrap: wrap; gap: 10px; }
.tag {
  padding: 7px 14px; border-radius: 999px; font-size: 13px;
  background: var(--chip); border: 1px solid var(--border); color: var(--text);
}

.hint { margin-top: 10px; }
</style>
