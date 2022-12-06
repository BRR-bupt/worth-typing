<script setup lang='ts'>
const emit = defineEmits<{
  (e: 'toggleInfo'): void
}>()
// 可设置包括中文字体、英文字体、字体大小、是否显示侧边标题信息注释翻译、进入网页全屏、静音
const fontZhIndex = ref('0')
const fontEnIndex = ref('0')
const fontColorIndex = ref('0')
const fontZh = window.localStorage.getItem('font-zh')
const fontEn = window.localStorage.getItem('font-en')
const fontCl = window.localStorage.getItem('font-color')
switch (fontZh) {
  case 'LXGWWenKai':
    fontZhIndex.value = '0'
    break
  case 'Microsoft YaHei':
    fontZhIndex.value = '1'
    break
  case 'FZKai':
    fontZhIndex.value = '2'
    break

  default:
    fontZhIndex.value = '0'
    break
}
switch (fontEn) {
  case 'Times New Roman':
    fontEnIndex.value = '0'
    break
  case 'Microsoft YaHei':
    fontEnIndex.value = '1'
    break

  default:
    fontEnIndex.value = '0'
    break
}
switch (fontCl) {
  case '#443a3a':
    fontColorIndex.value = '0'
    break
  case 'green':
    fontColorIndex.value = '1'
    break

  default:
    fontColorIndex.value = '0'
    break
}

const fontZhArr = ['LXGWWenKai', 'Microsoft YaHei', 'FZKai']
function selectZhFont() {
  document.body.style.setProperty('--font-zh', fontZhArr[Number(fontZhIndex.value)])
  window.localStorage.setItem('font-zh', fontZhArr[Number(fontZhIndex.value)])
}

const fontEnArr = ['Times New Roman', 'Microsoft YaHei', 'Lora']
function selectEnFont() {
  document.body.style.setProperty('--font-en', fontEnArr[Number(fontEnIndex.value)])
  window.localStorage.setItem('font-en', fontEnArr[Number(fontEnIndex.value)])
}

const fontColorArr = ['#443a3a', 'green']
function selectFontColor() {
  document.body.style.setProperty('--font-color', fontColorArr[Number(fontColorIndex.value)])
  window.localStorage.setItem('font-color', fontColorArr[Number(fontColorIndex.value)])
}

const sound = ref(true)
const info = ref(true)
if (window.localStorage.getItem('sound') === '0')
  sound.value = false

function toggleSound() {
  if (sound.value)
    window.localStorage.setItem('sound', '1')

  else
    window.localStorage.setItem('sound', '0')
}

if (window.localStorage.getItem('info') === '0')
  info.value = false

function toggleInfo() {
  if (info.value)
    window.localStorage.setItem('info', '1')

  else
    window.localStorage.setItem('info', '0')

  emit('toggleInfo')
}
</script>

<template>
  <div class="setting-item">
    <div class="select-title">
      中文字体
    </div>
    <div>
      <el-radio-group v-model="fontZhIndex" @change="selectZhFont">
        <el-radio label="0" size="default" border>
          霞鹜文楷（默认）
        </el-radio>
        <el-radio label="1" size="default" border>
          微软雅黑
        </el-radio>
        <el-radio label="2" size="default" border>
          方正楷体
        </el-radio>
      </el-radio-group>
    </div>
  </div>
  <div class="setting-item">
    <div class="select-title">
      英文字体
    </div>
    <div>
      <el-radio-group v-model="fontEnIndex" @change="selectEnFont">
        <el-radio label="0" size="default" border>
          Times New Roman（默认）
        </el-radio>
        <el-radio label="1" size="default" border>
          微软雅黑
        </el-radio>
        <el-radio label="2" size="default" border>
          Lora
        </el-radio>
      </el-radio-group>
    </div>
  </div>
  <div class="setting-item">
    <div class="select-title">
      中文打字颜色
    </div>
    <div>
      <el-radio-group v-model="fontColorIndex" @change="selectFontColor">
        <el-radio label="0" size="default" border>
          黑色（默认）
        </el-radio>
        <el-radio label="1" size="default" border>
          绿色
        </el-radio>
      </el-radio-group>
    </div>
  </div>
  <div class="switch">
    键盘打字声
    <el-switch
      v-model="sound"
      inline-prompt
      active-text="开"
      inactive-text="关"
      @change="toggleSound"
    />
  </div>
  <div class="switch">
    侧边文章信息
    <el-switch
      v-model="info"
      inline-prompt
      active-text="开"
      inactive-text="关"
      @change="toggleInfo"
    />
  </div>
</template>

<style scoped>
.setting-item {
  margin-bottom: 3rem;
}
.select-title {
  margin-bottom: 1rem;
}
.switch {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}
.el-radio-group {
  row-gap: 1rem;
}
</style>
