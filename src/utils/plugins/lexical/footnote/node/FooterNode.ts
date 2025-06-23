import { ElementNode, SerializedElementNode, LexicalNode, NodeKey } from 'lexical'
type FooterType = { id: number; footnote: string }[]
export class FooterNode extends ElementNode {
  __data: FooterType

  static getType() {
    return 'footerFootnote'
  }
  static clone(node: FooterNode) {
    return new FooterNode(node.__data, node.__key)
  }

  constructor(data: FooterType, key?: NodeKey) {
    super(key)
    this.__data = data
  }

  createDOM(): HTMLElement {
    const footer = document.createElement('footer')
    const ul = document.createElement('ul')

    this.__data.map((item) => {
      const anchor = document.createElement('a')
      anchor.href = `#footnote-${item.id}`
      anchor.style.cursor = 'pointer'
      anchor.setAttribute('target', '_self')
      anchor.style.textDecoration = 'none'
      anchor.style.fontSize = '0.75em'
      anchor.innerText = `[${item.id}] ${item.footnote}`
      const li = document.createElement('li')
      li.style.listStyle = 'none'
      li.appendChild(anchor)

      ul.appendChild(li)
    })
    footer.appendChild(ul)

    return footer
  }
  isInline(): true {
    return true
  }

  updateDOM(): false {
    return false
  }
  isEditable(): boolean {
    return false
  }
  static importJSON(serializedNode: SerializedElementNode & { data: FooterType }): FooterNode {
    return new FooterNode(serializedNode.data)
  }

  exportJSON(): SerializedElementNode & { data: FooterType } {
    return {
      ...super.exportJSON(),
      type: 'footerFootnote',
      version: 1,
      data: this.__data,
    }
  }
}

export const $createFooterNode = (data: FooterType) => {
  return new FooterNode(data)
}

export const $isFooterNode = (node: LexicalNode | null | undefined): node is FooterNode =>
  node instanceof FooterNode
