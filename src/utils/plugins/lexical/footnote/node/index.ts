import { ElementNode, SerializedElementNode, LexicalNode, NodeKey } from 'lexical'

type FooterType = { id: number; footnote: string }[]
export class FootnoteNode extends ElementNode {
  __data: string

  static footnote: FooterType = []
  static deltedfootnote: number[] = []
  static tempId: number = 0
  static getType() {
    return 'footnote'
  }

  static clone(node: FootnoteNode) {
    return new FootnoteNode(node.__data, node.__key)
  }

  constructor(data: string, key?: NodeKey) {
    super(key)
    this.__data = data
  }

  createDOM(): HTMLElement {
    const sup = document.createElement('sup')

    sup.style.position = 'relative'
    sup.style.cursor = 'pointer'
    sup.setAttribute('id', `footnote-${FootnoteNode.tempId.toString()}`)

    sup.style.color = 'aquamarine'

    return sup
  }
  isInline(): true {
    return true
  }
  isEditable(): boolean {
    return false
  }
  updateDOM(): false {
    return false
  }

  static importJSON(serializedNode: SerializedElementNode & { data: string }): FootnoteNode {
    return new FootnoteNode(serializedNode.data)
  }

  exportJSON(): SerializedElementNode & { data: string; footnote: Record<string, any>[] } {
    return {
      ...super.exportJSON(),
      type: 'footnote',
      version: 1,
      data: this.__data,
      footnote: FootnoteNode.footnote,
    }
  }
}

export const $createFootnoteNode = (data: string = '') => {
  let footnoteId: number = 0

  footnoteId = FootnoteNode.footnote?.length + 1
  if (data == '') {
    return
  }
  FootnoteNode.footnote.push({
    id: footnoteId,
    footnote: data,
  })

  FootnoteNode.footnote.sort((a, b) => a.id - b.id)
  FootnoteNode.tempId = footnoteId
  return new FootnoteNode(data)
}

export const $updateFootnoteNode = (footnoteId: number, updatedFootnote: string) => {
  const footerFootnoteData = FootnoteNode.footnote.sort((a, b) => a.id - b.id)

  FootnoteNode.footnote = [
    ...footerFootnoteData.filter((item) => item.id !== footnoteId),
    { id: footnoteId, footnote: updatedFootnote },
  ]
  FootnoteNode.footnote.sort((a, b) => a.id - b.id)
  return { id: footnoteId, footnote: updatedFootnote }
}

export const $getFootnoteCount = () => {
  let footnoteId: number = 0

  if (FootnoteNode.deltedfootnote.length > 0) {
    const id = FootnoteNode.deltedfootnote.pop()
    if (id !== undefined) {
      footnoteId = id
    }
  } else {
    const id = FootnoteNode.footnote.length === 0 ? 1 : FootnoteNode.footnote.length
    footnoteId = id
  }
  return footnoteId
}

export const $removeFootnote = (footnoteId: number) => {
  const updatedFootnote = FootnoteNode.footnote.filter((item) => item.id !== footnoteId)

  FootnoteNode.footnote = updatedFootnote

  return updatedFootnote
}

export const $isMarkNode = (node: LexicalNode | null | undefined): node is FootnoteNode =>
  node instanceof FootnoteNode
