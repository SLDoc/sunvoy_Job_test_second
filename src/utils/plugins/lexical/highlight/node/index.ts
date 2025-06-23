import { ElementNode, SerializedElementNode, LexicalNode, NodeKey } from 'lexical'

export class MarkNode extends ElementNode {
  __data: string
  static getType() {
    return 'mark'
  }

  static clone(node: MarkNode) {
    return new MarkNode(node.__data, node.__key)
  }

  constructor(data: string, key?: NodeKey) {
    super(key)
    this.__data = data
  }

  createDOM(): HTMLElement {
    const mark = document.createElement('mark')

    mark.style.backgroundColor = 'aquamarine'
    return mark
  }
  isInline(): true {
    return true
  }

  updateDOM(): false {
    return false
  }

  static importJSON(serializedNode: SerializedElementNode & { data: string }): MarkNode {
    return new MarkNode(serializedNode.data)
  }

  exportJSON(): SerializedElementNode & { data: string } {
    return {
      ...super.exportJSON(),
      type: 'mark',
      version: 1,
      data: this.__data,
    }
  }
}

export const $createMarkNode = (data: string = '') => new MarkNode(data)

export const $isMarkNode = (node: LexicalNode | null | undefined): node is MarkNode =>
  node instanceof MarkNode
