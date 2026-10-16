<!-- ============================================================
     项目列表 · 子路由 ProjectsListView（路由 /projects）
     ------------------------------------------------------------
     页面头部由父路由 ProjectsView 提供（共享标题 + 子导航），
     本组件只负责列表部分：统计筛选、卡片 / 列表两种视图、技术栈分布。
     「查看详情」用 RouterLink 跳到子路由 /projects/:id。

     组件内部状态（关键词 / 状态筛选 / 视图 / 排序）只有本页面用得到，
     依旧留在本组件里，不上提。
     ============================================================ -->
<script setup>
import { ref, computed, watch, onMounted } from 'vue'

import { PROJECTS, STATUS_OPTIONS } from '../data/projects.js'

import PanelCard from '../components/PanelCard.vue'
import ProjectCard from '../components/ProjectCard.vue'
import DataList from '../components/DataList.vue'
import TagList from '../components/TagList.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ProgressBar from '../components/ProgressBar.vue'

/* ---------- 组件内部状态 ---------- */
const keyword = ref('')
const statusFilter = ref('all')
const viewMode = ref('card')
const sortKey = ref('default')

/* ---------- computed：统计数据 ---------- */
/** 各状态项目数量，同时用于顶部统计块与筛选 */
const statusCount = computed(() => {
  const map = { all: PROJECTS.length, doing: 0, done: 0, todo: 0 }
  PROJECTS.forEach(p => {
    if (map[p.statusKey] !== undefined) map[p.statusKey] += 1
  })
  return map
})

/** 顶部统计块数据：把状态选项和数量拼起来 */
const statCards = computed(() =>
  STATUS_OPTIONS.map(opt => ({ ...opt, count: statusCount.value[opt.key] }))
)

/** 技术栈使用统计：某个技术被几个项目用到 */
const stackStats = computed(() => {
  const map = new Map()
  PROJECTS.forEach(p => p.stack.forEach(s => map.set(s, (map.get(s) || 0) + 1)))
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})

/** 技术栈里被引用最多的次数，用于让标签大小随数量变化 */
const maxStackCount = computed(() =>
  stackStats.value.length ? Math.max(...stackStats.value.map(s => s.count)) : 1
)

/** 技术栈名称 → 使用次数，模板里按名字反查 */
const stackCountMap = computed(() =>
  Object.fromEntries(stackStats.value.map(s => [s.name, s.count]))
)

/** 某个技术被几个项目使用 */
function stackCount(name) {
  return stackCountMap.value[name] || 0
}

/** 标签字号随使用次数在 12px ~ 17px 之间线性变化 */
function stackSize(name) {
  const count = stackCount(name)
  const max = maxStackCount.value
  if (max <= 1) return '14px'
  return 12 + Math.round(((count - 1) / (max - 1)) * 5) + 'px'
}

/** 平均完成进度 */
const avgProgress = computed(() => {
  if (!PROJECTS.length) return 0
  return Math.round(PROJECTS.reduce((sum, p) => sum + p.progress, 0) / PROJECTS.length)
})

/* ---------- computed：筛选 + 排序后的项目列表 ---------- */
const filteredProjects = computed(() => {
  const kw = keyword.value.trim().toLowerCase()

  let list = PROJECTS.filter(p => {
    if (statusFilter.value !== 'all' && p.statusKey !== statusFilter.value) return false
    if (!kw) return true
    return (
      p.name.toLowerCase().includes(kw) ||
      p.desc.toLowerCase().includes(kw) ||
      p.tags.some(t => t.toLowerCase().includes(kw)) ||
      p.stack.some(t => t.toLowerCase().includes(kw))
    )
  })

  if (sortKey.value === 'progress') {
    list = [...list].sort((a, b) => b.progress - a.progress)
  } else if (sortKey.value === 'name') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
  }
  return list
})

/** 当前筛选条件是否有生效，用于决定要不要显示「重置」按钮 */
const hasFilter = computed(
  () => keyword.value.trim() !== '' || statusFilter.value !== 'all' || sortKey.value !== 'default'
)

/* ---------- watch：条件变化时输出日志，方便在控制台观察 ---------- */
watch([keyword, statusFilter, viewMode, sortKey], () => {
  console.log(
    `[项目列表] 关键词「${keyword.value.trim() || '空'}」` +
    `｜状态「${statusFilter.value}」｜视图「${viewMode.value}」｜排序「${sortKey.value}」` +
    `→ 匹配 ${filteredProjects.value.length} 个项目`
  )
})

/* ---------- 方法 ---------- */
/** 点击统计块：直接按该状态筛选；再点一次回到全部 */
function pickStatus(key) {
  statusFilter.value = statusFilter.value === key && key !== 'all' ? 'all' : key
}

/** 重置全部筛选条件 */
function resetFilter() {
  keyword.value = ''
  statusFilter.value = 'all'
  sortKey.value = 'default'
}

onMounted(() => {
  console.log(`[项目列表] 子路由已挂载，共加载 ${PROJECTS.length} 个项目`)
})
</script>

<template>
  <div class="page">

    <!-- ============ 统计概览：点击可当作状态筛选 ============ -->
    <div class="stat-grid">
      <button
        v-for="item in statCards"
        :key="item.key"
        class="stat-block"
        :class="{ active: statusFilter === item.key }"
        @click="pickStatus(item.key)"
      >
        <b class="stat-num">{{ item.count }}</b>
        <span class="stat-label">{{ item.label }}</span>
      </button>
    </div>

    <!-- ============ 项目列表面板 ============ -->
    <PanelCard>
      <template #title>
        项目列表
        <span class="count-chip">{{ filteredProjects.length }} / {{ PROJECTS.length }}</span>
      </template>

      <!-- 具名插槽 extra：右上角操作区，视图切换 + 排序 -->
      <template #extra>
        <div class="seg">
          <button :class="{ on: viewMode === 'card' }" @click="viewMode = 'card'">卡片</button>
          <button :class="{ on: viewMode === 'list' }" @click="viewMode = 'list'">列表</button>
        </div>
        <select v-model="sortKey" class="select">
          <option value="default">默认排序</option>
          <option value="progress">按进度</option>
          <option value="name">按名称</option>
        </select>
      </template>

      <!-- 默认插槽：工具栏 + 内容区 -->
      <div class="toolbar">
        <div class="search-box">
          <span>🔍</span>
          <input
            v-model.trim="keyword"
            type="text"
            placeholder="搜索项目名称、简介、标签或技术栈，例如：Vue、可视化"
          >
        </div>
        <button v-if="keyword" class="mini-btn" @click="keyword = ''">清空关键词</button>
        <button v-if="hasFilter" class="mini-btn" @click="resetFilter">重置全部</button>
      </div>

      <!-- ---------- 视图一：卡片视图 ---------- -->
      <div v-show="viewMode === 'card'">
        <div class="card-grid" v-if="filteredProjects.length">
          <ProjectCard
            v-for="project in filteredProjects"
            :key="project.id"
            :project="project"
            :featured="project.featured"
          >
            <!-- 具名插槽 badge：精选项目额外加一个「精选」标记 -->
            <template #badge="{ project: p }">
              <span class="badge-group">
                <span v-if="p.featured" class="pick">精选</span>
                <StatusBadge :status="p.statusKey" />
              </span>
            </template>

            <!-- 默认插槽（作用域插槽）：主体内容由这里决定 -->
            <template #default="{ project: p }">
              <p class="pcard-desc">{{ p.desc }}</p>
              <ul class="pcard-points">
                <li v-for="(point, i) in p.highlight.slice(0, 2)" :key="i">{{ point }}</li>
              </ul>
            </template>

            <!-- 具名插槽 tags：内部再用 TagList 的作用域插槽自定义标签样式 -->
            <template #tags="{ project: p }">
              <TagList :tags="p.tags">
                <template #default="{ tag }">
                  <span class="dot-tag"><i class="dot"></i>{{ tag }}</span>
                </template>
              </TagList>
            </template>

            <!-- 具名插槽 footer：用 RouterLink 跳到项目详情子路由 -->
            <template #footer="{ project: p }">
              <RouterLink
                class="mini-btn primary"
                :to="{ name: 'project-detail', params: { id: p.id } }"
              >查看详情</RouterLink>
              <a v-if="p.repo" class="mini-btn" :href="p.repo" target="_blank" rel="noopener">源码</a>
              <span class="foot-period">{{ p.period }}</span>
            </template>
          </ProjectCard>
        </div>

        <!-- 卡片视图下的空状态 -->
        <div v-else class="empty-box">
          <p>没有找到符合条件的项目</p>
          <p class="empty-sub">试着换个关键词，或者把状态筛选切回「全部项目」</p>
          <button class="mini-btn primary" @click="resetFilter">清空筛选条件</button>
        </div>
      </div>

      <!-- ---------- 视图二：列表视图（作用域插槽 + 具名插槽 empty） ---------- -->
      <DataList
        v-show="viewMode === 'list'"
        :items="filteredProjects"
        empty-text="暂无项目"
      >
        <!-- 作用域插槽：item / index 都来自子组件 -->
        <template #default="{ item, index }">
          <span class="row-idx">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="row-main">
            <div class="row-title">
              {{ item.name }}
              <StatusBadge :status="item.statusKey" />
              <span v-if="item.featured" class="pick">精选</span>
            </div>
            <div class="row-desc">{{ item.desc }}</div>
          </div>
          <div class="row-progress">
            <ProgressBar :value="item.progress" />
          </div>
          <RouterLink
            class="mini-btn"
            :to="{ name: 'project-detail', params: { id: item.id } }"
          >详情</RouterLink>
        </template>

        <!-- 具名插槽 empty：空状态完全由父组件决定长什么样 -->
        <template #empty>
          <div class="empty-box bare">
            <p>没有符合条件的项目</p>
            <p class="empty-sub">当前筛选：关键词「{{ keyword || '空' }}」，状态「{{ statusFilter }}」</p>
            <button class="mini-btn primary" @click="resetFilter">清空筛选条件</button>
          </div>
        </template>
      </DataList>

      <!-- 具名插槽 footer：底部统计说明 -->
      <template #footer>
        共 {{ PROJECTS.length }} 个项目 · 平均完成进度 {{ avgProgress }}% ·
        当前显示 {{ filteredProjects.length }} 个
      </template>
    </PanelCard>

    <!-- ============ 技术栈分布（PanelCard 复用 + TagList 作用域插槽） ============ -->
    <PanelCard title="技术栈分布" :level="2">
      <TagList :tags="stackStats.map(s => s.name)" size="md" variant="outline">
        <!-- 作用域插槽：拿到 tag 与 index，再去查这个技术被几个项目用到 -->
        <template #default="{ tag }">
          <span
            class="stack-item"
            :style="{ fontSize: stackSize(tag) }"
            :title="`${tag}：被 ${stackCount(tag)} 个项目使用`"
          >
            {{ tag }}
            <em class="stack-num">{{ stackCount(tag) }}</em>
          </span>
        </template>
      </TagList>

      <template #footer>
        合计 {{ stackStats.length }} 项技术 · 单个技术最多被 {{ maxStackCount }} 个项目使用
      </template>
    </PanelCard>
  </div>
</template>

<style scoped>
/* ========== 统计块（点击即筛选） ========== */
.stat-block { cursor: pointer; }
.stat-block:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--primary) 55%, var(--border)); }
.stat-block.active {
  border-color: color-mix(in srgb, var(--primary) 65%, var(--border));
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, var(--card)), var(--card));
}

/* ========== 视图切换 ========== */
.seg { display: flex; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
.seg button {
  border: none; background: var(--card); color: var(--muted);
  padding: 6px 12px; font-size: 12px; cursor: pointer; font-family: inherit; transition: .2s;
}
.seg button.on { background: var(--primary); color: #fff; }

/* ========== 卡片视图 ========== */
.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(268px, 1fr)); gap: 14px; }

.pcard-desc { margin: 0; font-size: 13px; line-height: 1.7; }
.pcard-points { margin: 8px 0 0; padding-left: 16px; display: grid; gap: 4px; font-size: 12px; line-height: 1.6; }
.pcard-points li::marker { color: var(--primary); }

.badge-group { display: flex; align-items: center; gap: 5px; }
.pick {
  font-size: 11px; font-weight: 700; color: #fff;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  padding: 2px 8px; border-radius: 999px;
}

.dot-tag { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: var(--muted); }
.dot { width: 5px; height: 5px; border-radius: 50%; background: var(--primary); display: inline-block; }

.foot-period { font-size: 11px; color: var(--muted); margin-left: auto; }

/* ========== 列表视图 ========== */
.row-idx {
  flex: 0 0 30px; font-size: 12px; font-weight: 700; color: var(--primary);
  font-variant-numeric: tabular-nums;
}
.row-main { flex: 1; min-width: 0; display: grid; gap: 4px; }
.row-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--text); }
.row-desc { font-size: 12px; color: var(--muted); line-height: 1.6; }
.row-progress { flex: 0 0 150px; }

/* ========== 技术栈分布 ========== */
.stack-item {
  display: inline-flex; align-items: center; gap: 5px;
  color: var(--primary);
  border: 1px dashed color-mix(in srgb, var(--primary) 45%, transparent);
  border-radius: 999px; padding: 4px 12px;
  transition: .2s;
}
.stack-item:hover { background: var(--chip); }
.stack-num {
  font-style: normal; font-size: 11px; font-weight: 700;
  background: var(--primary); color: #fff;
  border-radius: 999px; padding: 0 6px; line-height: 16px;
}
</style>
