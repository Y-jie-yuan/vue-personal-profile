<!--
  根组件 App.vue
  ------------------------------------------------------------------
  职责只有三件事：
    1. 渲染所有页面共用的外壳：顶部导航 TheHeader、底部信息 TheFooter；
    2. 提供路由出口 <RouterView>，由当前路由决定渲染哪个页面组件；
    3. 应用启动时把持久化的主题同步到页面。
  页面之间共享的数据（主题、登录状态、个人资料、文章）统一交给 src/stores 里的
  Pinia Store 管理，页面各自只持有自己的局部状态。
  另外本文件的样式是全局样式：主题变量与各页面公用的布局 / 组件类都定义在这里。
-->
<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import { useAppStore, applyTheme } from './stores/app.js'
import { useAuthStore } from './stores/auth.js'

const route = useRoute()

/* 全局状态由 Pinia 管理。storeToRefs 只把 state / getters 解构成 ref，
   解构后依然保持响应性；actions 不需要包装，直接从 Store 实例上调用即可。 */
const appStore = useAppStore()
const { theme } = storeToRefs(appStore)
const { isLoggedIn } = storeToRefs(useAuthStore())

onMounted(() => {
  // 主题持久化在 localStorage 里，应用启动时把它同步到 <html data-theme>
  applyTheme(theme.value)
  console.log('[App] 应用加载完成 · 当前路由：', route.name, '｜登录状态：', isLoggedIn.value)
})
</script>

<template>
  <div v-cloak>
    <!-- 顶部导航：RouterLink 跳转与高亮 -->
    <TheHeader />

    <!-- 路由出口：当前匹配到的页面组件渲染在这里（嵌套路由的子出口由项目页自己提供） -->
    <main class="wrap">
      <RouterView v-slot="{ Component }">
        <Transition name="route" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- 底部信息 -->
    <TheFooter />
  </div>
</template>

<style>
  /* ========== 主题变量：亮色 / 暗色 ========== */
  :root {
    --bg:         #f4f6fb;
    --card:       #ffffff;
    --text:       #1f2937;
    --muted:      #6b7280;
    --primary:    #4f46e5;
    --primary-2:  #0ea5e9;
    --border:     #e6eaf2;
    --chip:       #f2f5fa;
    --shadow:     0 1px 2px rgba(15, 23, 42, .04), 0 10px 28px rgba(15, 23, 42, .06);
    --success:    #047857;
    --success-bg: #d1fae5;
    --success-bd: #a7f3d0;
    --danger:     #ef4444;
  }
  html[data-theme="dark"] {
    --bg:         #0b1220;
    --card:       #16203a;
    --text:       #e6ecf7;
    --muted:      #93a2bd;
    --primary:    #818cf8;
    --primary-2:  #38bdf8;
    --border:     #263553;
    --chip:       #1c2946;
    --shadow:     0 1px 2px rgba(0, 0, 0, .25), 0 10px 28px rgba(0, 0, 0, .35);
    --success:    #6ee7b7;
    --success-bg: rgba(52, 211, 153, .14);
    --success-bd: rgba(52, 211, 153, .35);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* 模板编译完成前隐藏，避免闪现 {{ }} 插值 */
  [v-cloak] { display: none; }

  body {
    font-family: "Microsoft YaHei", "PingFang SC", system-ui, -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    padding-bottom: 40px;
    -webkit-font-smoothing: antialiased;
    transition: background .3s, color .3s;
  }

  /* ========== 布局 ========== */
  .wrap { max-width: 980px; margin: 32px auto 0; padding: 0 20px; display: grid; gap: 18px; }

  /* 每个路由页面内部再排一层网格，使多个卡片之间保持一致的间距 */
  .page { display: grid; gap: 18px; }

  /* 卡片容器：子组件共用（全局样式，因为子组件 style 是 scoped） */
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: var(--shadow);
    padding: 24px;
    transition: background .3s, border-color .3s;
  }

  /* ========== 页面头部（各页面共用） ========== */
  .hero {
    display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap;
    padding: 24px 26px;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 7%, var(--card)), var(--card) 62%);
    box-shadow: var(--shadow);
  }
  .hero-title { font-size: 22px; font-weight: 700; margin: 0 0 6px; letter-spacing: .2px; }
  .hero-sub { font-size: 13.5px; color: var(--muted); line-height: 1.75; margin: 0; max-width: 620px; }
  .hero-sub b { color: var(--primary); }
  .hero-sub code {
    background: var(--chip); border: 1px solid var(--border);
    padding: 1px 6px; border-radius: 6px; font-size: 12px; color: var(--primary);
  }
  .hero-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

  /* 小信息胶囊 */
  .chip {
    font-size: 12px; font-weight: 600; color: var(--primary);
    background: var(--chip); border: 1px solid var(--border);
    padding: 4px 12px; border-radius: 999px; white-space: nowrap;
  }
  .chip.ok { color: var(--success); background: var(--success-bg); border-color: var(--success-bd); }

  /* ========== 区块标题 ========== */
  .section-title {
    font-size: 16px; font-weight: 700; color: var(--text);
    margin: 0 0 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-title::before {
    content: ""; width: 4px; height: 16px; border-radius: 2px;
    background: linear-gradient(180deg, var(--primary), var(--primary-2));
  }

  /* ========== 按钮 ========== */
  .btn, .mini-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    white-space: nowrap; text-decoration: none;
    border: 1px solid var(--border); background: var(--card); color: var(--text);
    padding: 8px 15px; border-radius: 10px;
    font-size: 13px; font-family: inherit; cursor: pointer;
    transition: border-color .2s, color .2s, background .2s, transform .2s, opacity .2s;
  }
  .mini-btn { padding: 6px 13px; font-size: 12px; border-radius: 9px; }
  .btn:hover, .mini-btn:hover {
    border-color: color-mix(in srgb, var(--primary) 55%, var(--border));
    color: var(--primary);
    transform: translateY(-1px);
  }
  .btn.primary, .mini-btn.primary {
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    border-color: transparent; color: #fff;
  }
  .btn.primary:hover, .mini-btn.primary:hover { color: #fff; opacity: .92; }
  .mini-btn.danger:hover { border-color: var(--danger); color: var(--danger); }

  /* ========== 统计块 ========== */
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
  .stat-block {
    display: grid; gap: 2px; text-align: left; font-family: inherit;
    padding: 15px 17px;
    border: 1px solid var(--border); border-radius: 14px;
    background: var(--card); box-shadow: var(--shadow);
    transition: border-color .2s, transform .2s, background .2s;
  }
  .stat-num { font-size: 22px; font-weight: 700; color: var(--primary); font-variant-numeric: tabular-nums; }
  .stat-label { font-size: 12px; color: var(--muted); }

  /* ========== 工具栏 / 搜索框 / 下拉 ========== */
  .toolbar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
  .search-box {
    flex: 1; min-width: 220px;
    display: flex; align-items: center; gap: 8px;
    border: 1px solid var(--border); border-radius: 12px;
    padding: 9px 14px; background: var(--bg); transition: .2s;
  }
  .search-box:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 16%, transparent);
  }
  .search-box input {
    flex: 1; border: none; outline: none; background: transparent;
    font-size: 14px; color: var(--text); font-family: inherit;
  }
  .search-box input::placeholder { color: var(--muted); }
  .select {
    border: 1px solid var(--border); background: var(--card); color: var(--text);
    border-radius: 10px; padding: 7px 10px;
    font-size: 12px; font-family: inherit; cursor: pointer;
  }
  .count-chip {
    font-size: 11px; font-weight: 600; color: var(--primary);
    background: var(--chip); border: 1px solid var(--border);
    padding: 1px 8px; border-radius: 999px; font-variant-numeric: tabular-nums;
  }

  /* ========== 状态徽标（已发布 / 草稿） ========== */
  .status-pill {
    font-size: 11px; font-weight: 600; padding: 2px 9px; border-radius: 999px;
    border: 1px solid transparent; white-space: nowrap;
  }
  .status-pill.is-on { color: var(--success); background: var(--success-bg); border-color: var(--success-bd); }
  .status-pill.is-off { color: var(--muted); background: var(--chip); border-color: var(--border); }

  /* ========== 表单 ========== */
  .field { display: grid; gap: 6px; }
  .field.full { grid-column: 1 / -1; }
  .field label { font-size: 12.5px; color: var(--muted); }
  .field label i { color: var(--danger); font-style: normal; }
  .field input, .field textarea, .field select {
    width: 100%; padding: 9px 12px; border-radius: 10px;
    border: 1px solid var(--border); background: var(--bg);
    color: var(--text); font-size: 14px; font-family: inherit; outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .field input:focus, .field textarea:focus, .field select:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 14%, transparent);
  }
  .field textarea { resize: vertical; min-height: 76px; line-height: 1.6; }

  /* ========== 信息网格 ========== */
  .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
  .meta-item {
    display: grid; gap: 4px;
    border: 1px solid var(--border); border-radius: 12px;
    background: var(--bg); padding: 12px 14px;
  }
  .meta-label { font-size: 12px; color: var(--muted); }
  .meta-item b { font-size: 14px; color: var(--text); }

  /* ========== 空状态与提示 ========== */
  .empty-box {
    text-align: center; color: var(--muted); font-size: 14px;
    padding: 32px 0; border: 1px dashed var(--border); border-radius: 12px;
    display: grid; gap: 10px; justify-items: center;
  }
  .empty-box.bare { border: none; padding: 22px 0; }
  .empty-sub { font-size: 12px; margin: 0; }
  .tip { font-size: 12px; font-weight: 600; color: var(--success); }
  .error { font-size: 13px; color: var(--danger); margin: 0; }
  .hint { font-size: 12px; color: var(--muted); }

  /* 路由切换的过渡动画（配合 RouterView 的 v-slot + Transition out-in） */
  .route-enter-active, .route-leave-active { transition: opacity .18s ease, transform .18s ease; }
  .route-enter-from { opacity: 0; transform: translateY(6px); }
  .route-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
