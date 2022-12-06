<script setup lang='ts'>
const props = defineProps<{
  title: string
  writer: string
  type: string[]
  remark: string
  dynasty: string
}>()
</script>

<template>
  <div class="sticked">
    <div class="title">
      {{ title }}
    </div>

    <div class="writer">
      {{ dynasty }} · {{ writer }}
    </div>
    <div class="type">
      <div v-for="(tag, i) in type" :key="i">
        {{ tag }}
      </div>
    </div>
    <div style="padding: 1rem 0;">
      <hr>
    </div>
  </div>
  <div class="remark">
    {{ remark }}
  </div>
</template>

<style scoped>
.sticked {
  position: sticky;
  overflow-y: hidden;
  top: 9rem;
  z-index: 1;
  background-color: #fcf1e5;
  font-family: FZKai;
}
.title {
  padding-top: 10px;
  font-size: 2rem;
}
.writer {
  margin-top: 1rem;
}
.type {
  margin: 2rem 0 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  font-size: 14px;
  font-family: LXGWWenKai;
}
.type div {
  border: 1px solid #808080;
  padding: 2px 4px;
  border-radius: 2px;
}
.remark {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #808080;
  white-space: pre-wrap;
  line-height: 1.5rem;
  font-family: LXGWWenKai;
}
.remark:hover {
  color: black;
}
</style>
