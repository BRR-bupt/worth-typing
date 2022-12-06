<script setup lang='ts'>
import { MdiKeyboardSpace } from './icons'
defineProps<{
  character: string
  nocolor?: boolean
}>()
</script>

<template>
  <MdiKeyboardSpace v-if="character === ' '" :class="nocolor ? 'space' : 'icon'" />

  <div v-else>
    {{ character }}
  </div>
</template>

<style scoped>
.space {
  color: antiquewhite;
  font-size: 0.75rem;
}
.icon {
  font-size: 1rem;
}
</style>

