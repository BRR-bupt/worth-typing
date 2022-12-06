<script setup lang='ts'>
import TypewritingInfo from '~/components/TypewritingInfo.vue'
import { ArticleTypeWriting } from '~/models'
import type { IInputVModel } from '~/composables/useInputVmodel'
import { useInputVModel } from '~/composables/useInputVmodel'
import type { ContemporaryInfo, GuwenInfo } from '~/models/typewriting/types/dataType'
import LeftInfo from '~/components/articleInfo/LeftInfo.vue'
import RightInfo from '~/components/articleInfo/RightInfo.vue'
import keydownAudioSrc from '~/assets/audio/keydown.mp3'
import keydownAudioSrc2 from '~/assets/audio/keydown_dadada.mp3'
import Confetti from '~/components/Confetti.vue'

const props = defineProps<{
  guwenInfo: GuwenInfo
  contemporary: ContemporaryInfo
  curType: 'guwen' | 'contemporary' | 'enArticle'
  showInfo: boolean
}>()

const emit = defineEmits<{
  (e: 'randomArticle'): void
  (e: 'chooseArticle'): void
}>()

const keydownAudioEl = ref<HTMLAudioElement>()
let typewriting: ArticleTypeWriting
const paras: [number, number][] = []

// 初始化文本参数
if (props.curType === 'guwen') {
  typewriting = new ArticleTypeWriting({ article: props.guwenInfo.content, type: 'guwen' })
  for (let i = 0; i < typewriting.warp.length - 1; i++)
    paras.push([typewriting.warp[i], typewriting.warp[i + 1]])
  paras.push([typewriting.warp[typewriting.warp.length - 1], typewriting.text.value.length])
}
else {
  const para = [...props.contemporary.paragraphs]
  const punctuation = ['，', '。', '？', '！', '；', '…', '—', '：']
  let sentence = ''

  for (let i = 0; i < para.length; i++) {
    if (!punctuation.includes(para[i][para[i].length - 1])) {
      if (i === para.length - 1)
        para[i] += '。'

      else
        para[i] += '，'
    }
    sentence += para[i]
  }
  typewriting = new ArticleTypeWriting({ article: sentence, type: 'contemporary' })
  paras.push([0, typewriting.text.value.length])
}

nextTick(() => {
  insertInputEl()
})

let inputVModel: IInputVModel
/**
 * 在页面插入InputVModel
 */
function insertInputEl() {
  const curTypingPos = document.getElementById('typeit')
  if (!curTypingPos)
    return

  inputVModel = useInputVModel(() => onInput(inputVModel.inputEl))
  curTypingPos.appendChild(inputVModel.inputEl)
  if (typewriting.working.value)
    inputVModel.inputEl.focus()
}
let pre: '“' | '”' = '”'
/**
 * InputVModel输入事件回调
 * @param el HTMLInputElement
 */
function onInput(el: HTMLInputElement) {
  let text = el.value
  if (text === '“”' || text === '“' || text === '”') {
    text = '“'
    if (pre === '“') {
      text = '”'
      pre = '”'
    }
    else {
      pre = '“'
    }
  }

  for (const el of text)
    typewriting.saveTypingValue(el)

  updateInputVM()
}
/**
 * 键盘事件keydown监听
 * @param e KeyboardEvent
 */
function keydownListener(e: KeyboardEvent) {
  if (e.key === 'Backspace') {
    typewriting.deleteTypingValue()
    updateInputVM()
  }
  if (e.key === ' ' && !typewriting.working.value) {
    onStart()
    e.preventDefault()
  }
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
/**
 * 更新InputVM，删除旧的，添加新的
 */
function updateInputVM() {
  inputVModel.remove()
  nextTick(() => {
    insertInputEl()
  })
}
document.addEventListener('keydown', keydownListener)
document.addEventListener('keyup', keyupListener)

onUnmounted(() => {
  document.removeEventListener('keydown', keydownListener)
  document.removeEventListener('keyup', keyupListener)
})

function onStart() {
  typewriting.start()
  inputVModel.inputEl.focus()
}

function onRestart() {
  typewriting.restart()
  updateInputVM()
}

function onResume() {
  typewriting.resume()
  inputVModel.inputEl.focus()
}

function onPause() {
  typewriting.pause()
  inputVModel.inputEl.blur()
}

function clickPause() {
  if (typewriting.working.value)
    onPause()
}

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

defineExpose({
  clickPause,
})
</script>

<template>
  <div class="typewriting-area">
    <!-- 可复用，抽离之 -->
    <TypewritingInfo
      type="zh"
      :working="typewriting.working.value"
      :duration="typewriting.duration.value"
      :prograss="typewriting.prograss.value"
      :wrong-count="typewriting.wrongCount.value"
      :accuracy="typewriting.accuracy.value"
      :speed="typewriting.speed.value"
      @start="onStart"
      @pause="onPause"
      @restart="onRestart"
    />
    <div class="typewriting-main" @click="clickPause()">
      <div v-show="showInfo" class="guwen-info-left">
        <LeftInfo
          v-if="curType === 'guwen'"
          :title="guwenInfo.title"
          :remark="guwenInfo.remark"
          :writer="guwenInfo.writer"
          :type="guwenInfo.type"
          :dynasty="guwenInfo.dynasty"
        />
        <div v-else class="sticked">
          <div style="font-size: 1.75rem; padding-top: 10px;">
            {{ contemporary.title }}
          </div>
          <div style="margin: 1rem 0 2rem 0;">
            当代 · {{ contemporary.author }}
          </div>
          <hr>
        </div>
      </div>

      <div class="typewriting-text">
        <div v-for="(para, j) in paras" :key="j" class="para">
          <div class="text-box" style="visibility: hidden;">
            缩
          </div>
          <div class="text-box" style="visibility: hidden;">
            进
          </div>
          <div v-for="(text, i) in typewriting.text.value.slice(para[0], para[1])" :id="i + para[0] === typewriting.curIndex.value ? 'typeit' : ''" :key="i" class="text-box">
            <div class="cursor" />
            <div v-if="!text.typingValue" class="undetermined">
              {{ text.realValue }}
            </div>
            <div v-else-if="text.realValue === text.typingValue" class="right">
              {{ text.typingValue }}
            </div>
            <div v-else class="wrong">
              <div class="wrong-real">
                {{ text.realValue }}
              </div>
              <div>
                {{ text.typingValue }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="showInfo" class="guwen-info-right">
        <RightInfo
          v-if="curType === 'guwen'"
          :translation="guwenInfo.translation"
        />
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
          {{ guwenInfo.title }}
        </div>

        <div class="writer">
          {{ guwenInfo.dynasty }} · {{ guwenInfo.writer }}
        </div>
        <div class="type">
          <div v-for="(tag, i) in guwenInfo.type" :key="i">
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

<style>
.input-vm {
  position: absolute;
  left: 0;
  bottom: 0;
  opacity: 0;
  height: 0;
  width: 0;
  cursor: default;
}
.input-box {
  text-align: center;
  margin-bottom: 2rem;
}
.typewriting-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
}
.typewriting-main {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 8rem 1rem 8rem;
}
.guwen-info-left {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.guwen-info-right {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.typewriting-text {
  margin: 0 5rem;
  width: 50vw;
  /* display: flex;
  flex-wrap: wrap; */
  font-size: 28px;
  /* row-gap: 2.5rem; */
  height: fit-content;
  padding-top: 10px;
  font-family: var(--font-zh);
}
.para {
  display: flex;
  flex-wrap: wrap;
  row-gap: 2.25rem;
  width: 100%;
  margin-bottom: 3.5rem;
}
.text-box {
  width: 40px;
  text-align: center;
  background-color: antiquewhite;
  position: relative;
}

.typewriting-text .undetermined {
  color: #b7b1b1;
}
.typewriting-text .right {
  color: var(--font-color);
  /* font-weight: bold; */
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
  top: -2rem;
  color: green;
  font-size: 24px;
}
@media(max-width: 1460px) {
  .typewriting-main {
    padding: 0rem 5rem 1rem 5rem;
  }
  .typewriting-text {
    margin: 0 4.5rem;
  }
}
@media(max-width: 1280px) {
  .typewriting-main {
    padding: 0rem 2.5rem 1rem 2.5rem;
  }
  .typewriting-text {
    margin: 0 4rem;
  }
}
.sticked {
  position: sticky;
  overflow-y: hidden;
  top: 9rem;
  z-index: 1;
  background-color: #fcf1e5;
  font-family: FZKai;
}

.summary {
  display: flex;
}
.summary-left {
  flex: 1;
  font-family: FZKai;
  padding-right: 40px;
}
.summary-right {
  flex: 3;
  border-left:1px solid #808080;
  padding-left: 40px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.summary-left .title {
  padding-top: 10px;
  font-size: 2rem;
}
.summary-left .writer {
  margin-top: 1rem;
}
.summary-left .type {
  margin: 2rem 0 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  font-size: 14px;
  font-family: LXGWWenKai;
}
.summary-left .type div {
  border: 1px solid #808080;
  padding: 2px 4px;
  border-radius: 2px;
}

.summary-info-card {
  padding: 10px;
  font-size: 1rem;
  /* background-color: #808080; */
  border: 1px solid #808080;
  border-radius: 0.25rem;
  margin: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.summary-info-card span {
  font-size: 1.25rem;
  font-weight: bold;
}
.dialog-message {
  margin-right: 50px;
  color: #bdbaba;
}
</style>

