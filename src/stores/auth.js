/**
 * 登录状态 Store（实验四新增）
 * ------------------------------------------------------------------
 * 实验三的登录状态是模块级 ref，且只存在内存中：刷新页面就丢失，
 * 于是访问 /admin 时又被守卫踢回登录页。实验四把它改造成 Pinia Store，
 * 并按实验要求用 localStorage 做持久化，使登录状态在刷新后依然保留。
 *
 *   state    user —— 当前登录用户 { name, role, loginAt }，未登录为 null
 *   getters  isLoggedIn / userName / role
 *   actions  login / logout
 *
 * 与路由守卫的配合（实验要求）：在 beforeEach 守卫函数「内部」调用
 * useAuthStore()，而不是在模块顶层调用，确保 Pinia 已完成初始化。
 */
import { defineStore } from 'pinia'

/** localStorage 存储键 */
const STORAGE_KEY = 'vue-site-auth'

/** 演示账号（真实项目应改为后端接口校验并下发令牌） */
export const DEMO_USER = 'admin'
export const DEMO_PASS = '123456'

/** 从 localStorage 读取已保存的登录用户 */
function loadUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (err) {
    console.warn('[登录] 读取 localStorage 失败：', err)
  }
  return null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: loadUser()
  }),

  getters: {
    /** 是否已登录（守卫与导航入口都依赖它） */
    isLoggedIn: (state) => Boolean(state.user),
    /** 当前登录用户名 */
    userName: (state) => state.user?.name || '',
    /** 当前登录角色 */
    role: (state) => state.user?.role || ''
  },

  actions: {
    /**
     * 登录校验。返回 { ok, message }，由页面决定如何提示。
     * 成功后写入 state 并同步写入 localStorage。
     */
    login(username, password) {
      if (!username || !password) {
        return { ok: false, message: '用户名与密码不能为空' }
      }
      if (username !== DEMO_USER || password !== DEMO_PASS) {
        return { ok: false, message: `用户名或密码错误（演示账号：${DEMO_USER} / ${DEMO_PASS}）` }
      }
      this.user = { name: username, role: '管理员', loginAt: Date.now() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.user))
      console.log('[Pinia] 身份认证通过，已开放内容管理权限：', this.user)
      return { ok: true, message: '登录成功' }
    },

    /** 退出登录：清空 state 并移除 localStorage 中的登录信息 */
    logout() {
      this.user = null
      localStorage.removeItem(STORAGE_KEY)
      console.log('[Pinia] 已退出登录')
    }
  }
})
