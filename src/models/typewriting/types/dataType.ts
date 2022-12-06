const a = 1

export { a }

export interface GuwenInfo {
  audioUrl: string
  content: string
  dynasty: string
  remark: string
  title: string
  translation: string
  type: string[]
  writer: string
  _id: {
    $oid: string
  }
}
export interface ContemporaryInfo {
  author: string
  paragraphs: string[]
  title: string
}
export interface EnglishArticleInfo {
  title: string
  content: string
  translation: string
  type: string[]
  writer: string
}
