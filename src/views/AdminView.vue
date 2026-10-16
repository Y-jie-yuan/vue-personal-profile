<!-- ============================================================
     后台管理 AdminView（路由 /admin）
     ------------------------------------------------------------
     实验要求：新增后台管理相关页面，用于修改个人简介、项目信息等内容，
     且内容修改入口与普通访客浏览功能合理区分。

     访问控制：本路由在 src/router/index.js 中标记 meta.requiresAuth，
     由全局前置守卫 beforeEach 拦截未登录访问，因此能进入本页说明已登录。

     页面内容：
       1. 个人资料编辑 —— 复用实验二的 ProfileEditor 组件；
       2. 项目信息管理 —— 直接修改 src/data/projects.js 中响应式项目数组，
                          项目列表与详情页会同步更新。
     ============================================================ -->
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import ProfileEditor from '../components/ProfileEditor.vue'
import PanelCard from '../components/PanelCard.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ProgressBar from '../components/ProgressBar.vue'

import { PROJECTS, STATUS_OPTIONS } from '../data/projects.js'
import { useProfileStore } from '../stores/profile.js'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()

/* 实验四：个人资料与登录状态都改由 Pinia Store 管理 */
const profileStore = useProfileStore()
const authStore = useAuthStore()
const { form, savedTip } = storeToRefs(profileStore)
const { userName } = storeToRefs(authStore)

/* 进入后台时把当前资料复制到表单，避免直接改动已展示的数据 */
onMounted(() => {
  profileStore.loadForm()
  console.log('[Admin] 已进入后台管理，当前登录用户：', userName.value, authStore.user?.role)
})

/* ---------- 项目信息管理 ---------- */
const editingId = ref(null)                       // 当前正在编辑的项目 id
const draft = reactive({ name: '', desc: '', statusKey: 'todo', progress: 0 })
const projectTip = ref('')

/** 开始编辑某个项目 */
function startEdit(project) {
  editingId.value = project.id
  draft.name = project.name
  draft.desc = project.desc
  draft.statusKey = project.statusKey
  draft.progress = project.progress
  projectTip.value = ''
}

/** 保存项目修改（直接改响应式数组，列表与详情页自动同步） */
function saveEdit(project) {
  if (!draft.name.trim()) {
    projectTip.value = '项目名称不能为空'
    return
  }
  project.name = draft.name.trim()
  project.desc = draft.desc.trim()
  project.statusKey = draft.statusKey
  project.progress = Math.min(100, Math.max(0, Number(draft.progress) || 0))
  editingId.value = null
  projectTip.value = `✓ 已保存项目「${project.name}」`
  console.log('[Admin] 项目信息已更新：', project)
  setTimeout(() => { projectTip.value = '' }, 2500)
}

/** 取消编辑 */
function cancelEdit() {
  editingId.value = null
  projectTip.value = ''
}

/** 退出登录并回到个人主页 */
function handleLogout() {
  authStore.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="page">

    <section class="hero">
      <div>
        <h1 class="hero-title">后台管理</h1>
        <p class="hero-sub">
          在这里维护个人资料与项目信息，保存后会立即同步到前台页面。
        </p>
      </div>
      <div class="hero-actions">
        <span class="chip ok">已登录：{{ userName }}</span>
        <RouterLink class="btn" :to="{ name: 'article-manage' }">文章管理</RouterLink>
        <button class="btn" @click="handleLogout">退出登录</button>
      </div>
    </section>

    <!-- ============ 个人资料编辑（复用实验二的 ProfileEditor 组件） ============ -->
    <ProfileEditor
      v-model:form="form"
      :visible="true"
      :tip="savedTip"
      @save="profileStore.saveProfile"
      @reset="profileStore.resetForm"
    />

    <!-- ============ 项目信息管理 ============ -->
    <PanelCard title="项目信息管理" :level="2">
      <template #extra>
        <span v-if="projectTip" class="tip">{{ projectTip }}</span>
      </template>

      <div class="proj-list">
        <article v-for="p in PROJECTS" :key="p.id" class="proj-row">
          <!-- 只读态 -->
          <template v-if="editingId !== p.id">
            <div class="proj-main">
              <div class="proj-title">
                <span class="proj-id">#{{ p.id }}</span>
                <b>{{ p.name }}</b>
                <StatusBadge :status="p.statusKey" />
              </div>
              <p class="proj-desc">{{ p.desc }}</p>
              <div class="proj-progress">
                <ProgressBar :value="p.progress" label="完成进度" />
              </div>
            </div>
            <div class="proj-actions">
              <button class="mini-btn" @click="startEdit(p)">编辑</button>
              <RouterLink
                class="mini-btn"
                :to="{ name: 'project-detail', params: { id: p.id } }"
              >查看</RouterLink>
            </div>
          </template>

          <!-- 编辑态 -->
          <template v-else>
            <div class="proj-edit">
              <div class="field">
                <label>项目名称</label>
                <input v-model.trim="draft.name" type="text">
              </div>
              <div class="field full">
                <label>项目简介</label>
                <textarea v-model="draft.desc"></textarea>
              </div>
              <div class="field">
                <label>状态</label>
                <select v-model="draft.statusKey">
                  <option v-for="opt in STATUS_OPTIONS.filter(o => o.key !== 'all')" :key="opt.key" :value="opt.key">
                    {{ opt.label }}
                  </option>
                </select>
              </div>
              <div class="field">
                <label>完成进度（0-100）</label>
                <input v-model.number="draft.progress" type="number" min="0" max="100">
              </div>
            </div>
            <div class="proj-actions">
              <button class="mini-btn primary" @click="saveEdit(p)">保存</button>
              <button class="mini-btn" @click="cancelEdit">取消</button>
            </div>
          </template>
        </article>
      </div>

      <template #footer>
        共 {{ PROJECTS.length }} 个项目 · 修改会同步到项目展示页与详情页
      </template>
    </PanelCard>
  </div>
</template>

<style scoped>
.proj-list { display: grid; gap: 12px; }
.proj-row {
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  border: 1px solid var(--border); border-radius: 12px;
  background: var(--bg); padding: 14px 16px;
  transition: border-color .2s;
}
.proj-row:hover { border-color: color-mix(in srgb, var(--primary) 45%, var(--border)); }
.proj-main { flex: 1; min-width: 240px; display: grid; gap: 8px; }
.proj-title { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 14px; }
.proj-id { font-size: 12px; font-weight: 700; color: var(--primary); font-variant-numeric: tabular-nums; }
.proj-desc { font-size: 12px; color: var(--muted); line-height: 1.6; margin: 0; }
.proj-progress { max-width: 320px; }

.proj-actions { display: flex; gap: 8px; flex-wrap: wrap; }

.proj-edit {
  flex: 1; min-width: 240px;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px;
}
</style>
