/**
 * 个人主页 · 基础数据模块（实验三沿用实验二的数据，并抽出为独立模块）
 * ------------------------------------------------------------------
 * 实验三把页面拆成了多个路由组件，个人资料会被「个人主页 /home」与
 * 「后台管理 /admin」两个路由同时使用，因此这里把数据统一抽到模块里：
 *   1. 路由组件只负责展示与交互，不重复定义数据；
 *   2. 以后换成接口请求时，只要改这一个文件。
 */

/** 初始个人资料 */
export const INITIAL_PROFILE = {
  name: '杨结缘',
  avatarUrl: '',            // 留空则用姓名首字生成占位头像
  major: '计算机科学与技术',
  className: '计科2班',
  sno: '249980638',
  email: '1452624751@qq.com',
  intro: '热爱前端开发与交互设计，正在系统学习 Vue 3，喜欢把想法快速做成能跑起来的页面。',
  detail: '目前主要在做三件事：一是把 Vue 3 的组合式 API 用熟，用 ref / reactive / computed / watch ' +
          '组织页面逻辑；二是练组件化，把页面按职责拆成可复用的组件，用 props、事件与各类插槽把「数据」和' +
          '「界面」分开；三是补齐工程能力，包括用 Vue Router 管理页面与导航、用 Pinia 存放跨页面共享的' +
          '状态并做本地持久化。习惯是先把想法做成能跑起来的页面，再回头把它整理成笔记。'
}

/** 技能列表（id / 名称 / 分类 / 掌握程度） */
export const SKILLS = [
  { id: 1, name: 'Vue 3',      tag: '前端框架', level: 82 },
  { id: 2, name: 'JavaScript', tag: '编程语言', level: 78 },
  { id: 3, name: 'HTML / CSS', tag: '页面基础', level: 90 },
  { id: 4, name: 'Git',        tag: '版本控制', level: 70 },
  { id: 5, name: 'UI 设计',    tag: '兴趣爱好', level: 65 },
  { id: 6, name: '篮球',       tag: '运动',     level: 88 },
  { id: 7, name: '摄影',       tag: '兴趣爱好', level: 60 },
  { id: 8, name: 'Node.js',    tag: '后端入门', level: 55 }
]

/** 兴趣爱好 */
export const HOBBIES = ['篮球', '摄影', '音乐', '旅行', '阅读']

/** 社交链接 */
export const LINKS = [
  { id: 1, name: 'GitHub', url: 'https://github.com/' },
  { id: 2, name: '博客',   url: 'https://cn.vuejs.org/' },
  { id: 3, name: '邮箱',   url: 'mailto:1452624751@qq.com' }
]
