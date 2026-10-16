/**
 * 文章 Store（实验四新增）
 * ------------------------------------------------------------------
 * 「文章列表 /articles」与「文章管理 /articles/manage」两个路由页面
 * 共用同一份文章数据，且文章管理页需要新增 / 修改 / 删除文章后
 * 列表页立即反映结果 —— 这正是需要跨页面共享的状态，因此建成 Store：
 *
 *   state    articles —— 文章数组
 *   getters  total / publishedCount / draftCount / categories / totalViews
 *            findById(id) —— 都是基于 state 的派生值，具有缓存特性
 *   actions  addArticle / updateArticle / removeArticle / toggleStatus / resetAll
 *            —— 修改 state 的唯一推荐入口
 *
 * 持久化（实验要求）：state 初始化时用 JSON.parse 从 localStorage 读取已保存文章；
 * 每个 action 修改 state 后统一调用 persist() 用 JSON.stringify 写回 localStorage。
 */
import { defineStore } from 'pinia'
import { INITIAL_ARTICLES } from '../data/articles.js'

/** localStorage 存储键 */
const STORAGE_KEY = 'vue-site-articles'

const clone = obj => JSON.parse(JSON.stringify(obj))

/** 从 localStorage 读取已保存的文章（没有则用初始文章） */
function loadArticles() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (err) {
    console.warn('[文章] 读取 localStorage 失败：', err)
  }
  return clone(INITIAL_ARTICLES)
}

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: loadArticles()
  }),

  getters: {
    /** 文章总数 */
    total: (state) => state.articles.length,
    /** 已发布数量 */
    publishedCount: (state) => state.articles.filter(a => a.status === 'published').length,
    /** 草稿数量 */
    draftCount: (state) => state.articles.filter(a => a.status === 'draft').length,
    /** 全部分类（去重） */
    categories: (state) => [...new Set(state.articles.map(a => a.category))],
    /** 总阅读量 */
    totalViews: (state) => state.articles.reduce((sum, a) => sum + a.views, 0),
    /** 按 id 查找文章（找不到返回 undefined） */
    findById: (state) => (id) => state.articles.find(a => a.id === Number(id))
  },

  actions: {
    /** 把当前 state 同步写入 localStorage */
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.articles))
    },

    /** 新增文章（返回新文章 id） */
    addArticle(payload) {
      const maxId = this.articles.length ? Math.max(...this.articles.map(a => a.id)) : 0
      const article = {
        id: maxId + 1,
        views: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        status: 'draft',
        ...payload
      }
      this.articles.unshift(article)
      this.persist()
      console.log('[Pinia] 已新增文章：', article.title)
      return article.id
    },

    /** 修改文章（返回是否修改成功） */
    updateArticle(id, payload) {
      const article = this.findById(id)
      if (!article) return false
      Object.assign(article, payload)
      this.persist()
      console.log('[Pinia] 已更新文章：', article.title)
      return true
    },

    /** 删除文章 */
    removeArticle(id) {
      const article = this.findById(id)
      if (!article) return false
      this.articles = this.articles.filter(a => a.id !== Number(id))
      this.persist()
      console.log('[Pinia] 已删除文章：', article.title)
      return true
    },

    /** 在「已发布 / 草稿」之间切换 */
    toggleStatus(id) {
      const article = this.findById(id)
      if (!article) return false
      article.status = article.status === 'published' ? 'draft' : 'published'
      this.persist()
      return true
    },

    /** 阅读量 +1（文章列表页展开阅读时调用） */
    increaseViews(id) {
      const article = this.findById(id)
      if (!article) return false
      article.views += 1
      this.persist()
      return true
    },

    /** 恢复初始文章数据 */
    resetAll() {
      this.articles = clone(INITIAL_ARTICLES)
      this.persist()
      console.log('[Pinia] 文章数据已恢复为初始值')
    }
  }
})
