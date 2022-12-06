export interface IInputVModel {
  /**
   * 双向绑定Input，针对中文输入
   */
  inputEl: HTMLInputElement
  /**
   * remove清除该元素以及所有事件
   */
  remove: () => void
}

export function useInputVModel(callback: () => void): IInputVModel {
  const inputEl = document.createElement('input')
  inputEl.className = 'input-vm'

  /**
   * 在执行input的时候先将 composing 置为 true,
   * 表示要开始中文输入法了
   * @param e any
   */
  function onCompositionStart(e: any) {
    e.target.composing = true
  }

  /**
   * 输入法结束之后执行,
   * 表示中文输入法结束了,
   * 派发一个input事件
   * @param e any
   */
  function onCompositionEnd(e: any) {
    // prevent triggering an input event for no reason
    if (!e.target.composing)
      return
    e.target.composing = false
    trigger(e.target, 'input')
  }

  /**
   * 对 el 节点进行 input 事件派发
   * @param el any
   * @param type string
   */
  function trigger(el: any, type: string) {
    const e = new Event(type)
    el.dispatchEvent(e)
  }

  function onInput(e: Event) {
    if (e instanceof InputEvent && e.inputType !== 'insertText')
      return

    callback()
  }

  function onClick() {
    inputEl.blur()
  }

  inputEl.addEventListener('input', onInput)
  inputEl.addEventListener('click', onClick)
  inputEl.addEventListener('compositionstart', onCompositionStart)
  inputEl.addEventListener('compositionend', onCompositionEnd)

  function remove() {
    inputEl.removeEventListener('input', onInput)
    inputEl.removeEventListener('click', onClick)
    inputEl.removeEventListener('compositionstart', onCompositionStart)
    inputEl.removeEventListener('compositionend', onCompositionEnd)
    inputEl.remove()
  }

  return {
    inputEl,
    remove,
  }
}

