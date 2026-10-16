/**
 * 个人资料 Store（实验四：由实验三的模块级 ref 改造为 Pinia Store）
 * ------------------------------------------------------------------
 * 个人资料被两个路由共用：个人主页 /home 负责展示，后台管理 /admin 负责修改。
 * 实验三用模块级 ref 共享，实验四改造成标准 Pinia Store：
 *
 *   state    profile（页面上展示的资料）/ form（编辑表单的临时副本）/ savedTip（提示）
 *   getters  displayName / avatarText —— 由 state 派生
 *   actions  loadForm / saveProfile / resetForm
 *
 * 持久化（实验要求）：state 初始化时用 JSON.parse 从 localStorage 读取已保存资料；
 * saveProfile 用 JSON.stringify 写回，刷新后个人主页仍显示修改后的内容。
 */
import { defineStore } from 'pinia'
import { INITIAL_PROFILE } from '../data/profile.js'

/** localStorage 存储键 */
const STORAGE_KEY = 'vue-site-profile'

/** 深拷贝小工具：隔离「原始数据 / 表单数据」，避免互相污染 */
const clone = obj => JSON.parse(JSON.stringify(obj))

/** 从 localStorage 读取已保存的资料（没有则用初始资料） */
function loadProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (err) {
    console.warn('[个人资料] 读取 localStorage 失败：', err)
  }
  return clone(INITIAL_PROFILE)
}

export const useProfileStore = defineStore('profile', {
  state: () => ({
    /** 页面上真正展示的资料（已保存） */
    profile: loadProfile(),
    /** 编辑表单的临时副本（未保存，与 ProfileEditor 组件 v-model:form 双向绑定） */
    form: clone(INITIAL_PROFILE),
    /** 保存后的提示文字 */
    savedTip: ''
  }),

  getters: {
    /** 展示用姓名 */
    displayName: (state) => state.profile.name,
    /** 头像占位文字：取姓名第一个字 */
    avatarText: (state) => (state.profile.name ? state.profile.name.charAt(0) : '?')
  },

  actions: {
    /** 把当前资料复制到表单（进入后台管理时调用，避免直接改原数据） */
    loadForm() {
      this.form = clone(this.profile)
      this.savedTip = ''
    },

    /** 保存修改：把表单数据写回 profile 并同步到 localStorage */
    saveProfile() {
      this.profile = clone(this.form)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile))
      this.savedTip = '✓ 已保存，个人主页视图已同步更新'
      console.log('[Pinia] 个人信息已更新：', this.profile)
      setTimeout(() => { this.savedTip = '' }, 2500)
    },

    /** 恢复初始数据（只重置表单，点「保存修改」后生效） */
    resetForm() {
      this.form = clone(INITIAL_PROFILE)
      this.savedTip = '已恢复为初始数据，点击「保存修改」生效'
      console.log('[Pinia] 表单已重置为初始数据')
    }
  }
})
