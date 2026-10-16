<!-- ============================================================
     个人主页 HomeView（路由 /home）
     ------------------------------------------------------------
     用到的路由知识：
       RouterLink   —— 页面跳转（快捷入口）
       useRouter()  —— 编程式导航（内容管理入口）
     ============================================================ -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import ProfileCard from '../components/ProfileCard.vue'
import SkillPanel from '../components/SkillPanel.vue'
import { SKILLS, HOBBIES, LINKS } from '../data/profile.js'
import { useProfileStore } from '../stores/profile.js'

const router = useRouter()

/* 个人资料来自 Pinia Store；storeToRefs 解构后仍保持响应性 */
const { profile } = storeToRefs(useProfileStore())

/* 页面内部状态：只在本页面使用，不需要跨路由共享，直接写在这里 */
const showDetail = ref(false)
const keyword = ref('')

/* 技能 / 兴趣 / 链接数据来自公共数据模块 */
const skills = SKILLS
const hobbies = HOBBIES
const links = LINKS

/** 详情展开 / 收起（ProfileCard 已用 defineModel 同步状态，这里只做记录） */
function handleToggleDetail(val) {
  console.log('[emits] ProfileCard 报告 toggle-detail，当前展开状态：', val)
}

/** 编程式导航：进入后台管理（受路由守卫保护） */
function goAdmin() {
  router.push({ name: 'admin' })
}
</script>

<template>
  <div class="page">

    <!-- 页面头部 -->
    <section class="hero">
      <div>
        <h1 class="hero-title">个人主页</h1>
        <p class="hero-sub">
          前端学习与实践的一站式主页 —— 记录正在做的项目、写下的笔记，
          以及一点点积累起来的技能。
        </p>
      </div>
    </section>

    <!-- 个人基本信息（props 传数据 + defineModel 双向同步 showDetail） -->
    <ProfileCard
      v-model:show-detail="showDetail"
      :profile="profile"
      :links="links"
      @toggle-detail="handleToggleDetail"
    />

    <!-- 技能与兴趣（props 传数据 + defineModel 双向绑定 keyword） -->
    <SkillPanel
      v-model:keyword="keyword"
      :skills="skills"
      :hobbies="hobbies"
    />

    <!-- 快捷入口：RouterLink（声明式）与 useRouter（编程式）各演示一处 -->
    <section class="card">
      <h2 class="section-title">快捷入口</h2>
      <div class="quick-actions">
        <RouterLink class="btn" :to="{ name: 'project-list' }">浏览项目 →</RouterLink>
        <RouterLink class="btn" :to="{ name: 'articles' }">阅读文章 →</RouterLink>
        <RouterLink class="btn" :to="{ name: 'about' }">关于我 →</RouterLink>
        <button class="btn" @click="goAdmin">内容管理</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.quick-actions { display: flex; gap: 10px; flex-wrap: wrap; }
</style>
