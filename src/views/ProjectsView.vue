<!-- ============================================================
     项目页 · 父路由布局 ProjectsView（路由 /projects）
     ------------------------------------------------------------
     嵌套路由的父组件：它自己不展示具体的项目内容，只负责
       1. 提供整个项目板块共享的标题与子导航；
       2. 在内部放一个 <RouterView> 作为子路由出口。
     访问 /projects 会重定向到子路由 project-list，
     访问 /projects/:id 则在同一块布局里渲染项目详情。
     ============================================================ -->
<template>
  <div class="page">

    <!-- 板块共享标题 + 子导航 -->
    <section class="hero">
      <div>
        <h1 class="hero-title">项目展示</h1>
        <p class="hero-sub">课程与实践项目的整理归档，包含完成进度、技术栈与阶段成果。</p>
      </div>

      <!-- 子导航：RouterLink 跳转到子路由；当前板块高亮 -->
      <nav class="sub-nav">
        <RouterLink class="sub-link" :to="{ name: 'project-list' }">全部项目</RouterLink>
      </nav>
    </section>

    <!-- 子路由出口：project-list 或 project-detail 渲染在这里 -->
    <RouterView />
  </div>
</template>

<style scoped>
.sub-nav { margin-left: auto; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.sub-link {
  display: inline-flex; align-items: center;
  font-size: 13px; text-decoration: none;
  color: var(--muted);
  border: 1px solid var(--border); background: var(--card);
  padding: 6px 14px; border-radius: 10px;
  transition: .2s;
}
.sub-link:hover { color: var(--primary); border-color: var(--primary); }
/* 子导航高亮：只有正好在项目列表这一条子路由时才强调 */
.sub-link.router-link-exact-active {
  color: var(--primary);
  border-color: color-mix(in srgb, var(--primary) 55%, var(--border));
  background: var(--chip);
  font-weight: 600;
}
</style>
