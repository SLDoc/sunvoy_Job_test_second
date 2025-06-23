'use client'

import { $getSelection, $isRangeSelection } from '@payloadcms/richtext-lexical/lexical'

import { FootNoteIcon } from './FootNoteIcon'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'

import { toolbarFormatGroupWithItems } from '@payloadcms/richtext-lexical/client'

import { $createFooterNode, FooterNode } from '../node/FooterNode'

import { $getRoot } from '@payloadcms/richtext-lexical/lexical'
import Drawer from './plugin/Drawer'
import { OPEN_FOOTNOTE_DRAWER_COMMAND } from './plugin/Drawer'

import { $isMarkNode, FootnoteNode, $removeFootnote } from '../node'

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
const groupConf = [
  toolbarFormatGroupWithItems([
    {
      ChildComponent: FootNoteIcon,

      order: 6.5,
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
      key: 'footnote',

      label: ({ i18n }) => {
        return i18n.t('lexical:footnote:label')
      },
      onSelect: ({ editor }) => {
        editor.update(() => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) return
          const nodes = selection.getNodes()

          const isFootNode = nodes.some((node) => {
            return $isMarkNode(node) || $isMarkNode(node.getParent())
          })
          const parent = selection.anchor.getNode().getParent()

          if (isFootNode) {
            if (parent && parent.__type === 'footnote') {
              $removeFootnote(parseInt(parent.getTextContent()))
              parent.remove()
            }
            removeFooterNode()

            for (const node of nodes) {
              if (node.__type === 'footnote') {
                $removeFootnote(parseInt(node.getTextContent()))
                removeFooterNode()
                node.remove()
              }
            }
            return
          }

          if (!isFootNode) {
            editor.dispatchCommand(OPEN_FOOTNOTE_DRAWER_COMMAND, undefined)
          }
        })
      },
    },
  ]),
]

export const FootnoteFeatureClient = createClientFeature({
  nodes: [FootnoteNode, FooterNode],
  plugins: [
    {
      Component: Drawer,
      position: 'floatingAnchorElem',
    },
  ],

  toolbarInline: {
    groups: groupConf,
  },
  toolbarFixed: {
    groups: groupConf,
  },
})
