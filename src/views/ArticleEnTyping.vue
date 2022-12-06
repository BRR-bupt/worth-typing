<script setup lang='ts'>
import KeyboardSpace from '~/components/KeyboardSpace.vue'
import TypewritingInfo from '~/components/TypewritingInfo.vue'
import { ArticleTypeWriting } from '~/models'
import keydownAudioSrc2 from '~/assets/audio/keydown_dadada.mp3'
import type { EnglishArticleInfo } from '~/models/typewriting/types/dataType'

const props = defineProps<{
  enArticleInfo: EnglishArticleInfo
  showInfo: boolean
}>()

const emit = defineEmits<{
  (e: 'randomArticle'): void
  (e: 'chooseArticle'): void
}>()

const paras: [number, number][] = []
const keydownAudioEl = ref<HTMLAudioElement>()
const articleData = props.enArticleInfo.content
const typewriting = new ArticleTypeWriting({ article: articleData, type: 'enArticle' })
console.log(typewriting)

for (let i = 0; i < typewriting.warp.length - 1; i++)
  paras.push([typewriting.warp[i], typewriting.warp[i + 1]])
paras.push([typewriting.warp[typewriting.warp.length - 1], typewriting.text.value.length])
/**
 * 处理键盘press输入
 * @param e KeyboardEvent
 */
function handleKeyPress(e: KeyboardEvent) {
  console.log(e)
  typewriting.saveTypingValue(e.key)
  if (e.key === ' ' && !typewriting.working.value)
    typewriting.start()

  // 键盘输入类，将被取消默认行为，特别用于针对空格
  e.preventDefault()
}

/**
 * 处理keydown的退格
 * @param e KeyboardEvent
 */
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Backspace')
    typewriting.deleteTypingValue()
}

/**
 * 键盘事件keyup监听，处理键盘释放声音
 * @param e KeyboardEvent
 */
function keyupListener(e: KeyboardEvent) {
  if (window.localStorage.getItem('sound') !== '1')
    return

  if (typewriting.working.value && keydownAudioEl.value) {
    keydownAudioEl.value.currentTime = 0
    keydownAudioEl.value.play()
  }
}
document.addEventListener('keypress', handleKeyPress)
document.addEventListener('keydown', handleKeyDown)
document.addEventListener('keyup', keyupListener)

onUnmounted(() => {
  document.removeEventListener('keypress', handleKeyPress)
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', keyupListener)
})

function clickPause() {
  typewriting.pause()
}

defineExpose({
  clickPause,
})

const endDialog = ref(false)
const endSummary = ref(false)
watch(typewriting.prograss, () => {
  if (typewriting.prograss.value === 100) {
    endSummary.value = true
    endDialog.value = true
    nextTick(() => {
      endSummary.value = false
    })
  }
})

const summaryInfo = ref([
  {
    prop: '总字符数',
    value: typewriting.text.value.length,
    unit: '个',
  },
  {
    prop: '用时',
    value: typewriting.duration,
    unit: '秒',
  },
  {
    prop: '速度',
    value: typewriting.speed,
    unit: '字符/分钟',
  },
  {
    prop: '正确率',
    value: typewriting.accuracy,
    unit: '%',
  },
])

function chooseArticle() {
  endDialog.value = false
  nextTick(() => {
    emit('chooseArticle')
  })
}

function randomArticle() {
  endDialog.value = false
  nextTick(() => {
    emit('randomArticle')
  })
}
</script>

<template>
  <div class="typewriting-area">
    <TypewritingInfo
      type="en"
      :working="typewriting.working.value"
      :duration="typewriting.duration.value"
      :prograss="typewriting.prograss.value"
      :wrong-count="typewriting.wrongCount.value"
      :accuracy="typewriting.accuracy.value"
      :speed="typewriting.speed.value"
      @start="typewriting.start()"
      @pause="typewriting.pause()"
      @restart="typewriting.restart()"
    />
    <div class="typewriting-main" @click="clickPause">
      <div v-show="showInfo" class="guwen-info-left">
        <div class="sticked2">
          <div class="title">
            {{ enArticleInfo.title }}
          </div>
          <div class="writer">
            {{ enArticleInfo.writer }}
          </div>
          <div class="type">
            <div v-for="(tag, i) in enArticleInfo.type" :key="i">
              {{ tag }}
            </div>
          </div>
          <hr>
        </div>
      </div>
      <div class="typewriting-text">
        <div v-for="(para, j) in paras" :key="j" class="para">
          <div v-for="(text, i) in typewriting.text.value.slice(para[0], para[1])" :id="i + para[0] === typewriting.curIndex.value ? 'typeit' : ''" :key="i" class="text-box">
            <div class="cursor" />
            <div v-if="!text.typingValue" class="undetermined">
              <KeyboardSpace :nocolor="true" :character="text.realValue" />
            </div>
            <div v-else-if="text.realValue === text.typingValue" class="right">
              <KeyboardSpace :nocolor="true" :character="text.typingValue" />
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

      <div v-show="showInfo" class="guwen-info-right">
        <div class="translation">
          <div class="fanyi">
            翻 译
          </div>
          {{ enArticleInfo.translation }}
        </div>
      </div>
    </div>
  </div>

  <Confetti :passed="endSummary" />

  <el-dialog
    v-model="endDialog"
    title="打字统计"
    width="60%"
    :open-delay="300"
  >
    <div class="summary">
      <div class="summary-left">
        <div class="title">
          {{ enArticleInfo.title }}
        </div>

        <div class="writer">
          {{ enArticleInfo.writer }}
        </div>
        <div class="type">
          <div v-for="(tag, i) in enArticleInfo.type" :key="i">
            {{ tag }}
          </div>
        </div>
      </div>
      <div class="summary-right">
        <div v-for="(item, i) in summaryInfo" :key="i" class="summary-info-card">
          <div>{{ item.prop }}</div>
          <div><span>{{ item.value }}</span> {{ item.unit }}</div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-message">点击按钮可继续下一篇或返回</span>
      <span class="dialog-footer">
        <el-button type="primary" @click="chooseArticle">
          选择文章
        </el-button>
        <el-button type="primary" @click="randomArticle">
          随机一篇
        </el-button>
        <el-button @click="endDialog = false">返回</el-button>
      </span>
    </template>
  </el-dialog>

  <audio ref="keydownAudioEl" :src="keydownAudioSrc2" />
</template>

<style scoped>
.typewriting-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
}
.typewriting-text {
  width: 60vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  font-size: 1.75rem;
  row-gap: 2rem;
  font-family: var(--font-en);
}
.typewriting-main {
  width: 100%;
  display: flex;
  justify-content: center;
}
.para {
  display: flex;
  flex-wrap: wrap;
  row-gap: 2.25rem;
  width: 100%;
  margin-bottom: 3rem;
}
.text-box {
  width: fit-content;
  position: relative;
  text-align: center;
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
  top: -2.25rem;
  color: green;
  font-size: 1.25rem;
}

.translation {
  font-size: 0.85rem;
  color: gray;
  line-height: 1.5rem;
  white-space: pre-wrap;
}
.translation:hover {
  color: black;
}
.translation .fanyi {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  margin-top: 10px;
}
.title {
  font-size: 1.5rem;
  word-break: break-word;
  padding-top: 10px;
}
.writer {
  /* color: gray; */
  margin-top: 1rem;
}
.type {
  margin: 2rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-family: Microsoft YaHei;
}
.type div {
  border: 1px solid #808080;
  padding: 2px 4px;
  border-radius: 2px;
}

.sticked2 {
  position: sticky;
  overflow-y: hidden;
  top: 9rem;
  z-index: 1;
  background-color: #fcf1e5;
}

.summary-left {
  font-family: Microsoft YaHei;
}
</style>

