'use client'

import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
} from '@payloadcms/richtext-lexical/lexical'

import { FaHighlighter } from 'react-icons/fa6'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'

import { toolbarFormatGroupWithItems } from '@payloadcms/richtext-lexical/client'

import { $createMarkNode, $isMarkNode, MarkNode } from '../node'

export const MarkFeatureClient = createClientFeature({
  nodes: [MarkNode],

  toolbarInline: {
    groups: [
      toolbarFormatGroupWithItems([
        {
          ChildComponent: FaHighlighter,
          order: 5,
          isActive: ({ selection }) => {
            if ($isRangeSelection(selection)) {
              const nodes = selection.getNodes()
              const isInsideMark = nodes.some((node) => {
                return $isMarkNode(node) || $isMarkNode(node.getParent())
              })
              return isInsideMark
            }

            return false
          },
          key: 'mark',
          label: ({ i18n }) => {
            return i18n.t('lexical:mark:label')
          },
          onSelect: ({ editor }) => {
            editor.update(() => {
              const selection = $getSelection()
              if (!$isRangeSelection(selection)) return

              const nodes = selection.getNodes()

              const selectData = selection.getTextContent()

              const isInsideMark = nodes.some((node) => {
                return $isMarkNode(node) || $isMarkNode(node.getParent())
              })
              if (isInsideMark) {
                const newNode = $createTextNode(selectData)
                const parent = selection.anchor.getNode().getParent()
                if (parent && parent.getTextContentSize() === selectData.length) {
                  parent.remove()
                }
                selection.insertNodes([newNode])
                for (const node of nodes) {
                  if (node.getTextContentSize() === 0) {
                    node.remove()
                  }
                }
                return
              }

              const wrapper = $createMarkNode()
              const newNode = $createTextNode(selectData)
              wrapper.append(newNode)
              selection.insertNodes([wrapper])
            })
          },
        },
      ]),
    ],
  },
})
