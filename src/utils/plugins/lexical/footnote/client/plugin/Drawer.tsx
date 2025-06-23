import React, { useCallback, useEffect, useRef, useState } from 'react'
import './index.scss'
import { useLexicalDrawer } from '@payloadcms/richtext-lexical/client'
import { useEditorConfigContext } from '@payloadcms/richtext-lexical/client'

import { CloseMenuIcon, EditIcon, formatDrawerSlug, useEditDepth } from '@payloadcms/ui'

import { FormState, Data } from 'payload'
import {
  $createTextNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isRangeSelection,
} from '@payloadcms/richtext-lexical/lexical'
import { FieldsDrawer } from '@payloadcms/richtext-lexical/client'

import { createCommand } from '@payloadcms/richtext-lexical/lexical'
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'

import {
  $createFootnoteNode,
  $getFootnoteCount,
  $isMarkNode,
  $updateFootnoteNode,
  FootnoteNode,
} from '../../node'
import { $createFooterNode } from '../../node/FooterNode'
export const OPEN_FOOTNOTE_DRAWER_COMMAND = createCommand<void>()

type FootnoteType = {
  id: number
  footnote: string
}

const Drawer = () => {
  const editDepth = useEditDepth()
  const drawerSlug = formatDrawerSlug({
    slug: `lexical-rich-text-link-` + 3,
    depth: editDepth,
  })

  const [currentFootnote, setCurrentFootnote] = useState<FootnoteType | null>(null)
  const editorRef = useRef<HTMLDivElement | null>(null)

  const { toggleDrawer } = useLexicalDrawer(drawerSlug)
  const [editor] = useLexicalComposerContext()
  const [isEdit, setIsEdit] = useState(false)
  const [position, setPosition] = useState<{
    x: number
    y: number
  }>({ x: 0, y: 0 })
  const [isFootnote, setIsFootnote] = useState(false)
  const removeFooterNode = () => {
    const rootNode = $getRoot()
    const childNode = rootNode.getChildren()

    for (const node of childNode) {
      if (node.__type === 'footerFootnote') {
        node.remove()
      }
    }

    if (FootnoteNode.footnote.length !== 0) {
      const footerNode = $createFooterNode(FootnoteNode.footnote)

      rootNode.append(footerNode)
    }
  }

  const updateFootnote = (id: number, updatedFootnote: string) => {
    const rootNode = $getRoot()
    const childNode = rootNode.getChildren()
    for (const node of childNode) {
      if (node.__type === 'footerFootnote') {
        node.remove()
      }
    }

    if (FootnoteNode.footnote.length !== 0) {
      const updatedFootnoteData = $updateFootnoteNode(id, updatedFootnote)
      setCurrentFootnote(updatedFootnoteData)
      const footerNode = $createFooterNode(FootnoteNode.footnote)

      rootNode.append(footerNode)
    }
  }
  const handleFooterNode = () => {
    const rootNode = $getRoot()
    const childNode = rootNode.getChildren()
    if (FootnoteNode.footnote.length > 0) {
      for (const node of childNode) {
        if (node.__type === 'footerFootnote') {
          node.remove()
        }
      }
      const footerNode = $createFooterNode(FootnoteNode.footnote)
      rootNode.append(footerNode)
    }
  }

  const activateFloatingMenu = useCallback(() => {
    if (editorRef && editorRef.current && !isFootnote) {
      editorRef.current.style.opacity = '0'
      editorRef.current.style.transform = 'translate(-10000px, -10000px)'
    }

    if (editorRef && editorRef.current && isFootnote) {
      editorRef.current.style.opacity = '1'
      editorRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`
    }
  }, [isFootnote, position])

  useEffect(() => {
    activateFloatingMenu()
  }, [isFootnote, activateFloatingMenu])

  useEffect(() => {
    return editor.registerCommand(
      OPEN_FOOTNOTE_DRAWER_COMMAND,
      () => {
        toggleDrawer()
        return true
      },
      0,
    )
  }, [editor, toggleDrawer])

  useEffect(() => {
    return editor.registerMutationListener(FootnoteNode, (mutatedNodes) => {
      editor.getEditorState().read(() => {
        for (const [nodeKey, mutation] of mutatedNodes.entries()) {
          const domElem = editor.getElementByKey(nodeKey)

          const footnote = $getNodeByKey(nodeKey)
          const footnodeId = footnote?.getTextContent()
          let currentFootnote = null
          if (footnodeId !== undefined) {
            currentFootnote = FootnoteNode.footnote.find((item) => item.id === parseInt(footnodeId))
          }
          const rect = domElem?.getBoundingClientRect()

          let EditorPosition: { x: number; y: number } | null = null
          const editorElement = document.querySelector('[data-lexical-editor]')

          const editorRect = editorElement?.getBoundingClientRect()

          if (domElem) {
            domElem.addEventListener('click', () => {
              if (rect && editorRect) {
                EditorPosition = {
                  x: rect.x - editorRect?.left,
                  y: rect.y - editorRect.top + 40,
                }
              }

              if (currentFootnote) {
                setCurrentFootnote(currentFootnote)
              }

              if (EditorPosition) {
                setPosition(EditorPosition)
              }

              setIsFootnote(true)
            })
          }
        }
      })
    })
  }, [editor])

  const {
    fieldProps: { schemaPath },
  } = useEditorConfigContext()

  return (
    <>
      <div className="link-editor" ref={editorRef}>
        <div className="link-input">
          <p>
            {`[${currentFootnote?.id}] `}
            {currentFootnote?.footnote}
          </p>
          {editor.isEditable() && (
            <React.Fragment>
              <button
                aria-label="Edit link"
                className="link-edit"
                onClick={(event) => {
                  event.preventDefault()
                  setIsEdit(true)
                  toggleDrawer()
                }}
                onMouseDown={(event) => event?.preventDefault()}
                tabIndex={0}
                type="button"
              >
                <EditIcon />
              </button>
              {true && (
                <button
                  aria-label="Remove link"
                  className="link-trash"
                  onClick={() => {
                    setIsFootnote(false)
                  }}
                  onMouseDown={(event) => event?.preventDefault()}
                  tabIndex={0}
                  type="button"
                >
                  <CloseMenuIcon />
                </button>
              )}
            </React.Fragment>
          )}
        </div>
      </div>

      <FieldsDrawer
        className="lexical-link-edit-drawer"
        drawerSlug={drawerSlug}
        drawerTitle={isEdit ? 'Edit Footnote' : 'Add Footnote'}
        featureKey="footnote"
        handleDrawerSubmit={(fields: FormState, data: Data) => {
          editor.update(() => {
            const selection = $getSelection()
            if (!$isRangeSelection(selection)) {
              setIsEdit(false)
              return
            }

            const nodes = selection.getNodes()
            const footNoteEntered = data?.footnote?.root?.children?.[0]?.children?.[0]?.text ?? ''
            const selectData = selection.getTextContent()

            const isFootNode = nodes.some((node) => {
              return $isMarkNode(node) || $isMarkNode(node.getParent())
            })

            const parent = selection.anchor.getNode().getParent()
            removeFooterNode()
            if (isFootNode) {
              const footNoteId = parent?.getTextContent()
              if (footNoteId !== undefined) {
                updateFootnote(parseInt(footNoteId), footNoteEntered)
              }
              setIsEdit(false)
              return
            }
            if (footNoteEntered === '') {
              setIsEdit(false)
              return alert('Please insert data')
            }
            const wrapper = $createFootnoteNode(footNoteEntered)
            if (!wrapper) {
              setIsEdit(false)
              return
            }
            const newNode = $createTextNode(`${$getFootnoteCount().toString()}`)
            const textNode = $createTextNode(selectData)
            handleFooterNode()
            wrapper.append(newNode)
            selection.insertNodes([textNode, wrapper])
          })
        }}
        schemaPath={schemaPath}
        schemaPathSuffix="fields"
      />
    </>
  )
}

export default Drawer
