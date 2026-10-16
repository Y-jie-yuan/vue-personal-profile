/**
 * 项目展示页面 · 数据源模块
 * ------------------------------------------------------------------
 * 实验二第二次实验要求「使用数组保存项目名称、简介、状态等信息」，
 * 这里把数据单独抽成一个模块：
 *   1. 页面组件只负责渲染与交互，不掺杂数据定义，职责更清晰；
 *   2. 以后换成接口请求时，只要改这一个文件，页面组件不用动。
 *
 * 单个项目对象的字段约定：
 *   id        唯一标识，v-for 的 :key 与选中判断使用
 *   name      项目名称
 *   desc      一句话简介
 *   statusKey 状态标识：doing / done / todo，用于筛选与样式
 *   tags      分类标签数组
 *   stack     用到的技术栈数组
 *   progress  完成进度 0-100
 *   period    起止时间
 *   role      承担角色
 *   highlight 项目亮点数组（详情里展示）
 *   repo      源码地址
 *   demo      演示地址
 *   featured  是否为精选项目（页面里会额外做视觉强调）
 */

import { reactive } from 'vue'

/** 状态筛选选项：页面顶部按状态切换时使用 */
export const STATUS_OPTIONS = [
  { key: 'all', label: '全部项目' },
  { key: 'doing', label: '进行中' },
  { key: 'done', label: '已完成' },
  { key: 'todo', label: '规划中' }
]

/** 状态标识 → 中文文案（徽章组件与详情共用） */
export const STATUS_TEXT = {
  doing: '进行中',
  done: '已完成',
  todo: '规划中'
}

/**
 * 项目数据。
 * 实验三说明：这里用 reactive() 包成响应式数组 —— 后台管理 /admin 页面会直接
 * 修改其中的项目信息，而项目列表 /projects 与项目详情 /projects/:id 都需要
 * 立即反映修改结果。reactive 让三处共享同一份数据，改一处即可全局更新。
 */
export const PROJECTS = reactive([
  {
    id: 1,
    name: '个人信息主页',
    desc: '把个人主页用 Vue 3 重新实现：组合式 API 组织逻辑，按职责拆分成可复用组件，作为本站的入口页面。',
    statusKey: 'done',
    tags: ['个人主页', '组件化'],
    stack: ['Vue 3', 'Vite', 'CSS 变量'],
    progress: 100,
    period: '2026.09',
    role: '独立开发',
    highlight: [
      'index.html 提供挂载点，main.js 创建并挂载应用，App.vue 作为根组件',
      '按职责拆分为 TheHeader / ProfileCard / SkillPanel / ProfileEditor / TheFooter',
      'defineProps 传数据、defineEmits 报事件、defineModel 做双向绑定'
    ],
    repo: 'https://cn.vuejs.org/',
    demo: 'https://cn.vuejs.org/',
    featured: true
  },
  {
    id: 2,
    name: '校园二手书交易平台',
    desc: '面向本校学生的二手教材流转工具，支持按学院、课程检索书籍，并发布求购与转让信息。',
    statusKey: 'doing',
    tags: ['课程设计', '全栈'],
    stack: ['Vue 3', 'Vite', 'Express', 'MySQL'],
    progress: 65,
    period: '2026.09 - 至今',
    role: '前端开发',
    highlight: [
      '书籍列表用数组驱动渲染，搜索与分类筛选放在前端完成',
      '列表项抽成可复用卡片组件，用作用域插槽把当前书籍数据交回父组件渲染',
      '表单校验与图片上传进度条抽成公共组件复用'
    ],
    repo: 'https://github.com/',
    demo: '',
    featured: true
  },
  {
    id: 3,
    name: 'Vue 指令练习合集',
    desc: '把课堂上 v-bind、v-on、v-model 与内置指令的案例整理成一个小型案例库，方便随时回看。',
    statusKey: 'done',
    tags: ['课堂练习', '基础'],
    stack: ['Vue 3', 'HTML', 'CSS'],
    progress: 100,
    period: '2026.08',
    role: '独立开发',
    highlight: [
      '设备状态面板：用 v-bind 绑定 class 与 style',
      '课堂答题计分器：用 v-on 处理事件并更新状态',
      '社团活动报名表：用 v-model 完成表单双向绑定'
    ],
    repo: 'https://github.com/',
    demo: '',
    featured: false
  },
  {
    id: 4,
    name: '班级考勤签到大屏',
    desc: '把每天的考勤结果做成一块可视化大屏，用颜色区分出勤状态，方便班委快速核对。',
    statusKey: 'todo',
    tags: ['课程设计', '数据可视化'],
    stack: ['Vue 3', 'ECharts'],
    progress: 15,
    period: '计划 2026.10',
    role: '待组队',
    highlight: [
      '用数组保存考勤记录，再按状态分组统计',
      '图表区域计划抽成可复用组件，标题区与操作区用具名插槽定制',
      '后期接入班级共享表格作为数据源'
    ],
    repo: '',
    demo: '',
    featured: false
  },
  {
    id: 5,
    name: '天气数据可视化看板',
    desc: '读取公开天气接口，把未来几天的温度与降水情况用折线、柱状图展示出来。',
    statusKey: 'doing',
    tags: ['个人练习', '数据可视化'],
    stack: ['Vue 3', 'Axios', 'ECharts'],
    progress: 45,
    period: '2026.09 - 至今',
    role: '独立开发',
    highlight: [
      '接口数据统一在根组件里请求，再通过 props 分发给各个图表子组件',
      '城市切换用 defineModel 与父组件双向同步',
      '加载中与空数据状态用插槽定制，避免在每个图表里重复写结构'
    ],
    repo: 'https://github.com/',
    demo: '',
    featured: false
  },
  {
    id: 6,
    name: '个人技术博客',
    desc: '用来沉淀前端学习笔记的静态博客，计划用 Markdown 写文章，构建后直接部署。',
    statusKey: 'todo',
    tags: ['个人练习', '内容创作'],
    stack: ['Vue 3', 'VitePress'],
    progress: 10,
    period: '计划 2026.11',
    role: '独立开发',
    highlight: [
      '文章列表用数组保存元信息，列表卡片做成可复用组件',
      '侧边目录与文章头部计划用插槽定制',
      '搜索采用本地索引，不依赖后端'
    ],
    repo: '',
    demo: '',
    featured: false
  }
])

/**
 * 按 id 查找项目（项目详情页使用）。
 * 注意：路由参数是字符串，这里统一转成数字再比较，
 * 查不到时返回 undefined，由详情页负责处理「无效详情地址」。
 */
export function findProject(id) {
  return PROJECTS.find(p => p.id === Number(id))
}
