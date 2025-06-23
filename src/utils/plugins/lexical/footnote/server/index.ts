import type { SerializedQuoteNode as _SerializedQuoteNode } from '@lexical/rich-text'
import type { Spread } from 'lexical'
import { Config } from 'payload'
import { createServerFeature, FixedToolbarFeature } from '@payloadcms/richtext-lexical'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Field, FieldSchemaMap } from 'payload'

import { sanitizeFields } from 'payload'
import { i18n } from './i18n'
import { FootnoteNode } from '../node'
import { FooterNode } from '../node/FooterNode'

export type SerializedQuoteNode = Spread<
  {
    type: 'quote'
  },
  _SerializedQuoteNode
>

export const FootnoteFeature = createServerFeature({
  feature: async ({ config, parentIsLocalized, isRoot }) => {
    const rawFields: Field[] = [
      {
        name: 'footnote',

        type: 'richText',
        editor: lexicalEditor({
          features: ({ defaultFeatures }) => [
            ...defaultFeatures.filter((item) =>
              ['bold', 'italic', 'link', 'paragraph', 'strikethrough'].includes(item.key),
            ),
            FixedToolbarFeature(),
          ],
        }),
        label: 'footnote',

        required: true,
      },
    ]

    const sanitizedFields = await sanitizeFields({
      config: config as unknown as Config,
      fields: rawFields,
      parentIsLocalized,
      requireFieldLevelRichTextEditor: isRoot,
      validRelationships: config.collections.map((c) => c.slug),
    })
    return {
      ClientFeature: 'src/utils/plugins/lexical/footnote/client#FootnoteFeatureClient',
      clientFeatureProps: null,
      i18n,
      generateSchemaMap: ({}) => {
        const schemaMap: FieldSchemaMap = new Map()

        schemaMap.set('fields', {
          fields: sanitizedFields,
        })

        return schemaMap
      },

      nodes: [
        {
          node: FootnoteNode,
        },
        {
          node: FooterNode,
        },
      ],
    }
  },
  key: 'footnote',
})
