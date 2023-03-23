import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'

import type {
  ITypeWriting,
  TextItem,
} from './types/typewritingTypes'

/**
 * 内部读写数据均使用_var；
 * 外部读数据一律使用get，外部不允许直接修改数据，需要调用内部函数修改；
 * 每个工作函数运行前需要判断working状态
 */
export default class TypeWriting implements ITypeWriting {
  /**
   * 唯一标识
   */
  private _id = uuidv4()

  /**
   * 是否处于运行状态
   */
  private _working = ref(false)

  /**
   * 工程文本
   */
  protected _text = ref<TextItem[]>([])

  /**
   * 当前索引(键入位置)
   */
  private _curIndex = ref(0)

  /**
   * 计数器ID
   */
  private _timeID = 0

  /**
   * 耗时
   */
  private _duration = ref(0)

  /**
   * 总字（符）数
   */
  protected _totalCount = 0

  /**
   * 键入的字（符）数
   */
  private _typeCount = ref(0)

  /**
   * 正确字（符）数
   */
  private _rightCount = ref(0)

  /**
   * 错误字（符）数
   */
  private _wrongCount = ref(0)

  /**
   * 打字速度
   */
  private _speed = computed(() => {
    return Math.round((this._typeCount.value / this._duration.value) * 60) || 0
  })

  /**
   * 进度
   */
  private _prograss = computed(() => {
    return Math.floor((this._typeCount.value / this._totalCount) * 100) || 0
  })

  /**
   * 正确率
   */
  private _accuracy = computed(() => {
    return Math.floor((this._rightCount.value / this._typeCount.value) * 100) || 0
  })

  /**
   * 是否运行中
   */
  get working() {
    return this._working
  }

  /**
   * 工程文本
   */
  get text() {
    return this._text
  }

  /**
   * 当前索引
   */
  get curIndex() {
    return this._curIndex
  }

  /**
   * 耗时
   */
  get duration() {
    return this._duration
  }

  /**
   * 进度
   */
  get prograss() {
    return this._prograss
  }

  /**
   * 错误字（符）数
   */
  get wrongCount() {
    return this._wrongCount
  }

  /**
   * 打字速度
   */
  get speed() {
    return this._speed
  }

  /**
   * 正确率
   */
  get accuracy() {
    return this._accuracy
  }

  /**
   * 保存键入的值
   * @param val
   */
  saveTypingValue(val: string) {
    if (!this._working.value)
      return

    if (this._curIndex.value === this._text.value.length - 1) {
      console.log('end')
      this.end()
    }

    // 键入总数加一，根据键入对错，right和wrong数加一，并将值保存进text
    this._typeCount.value++
    if (this._text.value[this._curIndex.value].realValue === val)
      this._rightCount.value += 1

    else
      this._wrongCount.value += 1

    this._text.value[this._curIndex.value++].typingValue = val
  }

  /**
   * 退格
   */
  deleteTypingValue() {
    if (!this._working.value)
      return

    if (this._curIndex.value === 0) {
      console.log('start')
      return
    }

    this._typeCount.value--
    if (this._text.value[this._curIndex.value - 1].typingValue === this._text.value[this._curIndex.value - 1].realValue)
      this._rightCount.value -= 1

    else
      this._wrongCount.value -= 1

    this._text.value[--this._curIndex.value].typingValue = ''
  }

  /**
   * 打字进程开始
   */
  start() {
    console.log(this._working)
    if (this._working.value)
      return

    this._working.value = true
    this._timeID = window.setInterval(() => {
      this._duration.value++
    }, 1000)
  }

  /**
   * 打字进程暂停
   */
  pause() {
    this._working.value = false
    clearInterval(this._timeID)
  }

  /**
   * 打字进程恢复
   * 目前看与start逻辑无区别
   */
  resume() {
    if (this._working.value)
      return

    this._working.value = true
    this._timeID = window.setInterval(() => {
      this._duration.value++
    }, 1000)
  }

  /**
   * 打字进程结束
   */
  end() {
    this._working.value = false
    clearInterval(this._timeID)
  }

  /**
   * 重开打字进程
   */
  restart() {
    clearInterval(this._timeID)
    this._working.value = true
    while (this._curIndex.value !== 0)
      this.deleteTypingValue()

    this._duration.value = 0
    this._timeID = window.setInterval(() => {
      this._duration.value++
    }, 1000)
  }
}

