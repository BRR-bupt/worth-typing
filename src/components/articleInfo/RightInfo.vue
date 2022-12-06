<script setup lang='ts'>
const props = defineProps<{
  translation: string
}>()
</script>

<template>
  <div class="translation">
    <div class="title">
      翻 译
    </div>

    {{ translation }}
  </div>

  <!-- <div class="shangxi">
    {{ translation }}
  </div> -->
</template>

<style scoped>
.translation:hover {
  color: black;
}
.translation {
  padding-top: 10px;
  font-size: 0.85rem;
  color: gray;
  line-height: 1.5rem;
  white-space: pre-wrap;
  font-family: LXGWWenKai;
}
.title {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
</style>
