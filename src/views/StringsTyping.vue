<script setup lang='ts'>
import KeyboardSpace from '~/components/KeyboardSpace.vue'
import TypewritingInfo from '~/components/TypewritingInfo.vue'
import { StringsTypeWriting } from '~/models'

const typewriting = new StringsTypeWriting({ length: 'long', mixUpperCase: false, customSet: 'dfjk ' })

function handleKeyPress(e: KeyboardEvent) {
  console.log(e)
  typewriting.saveTypingValue(e.key)
  if (e.key === ' ' && !typewriting.working.value)
    typewriting.start()

  // 键盘输入类，将被取消默认行为，特别用于针对空格
  e.preventDefault()
}
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Backspace')
    typewriting.deleteTypingValue()
}
document.addEventListener('keypress', handleKeyPress)
document.addEventListener('keydown', handleKeyDown)

onUnmounted(() => {
  document.removeEventListener('keypress', handleKeyPress)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="typewriting-area">
    <TypewritingInfo
      :working="typewriting.working.value"
      :duration="typewriting.duration.value"
      :prograss="typewriting.prograss.value"
      :wrong-count="typewriting.wrongCount.value"
      :accuracy="typewriting.accuracy.value"
      :speed="typewriting.speed.value"
      type="en"
      @start="typewriting.start()"
      @pause="typewriting.pause()"
      @restart="typewriting.restart()"
    />
    <div class="typewriting-main" @click="typewriting.pause()">
      <div class="typewriting-text">
        <div v-for="(text, i) in typewriting.text.value" :id="i === typewriting.curIndex.value ? 'typeit' : ''" :key="i" class="text-box">
          <div class="cursor" />
          <div v-if="!text.typingValue" class="undetermined">
            <KeyboardSpace :character="text.realValue" />
          </div>
          <div v-else-if="text.realValue === text.typingValue" class="right">
            <KeyboardSpace :character="text.typingValue" />
          </div>
          <div v-else class="wrong">
            <div class="wrong-real">
              <KeyboardSpace :character="text.realValue" />
            </div>
            <div>
              <KeyboardSpace :character="text.typingValue" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.typewriting-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
}
.typewriting-text {
  width: 50vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  font-size: 1.5rem;
  row-gap: 2rem;
}
.typewriting-main {
  width: 100%;
  display: flex;
  justify-content: center;
}
.text-box {
  width: 1.25rem;
  text-align: center;
  position: relative;
  background-color: antiquewhite;
}
.typewriting-text .undetermined {
  color: #b7b1b1;
}
.typewriting-text .right {
  color: green;
}
.typewriting-text .wrong {
  color: red;
  position: relative;
}
.typewriting-text .wrong .wrong-real {
  height: 80%;
  width: 100%;
  text-align: center;
  position: absolute;
  top: -1.75rem;
  color: green;
  font-size: 1.25rem;
}
</style>
