import type { SerializedQuoteNode as _SerializedQuoteNode } from '@lexical/rich-text'
import type { Spread } from 'lexical'

import { createServerFeature } from '@payloadcms/richtext-lexical'

import { convertLexicalNodesToHTML } from '@payloadcms/richtext-lexical'

import { createNode } from '@payloadcms/richtext-lexical'

import { i18n } from './i18n'
import { MarkNode } from '../node'

export type SerializedQuoteNode = Spread<
  {
    type: 'quote'
  },
  _SerializedQuoteNode
>

export const MarkFeature = createServerFeature({
  feature: {
    ClientFeature: 'src/utils/plugins/lexical/highlight/client#MarkFeatureClient',
    clientFeatureProps: null,
    i18n,

    nodes: [
      createNode({
        converters: {
          html: {
            converter: async ({
              converters,
              currentDepth,
              depth,
              draft,
              node,
              overrideAccess,
              parent,
              req,
              showHiddenFields,
            }) => {
              const childrenText = await convertLexicalNodesToHTML({
                converters,
                currentDepth,
                depth,
                draft,
                lexicalNodes: node.children,
                overrideAccess,
                parent: {
                  ...node,
                  parent,
                },
                req,
                showHiddenFields,
              })
              const style = [
                node.indent > 0 ? `padding-inline-start: ${Number(node.indent) * 2}rem;` : '',
              ]
                .filter(Boolean)
                .join(' ')

              return `<mark${style ? ` style='${style}'` : ''}>${childrenText}</mark>`
            },
            nodeTypes: [MarkNode.getType()],
          },
        },
        node: MarkNode,
      }),
    ],
  },
  key: 'mark',
})
