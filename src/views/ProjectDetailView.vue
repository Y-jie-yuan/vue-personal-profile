<!-- ============================================================
     项目详情 · 子路由 ProjectDetailView（路由 /projects/:id）
     ------------------------------------------------------------
     动态路由：一条规则 /projects/:id 匹配任意项目详情地址，
     具体显示哪个项目由 URL 里的 :id 决定。

     用到的路由知识：
       useRoute()        —— 读取路由参数 route.params.id
       useRouter()       —— 编程式导航：返回上一页 go(-1)、返回列表 push()
       无效详情地址处理   —— id 不存在时给出友好提示，而不是空白页
     ============================================================ -->
<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { findProject } from '../data/projects.js'
import StatusBadge from '../components/StatusBadge.vue'
import TagList from '../components/TagList.vue'
import ProgressBar from '../components/ProgressBar.vue'
import PanelCard from '../components/PanelCard.vue'

const route = useRoute()
const router = useRouter()

/** 从路由参数里取出项目编号（动态参数 id 永远是字符串） */
const projectId = computed(() => route.params.id)

/** 根据 id 查项目；查不到返回 undefined，用于「无效详情地址处理」 */
const project = computed(() => findProject(projectId.value))

/** 是否命中有效项目 */
const isValid = computed(() => Boolean(project.value))

/** 进度条配色跟随状态 */
const progressTone = computed(() => {
  if (!project.value) return 'brand'
  if (project.value.statusKey === 'done') return 'success'
  if (project.value.statusKey === 'doing') return 'brand'
  return 'warn'
})

/* 每次 id 变化都输出日志，便于在控制台观察动态路由参数的解析 */
watchEffect(() => {
  console.log(
    `[项目详情] route.params.id = ${projectId.value} → ` +
    (isValid.value ? `命中项目「${project.value.name}」` : '无效的项目编号')
  )
})

/** 编程式导航：返回上一页（等价于浏览器的后退） */
function goBack() {
  router.go(-1)      // 也可以写 router.back()
}

/** 编程式导航：返回项目列表（按命名路由跳转） */
function goList() {
  router.push({ name: 'project-list' })
}

/** 跳转到「上一个 / 下一个」项目，演示带参数的编程式跳转 */
function goProject(id) {
  router.push({ name: 'project-detail', params: { id } })
}
</script>

<template>
  <div class="page">

    <!-- 面包屑 + 操作按钮：全部使用编程式导航 -->
    <section class="card bar">
      <nav class="crumb">
        <RouterLink :to="{ name: 'home' }">个人主页</RouterLink>
        <span>/</span>
        <RouterLink :to="{ name: 'projects' }">项目展示</RouterLink>
        <span>/</span>
        <span class="crumb-now">项目详情 #{{ projectId }}</span>
      </nav>
      <div class="bar-actions">
        <button class="mini-btn" @click="goBack">← 返回上一页</button>
        <button class="mini-btn primary" @click="goList">返回项目列表</button>
      </div>
    </section>

    <!-- ============ 有效：展示项目详情 ============ -->
    <template v-if="isValid">
      <PanelCard :title="project.name">
        <template #extra>
          <StatusBadge :status="project.statusKey" />
        </template>

        <p class="detail-desc">{{ project.desc }}</p>

        <ProgressBar :value="project.progress" label="完成进度" :height="10" :tone="progressTone" />

        <div class="meta-grid">
          <div class="meta-item"><span class="meta-label">项目编号</span><b>{{ project.id }}</b></div>
          <div class="meta-item"><span class="meta-label">承担角色</span><b>{{ project.role }}</b></div>
          <div class="meta-item"><span class="meta-label">起止时间</span><b>{{ project.period }}</b></div>
        </div>

        <div class="detail-section">
          <h4>分类标签</h4>
          <TagList :tags="project.tags" size="sm" />
        </div>

        <div class="detail-section">
          <h4>技术栈</h4>
          <TagList :tags="project.stack" size="sm" variant="outline" />
        </div>

        <div class="detail-section">
          <h4>项目亮点</h4>
          <ul class="detail-list">
            <li v-for="(point, i) in project.highlight" :key="i">{{ point }}</li>
          </ul>
        </div>

        <template #footer>
          <div class="foot-row">
            <a v-if="project.repo" class="mini-btn" :href="project.repo" target="_blank" rel="noopener">源码地址</a>
            <a v-if="project.demo" class="mini-btn" :href="project.demo" target="_blank" rel="noopener">在线演示</a>
            <!-- 动态路由参数的编程式跳转：切换到相邻项目 -->
            <button
              v-if="findProject(projectId - 1)"
              class="mini-btn"
              @click="goProject(projectId - 1)"
            >← 上一个项目</button>
            <button
              v-if="findProject(Number(projectId) + 1)"
              class="mini-btn"
              @click="goProject(Number(projectId) + 1)"
            >下一个项目 →</button>
          </div>
        </template>
      </PanelCard>
    </template>

    <!-- ============ 无效：无效详情地址处理 ============ -->
    <section v-else class="card invalid">
      <div class="invalid-icon">⚠️</div>
      <h2 class="invalid-title">无效的项目详情地址</h2>
      <p class="invalid-desc">
        当前 URL 中的项目编号为 <b>「{{ projectId }}」</b>，项目数据里没有这一条。
        可能是手动输入了不存在的编号，或该项目已被移除。
      </p>
      <div class="invalid-actions">
        <button class="mini-btn primary" @click="goList">返回项目列表</button>
        <button class="mini-btn" @click="goBack">返回上一页</button>
        <RouterLink class="mini-btn" :to="{ name: 'home' }">回到个人主页</RouterLink>
      </div>
      <p class="invalid-tip">
        提示：有效的项目编号为
        <RouterLink
          v-for="id in [1, 2, 3, 4, 5, 6]"
          :key="id"
          class="num-link"
          :to="{ name: 'project-detail', params: { id } }"
        >{{ id }}</RouterLink>
      </p>
    </section>
  </div>
</template>

<style scoped>
.bar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 14px 20px; }
.crumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); flex-wrap: wrap; }
.crumb a { color: var(--primary); text-decoration: none; }
.crumb a:hover { text-decoration: underline; }
.crumb-now { color: var(--text); font-weight: 600; }
.bar-actions { margin-left: auto; display: flex; gap: 10px; flex-wrap: wrap; }

.detail-desc { margin: 0 0 14px; font-size: 14px; line-height: 1.8; color: var(--text); }

.detail-section { margin-top: 18px; display: grid; gap: 8px; }
.detail-section h4 {
  font-size: 13px; font-weight: 700; color: var(--text); margin: 0;
  padding-left: 9px; border-left: 3px solid var(--primary);
}
.detail-list { margin: 0; padding-left: 18px; display: grid; gap: 6px; font-size: 13px; line-height: 1.75; color: var(--muted); }
.detail-list li::marker { color: var(--primary); }

.foot-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

/* ========== 无效地址 ========== */
.invalid { display: grid; gap: 12px; justify-items: center; text-align: center; padding: 40px 24px; }
.invalid-icon { font-size: 40px; line-height: 1; }
.invalid-title { font-size: 20px; font-weight: 700; margin: 0; }
.invalid-desc { font-size: 14px; color: var(--muted); line-height: 1.8; margin: 0; max-width: 520px; }
.invalid-desc b { color: var(--danger); }
.invalid-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.invalid-tip { font-size: 12px; color: var(--muted); margin: 6px 0 0; }
.num-link {
  color: var(--primary); text-decoration: none; font-weight: 600;
  padding: 0 4px;
}
.num-link:hover { text-decoration: underline; }
</style>
