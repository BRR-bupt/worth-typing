import TypeWriting from './typewriting'
import type {
  IStringsTypeWriting,
  StringsOptions,
} from './types/typewritingTypes'
import characterSets from '~/assets/textdata/characterSet/test'

export default class StringsTypeWriting extends TypeWriting implements IStringsTypeWriting {
  /**
   * 字符集ids，随机字符集相当于使用ids=[0,1,2,3,4]
   */
  private _characterSetIds?: number[]

  /**
   * 用户自定义字符集
   */
  private _customSet?: string

  /**
   * 计算后的工程字符集，不用传入，自生成
   */
  private _characterSet: string[] = []

  /**
   * 字符总长度
   */
  private _length: 'long' | 'middle' | 'short'

  /**
   * 是否混入大写字母，默认为FALSE
   */
  private _mixUpperCase = false

  constructor(options: StringsOptions) {
    super()
    this._length = options.length
    this._characterSetIds = options.characterSetIds
    this._customSet = options.customSet
    this._mixUpperCase = options.mixUpperCase
    this.loadCharacterData()
    this.loadText()
  }

  /**
   * 初始化字符集
   */
  private loadCharacterData() {
    console.log('初始化字符集')
    if (this._characterSetIds) {
      this._characterSetIds.forEach((id) => {
        this._characterSet.push(...characterSets[id])
      })
    }
    else if (this._customSet) {
      this._characterSet = this._customSet.split('')
    }
    else {
      throw new Error('请输入字符集ids或自定义字符集')
    }
  }

  /**
   * 初始化文本
   */
  private loadText() {
    console.log('初始化文本')
    switch (this._length) {
      case 'long':
        this._totalCount = 80
        break

      case 'middle':
        this._totalCount = 50
        break

      case 'short':
        this._totalCount = 20
        break

      default:
        break
    }
    for (let i = this._totalCount; i > 0; i--) {
      this._text.value.push({
        realValue: this._characterSet[Math.round(Math.random() * (this._characterSet.length - 1))],
        typingValue: '',
      })
    }
    // 混入大写
    if (this._mixUpperCase) {
      this._text.value.forEach((item) => {
        if (item.realValue.charCodeAt(0) <= 122 && item.realValue.charCodeAt(0) >= 97 && Math.random() > 0.8)
          item.realValue = item.realValue.toUpperCase()
      })
    }
  }
}
