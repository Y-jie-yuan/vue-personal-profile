/**
 * 文章数据模块（实验四新增）
 * ------------------------------------------------------------------
 * 「文章列表」与「文章管理」两个页面共用同一份文章数据，因此把它单独抽成
 * 一个模块，作为 Store 中 state 的初始值来源：
 *   1. 页面组件只负责渲染与交互，不掺杂数据定义；
 *   2. localStorage 中没有已保存数据时，用这里的初始数据作为默认值。
 *
 * 单篇文章对象的字段约定：
 *   id        唯一标识
 *   title     标题
 *   summary   摘要
 *   content   正文
 *   category  分类
 *   tags      标签数组
 *   status    published（已发布）/ draft（草稿）
 *   views     阅读量
 *   createdAt 创建日期
 */

/** 初始文章列表 */
export const INITIAL_ARTICLES = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 入门笔记',
    summary: '从 options API 到组合式 API 的思维转变：ref / reactive / computed / watch 的基本用法与适用场景。',
    content: '组合式 API 把「同一个功能的代码」聚合在一起，而不是按 data / methods / computed 分散到多个选项里。'
           + '在 <script setup> 中，ref 用于基本类型、reactive 用于对象；computed 负责派生值，watch 负责副作用。'
           + '把可复用的逻辑抽成组合式函数（useXxx），页面之间就能共享同一套状态与行为。',
    category: '学习笔记',
    tags: ['Vue 3', '组合式 API'],
    status: 'published',
    views: 168,
    createdAt: '2026-09-18'
  },
  {
    id: 2,
    title: '组件通信：props、事件与插槽',
    summary: '父子组件之间如何传数据、报事件，以及用默认插槽、具名插槽、作用域插槽定制界面内容。',
    content: '父组件通过 props 向下传数据，子组件通过 defineEmits 向上报事件，v-model 则把两者合成双向绑定。'
           + '当「界面结构」也需要由使用方决定时，用插槽：默认插槽传主体内容，具名插槽传局部区域，'
           + '作用域插槽把子组件遍历得到的数据交回给父组件渲染。',
    category: '学习笔记',
    tags: ['组件', '插槽'],
    status: 'published',
    views: 132,
    createdAt: '2026-09-24'
  },
  {
    id: 3,
    title: 'Vue Router 路由配置要点整理',
    summary: '基础路由、动态路由、嵌套路由、redirect、meta 与全局前置守卫的配合使用。',
    content: '路由表按页面关系设计：基础路由对应独立页面，动态路由用 :id 之类片段匹配多条地址，'
           + '嵌套路由用 children 组织共享布局的子页面。redirect 完成默认页跳转，'
           + 'meta 用来存放标题与访问权限，beforeEach 在每次跳转前统一更新标题并做访问控制。',
    category: '学习笔记',
    tags: ['Vue Router', '路由'],
    status: 'published',
    views: 96,
    createdAt: '2026-10-05'
  },
  {
    id: 4,
    title: '为什么需要全局状态管理',
    summary: '跨组件、跨页面共享数据时，层层 props 传递会带来什么问题，Pinia 又如何解决。',
    content: '当两个组件分处不同的组件树分支（例如不同路由页面）时，props 传递链路会被打断，'
           + '只能把状态一层层往上提，导致根组件越来越臃肿。'
           + '把这类「谁都需要」的状态集中到 Store：state 存数据、getters 派生计算值、actions 改数据，'
           + '组件按需取用，数据来源唯一、修改入口唯一。',
    category: '学习笔记',
    tags: ['Pinia', '状态管理'],
    status: 'published',
    views: 74,
    createdAt: '2026-10-10'
  },
  {
    id: 5,
    title: '状态持久化：把 Store 存进 localStorage',
    summary: 'Pinia 刷新后会重置为初始值，用 JSON.parse / JSON.stringify 手动实现持久化。',
    content: 'Pinia 本身不提供持久化能力。手动实现的做法是：在 state 初始化时用 JSON.parse 从 localStorage '
           + '读取已保存的值作为默认值；在 actions 修改 state 之后，用 JSON.stringify 同步写回 localStorage。'
           + '这样页面刷新后仍然能恢复到刷新前的状态。',
    category: '实践记录',
    tags: ['Pinia', 'localStorage'],
    status: 'draft',
    views: 21,
    createdAt: '2026-10-12'
  }
]
