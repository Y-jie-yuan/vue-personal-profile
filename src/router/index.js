/**
 * 路由配置（实验三核心文件）
 * ------------------------------------------------------------------
 * 1. 路由表按页面关系设计，涵盖三类路由：
 *      基础路由：/home、/projects、/about
 *      动态路由：/projects/:id（一条规则匹配任意项目详情）
 *      嵌套路由：/projects 作为父路由，其下挂 list 与 :id 两个子路由
 * 2. 使用「命名路由」（name）组织导航，跳转时只关心名字、不写死路径。
 * 3. 使用 redirect 完成默认页跳转（'/' → '/home'）。
 * 4. 使用 meta 记录每个页面的标题与访问权限，
 *    并在 beforeEach 全局前置守卫里统一更新浏览器标题、拦截未登录访问。
 */
import { createRouter, createWebHistory } from 'vue-router'

// 实验四：守卫里不再直接读模块级 ref，而是在守卫函数「内部」调用 useAuthStore()。
// 只在这里 import 工厂函数，绝不在模块顶层调用它 —— 那时 Pinia 还没初始化。
import { useAuthStore } from '../stores/auth.js'

// 页面组件统一放在 src/views 目录下（与可复用的 src/components 区分开）
import HomeView from '../views/HomeView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ProjectsListView from '../views/ProjectsListView.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import ArticlesView from '../views/ArticlesView.vue'
import ArticleManageView from '../views/ArticleManageView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AdminView from '../views/AdminView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  // 根路径重定向到个人主页（redirect 完成默认页面跳转）
  { path: '/', redirect: { name: 'home' } },

  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { title: '个人主页' }
  },

  // 项目页：父路由只提供共享标题、子导航与 RouterView 出口
  {
    path: '/projects',
    name: 'projects',
    component: ProjectsView,
    meta: { title: '项目展示' },
    // 访问 /projects 时默认展示项目列表（相对重定向到子路由）
    redirect: { name: 'project-list' },
    // 嵌套路由：项目列表与项目详情作为项目页的子路由
    children: [
      {
        path: '',                 // 相对路径为空 → 完整路径 /projects
        name: 'project-list',
        component: ProjectsListView,
        meta: { title: '项目列表' }
      },
      {
        path: ':id',              // 动态路由片段 → 完整路径 /projects/:id
        name: 'project-detail',
        component: ProjectDetailView,
        meta: { title: '项目详情' }
      }
    ]
  },

  // 文章列表：公开页面，任何人可访问
  {
    path: '/articles',
    name: 'articles',
    component: ArticlesView,
    meta: { title: '文章列表' }
  },

  // 文章管理：内容修改入口，标记 requiresAuth，由守卫拦截未登录访问
  {
    path: '/articles/manage',
    name: 'article-manage',
    component: ArticleManageView,
    meta: { title: '文章管理', requiresAuth: true }
  },

  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { title: '关于' }
  },

  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: '身份认证' }
  },

  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    // meta.requiresAuth 标记该页面需要登录后才能访问
    meta: { title: '后台管理', requiresAuth: true }
  },

  // 404 通配符路由：放在最后，匹配所有未定义的地址
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: '页面未找到' }
  }
]

/* 路由实例
   路由模式二选一（实验要求掌握 Hash 与 History 两种）：
     createWebHistory()      —— History 模式，URL 形如 /projects/3（默认采用，需服务端配合）
     createWebHashHistory()  —— Hash 模式，URL 形如 /#/projects/3（无需服务端配置）
   本实验使用 History 模式，如需切换只需替换下面一行。 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 切换路由后回到页面顶部（浏览器前进 / 后退时还原原滚动位置）
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

/* 全局前置守卫 beforeEach（实验四：登录状态改由 Pinia Store 提供）
   1. 更新浏览器标题：读取目标路由 meta.title，实现「标题跟随页面内容变化」
   2. 路由守卫：读取 Store 里的登录状态决定是否放行，结合 meta 灵活控制。
   ⚠️ useAuthStore() 必须写在守卫函数「内部」——在模块顶层调用时 Pinia 尚未初始化。 */
router.beforeEach((to) => {
  const authStore = useAuthStore()

  const baseTitle = 'Personal Profile'
  document.title = to.meta.title ? `${to.meta.title} · ${baseTitle}` : baseTitle

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    console.log(`[路由守卫] 「${to.meta.title}」需要登录，已拦截并跳转登录页`)
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 已经登录时再访问登录页，直接放行到后台管理
  if (to.name === 'login' && authStore.isLoggedIn) {
    return { name: 'admin' }
  }

  return true
})

export default router
