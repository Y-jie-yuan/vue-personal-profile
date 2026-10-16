/**
 * 主题 Store（实验四：由实验三的模块级 ref 改造为 Pinia Store）
 * ------------------------------------------------------------------
 * 实验三用「模块级 ref」充当极简 store，实验四按实验要求引入 Pinia，
 * 把需要跨组件、跨页面共享的状态统一改造成 Store：
 *
 *   state    theme —— 当前主题（light / dark）
 *   getters  isDark —— 是否暗色主题（由 state 派生，相当于 computed）
 *   actions  setTheme / toggleTheme —— 修改 state 的唯一入口
 *
 * 持久化（实验要求）：Pinia 刷新后会重置为初始值，因此
 *   · state 初始化时用 JSON.parse 从 localStorage 读取已保存的主题作为默认值；
 *   · actions 修改 state 后用 JSON.stringify 同步写回 localStorage。
 */
import { defineStore } from 'pinia'

/** localStorage 存储键 */
const STORAGE_KEY = 'vue-site-theme'

/** 从 localStorage 读取已保存的主题（读取失败时回退到亮色） */
function loadTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch (err) {
    console.warn('[主题] 读取 localStorage 失败：', err)
  }
  return 'light'
}

/** 把主题写到 <html data-theme>，让全局 CSS 变量生效 */
export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: loadTheme()
  }),

  getters: {
    /** 是否处于暗色主题 */
    isDark: (state) => state.theme === 'dark'
  },

  actions: {
    /** 设置主题：更新 state + 应用到页面 + 写入 localStorage */
    setTheme(theme) {
      this.theme = theme
      applyTheme(theme)
      localStorage.setItem(STORAGE_KEY, theme)
      console.log(`[Pinia] 主题已切换为：${theme}`)
    },

    /** 亮色 / 暗色切换 */
    toggleTheme() {
      this.setTheme(this.theme === 'light' ? 'dark' : 'light')
    }
  }
})
