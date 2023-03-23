<script setup lang='ts'>
import Setting from './Setting.vue'
import type { ContemporaryInfo, EnglishArticleInfo, GuwenInfo } from '~/models/typewriting/types/dataType'
import guwen from '~/assets/textdata/article/zh/guwen.json'
import contem from '~/assets/textdata/article/zh/contemporary/0-49.json'
import enTest from '~/assets/textdata/article/en/test.json'
import { CarbonSearch } from '~/components/icons'

const props = defineProps<{
  curType: 'guwen' | 'contemporary' | 'enArticle'
}>()

const emit = defineEmits<{
  (e: 'newArticle', value: GuwenInfo | ContemporaryInfo | EnglishArticleInfo): void
  (e: 'changeType', value: 'guwen' | 'contemporary' | 'enArticle'): void
  (e: 'stop'): void
  (e: 'toggleInfo'): void
}>()
const guwens = guwen.data as GuwenInfo[]
const contems = contem as ContemporaryInfo[]
const enArticles = enTest as EnglishArticleInfo[]

const curGuwen = ref<GuwenInfo>()
const curContem = ref<ContemporaryInfo>()
const curEn = ref<EnglishArticleInfo>()

// 初始化标题列表
const guwensTitleList: string[] = []
const contemsTitleList: string[] = []
const enArticlesTitleList: string[] = []
for (let i = 0; i < guwens.length; i++)
  guwensTitleList.push(guwens[i].title)

for (let i = 0; i < contems.length; i++)
  contemsTitleList.push(contems[i].title)

for (let i = 0; i < enArticles.length; i++)
  enArticlesTitleList.push(enArticles[i].title)

const drawer = ref(false)
const confirmArticleDialog = ref(false)
const searchTitle = ref('')
let searchIndex = 0
const findType = ref<'guwen' | 'contemporary' | 'enArticle'>('guwen')

/**
 * 按文章标题搜索中文古文和现代文，搜索逻辑为正则匹配
 */
function doSearch() {
  const patt = new RegExp(searchTitle.value)
  let find = false
  for (let i = 0; i < guwensTitleList.length; i++) {
    if (patt.test(guwensTitleList[i])) {
      find = true
      searchIndex = i
      findType.value = 'guwen'
      curGuwen.value = guwens[i]
      break
    }
  }
  if (!find) {
    for (let i = 0; i < contemsTitleList.length; i++) {
      if (patt.test(contemsTitleList[i])) {
        find = true
        searchIndex = i
        findType.value = 'contemporary'
        curContem.value = contems[i]
        break
      }
    }
  }
  if (!find) {
    for (let i = 0; i < enArticlesTitleList.length; i++) {
      if (patt.test(enArticlesTitleList[i])) {
        find = true
        searchIndex = i
        findType.value = 'enArticle'
        curEn.value = enArticles[i]
        break
      }
    }
  }

  if (!find) {
    ElNotification({
      title: '404',
      message: `本站暂未收录文章 —— ${searchTitle.value}`,
      type: 'warning',
      duration: 4500,
    })
    return
  }

  confirmArticleDialog.value = true
}
const dialogTitle = computed(() => {
  switch (findType.value) {
    case 'guwen':
      return curGuwen.value?.title

    case 'contemporary':
      return curContem.value?.title

    case 'enArticle':
      return curEn.value?.title

    default:
      break
  }
})
/**
 * 搜索弹窗确定按钮处理函数，刷新打字组件
 */
function changeArticle() {
  if (findType.value === 'guwen') {
    emit('changeType', 'guwen')
    emit('newArticle', curGuwen.value!)
  }
  else if (findType.value === 'contemporary') {
    emit('changeType', 'contemporary')
    emit('newArticle', curContem.value!)
  }
  else if (findType.value === 'enArticle') {
    emit('changeType', 'enArticle')
    emit('newArticle', curEn.value!)
  }
  window.localStorage.setItem('index', searchIndex.toString())
  confirmArticleDialog.value = false
}

function dofingerExercise() {
  ElNotification({
    title: '待开发',
    message: '敬请期待',
    type: 'info',
    duration: 3000,
    offset: 50,
  })
}
/**
 * 随机一篇，根据当前类型，随机同类型
 */
function randomArticle() {
  if (props.curType === 'guwen') {
    const index = Math.floor((Math.random() * 1000))
    emit('newArticle', guwens[index])
    window.localStorage.setItem('index', index.toString())
  }
  else if (props.curType === 'contemporary') {
    const index = Math.floor((Math.random() * 614))
    emit('newArticle', contems[index])
    window.localStorage.setItem('index', index.toString())
  }
  else {
    const index = Math.floor((Math.random() * 6))
    emit('newArticle', enArticles[index])
    window.localStorage.setItem('index', index.toString())
  }
}

const chooseArticleDialog = ref(false)
const typesActive = ref(0)
const types = [
  '古文',
  '现代文',
  '英文',
]
const guwenSelectIndex = ref(0)
const contemSelectIndex = ref(0)
const enSelectIndex = ref(0)

/**
 * 根据typeActive和selectIndex确定对应文章，像App.vue发送
 */
function confirmSelected() {
  switch (typesActive.value) {
    case 0:
      emit('changeType', 'guwen')
      emit('newArticle', guwens[guwenSelectIndex.value])
      window.localStorage.setItem('index', guwenSelectIndex.value.toString())
      break

    case 1:
      emit('changeType', 'contemporary')
      emit('newArticle', contems[contemSelectIndex.value])
      window.localStorage.setItem('index', contemSelectIndex.value.toString())
      break

    case 2:
      emit('changeType', 'enArticle')
      emit('newArticle', enArticles[enSelectIndex.value])
      window.localStorage.setItem('index', enSelectIndex.value.toString())
      break

    default:
      break
  }
  chooseArticleDialog.value = false
}

const initIndex = Number(window.localStorage.getItem('index'))
const initType = window.localStorage.getItem('type')
switch (initType) {
  case 'guwen':
    emit('changeType', 'guwen')
    emit('newArticle', guwens[initIndex])
    break

  case 'contemporary':
    emit('changeType', 'contemporary')
    emit('newArticle', contems[initIndex])
    break

  case 'enArticle':
    emit('changeType', 'enArticle')
    emit('newArticle', enArticles[initIndex])
    break

  default:
    break
}

function stopTypewriting() {
  console.log('stop')
  emit('stop')
}

function openChooseDialog() {
  chooseArticleDialog.value = true
}

defineExpose({
  openChooseDialog,
  randomArticle,
})

function fullScreen() {
  if (document.fullscreenElement)
    document.exitFullscreen()

  else
    document.documentElement.requestFullscreen()
}
</script>

<template>
  <header @click="stopTypewriting">
    <nav>
      <div class="title">
        Worthtyping
      </div>
      <div class="search-comp">
        <div class="search">
          <input
            v-model="searchTitle"
            placeholder="请输入文章标题"
            type="search"
            @keyup.enter="doSearch"
          >
          <CarbonSearch class="search-icon" @click="doSearch" />
        </div>
      </div>
      <div class="control-area">
        <div @click="randomArticle">
          随机一篇
        </div>
        <div @click="chooseArticleDialog = true">
          选择文章
        </div>
        <!-- <div class="construting" @click="dofingerExercise">
          指法练习
        </div> -->
        <div @click="drawer = true">
          设置
        </div>
        <div @click="fullScreen">
          <svg width="22" height="22" viewBox="0 0 32 32"><path fill="currentColor" d="M22 16h2V8h-8v2h6v6zM8 24h8v-2h-6v-6H8v8z" /><path fill="currentColor" d="M26 28H6a2.002 2.002 0 0 1-2-2V6a2.002 2.002 0 0 1 2-2h20a2.002 2.002 0 0 1 2 2v20a2.002 2.002 0 0 1-2 2ZM6 6v20h20.001L26 6Z" /></svg>
        </div>
      </div>
    </nav>
  </header>

  <el-drawer v-model="drawer" title="全局样式设置">
    <Setting @toggle-info="emit('toggleInfo')" />
  </el-drawer>

  <el-dialog
    v-model="confirmArticleDialog"
    :title="dialogTitle"
    width="40%"
  >
    <div v-if="findType === 'guwen'">
      <div>{{ curGuwen?.dynasty }} · {{ curGuwen?.writer }}</div>
      <div class="content">
        {{ curGuwen?.content }}
      </div>
    </div>

    <div v-else-if="findType === 'contemporary'">
      <div>当代 · {{ curContem?.author }}</div>
      <div class="content">
        {{ curContem?.paragraphs }}
      </div>
    </div>

    <div v-else>
      <div>{{ curEn?.writer }}</div>
      <div class="content">
        {{ curEn?.content }}
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="confirmArticleDialog = false">取消</el-button>
        <el-button type="primary" @click="changeArticle">
          开始打字
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="chooseArticleDialog"
    title="选择文章"
    width="60%"
  >
    <div class="select">
      <div class="select-area">
        <div class="select-title">
          类型
        </div>
        <div class="select-opts">
          <div
            v-for="(item, i) in types"
            :key="i"
            :class="typesActive === i ? 'opt-selected' : ''"
            @click="typesActive = i"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>

    <div v-show="typesActive === 0" class="select-result">
      <div
        v-for="(item, i) in guwensTitleList"
        :key="i"
        :class="guwenSelectIndex === i ? 'res-selected' : ''"
        @click="guwenSelectIndex = i"
      >
        {{ item }}
      </div>
    </div>

    <div v-show="typesActive === 1" class="select-result">
      <div
        v-for="(item, i) in contemsTitleList"
        :key="i"
        :class="contemSelectIndex === i ? 'res-selected' : ''"
        @click="contemSelectIndex = i"
      >
        {{ item }}
      </div>
    </div>

    <div v-show="typesActive === 2" class="select-result">
      <div
        v-for="(item, i) in enArticlesTitleList"
        :key="i"
        :class="enSelectIndex === i ? 'res-selected' : ''"
        @click="enSelectIndex = i"
      >
        {{ item }}
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="chooseArticleDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmSelected">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
@font-face {
  font-family: Cormorant;
  src: url('~/assets/font/Cormorant-Regular.ttf')
}

header {
  cursor: default;
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  height: 4rem;
  padding: 0 8rem;
  z-index: 100;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: rgb(252, 241, 229, 0.86);
  border-bottom: 1px solid rgb(209, 207, 207);
}
nav {
  display: flex;
  align-items: center;
  height: 4rem;
}
.title {
  flex: 1;
  font-size: 1.875rem;
  font-weight: bold;
  font-family: Cormorant;
}
.search {
  display: flex;
  flex: 1;
  gap: 0.25rem;
  width: 22rem;
  border-radius: 0.25rem;
  justify-content: center;
  align-items: center;
  background-color: white;
}
.search-icon {
  cursor: pointer;
  border-radius: 0.25rem;
}
.search-icon:hover {
  color: rgb(126, 125, 121);
}
input {
  height: 2rem;
  width: 20rem;
  font-size: 1rem;
  padding-left: 0.75rem;
}

.control-area {
  display: flex;
  justify-content: end;
  flex: 1;
  gap: 3rem;
  font-size: 1.1rem;
}
.control-area div {
  cursor: pointer;
  display: flex;
  align-items: center;
  /* font-weight: bold; */
}
.construting {
  color: gray;
}
.control-area div:hover {
  color: gray;
}

@media(max-width: 1460px) {
  header {
    padding: 0rem 5rem;
  }
  .control-area {
    gap: 2rem;
  }
}

@media(max-width: 1280px) {
  header {
    padding: 0rem 2.5rem;
  }
  .search {
    width: 16rem;
  }
  input {
    width: 14rem;
  }
  .control-area {
    gap: 1rem;
  }
}

.content {
  margin-top: 1rem;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  display: -moz-box;
  -moz-line-clamp: 2;
  -moz-box-orient: vertical;
  overflow: hidden;
}
.select {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.select-area {
  display: flex;
  font-size: 1rem;
}
.select-title {
  color: gray;
  cursor: default;
}
.select-opts {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-left: 2rem;
  cursor: pointer;
  color: black;
}
.opt-selected {
  color: #00a1d9;
}
.select-result {
  display: flex;
  flex-wrap: wrap;
  margin-top: 3rem;
  height: 200px;
  overflow-y: scroll;
  gap: 0.35rem;
  font-size: 1rem;
  font-family: LXGWWenKai;
  /* color: gray; */
  /* border: 1px solid;
  padding: 0.5rem; */
}
.select-result div {
  border: 1px solid #808080;
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 3px;
  height: fit-content;
}
.select-result .res-selected {
  color: #239531;
  border: 1px solid #239531;
}
</style>
