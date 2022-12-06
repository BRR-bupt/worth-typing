import TypeWriting from './Typewriting'
import type {
  ArticleOptions,
  IArticleTypeWriting,
} from './types/typewritingTypes'

/**
 * 不区分中英文；
 * 较与父类TypeWriting的进步在于内部具备检测段落功能，并处理之，返回纯文本给父类，储存段落索引，暴露给外部
 */
export default class ArticleTypeWriting extends TypeWriting implements IArticleTypeWriting {
  /**
   * 设元素为el，el为段落起始字符
   */
  private _warp: number[] = [-1]

  // private _language: 'zh' | 'en'

  private _type: 'guwen' | 'contemporary' | 'enArticle'

  /**
   * 设元素为el，el为段落起始字符
   */
  get warp() {
    return this._warp
  }

  constructor(options: ArticleOptions) {
    super()
    this._type = options.type
    this.loadText(options.article)
    this._totalCount = this._text.value.length
  }

  /**
   * 初始化文本
   */
  private loadText(article: string) {
    let handledArticle = this._type === 'guwen' ? this.handleBrackets(article) : article
    handledArticle = this._type === 'enArticle' ? this.handleQuote(handledArticle) : handledArticle
    console.log(handledArticle)
    const articleArr = handledArticle.trim().split('')
    this.handleWarp(articleArr)
  }

  /**
   * 去除括号和空格
   * @param article string
   * @returns string
   */
  private handleBrackets(article: string): string {
    const patt = /\(.*\)/g
    // const patt2 = /（.*）/g
    // eslint-disable-next-line vue/no-irregular-whitespace, no-irregular-whitespace
    const pattSpace = /　　/g
    const pattSpace2 = / /g

    return article.replace(/（/g, '(').replace(/）/g, ')').replace(patt, '').replace(pattSpace, '').replace(pattSpace2, '')

    // return article.replace(patt, '').replace(patt2, '').replace(pattSpace, '')
  }

  private handleQuote(val: string): string {
    return val.replace(/“|”/g, '"').replace(/‘|’/g, '\'')
  }

  /**
   * 处理换行，初始化换行索引数组
   * @param articleArr string[]
   */
  private handleWarp(articleArr: string[]) {
    let count = 1
    for (let i = 0; i < articleArr.length; i++) {
      if (articleArr[i] === '\n' && articleArr[i - 1] === '\n') {
        this._warp.push(i - count)
        count++
        continue
      }
      if (articleArr[i] === '\n') {
        count++
        continue
      }

      this._text.value.push({
        realValue: articleArr[i],
        typingValue: '',
      })
    }
    for (let i = 0; i < this._warp.length; i++)
      this._warp[i] += 1
  }
}
