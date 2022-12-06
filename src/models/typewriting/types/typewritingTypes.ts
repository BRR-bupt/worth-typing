import type { ComputedRef, Ref } from 'vue'

interface TextItem {
  realValue: string
  typingValue: string
}

interface ITypeWriting {
  /**
   * 是否运行中
   */
  working: Ref<boolean>
  /**
   * 工程文本
   */
  text: Ref<TextItem[]>
  /**
   * 当前索引
   */
  curIndex: Ref<number>
  /**
   * 耗时
   */
  duration: Ref<number>
  /**
   * 错误字（符）数
   */
  wrongCount: Ref<number>
  /**
   * 打字速度
   */
  speed: ComputedRef<number>
  /**
   * 进度
   */
  prograss: ComputedRef<number>
  /**
   * 正确率
   */
  accuracy: ComputedRef<number>

  saveTypingValue: (val: string) => void
  deleteTypingValue: () => void
  start: () => void
  pause: () => void
  resume: () => void
  end: () => void
  restart: () => void
}

interface StringsOptions {
  /**
   * 字符集ids，随机字符集相当于使用ids=[0,1,2,3,4]
   */
  characterSetIds?: number[]

  /**
   * 用户自定义字符集
   */
  customSet?: string

  /**
   * 计算后的工程字符集，不用传入，自生成
   */
  characterSet?: string[]

  /**
   * 是否混入大写字母，默认为FALSE
   */
  mixUpperCase: boolean

  /**
   * 字符总长度
   */
  length: 'long' | 'middle' | 'short'
}

interface ArticleOptions {
  /**
   * 输入文本
   */
  article: string

  /**
   * 类型
   */
  type: 'guwen' | 'contemporary' | 'enArticle'
}

type IStringsTypeWriting = ITypeWriting & {}

type IArticleTypeWriting = ITypeWriting & {
  /**
   * 设元素为el，则代表在位置el后换行
   */
  warp: number[]
}

export type {
  ITypeWriting,
  IStringsTypeWriting,
  IArticleTypeWriting,
  StringsOptions,
  ArticleOptions,
  TextItem,
}
