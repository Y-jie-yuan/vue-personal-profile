<!-- ============================================================
     404 页面 NotFoundView（通配符路由 /:pathMatch(.*)*）
     ------------------------------------------------------------
     通配符路由放在路由表最后，匹配所有前面没定义过的地址。
     通过 useRoute() 可以读到用户实际访问的错误地址并提示出来。
     ============================================================ -->
<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/** 编程式导航：返回上一页 */
function goBack() {
  router.go(-1)
}
</script>

<template>
  <div class="page">
    <section class="card nf">
      <div class="nf-code">404</div>
      <h1 class="nf-title">页面走丢了</h1>
      <p class="nf-desc">
        没有找到你要访问的页面，地址
        <code>{{ route.fullPath }}</code>
        可能已被移动或删除。
      </p>

      <div class="nf-actions">
        <RouterLink class="mini-btn primary" :to="{ name: 'home' }">返回个人主页</RouterLink>
        <RouterLink class="mini-btn" :to="{ name: 'project-list' }">去项目列表</RouterLink>
        <button class="mini-btn" @click="goBack">返回上一页</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.nf {
  display: grid; gap: 12px; justify-items: center; text-align: center;
  padding: 56px 24px;
}
.nf-code {
  font-size: 72px; font-weight: 800; line-height: 1;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  letter-spacing: 2px;
}
.nf-title { font-size: 20px; font-weight: 700; margin: 0; }
.nf-desc { font-size: 14px; color: var(--muted); line-height: 1.8; margin: 0; max-width: 560px; }
.nf-desc code {
  background: var(--chip); border: 1px solid var(--border);
  padding: 1px 6px; border-radius: 6px; font-size: 12px; color: var(--primary);
}
.nf-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
</style>
