<!-- ============================================================
     身份认证页 LoginView（路由 /login）
     ------------------------------------------------------------
     实验要求「内容修改入口应与普通访客浏览功能合理区分」，
     因此后台管理 /admin 被标记 meta.requiresAuth，由全局前置守卫
     beforeEach 拦截：未登录访问 /admin 时会被重定向到本页。

     登录成功后使用 router.replace() 跳转：
       push    会新增一条历史记录，登录页仍留在历史里，按「后退」又能回到登录页；
       replace 直接替换当前历史记录，避免登录页残留在历史栈中 —— 这正是
       实验要求中「验证后进入原目标」应使用 replace 的典型场景。
     ============================================================ -->
<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth.js'

const route = useRoute()
const router = useRouter()

/* 实验四：登录状态与登录动作都由 Pinia 的 auth Store 提供，
   登录成功后由 action 写入 state 并同步到 localStorage（刷新后仍保持登录）。 */
const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)

const username = ref('')
const password = ref('')
const error = ref('')

/** 提交登录（校验逻辑封装在 Store 的 login action 里） */
function handleSubmit() {
  const result = authStore.login(username.value.trim(), password.value)
  if (!result.ok) {
    error.value = result.message
    return
  }

  error.value = ''

  // 若守卫拦截时带了 redirect，登录后回到原目标；否则进入后台管理
  const target = route.query.redirect || { name: 'admin' }
  router.replace(target)
}

/** 取消并返回上一页（编程式导航） */
function goBack() {
  router.go(-1)
}
</script>

<template>
  <div class="page">
    <section class="hero">
      <div>
        <h1 class="hero-title">身份认证</h1>
        <p class="hero-sub">登录后即可进入后台管理，维护个人资料与文章内容。</p>
      </div>
    </section>

    <section class="card login-card">
      <h2 class="section-title">管理员登录</h2>

      <div class="form">
        <div class="field">
          <label>用户名</label>
          <input v-model.trim="username" type="text" placeholder="演示账号：admin" @keyup.enter="handleSubmit">
        </div>
        <div class="field">
          <label>密码</label>
          <input v-model="password" type="password" placeholder="演示密码：123456" @keyup.enter="handleSubmit">
        </div>

        <p v-if="error" class="error">✕ {{ error }}</p>

        <div class="actions">
          <button class="btn primary" @click="handleSubmit">登录并进入后台管理</button>
          <button class="btn" @click="goBack">返回上一页</button>
        </div>
      </div>

      <p class="hint">演示账号：admin ／ 123456（仅用于本地演示）</p>
    </section>
  </div>
</template>

<style scoped>
.login-card { max-width: 520px; }

.form { display: grid; gap: 14px; }
.actions { display: flex; gap: 10px; flex-wrap: wrap; }
.hint { margin-top: 16px; line-height: 1.7; }
</style>
