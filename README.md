# 个人主页 · Vue 3

一个用 Vue 3 组合式 API 搭建的个人主页 / 作品集站点：个人资料、项目展示、文章笔记，以及一个需要登录的后台管理。

## 技术栈

- **Vue 3** —— `<script setup>` 组合式 API，`ref / reactive / computed / watch`
- **Vue Router** —— 基础路由、动态路由（`/projects/:id`）、嵌套路由、命名路由、`meta` 与全局前置守卫
- **Pinia** —— 跨页面共享状态（主题 / 登录 / 个人资料 / 文章），并用 `localStorage` 做持久化
- **Vite** —— 开发服务器与构建
- **纯 CSS 变量** —— 一套变量同时支撑亮色 / 暗色主题，不依赖 UI 框架

## 页面一览

| 页面 | 路由 | 说明 |
| --- | --- | --- |
| 个人主页 | `/home` | 个人资料卡、技能与兴趣、快捷入口 |
| 项目展示 | `/projects` | 父路由，共享标题 + 子导航 |
| └ 项目列表 | `/projects` | 统计筛选、卡片 / 列表两种视图、技术栈分布 |
| └ 项目详情 | `/projects/:id` | 动态路由，含无效编号的兜底提示 |
| 文章列表 | `/articles` | 搜索、分类与状态筛选、排序、展开正文 |
| 文章管理 | `/articles/manage` | 需登录，文章的增删改与发布切换 |
| 关于 | `/about` | 联系方式与本站技术栈 |
| 身份认证 | `/login` | 演示用登录页，登录后回到原目标 |
| 后台管理 | `/admin` | 需登录，维护个人资料与项目信息 |
| 404 | `/:pathMatch(.*)*` | 通配符路由兜底 |

## 目录结构

```
src/
├── App.vue            根组件：导航 + 路由出口 + 页脚，并存放全局样式与主题变量
├── main.js            创建应用，注册 Pinia 与 Router
├── style.css          全局基础样式
├── components/        可复用组件：ProfileCard / SkillPanel / PanelCard / ProjectCard /
│                      StatusBadge / TagList / DataList / ProgressBar / TheHeader / TheFooter
├── views/             路由页面（每个路由一个组件）
├── router/index.js    路由表、默认页重定向、动态标题与登录守卫
├── stores/            Pinia Store：app（主题）/ auth（登录）/ profile（资料）/ article（文章）
└── data/              初始数据模块：profile / projects / articles
```

## 本地运行

```bash
npm install     # 安装依赖
npm run dev     # 启动开发服务器（默认 http://localhost:5173）
npm run build   # 生产构建，产物在 dist/
npm run preview # 预览构建产物
```

## 演示账号

后台管理与文章管理为演示用登录，校验在前端完成：

```
账号：admin
密码：123456
```

> 真实项目应当改为后端接口校验并下发令牌，而不是把账号密码写在前端。

## 说明

- 数据默认放在 `src/data/`，页面组件只负责渲染与交互；换成接口请求时只需改数据层。
- 主题、登录状态、个人资料与文章都会写入 `localStorage`（键名统一为 `vue-site-*`），刷新后保持不变。
