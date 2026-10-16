<!-- ============================================================
     关于页 AboutView（路由 /about）
     ------------------------------------------------------------
     一个普通的基础路由页面：介绍个人联系方式，并列出本站用到的技术。
     ============================================================ -->
<script setup>
import { storeToRefs } from 'pinia'
import PanelCard from '../components/PanelCard.vue'
import TagList from '../components/TagList.vue'
import { useProfileStore } from '../stores/profile.js'
import { LINKS } from '../data/profile.js'

/* 个人资料来自 Pinia Store */
const { profile } = storeToRefs(useProfileStore())

/* 本站用到的技术（与 package.json 中的依赖保持一致） */
const TECH = ['Vue 3', 'Vue Router', 'Pinia', 'Vite', '组合式 API']
</script>

<template>
  <div class="page">

    <section class="hero">
      <div>
        <h1 class="hero-title">关于</h1>
        <p class="hero-sub">联系方式与本站信息，欢迎交流前端相关的话题。</p>
      </div>
    </section>

    <PanelCard title="个人联系方式">
      <div class="meta-grid">
        <div class="meta-item"><span class="meta-label">姓名</span><b>{{ profile.name }}</b></div>
        <div class="meta-item"><span class="meta-label">学号</span><b>{{ profile.sno }}</b></div>
        <div class="meta-item"><span class="meta-label">专业</span><b>{{ profile.major }}</b></div>
        <div class="meta-item"><span class="meta-label">班级</span><b>{{ profile.className }}</b></div>
        <div class="meta-item"><span class="meta-label">邮箱</span><b>{{ profile.email }}</b></div>
      </div>

      <div class="links">
        <TagList :tags="LINKS.map(l => l.name)" size="md" variant="outline">
          <template #default="{ tag, index }">
            <a class="link-pill" :href="LINKS[index].url" target="_blank" rel="noopener">{{ tag }} ↗</a>
          </template>
        </TagList>
      </div>
    </PanelCard>

    <PanelCard title="本站技术栈">
      <TagList :tags="TECH" size="md" variant="outline" />
      <template #footer>
        页面由 Vue Router 管理，共享状态放在 Pinia，构建工具为 Vite
      </template>
    </PanelCard>
  </div>
</template>

<style scoped>
.links { margin-top: 16px; }
.link-pill {
  display: inline-flex; align-items: center;
  text-decoration: none; color: var(--primary);
  border: 1px dashed var(--primary);
  padding: 5px 12px; border-radius: 999px; font-size: 13px;
  transition: .2s;
}
.link-pill:hover { background: var(--chip); }
</style>
