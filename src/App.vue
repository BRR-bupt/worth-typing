<script setup lang="ts">
import type { ContemporaryInfo, EnglishArticleInfo, GuwenInfo } from './models/typewriting/types/dataType'
import NavBar from './components/NavBar.vue'
import ArticleZhTyping from '~/views/ArticleZhTyping.vue'
import ArticleEnTyping from '~/views/ArticleEnTyping.vue'
import StringsTyping from '~/views/StringsTyping.vue'
import defaultJson from '~/assets/textdata/article/zh/default.json'
import contemdefaultJson from '~/assets/textdata/article/zh/contemporary/default.json'
import endefault from '~/assets/textdata/article/en/default.json'
onMounted(() => {
  ElNotification({
    title: '开始打字',
    message: '按空格或切换屏幕左侧“预备”开关',
    type: 'info',
    offset: 50,
    position: 'top-right',
    duration: 6000,
  })
})

const fontZh = window.localStorage.getItem('font-zh')
if (fontZh)
  document.body.style.setProperty('--font-zh', fontZh)

const fontEn = window.localStorage.getItem('font-en')
if (fontEn)
  document.body.style.setProperty('--font-en', fontEn)

const fontColor = window.localStorage.getItem('font-color')
if (fontColor)
  document.body.style.setProperty('--font-color', fontColor)

const curType = ref<'guwen' | 'contemporary' | 'enArticle'>('guwen')
const guwenData = ref<GuwenInfo>(defaultJson as GuwenInfo)
const contemData = ref<ContemporaryInfo>(contemdefaultJson as ContemporaryInfo)
const enData = ref<EnglishArticleInfo>(endefault as EnglishArticleInfo)

const refreshed = ref(true)
function updateArticle(article: GuwenInfo | ContemporaryInfo | EnglishArticleInfo) {
  console.log(article)
  window.localStorage.setItem('type', curType.value)
  if (curType.value === 'guwen')
    guwenData.value = article as GuwenInfo

  else if (curType.value === 'contemporary')
    contemData.value = article as ContemporaryInfo

  else
    enData.value = article as EnglishArticleInfo

  refreshed.value = false
  nextTick(() => {
    refreshed.value = true
  })
}
const zhTyping = ref<typeof ArticleZhTyping>()
const enTyping = ref<typeof ArticleEnTyping>()
function stop() {
  console.log('stop')
  zhTyping.value?.clickPause()
  enTyping.value?.clickPause()
}
const showInfo = ref(true)
if (window.localStorage.getItem('info') === '0')
  showInfo.value = false

function toggleInfo() {
  console.log('toggle')
  if (window.localStorage.getItem('info') === '0')
    showInfo.value = false

  else
    showInfo.value = true
}

const navbar = ref<typeof NavBar>()
function chooseArticle() {
  navbar.value!.openChooseDialog()
}

function randomArticle() {
  navbar.value!.randomArticle()
}
</script>

<template>
  <div style="height: 100vh;">
    <el-scrollbar>
      <NavBar
        ref="navbar"
        :cur-type="curType"
        @change-type="val => curType = val"
        @new-article="val => updateArticle(val)"
        @stop="stop"
        @toggle-info="toggleInfo"
      />

      <main>
        <ArticleZhTyping
          v-if="refreshed && (curType === 'contemporary' || curType === 'guwen')"
          ref="zhTyping"
          :guwen-info="guwenData"
          :contemporary="contemData"
          :cur-type="curType"
          :show-info="showInfo"
          @choose-article="chooseArticle"
          @random-article="randomArticle"
        />
        <ArticleEnTyping
          v-if="refreshed && curType === 'enArticle'"
          ref="enTyping"
          :en-article-info="enData"
          :show-info="showInfo"
          @choose-article="chooseArticle"
          @random-article="randomArticle"
        />
      </main>
    </el-scrollbar>
  </div>
</template>

<style scoped>
main {
  margin-top: 11rem;
}
</style>

