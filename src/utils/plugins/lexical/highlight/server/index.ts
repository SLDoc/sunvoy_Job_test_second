import type { SerializedQuoteNode as _SerializedQuoteNode } from '@lexical/rich-text'
import type { Spread } from 'lexical'

import { createServerFeature } from '@payloadcms/richtext-lexical'

import { i18n } from './i18n'

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

    nodes: [],
  },
  key: 'mark',
})
