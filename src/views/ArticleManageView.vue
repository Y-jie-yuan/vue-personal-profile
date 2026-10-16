<!-- ============================================================
     文章管理 ArticleManageView（路由 /articles/manage，需登录）
     ------------------------------------------------------------
     实验四新增页面。路由上标记了 meta.requiresAuth，由全局前置守卫
     读取 auth Store 中的登录状态决定是否放行 —— 未登录访问会被拦到
     登录页，登录后再用 replace 回到这里。

     页面职责：对 article Store 里的文章做增、删、改与发布状态切换。
     所有写操作都通过 Store 的 actions 完成（actions 是修改 state 的
     唯一推荐入口），并在 action 内同步写入 localStorage。
     ============================================================ -->
<script setup>
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useArticleStore } from '../stores/article.js'
import { useAuthStore } from '../stores/auth.js'
import PanelCard from '../components/PanelCard.vue'

const articleStore = useArticleStore()
const authStore = useAuthStore()

/* storeToRefs 解构 state / getters；actions 直接从 Store 实例调用 */
const { articles, total, publishedCount, draftCount } = storeToRefs(articleStore)
const { userName } = storeToRefs(authStore)

/* ---------- 表单状态（本页面局部状态） ---------- */
const emptyForm = () => ({
  title: '',
  category: '学习笔记',
  summary: '',
  content: '',
  tags: '',
  status: 'draft'
})

const form = reactive(emptyForm())
const editingId = ref(null)        // null 表示「新增」模式
const error = ref('')
const tip = ref('')
const pendingDeleteId = ref(null)  // 二次确认删除

/** 当前是否处于编辑模式 */
const isEditing = computed(() => editingId.value !== null)

/** 清空表单，回到新增模式 */
function resetForm() {
  Object.assign(form, emptyForm())
  editingId.value = null
  error.value = ''
}

/** 载入某篇文章开始编辑 */
function startEdit(article) {
  editingId.value = article.id
  Object.assign(form, {
    title: article.title,
    category: article.category,
    summary: article.summary,
    content: article.content,
    tags: article.tags.join('、'),
    status: article.status
  })
  error.value = ''
  tip.value = ''
}

/** 保存：新增或修改，统一走 Store 的 action */
function submit() {
  if (!form.title.trim()) {
    error.value = '文章标题不能为空'
    return
  }
  if (!form.summary.trim()) {
    error.value = '文章摘要不能为空'
    return
  }
  error.value = ''

  const payload = {
    title: form.title.trim(),
    category: form.category.trim() || '未分类',
    summary: form.summary.trim(),
    content: form.content.trim(),
    tags: form.tags.split(/[、,，\s]+/).filter(Boolean),
    status: form.status
  }

  if (isEditing.value) {
    articleStore.updateArticle(editingId.value, payload)
    tip.value = `✓ 已保存文章「${payload.title}」`
  } else {
    articleStore.addArticle(payload)
    tip.value = `✓ 已新增文章「${payload.title}」`
  }

  resetForm()
  setTimeout(() => { tip.value = '' }, 2500)
}

/** 删除（两次点击确认，避免误删） */
function confirmRemove(article) {
  if (pendingDeleteId.value !== article.id) {
    pendingDeleteId.value = article.id
    tip.value = `再次点击「确认删除」删除「${article.title}」`
    return
  }
  articleStore.removeArticle(article.id)
  pendingDeleteId.value = null
  tip.value = `已删除文章「${article.title}」`
  setTimeout(() => { tip.value = '' }, 2500)
}

/** 已发布 / 草稿切换 */
function toggleStatus(article) {
  articleStore.toggleStatus(article.id)
}

/** 恢复初始文章数据 */
function resetAll() {
  articleStore.resetAll()
  tip.value = '已恢复为初始文章数据'
  setTimeout(() => { tip.value = '' }, 2500)
}
</script>

<template>
  <div class="page">

    <!-- 页面头部：显示当前登录用户（来自 auth Store） -->
    <section class="hero">
      <div>
        <h1 class="hero-title">文章管理</h1>
        <p class="hero-sub">
          新增、修改、发布或删除文章，改动会即时同步到文章列表页。
        </p>
      </div>
      <div class="hero-actions">
        <span class="chip ok">已登录：{{ userName }}</span>
        <RouterLink class="mini-btn" :to="{ name: 'articles' }">← 返回文章列表</RouterLink>
      </div>
    </section>

    <!-- 统计：来自 Store 的 getters -->
    <div class="stat-grid">
      <div class="stat-block"><b class="stat-num">{{ total }}</b><span class="stat-label">文章总数</span></div>
      <div class="stat-block"><b class="stat-num">{{ publishedCount }}</b><span class="stat-label">已发布</span></div>
      <div class="stat-block"><b class="stat-num">{{ draftCount }}</b><span class="stat-label">草稿</span></div>
    </div>

    <!-- ============ 新增 / 编辑表单 ============ -->
    <PanelCard :title="isEditing ? `编辑文章 #${editingId}` : '新增文章'">
      <template #extra>
        <span v-if="tip" class="tip">{{ tip }}</span>
      </template>

      <div class="form-grid">
        <div class="field">
          <label>文章标题 <i>*</i></label>
          <input v-model.trim="form.title" type="text" placeholder="请输入文章标题">
        </div>
        <div class="field">
          <label>分类</label>
          <input v-model.trim="form.category" type="text" placeholder="例如：学习笔记">
        </div>
        <div class="field">
          <label>状态</label>
          <select v-model="form.status">
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
          </select>
        </div>
        <div class="field">
          <label>标签（用顿号或逗号分隔）</label>
          <input v-model.trim="form.tags" type="text" placeholder="例如：Pinia、localStorage">
        </div>
        <div class="field full">
          <label>文章摘要 <i>*</i></label>
          <textarea v-model="form.summary" placeholder="一两句话概括文章内容"></textarea>
        </div>
        <div class="field full">
          <label>正文</label>
          <textarea v-model="form.content" placeholder="文章正文内容"></textarea>
        </div>
      </div>

      <p v-if="error" class="error">✕ {{ error }}</p>

      <template #footer>
        <div class="form-actions">
          <button class="mini-btn primary" @click="submit">{{ isEditing ? '保存修改' : '新增文章' }}</button>
          <button class="mini-btn" @click="resetForm">{{ isEditing ? '取消编辑' : '清空表单' }}</button>
          <button class="mini-btn" @click="resetAll">恢复初始数据</button>
        </div>
      </template>
    </PanelCard>

    <!-- ============ 文章列表 ============ -->
    <PanelCard title="文章列表" :level="2">
      <div class="row-list">
        <div v-for="a in articles" :key="a.id" class="row">
          <span class="row-id">#{{ a.id }}</span>
          <div class="row-main">
            <div class="row-title">
              <b>{{ a.title }}</b>
              <span class="status-pill" :class="a.status === 'published' ? 'is-on' : 'is-off'">
                {{ a.status === 'published' ? '已发布' : '草稿' }}
              </span>
            </div>
            <div class="row-meta">
              {{ a.category }} · {{ a.createdAt }} · 阅读 {{ a.views }} · 标签：{{ a.tags.join('、') || '无' }}
            </div>
          </div>
          <div class="row-actions">
            <button class="mini-btn" @click="startEdit(a)">编辑</button>
            <button class="mini-btn" @click="toggleStatus(a)">
              {{ a.status === 'published' ? '转为草稿' : '发布' }}
            </button>
            <button class="mini-btn danger" @click="confirmRemove(a)">
              {{ pendingDeleteId === a.id ? '确认删除' : '删除' }}
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        共 {{ total }} 篇文章 · 修改结果会同步到文章列表页
      </template>
    </PanelCard>
  </div>
</template>

<style scoped>
.form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }

.error { margin-top: 12px; }
.form-actions { display: flex; gap: 10px; flex-wrap: wrap; }

.row-list { display: grid; gap: 10px; }
.row {
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  border: 1px solid var(--border); border-radius: 12px;
  background: var(--bg); padding: 12px 14px;
  transition: border-color .2s;
}
.row:hover { border-color: color-mix(in srgb, var(--primary) 45%, var(--border)); }
.row-id { font-size: 12px; font-weight: 700; color: var(--primary); font-variant-numeric: tabular-nums; }
.row-main { flex: 1; min-width: 220px; display: grid; gap: 4px; }
.row-title { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 14px; color: var(--text); }
.row-meta { font-size: 12px; color: var(--muted); }
.row-actions { display: flex; gap: 8px; flex-wrap: wrap; }
</style>
