<script setup lang='ts'>
import { CarbonCloseOutline, CarbonInProgress, CarbonTimer, MdiSpeedometer, MdiTarget } from './icons'
const props = defineProps<{
  type: 'en' | 'zh'
  working: boolean
  duration: number
  prograss: number
  wrongCount: number
  accuracy: number
  speed: number
}>()
const emit = defineEmits<{
  (e: 'start'): void
  (e: 'pause'): void
  (e: 'restart'): void
}>()
const vmWorking = ref(props.working)
watch(vmWorking, () => {
  if (vmWorking.value && !props.working)
    emit('start')

  else if (!vmWorking.value && props.working)
    emit('pause')
})
watch(() => props.working, () => {
  if (vmWorking.value && !props.working)
    vmWorking.value = false

  else if (!vmWorking.value && props.working)
    vmWorking.value = true
})
</script>

<template>
  <div class="typewriting-info">
    <div>
      <!-- <div class="status" :class="working ? 'working' : 'waiting'" /> -->
      <el-switch
        v-model="vmWorking"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #8f8989"
        size="large"
        active-text="运行"
        inactive-text="预备"
      />
    </div>

    <el-tooltip content="时间" placement="bottom" effect="light">
      <div>
        <CarbonTimer style="font-size: 1.25rem" />
        {{ duration }} s
      </div>
    </el-tooltip>

    <el-tooltip content="进度" placement="bottom" effect="light">
      <div>
        <CarbonInProgress />
        {{ prograss }} %
      </div>
    </el-tooltip>

    <el-tooltip content="错误数" placement="bottom" effect="light">
      <div>
        <CarbonCloseOutline style="color: red;" />
        {{ wrongCount }} 个
      </div>
    </el-tooltip>

    <el-tooltip content="正确率" placement="bottom" effect="light">
      <div>
        <MdiTarget />
        {{ accuracy }} %
      </div>
    </el-tooltip>

    <el-tooltip content="速度" placement="bottom" effect="light">
      <div>
        <MdiSpeedometer />
        <span v-if="type === 'zh'">{{ speed }} 字符（中）/分钟</span>
        <span v-else>{{ speed }} 字符（英）/分钟</span>
      </div>
    </el-tooltip>

    <div>
      <div class="restart" @click="emit('restart')">
        重来
      </div>
    </div>
  </div>
</template>

<style scoped>
.typewriting-info {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  height: 5rem;
  gap: 3rem;
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;
  z-index: 100;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: rgb(252, 241, 229, 0.86);
  cursor: default;
  box-shadow: 0 2px 4px rgb(0 0 0 / 8%);
}
.typewriting-info div {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status.working {
  background-color: rgb(74, 222, 74);
}

.status.waiting {
  background-color: #8f8989;
}

.restart {
  padding: 0.35rem 0.75rem;
  /* border: 1px solid; */
  border-radius: 0.35rem;
  cursor: pointer;
  color: rgb(54, 53, 53);
  background-color: rgba(240, 221, 195, 0.6);
}
.restart:hover {
 background-color: rgba(240, 221, 195, 0.3);
}
</style>
