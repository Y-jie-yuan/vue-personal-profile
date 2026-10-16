<!-- 个人基本信息卡片组件
     props：profile（个人信息对象）、links（社交链接数组）
     emits：toggle-detail（展开/收起详情）
     defineModel：showDetail（详情展开状态，与父组件双向同步） -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  profile: { type: Object, required: true },
  links: { type: Array, default: () => [] }
})

const emit = defineEmits(['toggle-detail'])

// 详情展开状态与父组件双向同步
const showDetail = defineModel('showDetail', { type: Boolean, default: false })

// 头像占位文字：取姓名第一个字
const avatarText = computed(() => (props.profile.name ? props.profile.name.charAt(0) : '?'))

// 展开 / 收起详情：先算出新状态，写入双向绑定，再把新状态报告给父组件
function toggleDetail() {
  const next = !showDetail.value
  showDetail.value = next
  emit('toggle-detail', next)
}
</script>

<template>
  <section class="card profile">
    <!-- v-bind 绑定头像地址；无地址时用姓名首字占位 -->
    <img v-if="profile.avatarUrl" class="avatar" :src="profile.avatarUrl" :alt="profile.name + '的头像'">
    <div v-else class="avatar-fallback">{{ avatarText }}</div>

    <div class="profile-main">
      <div class="name-line">
        <span class="name">{{ profile.name }}</span>
        <span class="badge">{{ profile.major }}</span>
        <span class="badge">{{ profile.className }}</span>
      </div>

      <div class="meta">
        <div>学号：<b>{{ profile.sno }}</b></div>
        <div>邮箱：<b>{{ profile.email }}</b></div>
      </div>

      <p class="intro">{{ profile.intro }}</p>

      <!-- 详情展开 / 收起：v-if 控制 DOM 是否存在 -->
      <div v-if="showDetail" class="detail">
        <span class="detail-title">详细信息</span>
        {{ profile.detail }}
      </div>

      <div class="profile-foot">
        <button class="btn" @click="toggleDetail">
          {{ showDetail ? '收起详情 ▲' : '展开详情 ▼' }}
        </button>

        <!-- v-for 渲染社交链接数组 -->
        <a v-for="link in links" :key="link.id"
           class="link-pill"
           :href="link.url"
           :title="link.name"
           target="_blank" rel="noopener">
          {{ link.name }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile { display: flex; gap: 22px; align-items: flex-start; }
.avatar {
  width: 104px; height: 104px; flex: 0 0 104px;
  border-radius: 22px; object-fit: cover;
  border: 3px solid var(--card);
  box-shadow: 0 6px 18px rgba(79, 70, 229, .35);
}
.avatar-fallback {
  width: 104px; height: 104px; flex: 0 0 104px;
  border-radius: 22px;
  display: flex; align-items: center; justify-content: center;
  font-size: 42px; font-weight: 700; color: #fff;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  box-shadow: 0 6px 18px rgba(79, 70, 229, .35);
}
.profile-main { flex: 1; min-width: 0; }
.name-line { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.name { font-size: 24px; font-weight: 700; }
.badge {
  font-size: 12px; padding: 3px 10px; border-radius: 999px;
  background: var(--chip); color: var(--muted); border: 1px solid var(--border);
}
.meta { margin-top: 8px; color: var(--muted); font-size: 14px; display: grid; gap: 5px; }
.meta b { color: var(--text); font-weight: 600; }
.intro { margin-top: 12px; font-size: 14px; line-height: 1.75; color: var(--text); }

.detail {
  margin-top: 14px; padding: 14px 16px;
  border-left: 3px solid var(--primary);
  background: var(--chip);
  border-radius: 0 10px 10px 0;
  font-size: 14px; line-height: 1.8; color: var(--muted);
}
.detail-title { color: var(--primary); font-weight: 600; display: block; margin-bottom: 4px; }

.profile-foot { margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.link-pill {
  display: inline-flex; align-items: center; gap: 6px;
  text-decoration: none; color: var(--primary);
  border: 1px dashed var(--border);
  padding: 6px 12px; border-radius: 999px; font-size: 13px;
  transition: .2s;
}
.link-pill:hover { border-style: solid; border-color: var(--primary); background: var(--chip); }
</style>
