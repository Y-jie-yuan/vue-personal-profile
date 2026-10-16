<!-- ============================================================
     文章列表 ArticlesView（路由 /articles，公开页面）
     ------------------------------------------------------------
     实验四新增页面。文章数据来自 Pinia 的 article Store：
       · 列表、统计数字都取自 Store 的 state / getters；
       · 展开阅读时调用 Store 的 increaseViews action，阅读量会在
         「文章管理」页同步变化 —— 这正是跨页面共享状态的体现。

     解构注意（实验要点）：直接解构 Store 实例会丢失响应性，
     所以 state / getters 一律用 storeToRefs 解构；actions 不需要包装。
     ============================================================ -->
<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useArticleStore } from '../stores/article.js'
import PanelCard from '../components/PanelCard.vue'
import TagList from '../components/TagList.vue'

const articleStore = useArticleStore()

/* storeToRefs：把 state 与 getters 解构成 ref，解构后仍保持响应性 */
const { articles, total, publishedCount, draftCount, totalViews, categories } = storeToRefs(articleStore)

/* 搜索、筛选、排序只在本页面用得到，属于组件内部状态，不必放进 Store */
const keyword = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')
const sortKey = ref('default')
const openedId = ref(null)

/** 过滤 + 排序后的文章列表（基于 Store 派生的展示用数据） */
const filteredArticles = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  let list = articles.value.filter(a => {
    if (categoryFilter.value !== 'all' && a.category !== categoryFilter.value) return false
    if (statusFilter.value !== 'all' && a.status !== statusFilter.value) return false
    if (!kw) return true
    return a.title.toLowerCase().includes(kw)
      || a.summary.toLowerCase().includes(kw)
      || a.tags.some(t => t.toLowerCase().includes(kw))
  })

  if (sortKey.value === 'views') list = [...list].sort((a, b) => b.views - a.views)
  else if (sortKey.value === 'title') list = [...list].sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'))
  else if (sortKey.value === 'date') list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return list
})

/** 是否有筛选条件生效 */
const hasFilter = computed(
  () => keyword.value.trim() !== '' || categoryFilter.value !== 'all' || statusFilter.value !== 'all'
)

/** 展开 / 收起正文；首次展开时调用 action 让阅读量 +1（会同步写入 localStorage） */
function toggleRead(article) {
  if (openedId.value === article.id) {
    openedId.value = null
    return
  }
  openedId.value = article.id
  articleStore.increaseViews(article.id)
}

/** 重置筛选条件 */
function resetFilter() {
  keyword.value = ''
  categoryFilter.value = 'all'
  statusFilter.value = 'all'
  sortKey.value = 'default'
}
</script>

<template>
  <div class="page">

    <!-- 页面头部 -->
    <section class="hero">
      <div>
        <h1 class="hero-title">文章列表</h1>
        <p class="hero-sub">
          记录前端学习过程中的笔记与实践总结，支持按关键词、分类与状态筛选。
        </p>
      </div>
      <RouterLink class="manage-btn" :to="{ name: 'article-manage' }">文章管理 →</RouterLink>
    </section>

    <!-- 统计概览：数字全部来自 Store 的 getters -->
    <div class="stat-grid">
      <div class="stat-block">
        <b class="stat-num">{{ total }}</b>
        <span class="stat-label">文章总数</span>
      </div>
      <div class="stat-block">
        <b class="stat-num">{{ publishedCount }}</b>
        <span class="stat-label">已发布</span>
      </div>
      <div class="stat-block">
        <b class="stat-num">{{ draftCount }}</b>
        <span class="stat-label">草稿</span>
      </div>
      <div class="stat-block">
        <b class="stat-num">{{ totalViews }}</b>
        <span class="stat-label">总阅读量</span>
      </div>
    </div>

    <PanelCard>
      <template #title>
        全部文章
        <span class="count-chip">{{ filteredArticles.length }} / {{ total }}</span>
      </template>

      <template #extra>
        <select v-model="sortKey" class="select">
          <option value="default">默认排序</option>
          <option value="date">按日期</option>
          <option value="views">按阅读量</option>
          <option value="title">按标题</option>
        </select>
      </template>

      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="search-box">
          <span>🔍</span>
          <input v-model.trim="keyword" type="text" placeholder="搜索标题、摘要或标签，例如：Pinia、路由">
        </div>
        <select v-model="categoryFilter" class="select">
          <option value="all">全部分类</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
        <select v-model="statusFilter" class="select">
          <option value="all">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
        </select>
        <button v-if="hasFilter" class="mini-btn" @click="resetFilter">重置筛选</button>
      </div>

      <!-- 文章列表 -->
      <div class="article-list" v-if="filteredArticles.length">
        <article v-for="a in filteredArticles" :key="a.id" class="article-item">
          <div class="article-head">
            <h3 class="article-title">{{ a.title }}</h3>
            <span class="status-pill" :class="a.status === 'published' ? 'is-on' : 'is-off'">
              {{ a.status === 'published' ? '已发布' : '草稿' }}
            </span>
          </div>

          <div class="article-meta">
            <span class="cat">{{ a.category }}</span>
            <span>{{ a.createdAt }}</span>
            <span>阅读 {{ a.views }}</span>
          </div>

          <p class="article-summary">{{ a.summary }}</p>

          <TagList :tags="a.tags" size="sm" />

          <!-- 展开正文：调用 Store 的 action 记录阅读量 -->
          <div class="article-foot">
            <button class="mini-btn" @click="toggleRead(a)">
              {{ openedId === a.id ? '收起正文 ▲' : '阅读全文 ▼' }}
            </button>
          </div>

          <div v-if="openedId === a.id" class="article-content">{{ a.content }}</div>
        </article>
      </div>

      <div v-else class="empty-box">
        <p>没有符合条件的文章</p>
        <p class="empty-sub">试着换个关键词，或把筛选条件重置</p>
        <button class="mini-btn primary" @click="resetFilter">清空筛选条件</button>
      </div>

      <template #footer>
        共 {{ total }} 篇文章 · 支持按标题、摘要与标签搜索
      </template>
    </PanelCard>
  </div>
</template>

<style scoped>
.manage-btn {
  margin-left: auto; white-space: nowrap; text-decoration: none;
  font-size: 13px; font-weight: 600; color: #fff;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  padding: 8px 16px; border-radius: 10px; transition: .2s;
}
.manage-btn:hover { opacity: .9; transform: translateY(-1px); }

.article-list { display: grid; gap: 12px; }
.article-item {
  border: 1px solid var(--border); border-radius: 12px;
  background: var(--bg); padding: 16px;
  display: grid; gap: 8px; transition: .2s;
}
.article-item:hover { border-color: var(--primary); }
.article-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.article-title { font-size: 15px; font-weight: 700; margin: 0; color: var(--text); }
.article-meta { display: flex; gap: 12px; flex-wrap: wrap; font-size: 12px; color: var(--muted); }
.article-meta .cat { color: var(--primary); font-weight: 600; }
.article-summary { font-size: 13px; line-height: 1.7; color: var(--muted); margin: 0; }
.article-foot { display: flex; gap: 8px; }
.article-content {
  margin-top: 4px; padding: 12px 14px;
  border-left: 3px solid var(--primary);
  background: var(--card); border-radius: 0 10px 10px 0;
  font-size: 13px; line-height: 1.85; color: var(--text);
}
</style>
