<!-- 顶部导航栏组件（实验三：改用命名路由 + RouterLink）
     ------------------------------------------------------------------
     实验二：导航项由父组件 props 传入，点击后 emit('change-page') 通知父组件换页。
     实验三：页面交给路由管理，导航直接用 <RouterLink> 跳转，不再需要手动报事件；
            导航项用「命名路由」组织，跳转只关心 name，不写死路径。

     导航高亮：Vue Router 会自动给处于当前路由的 RouterLink 加上
       router-link-active        —— 当前路径「包含」该链接路径（父级也高亮）
       router-link-exact-active  —— 当前路径与该链接路径「完全相等」
     本组件用 router-link-active 控制标签高亮：
       /projects/3（项目详情）时，父级「项目展示」(/projects) 同样高亮，
       便于用户知道自己在哪个板块；再用 router-link-exact-active 做一层强调。

     props：title 品牌标题 -->
<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app.js'
import { useAuthStore } from '../stores/auth.js'
import { useProfileStore } from '../stores/profile.js'

defineProps({
  title: { type: String, default: 'Personal Profile · Vue 3' }
})

/* 实验四：主题、登录状态、个人资料都改为从 Pinia Store 取用。
   storeToRefs 负责把 state / getters 解构成 ref（保持响应性），
   actions 直接挂在实例上调用，不需要 storeToRefs 包装。 */
const appStore = useAppStore()
const authStore = useAuthStore()
const profileStore = useProfileStore()

const { theme } = storeToRefs(appStore)
const { isLoggedIn } = storeToRefs(authStore)
const { profile } = storeToRefs(profileStore)

/* 导航数据：用命名路由 name 组织，label 用于展示 */
const navItems = [
  { name: 'home', label: '个人主页' },
  { name: 'projects', label: '项目展示' },
  { name: 'articles', label: '文章' },
  { name: 'about', label: '关于' }
]
</script>

<template>
  <header class="navbar">
    <!-- 品牌名回到首页：不参与导航高亮，故清空 active 类名 -->
    <RouterLink class="brand" :to="{ name: 'home' }" active-class="" exact-active-class="">
      {{ title }}
    </RouterLink>

    <!-- 导航标签：命名路由 + 自动高亮 -->
    <nav class="nav-tabs">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        class="tab"
        :to="{ name: item.name }"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="nav-actions">
      <!-- 站点主人标识：每个页面都可见，便于识别页面归属 -->
      <span v-if="profile.name" class="me-chip">{{ profile.name }}</span>
      <!-- 内容修改入口：未登录去身份认证页，已登录进后台管理（与公开浏览区分开） -->
      <RouterLink class="btn" :to="isLoggedIn ? { name: 'admin' } : { name: 'login' }" active-class="">
        {{ isLoggedIn ? '后台管理' : '登录' }}
      </RouterLink>
      <button class="btn" @click="appStore.toggleTheme">
        {{ theme === 'light' ? '🌙 暗色' : '☀️ 亮色' }}
      </button>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky; top: 0; z-index: 20;
  display: flex; align-items: center; gap: 16px;
  padding: 14px 24px;
  background: color-mix(in srgb, var(--card) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}
.brand {
  font-weight: 700; font-size: 17px; letter-spacing: .5px;
  background: linear-gradient(90deg, var(--primary), var(--primary-2));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  white-space: nowrap;
  text-decoration: none;
}

.nav-tabs { display: flex; gap: 4px; }
.tab {
  display: inline-flex; align-items: center;
  white-space: nowrap;
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 13px;
  text-decoration: none;
  transition: .2s;
}
.tab:hover { color: var(--primary); background: var(--chip); }

/* 导航高亮：处于当前路由（含父级路径）时生效 */
.tab.router-link-active {
  color: var(--primary);
  background: var(--chip);
  border-color: color-mix(in srgb, var(--primary) 40%, var(--border));
  font-weight: 600;
}
/* 完全匹配当前路径时再加一层强调（如精确停在 /projects 板块首页时） */
.tab.router-link-exact-active {
  border-color: color-mix(in srgb, var(--primary) 70%, var(--border));
}

.nav-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; }

.me-chip {
  font-size: 12px; font-weight: 600; color: var(--muted);
  background: var(--chip); border: 1px solid var(--border);
  padding: 4px 11px; border-radius: 999px; white-space: nowrap;
}

/* 中等宽度下让导航标签另起一行，避免标签文字被挤成竖排 */
@media (max-width: 860px) {
  .navbar { flex-wrap: wrap; gap: 10px; }
  .nav-tabs { order: 3; width: 100%; }
}
</style>
