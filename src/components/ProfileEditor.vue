<!-- 编辑个人信息面板组件
     props：visible（是否显示，由父组件控制 v-show）、tip（保存提示文字）
     defineModel：form（编辑表单对象，与父组件双向同步）
     emits：save（保存）、reset（恢复初始数据） -->
<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  tip: { type: String, default: '' }
})

// 编辑表单对象与父组件双向同步
const form = defineModel('form', { type: Object, required: true })

const emit = defineEmits(['save', 'reset'])
</script>

<template>
  <section class="card" v-show="visible">
    <h2 class="section-title">编辑个人信息</h2>

    <div class="form-grid">
      <div class="field">
        <label>姓名</label>
        <input v-model.trim="form.name" type="text">
      </div>
      <div class="field">
        <label>专业</label>
        <input v-model.trim="form.major" type="text">
      </div>
      <div class="field">
        <label>班级</label>
        <input v-model.trim="form.className" type="text">
      </div>
      <div class="field">
        <label>学号</label>
        <input v-model.trim="form.sno" type="text">
      </div>
      <div class="field">
        <label>邮箱</label>
        <input v-model.trim="form.email" type="text">
      </div>
      <div class="field">
        <label>头像图片地址（留空则用姓名首字）</label>
        <input v-model.trim="form.avatarUrl" type="text" placeholder="https://... 或 data:image/...">
      </div>
      <div class="field full">
        <label>个人简介</label>
        <textarea v-model="form.intro"></textarea>
      </div>
      <div class="field full">
        <label>详细信息（点击「展开详情」后显示）</label>
        <textarea v-model="form.detail"></textarea>
      </div>
    </div>

    <div class="profile-foot" style="margin-top:16px">
      <button class="btn primary" @click="emit('save')">保存修改</button>
      <button class="btn" @click="emit('reset')">恢复初始数据</button>
      <span class="hint" v-if="tip">{{ tip }}</span>
    </div>
  </section>
</template>

<style scoped>
.form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
.profile-foot { margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
</style>
